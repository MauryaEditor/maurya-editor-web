import { backendUrl } from "../lib/backend-url";

export const getEvents = (token: string, projectID: string) => {
  return fetch(`${backendUrl}/web-events?pid=${projectID}&token=${token}`).then(
    (resp) => resp.json()
  );
};
