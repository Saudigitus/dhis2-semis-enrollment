import { SplitButton } from "@dhis2/ui";
import React from "react";
import { DropdownButtonComponentProps } from "../../types/buttons/DropdownButtonProps";
import FlyoutMenuComponent from "../menu/FlyoutMenu";

function DropdownButtonComponent(props: DropdownButtonComponentProps): React.ReactElement {
  const { name, icon, options, disabled } = props;

  return (
    <SplitButton
      disabled={disabled}
      icon={icon}
      component={<FlyoutMenuComponent options={options} />}
    >
      {name}
    </SplitButton>
  );
}

export default DropdownButtonComponent;
