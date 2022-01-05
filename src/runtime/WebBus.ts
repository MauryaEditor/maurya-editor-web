import { Subscription, Observer } from "rxjs";
import { Bus } from "./Bus";
import { ReplaySubjectWrapper } from "./ReplaySubjectWrapper";
import { SubjectBus } from "./SubjectBus";
import { WebBusEvent } from "./WebBusEvent";

export const WebBus = new SubjectBus<WebBusEvent>();

// (window as any).SubscribeWebBus = (
//   observer: Partial<Observer<WebBusEvent>>
// ): Subscription => {
//   return WebBus.subscribe(observer);
// };
