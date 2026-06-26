/** @format */

import * as React from "react";
import AppButton from "../buttons/AppButton";
import { RiFileExcel2Fill } from "react-icons/ri";

interface IProps {
  onClick: () => void;
  disabled: boolean;
}

const ExportExcelButton: React.FC<IProps> = (props) => {
  const { onClick, disabled } = props;

  return (
    <AppButton
      disabled={disabled}
      fullWidth
      size='medium'
      startIcon={<RiFileExcel2Fill color='#fff' />}
      onClick={onClick}
      label='common.exportAsExcel'
    />
  );
};

export default ExportExcelButton;
