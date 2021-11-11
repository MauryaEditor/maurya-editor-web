import { IconTextOption } from "./IconTextOption";
import ShareImage from "../../../../assets/images/share.svg";
import PreviewImage from "../../../../assets/images/preview.svg";
import DeployImage from "../../../../assets/images/deploy.svg";
import AccountImage from "../../../../assets/images/account.svg";
import { EditableDiv } from "./EditableDiv";

export const Options: React.FC = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        right: "2rem",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: "2rem",
        }}
      >
        <IconTextOption img={ShareImage} text={"Share"} />
        <IconTextOption img={PreviewImage} text={"Preview"} />
        <IconTextOption img={DeployImage} text={"Deploy"} />
        <IconTextOption img={AccountImage} text={"Account"} />
        <EditableDiv />
      </div>
    </div>
  );
};
