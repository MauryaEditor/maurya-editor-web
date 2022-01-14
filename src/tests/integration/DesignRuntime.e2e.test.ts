import assert from "assert";
import React from "react";
import { Runtime } from "../../runtime/Runtime";
beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  jest.mock("../../lib/getAuth", () => {
    return {
      getAuth: () => {
        return {
          token: "testtoken",
        };
      },
    };
  });
  jest.mock("../../lib/getProjectID", () => {
    return {
      getProjectID: () => {
        return "testproject";
      },
    };
  });
  jest.mock("../../api/getEvents", () => {
    return {
      getEvents: () => {
        const events = require("../../runtime/Runtime.events.test.json");
        return Promise.resolve(events);
      },
    };
  });
  jest.mock("../../api/getIDPool", () => {
    return {
      getIDPool: () => {
        const idpool = require("../../runtime/Runtime.idpool.test.json");
        return Promise.resolve(idpool);
      },
    };
  });
  jest.mock("../../api/postEvent", () => {
    return {
      postEvent: () => {
        console.log("posting mock event");
      },
    };
  });
});

test("Random Test", () => {
  const mod = require("../../tools/design/runtime/DesignRuntime/DesignRuntime");
  const DesignRuntime = mod.DesignRuntime;
  const ref = React.createRef();
  DesignRuntime.setCanvasRoot(ref);
  const canvas_ref = DesignRuntime.getCanvasRoot();
  assert(canvas_ref["current"] == null);
});

test("Checking the final value of an element", () => {
  const mod = require("../../tools/design/runtime/DesignRuntime/DesignRuntime");
  const DesignRuntime = mod.DesignRuntime;
  const id = "61d12a0faea8f1356030d821";
  const final_state = DesignRuntime.getStateFor(id).state.properties.Value;
  assert(final_state === "suman");
});

export {};
