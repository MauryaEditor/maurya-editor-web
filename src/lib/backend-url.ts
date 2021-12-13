export const backendUrl =
  process.env.REACT_APP_BACKEND_ORIGIN ||
  // interactive development hits at http://host/api
  window.location.protocol + "//" + window.location.host + "/api";
