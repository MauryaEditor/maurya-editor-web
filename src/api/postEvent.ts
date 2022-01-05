import { backendUrl } from "../lib/backend-url";
import { WebBusEvent } from "../runtime/WebBusEvent";

export const postEvent = (
  token: string,
  projectID: string,
  event: WebBusEvent
) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ ...event, token, projectID }),
  };
  return fetch(`${backendUrl}/web-events`, options).then((resp) => resp.json());
};
