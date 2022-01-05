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

test("onReady gets called", () => {
  const Runtime = RuntimeClass.getRuntime();
  Runtime.onReady(() => {
    console.log("onReady called");
  });
});
