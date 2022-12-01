type Func = (...args: unknown[]) => Promise<unknown>;
type State = 'idle' | 'processing';

let REQ_PER_TIMEOUT = 5;
let TIMEOUT_MILLS = 1000;
const SAFE_TIMEOUT_BUFFER = 100;

export class BufferedRequest {
  public static markAsRead = BufferedRequest.create();
  public static markAsDelivered = BufferedRequest.create();

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
    const waitQueue: Func[] = [];
    const nextQueue: Func[] = [];

    let state: State = 'idle';
    let timeout: NodeJS.Timeout | undefined;

    return {
      push(func: Func) {
        waitQueue.push(func);
        this.invoke();
      },
      shift() {
        if (nextQueue.length < reqPerTimeout) {
          const nextRemains = Math.min(reqPerTimeout - nextQueue.length, waitQueue.length);
          for (let n = 0; n < nextRemains; n++) {
            const func = waitQueue.shift();
            if (func) nextQueue.push(func);
          }
        }
      },
      handleIdle() {
        if (0 < nextQueue.length) {
          state = 'processing';
          this.invoke();
        }
      },
      handleProcessing() {
        if (timeout) return;

        timeout = setTimeout(() => {
          timeout = undefined;
          if (0 < nextQueue.length || 0 < waitQueue.length) {
            this.invoke();
          } else {
            state = 'idle';
          }
        }, timeoutMills + SAFE_TIMEOUT_BUFFER);

        nextQueue.forEach((func) => func());
        nextQueue.length = 0;
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
