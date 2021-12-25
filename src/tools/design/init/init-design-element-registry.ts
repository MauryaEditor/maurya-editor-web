import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";
import ButtonManifest from "../elements/button/Button";
import InputboxManifest from "../elements/inputbox/Inputbox";
import SectionManifest from "../elements/section/Section";

export const initDesignElementRegistry = () => {
  DesignRuntime.registerDesignElement("basic", ButtonManifest);
  DesignRuntime.registerDesignElement("basic", InputboxManifest);
  DesignRuntime.registerDesignElement("layout", SectionManifest);
};
