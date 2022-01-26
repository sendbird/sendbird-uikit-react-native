export type FilterByValueType<T extends object, Type> = {
  [K in keyof T as T[K] extends Type ? K : never]: T[K];
};

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export type OmittedValues<T, K extends keyof T> = Omit<T, K>[keyof Omit<T, K>];
