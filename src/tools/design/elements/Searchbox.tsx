import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import SearchImage from "./assets/search.svg";
import { RenderProps } from "./types/RenderProps";
import "./css/elements.css";
import { useAttachProperty } from "./hooks/useAttachProperty";
export const Searchbox: React.FC<RenderProps> = (props) => {
  const Alias = useAttachProperty<string>(
    props.ID,
    "design/alias",
    "Alias",
    props.properties?.Alias || ""
  );
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #CBD5E1",
        padding: "0.5rem 0.75rem 0.5rem 0.75rem",
        borderRadius: "6px",
        boxSizing: "border-box",
      }}
    >
      <img src={SearchImage} />
      <input
        style={{
          outline: "none",
          border: "none",
          backgroundColor: "transparent",
          lineHeight: "0.75rem",
          fontSize: "0.75rem",
        }}
        placeholder={"Type to search ..."}
      ></input>
    </div>
  );
};

const manifest = {
  key: "Searchbox",
  comp: SimpleComponent,
  props: { name: "Searchbox" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Searchbox" },
  renderComp: Searchbox,
  renderCompProps: () => {
    return {
      style: {} as React.CSSProperties,
    };
  },
};

export default manifest;
