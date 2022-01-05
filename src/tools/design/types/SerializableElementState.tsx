import { RenderProps } from "./RenderProps";

export interface SerializableElementState {
  // synced with database
  compKey: string;
  state: {
    style: React.CSSProperties; // dev related styles only like position, top, left
    properties: { [key: string | number]: any };
    appearance: { [key: string | number]: any };
    parent: string;
    alias: string;
  };
  // fields need only in front end

  propertyMap: { key: string; type: string; slice: (string | number)[] }[];
  appearanceMap: { key: string; type: string; slice: (string | number)[] }[];
  renderProps: RenderProps;

  isAliasable: boolean; // true if the state.alias can be used as variable
}
