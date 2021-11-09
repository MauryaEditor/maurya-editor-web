import { getQuery } from "./getQuery";

export const getProjectID = () => {
  return getQuery().get("pid") || window.localStorage.getItem("projectID");
};
