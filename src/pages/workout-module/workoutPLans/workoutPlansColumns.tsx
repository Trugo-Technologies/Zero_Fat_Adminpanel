/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import useIntl from "react-intl/lib/src/components/useIntl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IWorkoutPlans } from "src/types/modules/workout/workoutPlans";
import LevelChip from "./components/level-chip";
function WorkoutPlansColumns(
  handleDetails = (row: IWorkoutPlans) => {},
  handleUpdate = (row: IWorkoutPlans) => {},
  handleDelete = (row: IWorkoutPlans) => {},
  handleToggleActive = (row: IWorkoutPlans) => {},
  handlePlanSchedules = (row: IWorkoutPlans) => {}
): GridColDef[] {
  const { messages, locale } = useIntl();

  const daysOfWeek = [
    messages["common.days.Sunday"],
    messages["common.days.Monday"],
    messages["common.days.Tuesday"],
    messages["common.days.Wednesday"],
    messages["common.days.Thursday"],
    messages["common.days.Friday"],
    messages["common.days.Saturday"],
  ];

  const getDayString = (dayNumber: number) => {
    return daysOfWeek[dayNumber];
  };
  const workoutPlansColumns: GridColDef[] = [
    {
      field: "nameAr",
      headerName: messages["common.nameAr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US",

      renderCell: (params) => <AppDataGridCell value={params.row?.nameAr} />,
    },
    {
      field: "nameEn",
      headerName: messages["common.nameEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => <AppDataGridCell value={params?.row?.nameEn} />,
    },

    {
      field: "daysPerWeek",
      headerName: messages["workoutPlans.daysPerWeek"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.daysPerWeek} />
      ),
    },

    {
      field: "restDays",
      headerName: messages["workouts.RestDays"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.restDays
              ? params?.row?.restDays?.map(getDayString).join(", ")
              : "-"
          }
          style={{
            whiteSpace: "break-spaces",
            textAlign: "left",
          }}
        />
      ),
    },
    {
      field: "weeklyRepetition",
      headerName: messages["workoutPlans.weeklyRepetition"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.weeklyRepetition} />
      ),
    },
    {
      field: "trainerName",
      headerName: messages["workoutPlans.trainerName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.trainer.nameEn} />
      ),
    },
    {
      field: "planGoal",
      headerName: messages["workoutPlans.planGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      sortable: false,

      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.planGoal.nameEn} />
      ),
    },
    {
      field: "createdByName",
      headerName: messages["createdByName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.createdByName} />
      ),
    },
    {
      field: "lastModifiedByName",
      headerName: messages["lastModifiedByName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.lastModifiedByName} />
      ),
    },
    {
      field: "createdOn",
      headerName: messages["createdOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={moment(params?.row?.createdOn).format("YYYY-MM-DD")}
        />
      ),
    },
    {
      field: "lastModifiedOn",
      headerName: messages["lastModifiedOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={moment(params?.row?.lastModifiedOn).format("YYYY-MM-DD")}
        />
      ),
    },
    {
      field: "level",
      headerName: messages["workoutPlans.level"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => <LevelChip title={params?.row?.level} />,
    },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
    },

    {
      field: "actions",
      headerName: messages["common.actions"] as string,
      sortable: false,
      align: "center",
      filterable: false,
      headerAlign: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      minWidth: 120,
      // hideable: false,

      renderCell: (params) => {
        return (
          <div>
            {/* Details */}
            <AppIconButton
              label='table.actions.details'
              handleClick={() => {
                handleDetails(params.row);
              }}
              withLink
              toPathLink={`/workout/training/plan/profile/${params?.row?.id}`}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />
            {/* <AppIconButton
              label="sidebar.planSchedules"
              handleClick={() => {
                handlePlanSchedules(params.row);
              }}
              childComp={
                <CalendarTodayIcon fontSize="small" sx={{ color: "#9b9b9b" }} />
              }
            /> */}

            {/* Edit */}
            <AppIconButton
              label='table.actions.edit'
              handleClick={() => {
                handleUpdate(params.row);
              }}
              childComp={
                <EditOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />
            {/**ACTIVE */}

            <AddDataGridActivation
              value={params.row?.isActive}
              handleClick={() => handleToggleActive(params.row)}
            />

            {/* Delete */}
            <AppIconButton
              label='table.actions.delete'
              handleClick={() => {
                handleDelete(params.row);
              }}
              childComp={
                <DeleteOutlinedIcon
                  fontSize='small'
                  sx={{ color: "#9b9b9b" }}
                />
              }
            />
          </div>
        );
      },
    },
  ];
  return workoutPlansColumns;
}

export default WorkoutPlansColumns;
