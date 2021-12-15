export interface IconTextOption {
  text: string;
  img: string;
  onClick?: () => void;
}

export const IconTextOption: React.FC<IconTextOption> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={props.onClick}
    >
      <div>
        <img src={props.img} />
      </div>
      <div style={{ fontSize: "0.6rem", fontWeight: 600 }}>{props.text}</div>
    </div>
  );
};
