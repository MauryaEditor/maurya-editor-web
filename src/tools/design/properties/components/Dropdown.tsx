import { useEffect, useRef, useState } from "react";
import Triangle from "./Triangle.svg";
import "./Dropdown.css";

export interface DropdownProps {
  height: string;
  width: string;
  options: string[];
}

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const [selected, setSelected] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (ev: MouseEvent) => {
      setShowOptions(false);
    };
    window.addEventListener("mousedown", fn);
    return () => {
      window.removeEventListener("mousedown", fn);
    };
  }, [setShowOptions]);
  return (
    <div
      ref={divRef}
      style={{
        display: "flex",
        height: props.height,
        width: props.width,
        border: "1px solid #CBD5E1",
        alignItems: "center",
        gap: "0.5em",
        borderRadius: "4px",
        boxSizing: "border-box",
        paddingLeft: "1em",
        fontSize: "0.8rem",
        position: "relative",
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        setShowOptions(true);
      }}
    >
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {selected ? (
            <span>{selected}</span>
          ) : (
            <span style={{ color: "#94A3B8" }}>Select</span>
          )}
        </div>
      </div>
      <img
        src={Triangle}
        style={{ height: "0.35rem", marginRight: "0.4rem" }}
      />
      {showOptions ? (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            top: props.height,
            width: "100%",
            left: 0,
            borderRight: "1px solid #CBD5E1",
            borderLeft: "1px solid #CBD5E1",
            borderBottom: "1px solid #CBD5E1",
            boxSizing: "border-box",
          }}
        >
          {props.options.map((option) => {
            return (
              <div
                className="dropdown-option"
                style={{
                  height: props.height,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "1em",
                  fontWeight: "bold",
                }}
                onMouseDown={(ev) => {
                  ev.stopPropagation();
                  setSelected(option);
                  setShowOptions(false);
                }}
                key={option}
              >
                <div style={{ flex: 1 }}>{option}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
