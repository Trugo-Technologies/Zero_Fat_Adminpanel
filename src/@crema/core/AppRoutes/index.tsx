/** @format */

import { Navigate } from "react-router-dom";

import { authRouteConfig } from "./AuthRoutes";
import Error403 from "../../../modules/errorPages/Error403";
import { errorPagesConfigs } from "./ErrorPagesRoutes";
import { workoutModulePages } from "./WorkoutModuleRoutes";
import { nutriPlanModulePages } from "./NutriPlanModuleRoutes";
import { coreModuleRoutes } from "./core-module";
import { clientsModuleRoutes } from "./ClientsRoutes";
import { UsersModuleRoutes } from "./Users-module";
import { DashboardRoutes } from "./DashboardRoutes";

const authorizedStructure = (loginUrl: string) => {
  return {
    fallbackPath: loginUrl,
    unAuthorizedComponent: <Error403 />,
    routes: [
      ...workoutModulePages,
      ...nutriPlanModulePages,
      ...coreModuleRoutes,
      ...clientsModuleRoutes,
      ...UsersModuleRoutes,
      ...DashboardRoutes,
    ],
  };
};

const publicStructure = (initialUrl: string) => {
  return {
    fallbackPath: initialUrl,
    routes: authRouteConfig,
  };
};
const anonymousStructure = (initialUrl: string) => {
  return {
    routes: errorPagesConfigs.concat([
      {
        path: "/",
        element: <Navigate to={initialUrl} />,
      },
      {
        path: "*",
        element: <Navigate to='/error-pages/error-404' />,
      },
    ]),
  };
};

export { authorizedStructure, publicStructure, anonymousStructure };
