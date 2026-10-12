/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import MealPlanDefaultDietitianGoal from "src/Components/baseComponents/badge/MealPlanDefaultDietitianGoal";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import {
  IMealPlans,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
export const MealPlansColumns = (
  handleDetails = (row: IMealPlans) => {},
  handleUpdate = (row: IMealPlans) => {},
  handleDelete = (row: IMealPlans) => {},
  handleToggleActive = (row: IMealPlans) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const MealPlansColumns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: messages["common.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridImage value={params.row?.imageUrl} />,
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
      field: "code",
      headerName: messages["common.code"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params?.row?.code} />,
    },
    {
      field: "carbPercentage",
      headerName: messages["mealPlans.carbPercentage"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) =>
        isCustomizeMealPlanRow(params.row) ? (
          <AppDataGridCell value='—' />
        ) : (
          <AppDataGridCell value={params?.row?.carbPercentage} />
        ),
    },
    {
      field: "proteinPercentage",
      headerName: messages["mealPlans.proteinPercentage"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => {
        if (!isCustomizeMealPlanRow(params.row)) {
          return <AppDataGridCell value={params?.row?.proteinPercentage} />;
        }
        const proteinGrams =
          params.row?.proteinGrams ?? params.row?.protein?.grams;
        return (
          <AppDataGridCell
            value={proteinGrams != null ? `${proteinGrams}g` : "—"}
          />
        );
      },
    },
    {
      field: "fatPercentage",
      headerName: messages["mealPlans.fatPercentage"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US",

      renderCell: (params) => {
        if (!isCustomizeMealPlanRow(params.row)) {
          return <AppDataGridCell value={params?.row?.fatPercentage} />;
        }
        const carbsGrams = params.row?.carbsGrams ?? params.row?.carbs?.grams;
        const fiberGrams = params.row?.fiberGrams ?? params.row?.fiber?.grams;
        return (
          <AppDataGridCell
            value={
              [
                carbsGrams != null ? `C ${carbsGrams}g` : null,
                fiberGrams != null ? `F ${fiberGrams}g` : null,
              ]
                .filter(Boolean)
                .join(" · ") || "—"
            }
          />
        );
      },
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
      field: "defaultDietitianGoal",
      headerName: messages["mealPlans.defaultDietitianGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,
      renderCell: (params) => (
        <MealPlanDefaultDietitianGoal
          label={params?.row?.defaultDietitianGoal}
        />
      ),
    },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,

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

  return MealPlansColumns;
};
