export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;
