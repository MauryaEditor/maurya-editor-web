import React, { useEffect, useState } from "react";
import { DecoratorCreator } from "../../decorators/DecoratorCreator";
import { useBus } from "../../decorators/hooks/useBus";
import { DrawRuntimeBus } from "../../rxjs/DrawState";

const createElement = ([Comp, props, key, decorators]: any) => {
  return (
    <DecoratorCreator
      decorators={decorators}
      ID={key}
      key={key}
      style={(props as any).style}
    >
      <Comp {...props} key={key} data-id={key} />
    </DecoratorCreator>
  );
};

export const useAcceptChild = (
  ID: string,
  ref: React.RefObject<HTMLDivElement>
) => {
  const [children, setChildren] = useState<
    [React.FC, object, string, React.FC<any>[]][]
  >([]);
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  const bus = useBus(ID);
  useEffect(() => {
    if (bus) {
      const subscription = bus.subscribe({
        next: (v) => {
          if (v && v["addchild"]) {
            setChildren((children) => {
              return [...children, v["addchild"]];
            });
          }
          if (v && v["removechild"]) {
            if (typeof v["removechild"] === "string") {
              const ID = v["removechild"];
              setChildren((children) => {
                const newChildren = children.filter((child) => {
                  return child[2] !== ID;
                });
                return newChildren;
              });
            }
          }
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [bus, setChildren]);

  useEffect(() => {
    const elements = children.map((child) => {
      return createElement(child);
    });
    setElements(elements);
  }, [setElements, children]);

  useEffect(() => {
    DrawRuntimeBus.next({ ID, payload: { ref } });
  }, [ref, ID]);
  return elements;
};
