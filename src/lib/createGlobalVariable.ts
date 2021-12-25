export function createGlobalVariable<T>(name: string, obj: T) {
  if (!(name in (window as any))) {
    (window as any)[name] = obj;
  }
  return (window as any)[name] as T;
}
