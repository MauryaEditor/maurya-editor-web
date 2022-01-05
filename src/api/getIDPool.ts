import { backendUrl } from "../lib/backend-url";

export const getIDPool = (size: number) => {
  const uri = `${backendUrl}/uuid?size=${size}`;
  return fetch(uri).then((resp) => resp.json());
};
