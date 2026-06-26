import {
  Button,
  SxProps,
  Theme,
  CircularProgress,
  ButtonProps,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useTranslation } from "src/hooks/use-translation";
import { borderRadius } from "src/shared/styles";
interface propsType
  extends Omit<
    ButtonProps,
    keyof {
      loading: boolean;
      title: string;
      sx?: SxProps<Theme> | undefined;
      disabled?: boolean;
      variant?: "contained" | "outlined" | "text";
      type?: "button" | "reset" | "submit" | undefined;
      onClick?: Function;
    }
  > {
  loading?: boolean;
  title: string;
  sx?: SxProps<Theme> | undefined;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: Function;
}

const GenericButton = ({
  loading,
  title,
  sx,
  disabled,
  variant = "contained",
  type,
  onClick,
  ...props
}: propsType) => {
  const { t } = useTranslation("translation");
  const {messages}=useIntl()

  return (
    <Button
      onClick={(e) => {
        onClick && onClick(e);
      }}
      type={type}
      variant={variant}
      fullWidth
      disabled={disabled || loading}
      sx={{ p: 1.2, borderRadius: `${borderRadius.medium}px`, ...sx }}
      {...props}
    >
      {loading ? <CircularProgress size={28} /> : messages[title] as string}
    </Button>
  );
};

export default GenericButton;
