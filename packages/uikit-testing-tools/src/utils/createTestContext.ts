type FixtureContext = {
  get date(): number;
  get increment(): number;
  increaseIncrement(): void;
  getHash(): string;
  getRandom(): number;
};
export const createTestContext = <T>(additionalContext?: T): FixtureContext & T => {
  const context = {
    date: Date.now(),
    increment: 0,
  };
  return {
    get date() {
      return context.date;
    },
    get increment() {
      return context.increment;
    },
    increaseIncrement: () => context.increment++,
    getHash: () => Math.random().toString(16).slice(2),
    getRandom: () => Math.random(),
    ...additionalContext,
  } as unknown as FixtureContext & T;
};
