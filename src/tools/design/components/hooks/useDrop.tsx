import { useEffect } from "react";
import { ElementDecorator } from "../../decorators/ElementDecorator";
import { ComponentItem, ComponentRegistry } from "../../rxjs/ComponentRegistry";
import {
  DragElement,
  DragOverElement,
  DrawRuntimeState,
} from "../../rxjs/DrawState";
import getCoords from "../../utils/getCoords";

export const useDrop = (
  ref: React.RefObject<HTMLElement>,
  setRenderComps: React.Dispatch<
    React.SetStateAction<[React.FC<{}>, object, string, React.FC<any>[]][]>
  >
) => {
  useEffect(() => {
    if (ref.current) {
      // TODO: set a subject that says over me being dragged
      const onmouseenter = (event: MouseEvent) => {
        console.log("mouseenter on root called");
        DragOverElement.next([...DragOverElement.value, "root"]);
      };
      const onmouseleave = (event: MouseEvent) => {
        console.log("mouseleave on rool called");
        DragOverElement.next(
          DragOverElement.value.slice(0, DragOverElement.value.length - 1)
        );
      };
      ref.current.addEventListener("mouseenter", onmouseenter, false);
      ref.current.addEventListener("mouseleave", onmouseleave, false);
      return () => {
        ref.current?.removeEventListener("mouseenter", onmouseenter, false);
        ref.current?.removeEventListener("mouseleave", onmouseleave, false);
      };
    }
  }, [ref]);
  // when an already existing element is dragged
  useEffect(() => {
    DragElement.subscribe({
      next: (v) => {
        if (v) {
          const draggedElementRef = v.ref;
          const ID = v.ID;
          // get current position
          const elementTop =
            draggedElementRef.current?.getBoundingClientRect().top!;
          const elementLeft =
            draggedElementRef.current?.getBoundingClientRect().left!;
          const canvasTop = ref.current?.getBoundingClientRect().top!;
          const canvasLeft = ref.current?.getBoundingClientRect().left!;
          const top = elementTop - canvasTop;
          const left = elementLeft - canvasLeft;
          console.log("top", top, "left", left);
          // send removechild to parent
          const parentID = DrawRuntimeState[ID].parent;
          console.log(parentID);
          if (parentID !== "root") {
            DrawRuntimeState[parentID].bus.next({ removechild: ID });
          }
          // send add child to canvas
          setRenderComps((renderComps) => {
            let compItem: ComponentItem;
            for (let i = 0; i < ComponentRegistry.value.length; i++) {
              const compItems = ComponentRegistry.value[i][1];
              for (let j = 0; j < compItems.length; j++) {
                if (compItems[j].key === DrawRuntimeState[ID].compKey) {
                  compItem = compItems[j];
                  break;
                }
              }
            }
            if (compItem!) {
              const newRenderComp: [React.FC, object, string, React.FC<any>[]] =
                [
                  compItem!.renderComp,
                  {
                    renderProps: DrawRuntimeState[ID].renderProps,
                    ...DrawRuntimeState[ID].state,
                    style: {
                      position: "absolute",
                      top: top + "px",
                      left: left + "px",
                    },
                    ID: ID,
                  },
                  ID,
                  compItem.decorators || [ElementDecorator],
                ];
              return [...renderComps, newRenderComp];
            }

            return [...renderComps];
          });
        }
      },
    });
  }, [ref]);
  useEffect(() => {
    // change style to move element on mousemove
    const onmousemove = (event: MouseEvent) => {
      if (DragElement.value) {
        console.log("mouse is moving for drags");
        const ID = DragElement.value.ID;
        const currentStyle = DrawRuntimeState[ID].style;
        const top =
          parseFloat(currentStyle.top?.toString()!) + event.movementY + "px";
        const left =
          parseFloat(currentStyle.left?.toString()!) + event.movementX + "px";
        DrawRuntimeState[ID].bus.next({
          style: { ...currentStyle, top: top, left: left },
        });
      }
    };
    ref.current?.addEventListener("mousemove", onmousemove, false);
    return () => {
      ref.current?.removeEventListener("mousemove", onmousemove, false);
    };
  }, [ref]);
  useEffect(() => {
    // send it to new parent
    const onmouseup = () => {
      if (DragElement.value) {
        const ID = DragElement.value.ID;
        DragElement.next(null);
        /**
         * DragOverElement looks like this ["root", "id1", "id2", "root"]
         * this happens because the new element gets created in canvas root
         * and hence mouseenter gets evoked on root
         * */
        let parent = DragOverElement.value[DragOverElement.value.length - 1];
        if (DragOverElement.value.length > 1) {
          if (
            DragOverElement.value[DragOverElement.value.length - 1] === "root"
          ) {
            parent = DragOverElement.value[DragOverElement.value.length - 2];
          }
        } else {
          // do nothing because the child is in root already
          // expected state of DragOverElement is ["root"]
          return;
        }
        if (
          DrawRuntimeState[ID] &&
          DrawRuntimeState[ID].ref &&
          DrawRuntimeState[ID].ref!.current &&
          DrawRuntimeState[parent] &&
          DrawRuntimeState[parent].ref &&
          DrawRuntimeState[parent].ref!.current &&
          ref.current
        ) {
          const elementTop =
            DrawRuntimeState[ID].ref!.current!.getBoundingClientRect().top!;
          const elementLeft =
            DrawRuntimeState[ID].ref!.current?.getBoundingClientRect().left!;
          const parentTop =
            DrawRuntimeState[parent].ref!.current?.getBoundingClientRect().top!;
          const parentLeft =
            DrawRuntimeState[parent].ref!.current?.getBoundingClientRect()
              .left!;
          console.log("parent position", parentTop, parentLeft);
          console.log("element position", elementTop, elementLeft);
          const top = elementTop - parentTop;
          const left = elementLeft - parentLeft;
          console.log("final child postion", top, left);
          let compItem: ComponentItem;
          for (let i = 0; i < ComponentRegistry.value.length; i++) {
            const compItems = ComponentRegistry.value[i][1];
            for (let j = 0; j < compItems.length; j++) {
              if (compItems[j].key === DrawRuntimeState[ID].compKey) {
                compItem = compItems[j];
                break;
              }
            }
          }
          if (!compItem!) {
            throw new Error("compItem not in registry");
          }
          const style = {
            position: "absolute",
            top: top + "px",
            left: left + "px",
          };
          console.log(style);
          const newRenderComp: [React.FC, object, string, React.FC<any>[]] = [
            compItem!.renderComp,
            {
              renderProps: DrawRuntimeState[ID].renderProps,
              ...DrawRuntimeState[ID].state,
              style,
              parent: parent,
              ID,
            },
            ID,
            compItem.decorators || [ElementDecorator],
          ];
          DrawRuntimeState[parent].bus.next({ addchild: newRenderComp });
          DrawRuntimeState[ID].bus.next({ style });
          // TODO: post path event for style and parent
        } else {
          throw new Error(
            "DrawruntimeState[ID].ref.current should be defined for elements which can be dragged"
          );
        }
        setRenderComps((renderComps) => {
          return renderComps.filter((renderComp) => {
            return renderComp[2] !== ID;
          });
        });
      }
    };
    ref.current?.addEventListener("mouseup", onmouseup, false);
    return () => {
      ref.current?.removeEventListener("mouseup", onmouseup, false);
    };
  }, [ref, setRenderComps]);
};
