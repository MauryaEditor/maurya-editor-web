import { Subscription } from "rxjs";
import { SubjectWrapper } from "./SubjectWrapper";
import { WebDevBusEvent } from "./WebDevBusEvent";

export const WebDevBus = new SubjectWrapper<WebDevBusEvent>();

(window as any).SubscribeWebDevBus = (
  next: (v: WebDevBusEvent) => {}
): Subscription => {
  return WebDevBus.subscribe({ next });
};
