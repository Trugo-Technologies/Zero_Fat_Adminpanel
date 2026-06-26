/** @format */

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import * as React from "react";
import { IBaseAdditionalResponseDetailsDto } from "src/types/baseEntity";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";

interface IAppDetailsModalProps {
  label: string;
  open: boolean;
  maxWidthAsPixel?: number;
  columns?: number;
  onClose: () => void;
  maxWidth?: "lg" | "md" | "sm" | "xs" | "xl";
  loading: boolean;
  errorMessage: any;
  moreDetails?: IBaseAdditionalResponseDetailsDto;
  itemName: string;
  spacing?: number;
  withoutSecoundTab?: boolean;
  tabs?: Array<{ id?: string; label?: string; component?: React.ReactNode }>;
  children: React.ReactNode;
}

interface ITab {
  id?: string;
  label?: string;
  component?: React.ReactNode;
}

const BaseDetails: React.FC<IAppDetailsModalProps> = (props) => {
  const {
    label,
    open,
    onClose,
    loading,
    maxWidthAsPixel,
    columns = undefined,
    spacing = undefined,
    maxWidth = !maxWidthAsPixel ? "md" : undefined,
    withoutSecoundTab = false,
    errorMessage,
    children,
    moreDetails,
    itemName,
    tabs,
  } = props;
  const [value, setValue] = React.useState<string>("1");

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    setValue(newValue);
  };

  // const useDialogStyles = makeStyles({
  //   paper: {
  //     minWidth: `${maxWidthAsPixel}px`,
  //   },
  // });
  // const dialogClasses = useDialogStyles();
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={label} />{" "}
          <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {" "}
            {itemName ? itemName : ""}
          </span>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <LoadingAndErrorWrapper
            isLoading={loading}
            errorMessage={errorMessage?.response?.data.messages[0]}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'>
                  {tabs?.length! > 0
                    ? tabs?.map((tab: ITab) => {
                        return (
                          <Tab
                            label={<IntlMessages id={tab?.label} />}
                            value={tab?.id}
                          />
                        );
                      })
                    : ""}
                  {!tabs && (
                    <Tab label={<IntlMessages id='details' />} value='1' />
                  )}
                  {!tabs && moreDetails && !withoutSecoundTab && (
                    <Tab
                      label={<IntlMessages id='additionalInfo' />}
                      value='2'
                    />
                  )}
                  {/* <Tab label={<IntlMessages id="details" />} value="1" />
                  {!withoutSecoundTab && (
                    <Tab
                      label={<IntlMessages id="additionalInfo" />}
                      value="2"
                    />
                  )} */}
                </TabList>
                {tabs?.length! > 0 ? (
                  <>
                    {tabs?.map((tab: ITab) => {
                      return (
                        <TabPanel value={tab?.id!}>{tab?.component}</TabPanel>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <TabPanel value='1'>
                      <Grid columns={columns} spacing={spacing} container>
                        {children}
                      </Grid>
                    </TabPanel>
                    <TabPanel value='2'>
                      {moreDetails && !withoutSecoundTab && (
                        <AppMoreDetails moreDetails={moreDetails} />
                      )}
                    </TabPanel>
                  </>
                )}
              </TabContext>
            </Box>
          </LoadingAndErrorWrapper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} color='secondary' label='common.cancel' />
      </DialogActions>
    </Dialog>
  );
};

export default BaseDetails;
