beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  jest.resetAllMocks();
  jest.mock("../../../../runtime/Runtime", () => {
    const RuntimeClass = function () {
      this.onReady = (cb: () => void) => {
        cb();
      };
      this.getWebBusEventGenerator = function* () {
        const events = require("../../../../runtime/Runtime.events.test.json");
        for (let event of events) {
          yield event;
        }
      };
      this.subscribeWebBus = () => {};
      this.subscribeSessionWebBus = () => {};
      this.subscribeWebDevBus = () => {};
      this.getID = () => {
        const random = Math.floor(Math.random() * 369);
        return "Skennedy" + random;
      };
      this.postCreateEvent = () => {
        const random = Math.floor(Math.random() * 369);
        return "poisonIV" + random;
      };
      this.postPatchEvent = () => {
        const random = Math.floor(Math.random() * 369);
        return "randomIV" + random;
      };
    };
    return {
      RuntimeClass: RuntimeClass,
      Runtime: new RuntimeClass(),
    };
  });
});

// ---------------------------------------DesignRuntime constructor-----------------------------------------

describe("DesignRuntime constructor working correctly or not", () => {
  // ----------DesignRuntime and Runtime constructor-----------

  it("Design onReady and Runtime onReady called or not", () => {
    // import runtime
    const Runtime = require("../../../../runtime/Runtime");
    const MockedRuntime = Runtime.Runtime;
    const runtimeOnReadySpy = jest.spyOn(MockedRuntime, "onReady");
    const isReady = jest.fn();
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            isReady();
            res();
          });
        });
      })
      .then(() => {
        expect(isReady).toBeCalledTimes(1);
        expect(runtimeOnReadySpy).toBeCalledTimes(1);
      });
  });

  // -----------------webEventsGenerator----------------

  it("web events generator and DesignState is working properly", () => {
    // import runtime
    const Runtime = require("../../../../runtime/Runtime");
    const MockedRuntime = Runtime.Runtime;
    const generatorSpy = jest.spyOn(MockedRuntime, "getWebBusEventGenerator");
    const events = require("../../../../runtime/Runtime.events.test.json");
    // extract ids of unique events
    const uniqueEventId = [...new Set(events.map((item) => item.payload.ID))];
    let designState;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            designState = DesignRuntime.getState();
            res();
          });
        });
      })
      .then(() => {
        expect(generatorSpy).toBeCalledTimes(1);
        const designStateKeys = [...Object.keys(designState)];
        expect(uniqueEventId.sort()).toEqual(designStateKeys.sort());
      });
  });
});

// ----------------------------------------------addElement-----------------------------------------------

describe("addElement", () => {
  // ---------------------addElement----------------

  it("addElement is working correcly or not", () => {
    let designState;
    const payload = {
      compKey: "Matt Murdock",
      state: {
        style: { nickname: "Absoulte Beast" },
        parent: "Matt Murdock Sr",
        alias: "noobmaster69",
      },
    };
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            DesignRuntime.addElement("noobmaster69", payload);
            designState = DesignRuntime.getState();
            res();
          });
        });
      })
      .then(() => {
        const lastElement = designState["noobmaster69"];
        expect(lastElement.compKey).toStrictEqual(payload.compKey);
        expect(lastElement.state).toStrictEqual(payload.state);
      });
  });
});

// -------------------------------------------acceptsChild-------------------------------------------------

describe("acceptsChild", () => {
  // ---------------------registerChildAcceptor----------------

  it("registerChildAcceptor is working correcly or not", () => {
    const testChildId = [
      "child#0",
      "child#1",
      "child#2",
      "child#3",
      "child#4",
      "child#5",
    ];
    let childState;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            for (let ele of testChildId) {
              DesignRuntime.registerChildAcceptor(ele);
            }
            childState = DesignRuntime.getChildAcceptors();
            res();
          });
        });
      })
      .then(() => {
        expect(childState).toStrictEqual(testChildId);
      });
  });

  // ---------------------deregisterChildAcceptor----------------

  it("deregisterChildAcceptor is working correcly or not", () => {
    let childState;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            DesignRuntime.deregisterChildAcceptor("child#3");
            DesignRuntime.deregisterChildAcceptor("child#5");
            childState = DesignRuntime.getChildAcceptors();
            res();
          });
        });
      })
      .then(() => {
        expect(childState).toStrictEqual([
          "child#0",
          "child#1",
          "child#2",
          "child#4",
        ]);
      });
  });
});
// ---------------------------------getStateFor,getBusFor,getRefFor-----------------------------------------
describe("getStateFor,getBusFor,getRefFor is working correctly or not", () => {
  // ---------------------getStateFor----------------

  it("getStateFor returns the corect state", () => {
    let allstate;
    let singleState;
    let id;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            allstate = DesignRuntime.getState();
            id = Object.keys(allstate)[5];
            singleState = DesignRuntime.getStateFor(id);
            res();
          });
        });
      })
      .then(() => {
        expect(singleState).toStrictEqual(allstate[id]);
      });
  });

  // ---------------------getStateFor----------------

  it("getStateFor throws an error if passed incorrect ID", () => {
    let singleState;
    let id = "lockheed";
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            singleState = DesignRuntime.getStateFor(id);
            res();
          });
        });
      })
      .catch((err) => {
        expect(err.message).toStrictEqual(
          "Fetching state for non-existent element with ID" + id
        );
      });
  });

  // ---------------------getBusFor,getRefFor----------------

  it.skip("getBusFor,getRefFor returns correct", () => {
    let allstate;
    let singleState;
    let id;
    let singleBus;
    let singleRef;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            allstate = DesignRuntime.getState();
            id = Object.keys(allstate)[5];
            singleState = DesignRuntime.getStateFor(id);
            singleBus = DesignRuntime.getBusFor(id);
            singleRef = DesignRuntime.getRefFor(id);
            res();
          });
        });
      })
      .then(() => {
        console.log(singleState);
        console.log(singleBus);
        console.log(singleRef);
      });
  });
});

// -------------------------------------------createElement-------------------------------------------------

describe("createElement is working correctly or not", () => {
  // ---------------------new element is created----------------
  it("new element gets created or not", () => {
    const payload = {
      state: {
        style: { position: "solo" },
        parent: "chrisRedfield",
        alias: ["wanda", "noobmaster69"],
      },
    };
    let searchId;
    let returnId;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            returnId = DesignRuntime.createElement("thunder", payload, false);
            searchId = DesignRuntime.getStateFor(returnId);
            res();
          });
        });
      })
      .then(() => {
        expect(returnId).toBeTruthy();
        expect(searchId.compKey).toStrictEqual("thunder");
        expect(searchId.state.parent).toStrictEqual(payload.state.parent);
        expect(searchId.state.alias).toStrictEqual(payload.state.alias);
      });
  });

  // ---------------------Runtime.postCreateEvent----------------

  it("new element created or not and postCreateEvent is called or not if record is true", () => {
    const payload = {
      state: {
        style: { position: "solo" },
        parent: "chrisRedfield",
        alias: ["wanda", "noobmaster69"],
      },
    };
    let returnId;
    const Runtime = require("../../../../runtime/Runtime");
    const MockedRuntime = Runtime.Runtime;
    const postCreateEventSpy = jest.spyOn(MockedRuntime, "postCreateEvent");
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            returnId = DesignRuntime.createElement("thunder", payload, true);
            res();
          });
        });
      })
      .then(() => {
        expect(postCreateEventSpy).toBeCalledTimes(1);
        expect(returnId).toBeTruthy();
      });
  });
});

// --------------------------------------patchState and patchStyle-------------------------------------------

describe("patchDevState and patchStyle working correctly or not", () => {
  // ---------------------Runtime.postCreateEvent----------------

  it("Runtime.postPatchEvent is called or not if record is true", () => {
    const payload = {
      state: {
        style: { position: "solo" },
        parent: "chrisRedfield",
        alias: ["wanda", "noobmaster69"],
      },
    };
    const Runtime = require("../../../../runtime/Runtime");
    const MockedRuntime = Runtime.Runtime;
    // MockedRuntime.postPatchEvent = jest.fn().mockImplementation(() => {
    //   console.log("postPatchEvent from jest mockImplementation");
    // });
    const postPatchEventSpy = jest.spyOn(MockedRuntime, "postPatchEvent");
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.onReady(() => {
            DesignRuntime.patchState("thunder", payload, true);
            res();
          });
        });
      })
      .then(() => {
        expect(postPatchEventSpy).toBeCalledTimes(1);
      });
  });

  // ---------------------patchState----------------

  it("patchState is called inside patch style or not", () => {
    const payload = {
      state: {
        style: { position: "solo" },
        parent: "chrisRedfield",
        alias: ["wanda", "noobmaster69"],
      },
    };
    let patchStateSpy;
    return import("./DesignRuntime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const DesignRuntime = mod.DesignRuntime;
          DesignRuntime.patchState = jest.fn().mockImplementation(() => {});
          patchStateSpy = jest.spyOn(DesignRuntime, "patchState");
          DesignRuntime.onReady(() => {
            DesignRuntime.patchStyle("thunder", payload, true);
            res();
          });
        });
      })
      .then(() => {
        expect(patchStateSpy).toBeCalledTimes(1);
      });
  });
});
