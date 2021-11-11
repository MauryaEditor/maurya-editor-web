export const EditableDiv: React.FC = (props) => {
  return (
    <div
      style={{
        height: "1.4em",
        border: "1px solid #B3B3B3",
        display: "flex",
        borderRadius: "4px",
        alignItems: "center",
        width: "2em",
      }}
    >
      <input
        style={{
          fontSize: "0.6em",
          width: "1.8em",
          textAlign: "center",
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
        }}
        defaultValue={"100"}
      />
      <span style={{ fontSize: "0.6em", textAlign: "center" }}>%</span>
    </div>
  );
};
