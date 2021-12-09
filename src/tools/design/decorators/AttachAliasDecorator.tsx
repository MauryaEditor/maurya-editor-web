import { useAttachAlias } from "../dev-pkg/hooks/useAttachAlias";

export const AttachAliasDecorator: React.FC<{ ID: string }> = (props) => {
  useAttachAlias(props.ID);
  return <>{props.children}</>;
};
