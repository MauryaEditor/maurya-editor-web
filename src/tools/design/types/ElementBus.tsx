import { BehaviorSubject } from "rxjs";
import { AcceptsChild } from "./AcceptsChild";
import { ElementState } from "./ElementState";

export type ElementBus = BehaviorSubject<
  Partial<Omit<ElementState, "bus"> & AcceptsChild>
>;
