import { TextProperty } from "../property-types/TextProperty";
import { PropertyMap } from "../types/PropertyMap";
import { PropertyRegistryClass } from "./PropertyRegistryClass";

const maps: PropertyMap[] = [{ type: "design/text", comp: TextProperty }];

export const AppearanceRegistry = new PropertyRegistryClass(maps);
