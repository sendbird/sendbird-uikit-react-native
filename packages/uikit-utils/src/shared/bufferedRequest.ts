type Func = (...args: unknown[]) => Promise<unknown>;
type State = 'idle' | 'processing';

export const createBufferedRequest = (reqPerSec = 10) => {
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
      if (nextQueue.length < reqPerSec) {
        const nextRemains = Math.min(reqPerSec - nextQueue.length, waitQueue.length);
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
      }, 1000);

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
};
