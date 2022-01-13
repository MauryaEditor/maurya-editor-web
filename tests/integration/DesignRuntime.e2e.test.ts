import assert from "assert";
import React from "react";
import { Runtime } from "../../src/runtime/Runtime";
beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  jest.mock("../../src/lib/getAuth", () => {
    return {
      getAuth: () => {
        return {
          token: "testtoken",
        };
      },
    };
  });
  jest.mock("../../src/lib/getProjectID", () => {
    return {
      getProjectID: () => {
        return "testproject";
      },
    };
  });
  jest.mock("../../src/api/getEvents", () => {
    return {
      getEvents: () => {
        const events = require("../../src/runtime/Runtime.events.test.json");
        return Promise.resolve(events);
      },
    };
  });
  jest.mock("../../src/api/getIDPool", () => {
    return {
      getIDPool: () => {
        const idpool = require("../../src/runtime/Runtime.idpool.test.json");
        return Promise.resolve(idpool);
      },
    };
  });
  jest.mock("../../src/api/postEvent", () => {
    return {
      postEvent: () => {
        console.log("posting mock event");
      },
    };
  });
});

test("Random Test", () => {
  const mod = require("../../src/tools/design/runtime/DesignRuntime/DesignRuntime");
  const DesignRuntime = mod.DesignRuntime;
  const ref = React.createRef();
  DesignRuntime.setCanvasRoot(ref);
  const canvas_ref = DesignRuntime.getCanvasRoot();
   assert(canvas_ref["current"] == null);
});

test("Checking the final value of an element", () => {
  const mod = require("../../src/tools/design/runtime/DesignRuntime/DesignRuntime");
  const DesignRuntime = mod.DesignRuntime;
  const id = "61d12a0faea8f1356030d821";
  const final_state = DesignRuntime.getStateFor(id).state.properties.Value;
  assert(final_state==="suman")
});

export{};