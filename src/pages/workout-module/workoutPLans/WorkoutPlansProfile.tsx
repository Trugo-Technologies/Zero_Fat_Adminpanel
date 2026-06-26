/** @format */

import AppProfile, {
  IProfileComponents,
  IProfileRoutes,
} from "src/Components/baseComponents/profile/AppProfile";
import InfoIcon from "@mui/icons-material/Info";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useParams } from "react-router-dom";
import { useGetPlanByIdQuery } from "./services/api";
import useIntl from "react-intl/lib/src/components/useIntl";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import PlanProfileDetails from "src/Components/wrokout-module/catalog/pLans/PlanProfileDetails";
import PlanReviewsPages from "../planReviews";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlanSchedulesPages from "../planSchedules";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";

const WorkoutPlansProfile = () => {
  const { workoutPlanIdParams } = useParams();
  const { messages } = useIntl();

  const {
    data: planItem,
    isLoading,
    error,
  } = useGetPlanByIdQuery(
    { id: workoutPlanIdParams || "" },
    {
      skip: !workoutPlanIdParams,
    }
  );

  const childrenComponents: IProfileComponents[] = [
    {
      label: "table.actions.details",
      toPath: "",
      icon: <InfoIcon fontSize='small' />,
    },

    {
      label: "sidebar.planReviews",
      toPath: "planReviews",
      icon: <ReviewsIcon fontSize='small' />,
    },

    {
      label: "planSchedule.name",
      toPath: "planSchedules",
      icon: <CalendarTodayIcon fontSize='small' />,
    },
  ];

  const sidebarRoutes: IProfileRoutes[] = [
    {
      path: "",
      routeComponent: (
        <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
          <PlanProfileDetails planItem={planItem!} />
        </LoadingAndErrorWrapper>
      ),
    },

    {
      path: "planReviews",
      routeComponent: <PlanReviewsPages />,
    },

    {
      path: "planSchedules",
      routeComponent: (
        <PlanSchedulesPages
          planId={workoutPlanIdParams!}
          daysPerWeek={planItem?.data?.daysPerWeek!}
        />
      ),
    },
  ];
  return (
    <AppProfile
      breadcrumbPaths={[
        { name: messages["sidebar.workoutManagement.title"] as string },
        {
          name: messages["sidebar.training.title"] as string,
          path: "workout/training/plan",
        },
        {
          name: getValueBasedOnCurrentLanguage(
            planItem?.data?.nameAr!,
            planItem?.data?.nameEn!
          ),
        },
        { name: messages["table.actions.details"] as string },
      ]}
      currentBreadcrumbPath=''
      childrenComponents={childrenComponents}
      sidebarRoutes={sidebarRoutes}
      activePath={6}></AppProfile>
  );
};

export default WorkoutPlansProfile;
