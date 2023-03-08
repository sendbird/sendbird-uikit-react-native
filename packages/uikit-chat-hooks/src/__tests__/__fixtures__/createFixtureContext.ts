type FixtureContext = {
  get date(): number;
  get incremental(): number;
  increaseIncremental(): void;
  getHash(): string;
  getRandom(): number;
};
export const createFixtureContext = <T>(additionalContext?: T): FixtureContext & T => {
  const _date = Date.now();
  let _incremental = 0;
  return {
    get date() {
      return _date;
    },
    get incremental() {
      return _incremental;
    },
    increaseIncremental: () => _incremental++,
    getHash: () => Math.random().toString(16).slice(2),
    getRandom: () => Math.random(),
    ...additionalContext,
  } as unknown as FixtureContext & T;
};
