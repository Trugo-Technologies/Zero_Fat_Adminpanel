import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SxProps } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";
import { Box } from "@mui/material";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppAppCustomizedSwitchProps {
  keyName: string;
  onChange: (field: string, value: any) => void;
  sxStyle?: SxProps;
  defaultChecked?: boolean;
}

const AppCustomizedSwitch: React.FC<IAppAppCustomizedSwitchProps> = (props) => {
  const {
    keyName,
    onChange,
    sxStyle = { margin: 0 },
    defaultChecked = true,
  } = props;

  const [checked, setChecked] = React.useState<boolean>(defaultChecked);
  return (
    <>
      <FormControlLabel
        sx={sxStyle}
        control={
          <StatusSwitch
            name={keyName}
            sx={{ m: 1 }}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={(value: any) => {
              onChange(keyName, value.target.checked);
              setChecked(value.target.checked);
            }}
          />
        }
        label={
          <Box sx={{ display: "flex" }}>
            <Zoom in={checked}>
              <p style={{ marginInline: "5px" }}>
                <IntlMessages id="columns.active" />
              </p>
            </Zoom>
            <Zoom in={!checked}>
              <p style={{ marginInline: "-40px" }}>
                <IntlMessages id="columns.inactive" />
              </p>
            </Zoom>
          </Box>
        }
      />
    </>
  );
};

export default AppCustomizedSwitch;

const StatusSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 15,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(23px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    // "&.Mui-focusVisible .MuiSwitch-thumb": {
    //   color: "#65C466",
    //   border: "5px solid #fff",
    // },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 11,
    height: 11,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "red" : "",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
