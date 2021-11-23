import { Subscription } from "rxjs";
import { SubjectWrapper } from "./SubjectWrapper";
import { WebBusEvent } from "./WebBusEvent";

export const SessionWebBus = new SubjectWrapper<WebBusEvent>();

(window as any).SubscribeSessionWebBus = (
  next: (v: WebBusEvent | null) => {}
): Subscription => {
  return SessionWebBus.subscribe({ next });
};
