import { IconTextOption } from "./IconTextOption";
import ShareImage from "../../../../assets/images/share.svg";
import PreviewImage from "../../../../assets/images/preview.svg";
import DeployImage from "../../../../assets/images/deploy.svg";
import AccountImage from "../../../../assets/images/account.svg";
import { EditableDiv } from "./EditableDiv";
import { useCallback } from "react";
import { getProjectID } from "../../../../lib/getProjectID";
import { backendUrl } from "../../../../lib/backend-url";

export const Options: React.FC = (props) => {
  const compile = useCallback(() => {
    const projectID = getProjectID();
    console.log("projectID", projectID);
    if (projectID) {
      fetch(`${backendUrl}/compiler?compiler=all&projectID=${projectID}`).then(
        (resp) => {
          console.log(resp);
        }
      );
    }
  }, []);
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
        <IconTextOption img={PreviewImage} text={"Preview"} onClick={compile} />
        <IconTextOption img={DeployImage} text={"Deploy"} />
        <IconTextOption img={AccountImage} text={"Account"} />
        <EditableDiv />
      </div>
    </div>
  );
};
