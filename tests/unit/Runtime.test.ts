export {};

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
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
        const events = require("../../src/runtime/Runtime.events.test.json");
        return Promise.resolve(events);
      },
    };
  });
  jest.mock("../api/getIDPool", () => {
    return {
      getIDPool: () => {
        const idpool = require("../../src/runtime/Runtime.idpool.test.json");
        return Promise.resolve(idpool);
      },
    };
  });
  jest.mock("../api/postEvent", () => {
    return {
      postEvent: () => {
        console.log("posting mock event");
      },
    };
  });
});

test.skip("token and projectID is required by Runtime to get ready", () => {
  jest.mock("../lib/getAuth", () => {
    return {
      getAuth: () => {
        return {
          token: undefined,
        };
      },
    };
  });
  const isReady = jest.fn();

  return import("../../src/runtime/Runtime")
    .then((mod) => {
      return new Promise<void>((res) => {
        const Runtime = mod.RuntimeClass.getRuntime();
        Runtime.onReady(() => {
          console.log("calling onReady");
          isReady();
          res();
        });
      });
    })
    .catch((err) => {
      // cannot be caught by this catch
      console.log(err);
    });
});

test("web events generator is working properly", () => {
  const isReady = jest.fn();
  let count = 0;
  return import("../../src/runtime/Runtime")
    .then((mod) => {
      return new Promise<void>((res) => {
        const Runtime = mod.RuntimeClass.getRuntime();
        Runtime.onReady(() => {
          isReady();
          const gen = Runtime.getWebBusEventGenerator();
          for (const event of gen) {
            count++;
          }
          res();
        });
      });
    })
    .then(() => {
      expect(isReady).toBeCalled();
      expect(
        count === require("../../src/runtime/Runtime.events.test.json").length
      ).toBeTruthy();
    });
});

// -------------------------------------------------postCreateEvent-------------------------------------------

describe("postCreateEvent", () => {
  //  - - - - - - - - - - - TEST - - - - - - - - - -

  test("postEvent gets called on posting event", () => {
    const postEvent = require("../api/postEvent");
    const spy = jest.spyOn(postEvent, "postEvent");
    const fn = jest.fn();
    let webbusEvent: any = {};
    return import("../../src/runtime/Runtime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const Runtime = mod.RuntimeClass.getRuntime();
          Runtime.onReady(() => {
            Runtime.subscribeWebBus({
              next: (v) => {
                console.log(v);
                webbusEvent = v.payload;
                fn();
              },
            });
            Runtime.subscribeSessionWebBus({
              next: () => {
                fn();
              },
            });
            Runtime.postCreateEvent({
              compKey: "dibas",
              pkg: "",
              state: {},
            });
            jest.runOnlyPendingTimers();
            res();
          });
        });
      })
      .then(() => {
        expect(spy).toHaveBeenCalled();
        expect(fn).toBeCalledTimes(2);
        expect(webbusEvent.compKey).toBe("dibas");
      });
  });

  //  - - - - - - - - - - - TEST - - - - - - - - - -

  test("postCreateEvent returns correct ids or not", () => {
    const idPool = require("../../src/runtime/Runtime.idpool.test.json");
    const ids = idPool.payload.pool;
    let returnIDS: string[] = [];
    return import("../../src/runtime/Runtime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const Runtime = mod.RuntimeClass.getRuntime();
          Runtime.onReady(() => {
            let returnId: string;
            for (let i = 0; i < 20; i++) {
              returnId = Runtime.postCreateEvent({
                compKey: "",
                pkg: "",
                state: {},
              });
              returnIDS.push(returnId);
            }
            jest.runOnlyPendingTimers();
          });
          res();
        });
      })
      .then(() => {
        expect(ids).toEqual(returnIDS);
      });
  });

  test("postCreateEvent throws Error or not if called for the 20th time", () => {
    let errorMessage: string;
    return import("../../src/runtime/Runtime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const Runtime = mod.RuntimeClass.getRuntime();
          Runtime.onReady(() => {
            for (let i = 0; i < 21; i++) {
              if (i === 20) {
                try {
                  Runtime.postCreateEvent({
                    compKey: "",
                    pkg: "",
                    state: {},
                  });
                } catch (e: any) {
                  errorMessage = e.message;
                }
              } else {
                Runtime.postCreateEvent({
                  compKey: "",
                  pkg: "",
                  state: {},
                });
              }
            }
            jest.runOnlyPendingTimers();
          });
          res();
        });
      })
      .then(() => {
        expect(errorMessage).toBe("ID Bank is bankrupt");
      });
  });
});

// ------------------------------------------postPatchEvent------------------------------------------------

describe("postPatchEvent", () => {
  test("postEvent gets called on postPatchEvent and return values matches the initial", () => {
    const postEvent = require("../api/postEvent");
    const spy = jest.spyOn(postEvent, "postEvent");
    const fn = jest.fn();
    const payload = {
      ID: "RandomID",
      slice: [],
    };
    let webBusPayload: Object;
    let sessionBusPayload: Object;
    let returnID: string;
    return import("../../src/runtime/Runtime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const Runtime = mod.RuntimeClass.getRuntime();
          Runtime.onReady(() => {
            Runtime.subscribeWebBus({
              next: (v) => {
                webBusPayload = v.payload;
                fn();
              },
            });
            Runtime.subscribeSessionWebBus({
              next: (v) => {
                sessionBusPayload = v.payload;
                fn();
              },
            });
            Runtime.addEvent(fn());
            returnID = Runtime.postPatchEvent(payload);
            jest.runOnlyPendingTimers();
            res();
          });
        });
      })
      .then(() => {
        expect(spy).toHaveBeenCalled();
        expect(fn).toBeCalledTimes(3);
        expect(returnID).toBe(payload.ID);
        expect(webBusPayload).toEqual(payload);
        expect(sessionBusPayload).toEqual(payload);
      });
  });
});

// ------------------------------------------postLinkEvent------------------------------------------------

describe("postLinkEvent", () => {
  test("postEvent gets called on postLinkEvent and return values matches the initial", () => {
    const postEvent = require("../api/postEvent");
    const spy = jest.spyOn(postEvent, "postEvent");
    const fn = jest.fn();
    const payload = {
      ID: "RandomID",
      alias: "RandomAlias",
    };
    let webBusPayload: Object;
    let sessionBusPayload: Object;
    let returnID: string;
    return import("../../src/runtime/Runtime")
      .then((mod) => {
        return new Promise<void>((res) => {
          const Runtime = mod.RuntimeClass.getRuntime();
          Runtime.onReady(() => {
            Runtime.subscribeWebBus({
              next: (v) => {
                webBusPayload = v.payload;
                fn();
              },
            });
            Runtime.subscribeSessionWebBus({
              next: (v) => {
                sessionBusPayload = v.payload;
                fn();
              },
            });
            Runtime.addEvent(fn());
            returnID = Runtime.postLinkEvent(payload);
            jest.runOnlyPendingTimers();
            res();
          });
        });
      })
      .then(() => {
        expect(spy).toHaveBeenCalled();
        expect(fn).toBeCalledTimes(3);
        expect(returnID).toBe(payload.ID);
        expect(webBusPayload).toEqual(payload);
        expect(sessionBusPayload).toEqual(payload);
      });
  });
});

// ----------------------------------------postWebDevBusEvent--------------------------------------------

describe("postWebDevBusEvent", () => {
  test("WebDevBus.post is called or not", () => {
    const WebDevBusEvent = {
      type: "WebDevBusEvent",
      payload: [1, 2, 3],
    };
    const fn = jest.fn();
    let webDevBus: any;
    return import("../../src/runtime/Runtime").then((mod) => {
      return new Promise<void>((res) => {
        const Runtime = mod.RuntimeClass.getRuntime();
        Runtime.onReady(() => {
          Runtime.subscribeWebDevBus({
            next: (v) => {
              webDevBus = v;
              fn();
            },
          });
          Runtime.postWebDevBusEvent(WebDevBusEvent);
          res();
        });
      }).then(() => {
        expect(fn).toBeCalledTimes(1);
        expect(webDevBus).toEqual(WebDevBusEvent);
      });
    });
  });
});
