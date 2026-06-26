/** @format */

import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import AppProfile, {
  IProfileComponents,
  IProfileRoutes,
} from "src/Components/baseComponents/profile/AppProfile";
import MealDetailsProfile from "src/Components/nutriplan-module/mealPlanning/meals/MealDetailsProfile";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import CustomizationOptionsPage from "../customizationOptions/CustomizationOptionsPage";
import { useGetMealQuery } from "./services/api";
const MealsProfile = () => {
  const { mealIdParams } = useParams();
  const { messages } = useIntl();
  const {
    data: mealsItem,
    isLoading,
    error,
  } = useGetMealQuery(
    { id: mealIdParams || "" },
    {
      skip: !mealIdParams,
    }
  );

  const childrenComponents: IProfileComponents[] = [
    {
      label: "table.actions.details",
      toPath: "",
      icon: <InfoIcon fontSize='small' />,
    },
    {
      label: "sidebar.customizationOptions",
      toPath: "customizationOptions",
      icon: <AddIcon fontSize='small' />,
    },
  ];

  const sidebarRoutes: IProfileRoutes[] = [
    {
      path: "",
      routeComponent: (
        <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
          <MealDetailsProfile mealItem={mealsItem!} />
        </LoadingAndErrorWrapper>
      ),
    },

    {
      path: "customizationOptions",
      routeComponent: <CustomizationOptionsPage />,
    },
  ];
  return (
    <AppProfile
      breadcrumbPaths={[
        { name: messages["sidebar.nutriplanManagement.title"] as string },
        {
          name: messages["sidebar.mealPlanning.title"] as string,
        },
        {
          name: messages["sidebar.meals"] as string,
          path: "/nutriplan/mealPlanning/meals",
        },
        {
          name: getValueBasedOnCurrentLanguage(
            mealsItem?.data?.nameAr!,
            mealsItem?.data?.nameEn!
          ),
        },
        { name: messages["table.actions.details"] as string },
      ]}
      currentBreadcrumbPath=''
      childrenComponents={childrenComponents}
      sidebarRoutes={sidebarRoutes}
      activePath={5}></AppProfile>
  );
};

export default MealsProfile;
