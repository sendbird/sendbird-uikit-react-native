type Func = (...args: unknown[]) => Promise<unknown>;
type State = 'idle' | 'processing';

let REQ_PER_TIMEOUT = 5;
let TIMEOUT_MILLS = 1000;
const SAFE_TIMEOUT_BUFFER = 100;

function generateRandomId() {
  return Math.random().toString(16).slice(2);
}

export class BufferedRequest {
  public static markAsRead = BufferedRequest.create();
  public static markAsDelivered = BufferedRequest.create();

  public static updateMarkAsReadOptions(reqPerTimeout: number, timeoutMills: number) {
    BufferedRequest.markAsRead = BufferedRequest.create(reqPerTimeout, timeoutMills);
  }
  public static updateMarkAsDeliveredOptions(reqPerTimeout: number, timeoutMills: number) {
    BufferedRequest.markAsDelivered = BufferedRequest.create(reqPerTimeout, timeoutMills);
  }

  public static get reqPerTimeout() {
    return REQ_PER_TIMEOUT;
  }
  public static set reqPerTimeout(value: number) {
    REQ_PER_TIMEOUT = value;
    BufferedRequest.markAsRead = BufferedRequest.create();
    BufferedRequest.markAsDelivered = BufferedRequest.create();
  }

  public static get timeoutMills() {
    return TIMEOUT_MILLS;
  }
  public static set timeoutMills(value: number) {
    TIMEOUT_MILLS = value;
    BufferedRequest.markAsRead = BufferedRequest.create();
    BufferedRequest.markAsDelivered = BufferedRequest.create();
  }

  public static create(reqPerTimeout = REQ_PER_TIMEOUT, timeoutMills = TIMEOUT_MILLS) {
    const waitQueue = new Map<string, Func>();
    const nextQueue = new Map<string, Func>();

    let state: State = 'idle';
    let timeout: NodeJS.Timeout | undefined;

    return {
      push(func: Func, lane?: string) {
        waitQueue.set(lane ?? generateRandomId(), func);
        this.invoke();
      },
      shift() {
        if (nextQueue.size < reqPerTimeout) {
          const nextRemains = Math.min(reqPerTimeout - nextQueue.size, waitQueue.size);
          const lanes = [...waitQueue.keys()];
          for (let n = 0; n < nextRemains; n++) {
            const lane = lanes[n];
            const func = waitQueue.get(lane);
            if (func) {
              waitQueue.delete(lane);
              nextQueue.set(lane, func);
            }
          }
        }
      },
      handleIdle() {
        if (0 < nextQueue.size) {
          state = 'processing';
          this.invoke();
        }
      },
      handleProcessing() {
        if (timeout) return;

        timeout = setTimeout(() => {
          timeout = undefined;
          if (0 < nextQueue.size || 0 < waitQueue.size) {
            this.invoke();
          } else {
            state = 'idle';
          }
        }, timeoutMills + SAFE_TIMEOUT_BUFFER);

        let index = 0;
        const nextRequestBaseTimeout = timeoutMills / nextQueue.size;
        nextQueue.forEach((func) => {
          setTimeout(() => {
            func();
            // TODO: Add retry
            //.catch(() => waitQueue.set(lane, func));
          }, nextRequestBaseTimeout * index);
          index++;
        });
        nextQueue.clear();
      },
      async invoke() {
        this.shift();

        if (state === 'idle') {
          this.handleIdle();
        }

        if (state === 'processing') {
          this.handleProcessing();
        }
      },
    };
  }
}
