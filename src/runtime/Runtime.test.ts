import { assert } from "console";
import { RuntimeClass } from "./Runtime";

jest.mock("../lib/getAuth", () => {
  return {
    getAuth: () => {
      return {
        token: "testtoken",
      };
    },
  };
});

jest.mock("../lib/getProjectID", () => {
  return {
    getProjectID: () => {
      return "testproject";
    },
  };
});

jest.mock("../api/getEvents", () => {
  return {
    getEvents: () => {
      const events = require("./Runtime.events.test.json");
      return Promise.resolve(events);
    },
  };
});

jest.mock("../api/getIDPool", () => {
  return {
    getIDPool: () => {
      const idpool = require("./Runtime.idpool.test.json");
      return Promise.resolve(idpool);
    },
  };
});

jest.mock("../api/postEvent", () => {
  return {
    postEvent: () => {},
  };
});

test("onReady gets called", () => {
  const Runtime = RuntimeClass.getRuntime();
  const isReady = jest.fn();
  Runtime.onReady(() => {
    isReady();
  });
  expect(isReady).toBeCalled();
});
