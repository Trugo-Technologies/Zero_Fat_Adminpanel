/** @format */

import { GridColDef } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import DietitianGoalBadge from "src/Components/baseComponents/badge/DietitianGoalBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";

export const ClientGoalsColumns = (): GridColDef[] => {
  const { messages } = useIntl();

  const ClientGoalsColumns: GridColDef[] = [
    {
      field: "heightInCM",
      headerName: messages["clinets.heightInCM"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.heightInCM && `${params?.row?.heightInCM}`}
        />
      ),
    },

    {
      field: "weightInKG",
      headerName: messages["clinets.weightInKG"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.weightInKG && `${params?.row?.weightInKG}`}
        />
      ),
    },
    {
      field: "targetWeightInKG",
      headerName: messages["clinets.targetWeightInKG"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.targetWeightInKG && `${params?.row?.targetWeightInKG}`
          }
        />
      ),
    },
    {
      field: "activityValue",
      headerName: messages["physicalActivityLevels.activityValue"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.activityValue && `${params?.row?.activityValue}`}
        />
      ),
    },

    {
      field: "bmi",
      headerName: messages["clinets.bmi"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.bmi && `${params?.row?.bmi}`} />
      ),
    },

    {
      field: "bmr",
      headerName: messages["clinets.bmr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.bmr && `${params?.row?.bmr}`} />
      ),
    },

    {
      field: "bodyFat",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.bodyFat && `${params?.row?.bodyFat}`}
        />
      ),
    },

    {
      field: "tdee",
      headerName: messages["clients.tdee"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.tdee && `${params?.row?.tdee}`} />
      ),
    },

    {
      field: "timeToReachGoalInDays",
      headerName: messages["clinets.timeToReachGoalInDays"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.timeToReachGoalInDays &&
            `${params?.row?.timeToReachGoalInDays}`
          }
        />
      ),
    },

    {
      field: "neededCaloriesToReachGoal",
      headerName: messages["clinets.neededCaloriesToReachGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.neededCaloriesToReachGoal &&
            `${params?.row?.neededCaloriesToReachGoal}`
          }
        />
      ),
    },

    {
      field: "heightMeasurement",
      headerName: messages["clientGoals.heightMeasurement"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.heightMeasurement} />
      ),
    },

    {
      field: "weightMeasurement",
      headerName: messages["clientGoals.weightMeasurement"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.weightMeasurement} />
      ),
    },

    {
      field: "targetWeightMeasurement",
      headerName: messages["clientGoals.targetWeightMeasurement"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.targetWeightMeasurement} />
      ),
    },

    {
      field: "dietitianGoal",
      headerName: messages["clinets.dietitianGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,
      renderCell: (params) => (
        <AppDataGridCell
          value={<DietitianGoalBadge label={params?.row?.dietitianGoal!} />}
        />
      ),
    },
  ];

  return ClientGoalsColumns;
};
