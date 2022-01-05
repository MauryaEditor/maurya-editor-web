export function createSlice(slice: (string | number)[], value: any) {
  const obj: any = {};
  let cur = obj;
  for (let i = 0; i < slice.length; i++) {
    if (i === slice.length - 1) {
      cur[slice[i]] = value;
      break;
    }
    cur[slice[i]] = {};
    cur = cur[slice[i]];
  }
  return obj;
}
