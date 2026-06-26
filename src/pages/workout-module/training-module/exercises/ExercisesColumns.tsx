/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import ExerciseTypeBadge from "src/Components/baseComponents/badge/ExerciseTypeBadge";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { baseImageUrl } from "src/env/base-url";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IExercise } from "src/types/modules/training/exercises";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";

export const ExercisesColumns = (
  handleDetails = (row: IExercise) => {},
  handleUpdate = (row: IExercise) => {},
  handleDelete = (row: IExercise) => {},
  handleToggleActive = (row: IExercise) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const ExercisesColumns: GridColDef[] = [
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
    {
      field: locale == "en-US" ? "trainer.nameEn" : "trainer.nameAr",
      headerName: messages["trainers.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.trainer?.nameAr!,
            params?.row?.trainer?.nameEn!
          )}
        />
      ),
    },
    {
      field: "bodyParts",
      headerName: messages["exercises.bodyParts"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,
      headerClassName: "super-app-theme--header",
      minWidth: 160,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.bodyParts
              ?.map((item: IWorkoutBodyPart) => item?.nameAr)
              .join(", ") || "",
            params?.row?.bodyParts
              ?.map((item: IWorkoutBodyPart) => item?.nameEn)
              .join(", ") || ""
          )}
        />
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
      field: "type",
      headerName: messages["exercises.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <ExerciseTypeBadge label={params?.row?.type} />,

      // renderCell: (params) => <AppDataGridCell value={messages[`exercises.type.${params?.row?.type}`] as string} />,
    },

    {
      field: "media",
      headerName: messages["common.media"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <>
          {params?.row?.mediaUrl ? (
            <a
              target='_blank'
              href={`${baseImageUrl}/${params?.row?.mediaUrl}`}>
              {messages["clickHere"] as string}
            </a>
          ) : (
            "-"
          )}
        </>
      ),
    },

    {
      field: "gif",
      headerName: messages["common.gif"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.gifUrl ? (
            <a target='_blank' href={`${baseImageUrl}/${params?.row?.gifUrl}`}>
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
      // hideable: false,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div>
            {/* Details */}
            <AppIconButton
              label='table.actions.details'
              handleClick={() => {
                handleDetails(params.row);
              }}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

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

  return ExercisesColumns;
};
