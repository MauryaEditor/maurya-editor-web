import { Subscription, Observer } from "rxjs";
import { Bus } from "./Bus";
import { ReplaySubjectWrapper } from "./ReplaySubjectWrapper";
import { WebBusEvent } from "./WebBusEvent";

export const WebBus = new Bus<WebBusEvent>(new ReplaySubjectWrapper());

(window as any).SubscribeWebBus = (
  observer: Observer<WebBusEvent>
): Subscription => {
  return WebBus.subscribe(observer);
};
