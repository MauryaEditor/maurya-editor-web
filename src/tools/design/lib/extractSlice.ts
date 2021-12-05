import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";

export const extractSlice = (ID: string, slice: (string | number)[]) => {
  try {
    let curr: any = DesignRuntime.getState()[ID].state;
    let newSlice: any = {};
    let currNewSlice = newSlice;
    for (let i = 0; i < slice.length; i++) {
      curr = curr[slice[i]];
      if (i === slice.length - 1) {
        currNewSlice[slice[i]] = curr;
        break;
      }
      currNewSlice[slice[i]] = {};
      currNewSlice = currNewSlice[slice[i]];
    }
    return newSlice;
  } catch (err) {
    throw err;
  }
};
