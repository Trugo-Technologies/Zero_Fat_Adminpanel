import WorkoutPlansPage from "src/pages/workout-module/workoutPLans/workoutPlansPage";

import React from "react";
import EquipmentCategoriesPage from "src/pages/workout-module/equipmentCategories";
import WorkoutTypesPages from "src/pages/workout-module/workoutTypes";
import PlanGoalsPages from "src/pages/workout-module/planGoals";
import EquipmentsPage from "src/pages/workout-module/equipments";
import ExercisesPage from "src/pages/workout-module/training-module/exercises";
import TrainersPages from "src/pages/workout-module/training-module/trainer";
import WorkoutPages from "src/pages/workout-module/workouts";
import WorkoutProfile from "src/pages/workout-module/workouts/WorkoutProfile";
import WorkoutPlansProfile from "src/pages/workout-module/workoutPLans/WorkoutPlansProfile";
const AllPlans = React.lazy(() => import("src/app/plans/pages/all-plans"));

const WorkoutBodyPartsPage = React.lazy(
  () => import("src/pages/workout-module/workoutBodyParts")
);
export const workoutModulePages = [
  { path: "/workout/catalog/bodyParts", element: <WorkoutBodyPartsPage /> },

  // { path: '/equipment-category', element: <AllEquipmentCategories /> },
  {
    path: "/workout/catalog/equipmentCategories",
    element: <EquipmentCategoriesPage />,
  },
  {
    path: "/workout/catalog/workoutTypes",
    element: <WorkoutTypesPages />,
  },
  {
    path: "/workout/catalog/planGoals",
    element: <PlanGoalsPages />,
  },
  {
    path: "/workout/catalog/equipments",
    element: <EquipmentsPage />,
  },
  {
    path: "/workout/training/exercises",
    element: <ExercisesPage />,
  },
  {
    path: "/workout/training/trainers",
    element: <TrainersPages />,
  },
  {
    path: "/workout/training/workouts",
    element: <WorkoutPages />,
  },
  { path: "/workout/training/plan", element: <WorkoutPlansPage /> },

  {
    path: "/workout/training/workouts/profile/:workoutIdParams/*",
    element: <WorkoutProfile />,
  },

  {
    path: "/workout/training/plan/profile/:workoutPlanIdParams/*",
    element: <WorkoutPlansProfile />,
  },
  //WorkoutPlansProfile
];
