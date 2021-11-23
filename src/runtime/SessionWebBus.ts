import { Observer, Subscription } from "rxjs";
import { Bus } from "./Bus";
import { SubjectWrapper } from "./SubjectWrapper";
import { WebBusEvent } from "./WebBusEvent";

export const SessionWebBus = new Bus<WebBusEvent>(new SubjectWrapper());

(window as any).SubscribeSessionWebBus = (
  observer: Observer<WebBusEvent>
): Subscription => {
  return SessionWebBus.subscribe(observer);
};
