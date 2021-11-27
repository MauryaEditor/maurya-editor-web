import { Observer, Subscription } from "rxjs";
import { Bus } from "./Bus";
import { SubjectWrapper } from "./SubjectWrapper";
import { WebDevBusEvent } from "./WebDevBusEvent";

export const WebDevBus = new Bus<WebDevBusEvent>(new SubjectWrapper());

(window as any).SubscribeWebDevBus = (
  observer: Partial<Observer<WebDevBusEvent>>
): Subscription => {
  return WebDevBus.subscribe(observer);
};
