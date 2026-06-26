import { Avatar, Chip, Grid, Typography } from "@mui/material";
import moment from "moment";
// import { dateFormatter, dateTimeFormatter, timeFormatter } from 'helpers/string/dateFormatter';
import * as React from "react";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { baseImageUrl } from "src/env/base-url";
import Image from "rc-image";

interface IAppItemViewProps {
  column?: number;
  marginX?: number;
  label?: string;
  value: any;
  type?:
    | "text"
    | "date"
    | "time"
    | "dateTime"
    | "isActive"
    | "isExist"
    | "isPhoneNumber"
    | "image"
    | "custom";
}

const AppItemView: React.FC<IAppItemViewProps> = (props) => {
  const {
    column = 6,
    label,
    value,
    type = "text",
    marginX = undefined,
  } = props;
  const { messages, locale } = useIntl();

  const ItemView = () => {
    return (
      <>
        {(() => {
          switch (type) {
            case "text":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: Fonts.REGULAR,
                      // textAlign:
                      //   locale === "ar-SA" &&
                      //   label &&
                      //   label?.toLowerCase()?.endsWith("en")
                      //     ? "right !important"
                      //     : locale === "ar-SA" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("ar")
                      //     ? "left !important"
                      //     : locale === "en-US" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("en")
                      //     ? "left !important"
                      //     : locale === "en-US" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("ar")
                      //     ? "right !important"
                      //     : "",
                      // direction:
                      //   locale === "ar-SA" &&
                      //   label &&
                      //   label?.toLowerCase()?.endsWith("en")
                      //     ? "rtl !important"
                      //     : locale === "ar-SA" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("ar")
                      //     ? "ltr !important"
                      //     : locale === "en-US" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("en")
                      //     ? "ltr !important"
                      //     : locale === "en-US" &&
                      //       label &&
                      //       label?.toLowerCase()?.endsWith("ar")
                      //     ? "rtl !important"
                      //     : "",

                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {value ?? "-"}
                  </Typography>
                </Grid>
              );

            case "date":
            case "dateTime":
            case "time":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
                    {type == "date" && value
                      ? moment(value).format("YYYY-MM-DD")
                      : type == "dateTime" && value
                        ? moment(value).format("YYYY-MM-DD HH:mm A")
                        : value
                          ? moment(value).format("HH:mm A")
                          : "-"}
                  </Typography>
                </Grid>
              );

            case "isActive":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
                    {value ? (
                      <Chip
                        size="small"
                        label={messages["columns.active"] as string}
                        color="success"
                        variant="filled"
                        sx={{
                          color: "#fff",
                          "& .MuiChip-label": { transform: "translateY(-2px)" },
                        }}
                      />
                    ) : (
                      <Chip
                        size="small"
                        label={messages["columns.inactive"] as string}
                        color="error"
                        variant="filled"
                        sx={{
                          "& .MuiChip-label": { transform: "translateY(-2px)" },
                        }}
                      />
                    )}
                  </Typography>
                </Grid>
              );

            case "isPhoneNumber":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  <Typography
                    style={{
                      direction: "ltr",
                      textAlign: locale == "ar-SA" ? "right" : "left",
                    }}
                  >
                    {value ? value : "-"}
                  </Typography>
                </Grid>
              );

            case "isExist":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  <Typography sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
                    {value ? (
                      <CheckIcon color="primary" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </Typography>
                </Grid>
              );
            case "image":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: Fonts.SEMI_BOLD,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}
                  {value && (
                    <Image
                      preview={{
                        closeIcon: <CloseIcon color="primary" />,
                        // focusTriggerAfterClose: true,
                        // maskClosable: true,
                        // destroyOnClose: true,
                        // forceRender: true,
                      }}
                      src={`${baseImageUrl}/${value}`}
                      width={120} // Set the width of the image
                      // Enable zoom functionality
                    />
                  )}

                  {/* <Avatar src={`${baseImageUrl}/${value}`} /> */}
                </Grid>
              );
            case "custom":
              return (
                <Grid marginX={marginX} item xs={column}>
                  {label && (
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id={label} />
                    </Typography>
                  )}

                  {value}
                </Grid>
              );

            default:
              return null;
          }
        })()}
      </>
    );
  };

  return <ItemView />;
};

export default AppItemView;
