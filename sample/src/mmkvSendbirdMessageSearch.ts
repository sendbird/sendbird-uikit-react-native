// mmkvSendbirdMessageSearch.ts
// - MMKV의 getString만 사용해서 Sendbird NestDB 캐시 블록을 파싱하고 검색
// - 인덱스 구조가 서로 다를 수 있어 "블록 스캔"을 기본으로 하되,
//   messageId 인덱스(JSON 형태)가 있으면 Optional로 활용(역시 getString만 사용)
//
// 사용전제:
//   1) mmkv: { getString: (key: string) => string | undefined | null } 객체
//   2) keys: string[]  // 이미 확보한 전체 키 배열 (직접 전달)
//   3) Sendbird가 저장한 Message block 키 패턴 예:
//      ".../Message/block.2.173.0", ".../Message/block.1.24.0" 등

export type MMKVLike = { getString: (key: string) => string | undefined | null };

type MessageShape = {
  messageId?: number;
  channelUrl?: string;
  createdAt?: number;
  parentMessageId?: number;
  message?: string;
  data?: any;
  _poll?: any;
  [k: string]: any;
};

export type SearchOptions = {
  // 좁히기 옵션 (가능한 한 지정 권장: 스캔양을 줄임)
  channelUrl?: string;
  textIncludes?: string;           // 본문 포함 검색 (대소문자 무시 기본)
  caseSensitive?: boolean;
  parentMessageId?: number;        // 스레드 자식만
  isPollOnly?: boolean;            // _poll 플래그가 있는 메시지만
  fromCreatedAt?: number;          // createdAt >=
  toCreatedAt?: number;            // createdAt <=

  // MessageCache.fetch 호환 토큰(앵커) 필터 (createdAt 기준)
  token?: number | string;         // 앵커 createdAt
  backward?: boolean;              // true: 앵커 이후(>=), false: 이전(<=)
  inclusive?: boolean;             // 앵커 포함여부
  exactMatch?: boolean;            // createdAt === token만 허용

  // 결과 정렬
  order?: "CHANNEL_LATEST" | "NEWEST_CHILD_MESSAGE"; // 기본: CHANNEL_LATEST(최신순)
  limit?: number | null;           // null이면 전부
};

const MESSAGE_BLOCK_RE = /\/Message\/block\.\d+\.\d+\.0$/;
const MESSAGE_ID_INDEX_RE = /\/Message\/index\.messageId\.0$/;

function safeParseJSON(raw?: string | null): any | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * NestDB block payload의 다양한 형태를 최대한 관용적으로 파싱해
 * "레코드 배열"로 반환한다.
 */
function extractRecordsFromBlock(block: any): any[] {
  if (!block) return [];

  // 0) 블록 자체가 문자열(JSON)인 경우 언랩
  if (typeof block === 'string') {
    const inner = safeParseJSON(block);
    if (inner) return extractRecordsFromBlock(inner);
    return [];
  }

  // 1) 네 샘플 형태: { data: "<JSON 문자열>" } 이고 내부에 { items:[...] }
  if (typeof block === 'object' && block !== null) {
    if (typeof block.data === 'string') {
      const inner = safeParseJSON(block.data);
      if (inner && typeof inner === 'object') {
        // 최우선: items 배열
        if (Array.isArray(inner.items)) return inner.items;
        // 다른 변형도 관용적으로 지원
        if (Array.isArray(inner.records)) return inner.records;
        if (Array.isArray(inner.data)) return inner.data;
        // 혹시 또 감싸져 있으면 재귀적으로 벗김
        return extractRecordsFromBlock(inner);
      }
    }

    // 2) data/records 가 배열인 변형
    if (Array.isArray(block.items)) return block.items;
    if (Array.isArray(block.records)) return block.records;
    if (Array.isArray(block.data)) return block.data;

    // 3) 맵 형태: 값들이 레코드인 경우
    const values = Object.values(block);
    if (values.length && typeof values[0] === 'object') {
      return values as any[];
    }
  }

  // 4) 배열 자체가 들어온 경우 (래퍼에 value|v|record|payload 필드가 있을 수 있음)
  if (Array.isArray(block)) {
    return block.map((it) => it?.value ?? it?.v ?? it?.record ?? it?.payload ?? it);
  }

  return [];
}

/** 메시지 레코드를 통일된 형태로 정규화 */
function normalizeMessage(r: any): MessageShape {
  const out: MessageShape = { ...r };
  if (typeof out.messageId === "string") {
    const n = parseInt(out.messageId, 10);
    if (!Number.isNaN(n)) out.messageId = n;
  }
  return out;
}

/** MessageCache.fetch의 createdAt 토큰 필터 로직을 getString만으로 재현 */
function createdAtTokenPredicate(
  opts: Pick<SearchOptions, "token" | "backward" | "inclusive" | "exactMatch">,
) {
  const { token, backward = false, inclusive = true, exactMatch = false } = opts;
  const hasToken = token !== undefined && token !== null && token !== "";
  return (m: MessageShape) => {
    if (!hasToken) return true;
    const t = typeof token === "string" ? Number(token) : (token as number);
    const c = m.createdAt ?? 0;

    if (exactMatch) return c === t;

    if (backward) {
      // 앵커 이후(증가) 방향만 허용
      return inclusive ? c >= t : c > t;
    }
    // 앵커 이전(감소) 방향만 허용
    return inclusive ? c <= t : c < t;
  };
}

/** order에 맞춰 정렬 (기본: 최신순) */
function sortMessages(arr: MessageShape[], order?: SearchOptions["order"]): MessageShape[] {
  const o = order ?? "CHANNEL_LATEST";
  switch (o) {
    case "NEWEST_CHILD_MESSAGE":
    case "CHANNEL_LATEST":
    default:
      return arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }
}

/** 블록 키를 전부 훑어서(= getString 반복) 조건에 맞는 메시지를 찾는다 */
export function searchMessagesFromBlocks(
  mmkv: MMKVLike,
  keys: string[],
  opts: SearchOptions = {},
): MessageShape[] {
  const {
    channelUrl,
    textIncludes,
    caseSensitive = false,
    parentMessageId,
    isPollOnly,
    fromCreatedAt,
    toCreatedAt,
    order,
    limit = 200, // 안전 기본값
  } = opts;

  const tokenPred = createdAtTokenPredicate(opts);
  const needle = textIncludes
    ? (caseSensitive ? textIncludes : textIncludes.toLowerCase())
    : undefined;

  let results: MessageShape[] = [];

  for (const key of keys) {
    if (!MESSAGE_BLOCK_RE.test(key)) continue;

    const raw = mmkv.getString(key);
    const parsed = safeParseJSON(raw);
    const records = extractRecordsFromBlock(parsed);
    for (const rec of records) {
      //console.log("rec", key, rec);
      const m = normalizeMessage(rec);
      //console.log("message", m);

      // 빠른 프리필터
      if (channelUrl && m.channelUrl !== channelUrl) continue;
      if (fromCreatedAt && (m.createdAt ?? 0) < fromCreatedAt) continue;
      if (toCreatedAt && (m.createdAt ?? 0) > toCreatedAt) continue;
      if (isPollOnly && !m._poll) continue;
      if (parentMessageId !== undefined) {
        if (!m.parentMessageId || m.parentMessageId !== parentMessageId) continue;
      }
      if (!tokenPred(m)) continue;

      // 텍스트 포함 검색
      if (needle !== undefined) {
        const body =
          (typeof m.message === "string" ? m.message : "") ||
          (typeof m.data?.message === "string" ? m.data.message : "") ||
          (typeof m.text === "string" ? m.text : "") ||
          "";

        const hay = caseSensitive ? body : body.toLowerCase();
        if (!hay.includes(needle)) continue;
      }

      results.push(m);
      if (limit && results.length >= limit) {
        // 블록 스캔 비용 줄이기
        return sortMessages(results, order);
      }
    }
  }

  return sortMessages(results, order).slice(0, limit ?? undefined);
}

/** messageId로 단건 찾기 (인덱스가 JSON이면 활용, 아니면 블록 스캔) */
export function findMessageById(
  mmkv: MMKVLike,
  keys: string[],
  messageId: number,
  channelUrlHint?: string, // 있으면 스캔 대폭 단축
): MessageShape | undefined {
  // 1) 인덱스(JSON) 시도
  console.log('findMessageById:', messageId);
  const indexKey = keys.find((k) => MESSAGE_ID_INDEX_RE.test(k));
  console.log('indexKey:', indexKey);
  if (indexKey) {
    const raw = mmkv.getString(indexKey);
    const idx = safeParseJSON(raw);
    // 가능한 형태들 시도: { "12345": "<blockKey>" } 또는 { map: { "12345": "<blockKey>" } } 등
    const map: Record<string, string> | undefined =
      (idx && typeof idx === "object" && (idx.map || idx.index || idx.kv)) ??
      (idx && typeof idx === "object" ? idx : undefined);

    const blockKey =
      map?.[String(messageId)] ??
      map?.[messageId as any];

    if (typeof blockKey === "string") {
      // 해당 블록만 읽어 파싱
      const rawBlock = mmkv.getString(blockKey);
      const parsed = safeParseJSON(rawBlock);
      const records = extractRecordsFromBlock(parsed);
      for (const rec of records) {
        const m = normalizeMessage(rec);
        if (m.messageId === messageId) return m;
      }
      // 인덱스-블록 싱크가 어긋났을 수 있으니 계속 진행
    }
  }

  // 2) 블록 스캔 (channelUrlHint 있으면 필터링)
  const found = searchMessagesFromBlocks(mmkv, keys, {
    channelUrl: channelUrlHint,
    limit: null,
  });
  return found.find((m) => m.messageId === messageId);
}

/**
 * 스레드 자식 메시지 모두 찾기
 */
export function findChildren(
  mmkv: MMKVLike,
  keys: string[],
  parentMessageId: number,
  channelUrlOfParent?: string,
  limit: number | null = null,
): MessageShape[] {
  return searchMessagesFromBlocks(mmkv, keys, {
    channelUrl: channelUrlOfParent,
    parentMessageId,
    order: "NEWEST_CHILD_MESSAGE",
    limit,
  });
}
