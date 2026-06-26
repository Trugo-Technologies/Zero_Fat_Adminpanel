/** @format */

import InfoIcon from "@mui/icons-material/Info";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import AppProfile, {
  IProfileComponents,
  IProfileRoutes,
} from "src/Components/baseComponents/profile/AppProfile";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetWorkoutQuery } from "./services/api";

import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import WorkoutDetailsProfile from "src/Components/wrokout-module/catalog/workouts/WorkoutDetailsProfile";
import { workoutFormat } from "src/types/enums";
import WorkoutExercisesPages from "../workoutExercises";
const WorkoutProfile = () => {
  const { workoutIdParams } = useParams();
  const { messages } = useIntl();
  const {
    data: workoutItem,
    isLoading,
    error,
  } = useGetWorkoutQuery(
    { id: workoutIdParams || "" },
    {
      skip: !workoutIdParams,
    }
  );

  const childrenComponents: IProfileComponents[] = [
    {
      label: "table.actions.details",
      toPath: "",
      icon: <InfoIcon fontSize='small' />,
    },
    {
      label: "sidebar.workoutsExercises",
      toPath: "workoutsExercises",
      icon: <SportsGymnasticsIcon fontSize='small' />,
    },
  ];

  // Assuming workoutItem is available and you are using it in a functional component
  const filteredComponents = childrenComponents.filter((component) => {
    // Check if the component is 'workoutsExercises' and if workoutItem?.data?.format is 'Follow Along'
    return !(
      component.label === "sidebar.workoutsExercises" &&
      workoutItem?.data?.format === workoutFormat.FollowAlong
    );
  });

  const sidebarRoutes: IProfileRoutes[] = [
    {
      path: "",
      routeComponent: (
        <LoadingAndErrorWrapper errorMessage={""} isLoading={isLoading}>
          <WorkoutDetailsProfile workoutItem={workoutItem?.data!} />
        </LoadingAndErrorWrapper>
      ),
    },

    {
      path: "workoutsExercises",
      routeComponent: (
        <WorkoutExercisesPages
          workoutId={workoutIdParams!}
          trainerId={workoutItem?.data?.trainer?.id!}
          sets={workoutItem?.data?.setNamesAr?.length!}
        />
      ),
    },
  ];
  return (
    <AppProfile
      breadcrumbPaths={[
        { name: messages["sidebar.workoutManagement.title"] as string },
        {
          name: messages["sidebar.workouts"] as string,
          path: "/workout/training/workouts",
        },
        {
          name: getValueBasedOnCurrentLanguage(
            workoutItem?.data?.nameAr!,
            workoutItem?.data?.nameEn!
          ),
        },
        { name: messages["table.actions.details"] as string },
      ]}
      currentBreadcrumbPath=''
      childrenComponents={filteredComponents}
      sidebarRoutes={sidebarRoutes}
      activePath={6}></AppProfile>
  );
};

export default WorkoutProfile;
