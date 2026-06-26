// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  DialogContent,
  Divider,
  Typography,
} from "@mui/material";
import LeanerProgress from "@mui/material/LinearProgress";
// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = ({
  boxShadow = "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02);",
  children,
  content = true,
  contentSX = {},
  secondary,
  sx = {},
  title,
  hide = false,
  loading = false,
  dialogMode = false,

  ...others
}: any) => {
  if (hide && dialogMode)
    return <DialogContent dividers> {children}</DialogContent>;

  return (
    <Card
      {...others}
      sx={{
        ...sx,
        boxShadow: boxShadow,
      }}
    >
      {/* card header and action */}
      {title && (
        <CardHeader
          sx={headerSX}
          title={
            <Typography variant="h3" color="#5A626B">
              {title}
            </Typography>
          }
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {title && <Divider />}
      {loading && <LeanerProgress />}
      {/* card content */}
      {!loading && children && (
        <CardContent sx={{ ...contentSX }}>{children}</CardContent>
      )}
    </Card>
  );
};

export default MainCard;
