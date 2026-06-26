/** @format */

import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import PreferredMealTimeBadge from "src/Components/baseComponents/badge/PreferredMealTimeBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";

export const KitchenOrderedMealColumns = (): GridColDef[] => {
  const { messages } = useIntl();

  const KitchenOrderedMealColumns: GridColDef[] = [
    {
      field: "client.fullName",
      headerName: messages["clients.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.client?.fullName || params?.row?.client?.mobile}
        />
      ),
    },

    {
      field: "clientLocation.type",
      headerName: messages["clientLocations.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[
              `clientLocations.type.${params.row?.clientLocation?.type}`
            ] as string
          }
        />
      ),
    },
    {
      field: "clientLocation.area",
      headerName: messages["clientLocations.area"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.area} />
      ),
    },
    {
      field: "clientLocation.street",
      headerName: messages["clientLocations.street"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.street} />
      ),
    },

    {
      field: "clientLocation.building",
      headerName: messages["clientLocations.building"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.building} />
      ),
    },

    {
      field: "clientLocation.postalCode",
      headerName: messages["clientLocations.postalCode"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.postalCode} />
      ),
    },

    {
      field: "clientLocation.office",
      headerName: messages["clientLocations.office"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.office} />
      ),
    },

    {
      field: "clientLocation.fullAddressEn",
      headerName: messages["clientLocations.fullAddressEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.clientLocation?.fullAddressEn}
          style={{ whiteSpace: "break-spaces", textAlign: "left" }}
        />
      ),
    },

    {
      field: "meals",
      headerName: messages["sidebar.meals"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,

      headerClassName: "super-app-theme--header",
      minWidth: 160,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.meals
              ?.map((item: IMeals) => item?.nameAr)
              .join(", ") || "",
            params?.row?.meals
              ?.map((item: IMeals) => item?.nameEn)
              .join(", ") || ""
          )}
          style={{ whiteSpace: "break-spaces", textAlign: "left" }}
        />
      ),
    },

    {
      field: "totalCalories",
      headerName: messages["dailyMenuMeals.calories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.totalCalories} />
      ),
    },

    {
      field: "totalFats",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.totalFats} />,
    },

    {
      field: "totalCarbohydrates",
      headerName: messages["dailyMenuMeals.carbs"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.totalCarbohydrates} />
      ),
    },

    {
      field: "totalProteins",
      headerName: messages["dailyMenuMeals.protein"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.totalProteins} />
      ),
    },

    {
      field: "specialInstructions",
      headerName: messages["dailySelections.specialInstructions"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params.row?.specialInstructions}
          style={{ whiteSpace: "break-spaces", textAlign: "left" }}
        />
      ),
    },

    {
      field: "notes",
      headerName: messages["common.notes"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params.row?.notes}
          style={{ whiteSpace: "break-spaces", textAlign: "left" }}
        />
      ),
    },

    {
      field: "date",
      headerName: messages["dailySelections.date"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.date
              ? moment(params?.row?.date).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "deliveryDate",
      headerName: messages["dailySelections.deliveryDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.deliveryDate
              ? moment(params?.row?.deliveryDate).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "deliveryTime",
      headerName: messages["dailySelections.deliveryTime"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={<PreferredMealTimeBadge label={params?.row?.deliveryTime!} />}
        />
      ),
    },
  ];

  return KitchenOrderedMealColumns;
};
