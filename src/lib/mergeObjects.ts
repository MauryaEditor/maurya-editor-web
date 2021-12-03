import { ObjectVisitor } from "./ObjectVisitor";
import { VisitableObject } from "./VisitableObject";

export const mergeObjects = (
  baseObj: { [key: string | number]: any },
  priorityObj: { [key: string | number]: any }
) => {
  const visitable = new VisitableObject(baseObj);
  const visitor = new ObjectVisitor({
    terminal: (key, value, parentObj, pathSoFar) => {
      const visitable = new VisitableObject(priorityObj);
      // what happens when path doesn't exists?
      visitable.visitPath(pathSoFar, new ObjectVisitor({}));
    },
  });
  visitable.visit(visitor);
};
