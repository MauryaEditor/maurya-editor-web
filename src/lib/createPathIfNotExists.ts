// it modifies the obj in place
// create keys if they don't exists already
// if exists, leave it unchanged
export function createPathIfNotExists(obj: any, path: (string | number)[]) {
  let curr = obj;
  for (let i = 0; i < path.length; i++) {
    if (i === path.length - 1 && curr[path[i]] === undefined) {
      curr[path[i]] = undefined;
      break;
    }
    if (curr[path[i]] === undefined) {
      curr[path[i]] = {};
    }
    curr = curr[path[i]];
  }
}
