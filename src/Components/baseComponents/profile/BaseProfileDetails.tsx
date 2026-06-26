/** @format */

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Card, CardContent, Grid, Tab } from "@mui/material";
import * as React from "react";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import { IBaseAdditionalResponseDetailsDto } from "src/types/baseEntity";
import IntlMessages from "src/@crema/helpers/IntlMessages";

interface IAppDetailsModalProps {
  moreDetails: IBaseAdditionalResponseDetailsDto;
  columns?: number;
  withMoreDetails?: boolean;
  children: React.ReactNode;
}

const BaseProfileDetails: React.FC<IAppDetailsModalProps> = (props) => {
  const {
    children,
    moreDetails,
    columns = undefined,
    withMoreDetails = false,
  } = props;
  const [value, setValue] = React.useState<string>("1");

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    setValue(newValue);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={8} rowSpacing={8}>
            <Grid item xs={12}>
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'>
                  <Tab label={<IntlMessages id='details' />} value='1' />
                  {withMoreDetails && (
                    <Tab
                      label={<IntlMessages id='additionalInfo' />}
                      value='2'
                    />
                  )}
                </TabList>
                {/* Details Tab */}
                <TabPanel value='1'>
                  <Grid columns={columns} container item>
                    {children}
                  </Grid>
                </TabPanel>
                {withMoreDetails && (
                  <TabPanel value='2'>
                    <AppMoreDetails moreDetails={moreDetails} />
                  </TabPanel>
                )}
              </TabContext>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BaseProfileDetails;
