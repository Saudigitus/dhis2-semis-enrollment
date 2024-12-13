import { MenuItem, FlyoutMenu } from "@dhis2/ui";
import React from "react";
import { Divider } from "@material-ui/core"
import { FlyoutComponentProps } from "../../types/buttons/FlyoutOptionsProps";

function FlyoutMenuComponent(props: FlyoutComponentProps): React.ReactElement {
  const { options } = props;

  return (
    <FlyoutMenu>
      <div style={{ display: "flex", flexDirection: "column", background: "#fff" }} >
        {options.map((option: any, i: any) => (
          <>
            {option.label}
            {option.divider === true && <Divider />}
          </>
        ))}
      </div>
    </FlyoutMenu>
  );
}

export default FlyoutMenuComponent;
