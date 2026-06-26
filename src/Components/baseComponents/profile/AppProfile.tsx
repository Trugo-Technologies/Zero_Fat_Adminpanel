/** @format */

import {
  Card,
  CardContent,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import * as React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
// import AppPermissionsGate, { IAppPermissionsProps } from '../permessions/AppPermissionsGate';
import { AxiosError } from "axios";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import Error403 from "src/modules/errorPages/Error403";

export interface IProfileRoutes {
  path: string;
  routeComponent: React.ReactNode;
}

export interface IProfileComponents {
  toPath: string;
  icon: React.ReactNode;
  label: string;
  // show?: boolean;
}

interface IAppProfileProps {
  breadcrumbPaths?: any[];
  currentBreadcrumbPath: string;
  childrenComponents: IProfileComponents[];
  sidebarRoutes: IProfileRoutes[];
  activePath?: number;
  isShowBreadcrumb?: boolean;
  error?: AxiosError<any, any> | undefined;
  withStatus?: boolean;
  statusComponent?: React.ReactNode;
}

const AppProfile: React.FC<IAppProfileProps> = (props) => {
  const {
    breadcrumbPaths,
    currentBreadcrumbPath,
    childrenComponents,
    sidebarRoutes,
    activePath = 5,
    isShowBreadcrumb = true,
    error,
    withStatus = false,
    statusComponent,
  } = props;
  const location = useLocation();
  const path = location.pathname.split("/");
  const currentPath = path[activePath];

  if (error && error?.response?.status == 403) {
    return <Error403 />;
  }

  return (
    <Grid container spacing={4}>
      <AppBreadcrumb
        paths={breadcrumbPaths}
        currentPathName={currentBreadcrumbPath}
        isShow={isShowBreadcrumb}
        withStatus={withStatus}
        StatusComponent={statusComponent!}
      />
      {/* Components */}
      <Grid item xs={3}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component='nav'
              aria-labelledby='nested-list-subheader'>
              {childrenComponents.map((item, index) => {
                return (
                  // <AppPermissionsGate
                  //   schemaName={item.schemaName}
                  //   entityName={item.entityName}
                  //   action={item.action}
                  // >
                  <Link
                    to={item.toPath}
                    style={{ textDecoration: "none", color: "black" }}>
                    <List component='div' disablePadding>
                      <ListItemButton
                        sx={{ pl: 10 }}
                        selected={
                          index == 0 ? !currentPath : currentPath == item.toPath
                        }>
                        <ListItemIcon style={{ minWidth: 30 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          secondary={<IntlMessages id={item.label} />}
                        />
                      </ListItemButton>
                    </List>
                  </Link>
                  // </AppPermissionsGate>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
      {/**/}
      <Grid item xs={9}>
        <Routes>
          {sidebarRoutes.map((item, index) => {
            return <Route path={item.path} element={item.routeComponent} />;
          })}
        </Routes>
      </Grid>
    </Grid>
  );
};

export default AppProfile;
