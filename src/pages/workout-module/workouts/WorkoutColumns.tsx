/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import WorkoutFormatBadge from "src/Components/baseComponents/badge/WorkoutFormatBadge";
import WorkoutLevelBadge from "src/Components/baseComponents/badge/WorkoutLevelBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { baseImageUrl } from "src/env/base-url";
import { workoutFormat } from "src/types/enums";
import { IWorkout } from "src/types/modules/workout/workouts";
export const WorkoutColumns = (
  handleDetails = (row: IWorkout) => {},
  handleUpdate = (row: IWorkout) => {},
  handleDelete = (row: IWorkout) => {},
  handleToggleActive = (row: IWorkout) => {},
  handleToggleTop = (row: IWorkout) => {},
  handleToggleWorkoutOfTheDay = (row: IWorkout) => {},

  handleWorkoutExercise = (row: IWorkout) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const WorkoutColumns: GridColDef[] = [
    {
      field: "avatarImageUrl",
      headerName: messages["common.avatarImage"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridImage value={params.row?.avatarImageUrl} />
      ),
    },
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
      hideable: locale != "en-US",

      renderCell: (params) => <AppDataGridCell value={params?.row?.nameEn} />,
    },

    // {
    //   field: 'isTop',
    //   headerName: messages['workouts.isTop'] as string,
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.2,
    //   headerClassName: 'super-app-theme--header',

    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <AppIconButton
    //           label={params?.row?.isTop ? 'workouts.isNotTopTitle' : 'workouts.isTopTitle'}
    //           handleClick={() => {
    //             handleToggleTop(params.row);
    //           }}
    //           childComp={params?.row?.isTop ? <CheckIcon color='primary' /> : <CloseIcon color='error' />}
    //         />
    //       </>
    //     );
    //   },
    // },

    // {
    //   field: 'isWorkoutOfTheDay',
    //   headerName: messages['workouts.isWorkoutOfTheDay'] as string,
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.2,
    //   headerClassName: 'super-app-theme--header',

    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <AppIconButton
    //           label={params?.row?.isWorkoutOfTheDay ? 'workouts.isNotWorkoutOfTheDayTitle' : 'workouts.isWorkoutOfTheDayTitle'}
    //           handleClick={() => {
    //             handleToggleWorkoutOfTheDay(params.row);
    //           }}
    //           childComp={params?.row?.isWorkoutOfTheDay ? <CheckIcon color='primary' /> : <CloseIcon color='error' />}
    //         />
    //       </>
    //     );
    //   },
    // },

    {
      field: "format",
      headerName: messages["workouts.format"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <WorkoutFormatBadge label={params?.row?.format} />
      ),
    },

    {
      field: "level",
      headerName: messages["workouts.level"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <WorkoutLevelBadge label={params?.row?.level} />,

      // <AppDataGridCell value={messages[`workouts.level.${params?.row?.level}`] as string} />,
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
      field: "profileMedia",
      headerName: messages["trainers.profileMedia"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <>
          {params?.row?.profileMediaUrl ? (
            <a
              target='_blank'
              href={`${baseImageUrl}/${params?.row?.profileMediaUrl}`}>
              {messages["clickHere"] as string}
            </a>
          ) : (
            "-"
          )}
        </>
      ),
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
              // handleClick={() => {
              //   handleDetails(params.row);
              // }}
              withLink
              toPathLink={`/workout/training/workouts/profile/${params?.row?.id}`}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />
            {params?.row?.format === workoutFormat.SetReps && (
              <AppIconButton
                label='sidebar.workoutsExercises'
                handleClick={() => {
                  handleWorkoutExercise(params.row);
                }}
                childComp={
                  <SportsGymnasticsIcon
                    fontSize='small'
                    sx={{ color: "#9b9b9b" }}
                  />
                }
              />
            )}

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

  return WorkoutColumns;
};
