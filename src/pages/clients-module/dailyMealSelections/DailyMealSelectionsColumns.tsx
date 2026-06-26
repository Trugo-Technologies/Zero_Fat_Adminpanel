/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { FaDownload } from "react-icons/fa6";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import MealSelectionTypeBadge from "src/Components/baseComponents/badge/MealSelectionTypeBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { DailyMealSelectionPrint } from "./useDailyMealSelections";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export const DailyMealSelectionsColumns = (
  handlePrintSticker = (_: DailyMealSelectionPrint) => {},
  handleDetails = (_: any) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();
  const { clientIdParams } = useParams();

  const clientObjects: GridColDef[] = [
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
  ];

  const DailyMealSelectionsColumns: GridColDef[] = [
    {
      field: locale == "en-US" ? "meal.nameEn" : "meal.nameAr",
      headerName: messages["meal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.mealSelectionType === "Custom"
              ? params?.row?.customeMealName
              : getValueBasedOnCurrentLanguage(
                  params?.row?.meal?.nameAr!,
                  params?.row?.meal?.nameEn!
                )
          }
        />
      ),
    },

    {
      field: "customeMealName",
      headerName: messages["dailyMealSelections.customeMealName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.customeMealName} />
      ),
    },

    {
      field: "basePrice",
      headerName: messages["dailyMealSelections.basePrice"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.basePrice).toFixed(0)} />
      ),
    },

    {
      field: "adjustedPrice",
      headerName: messages["dailyMealSelections.adjustedPrice"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.adjustedPrice).toFixed(0)} />
      ),
    },
    {
      field: "qty",
      headerName: messages["dailyMealSelections.qty"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.qty} />,
    },

    {
      field: "totalCalories",
      headerName: messages["dailyMenuMeals.calories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.totalCalories).toFixed(0)} />
      ),
    },

    {
      field: "totalFats",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.totalFats).toFixed(0)} />
      ),
    },

    {
      field: "totalCarbohydrates",
      headerName: messages["dailyMenuMeals.carbs"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={Number(params.row?.totalCarbohydrates).toFixed(0)}
        />
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
        <AppDataGridCell value={Number(params.row?.totalProteins).toFixed(0)} />
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
      field: "isConsumed",
      headerName: messages["dailyMealSelections.isConsumed"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.isConsumed ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "isPaid",
      headerName: messages["dailyMealSelections.isPaid"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.isPaid ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },
    {
      field: "mealSelectionType",
      headerName: messages["dailyMealSelections.mealSelectionType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            <MealSelectionTypeBadge label={params?.row?.mealSelectionType!} />
          }
        />
      ),
    },

    {
      field: "priceAdjustmentReason",
      headerName: messages[
        "dailyMealSelections.priceAdjustmentReason"
      ] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.priceAdjustmentReason} />
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
      field: "actions",
      headerName: messages["common.actions"] as string,
      sortable: false,
      align: "center",
      filterable: false,
      headerAlign: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      hideable: false,
      renderCell: (params) => {
        return (
          <div>
            <AppIconButton
              label='common.downloadSticker'
              disabled={
                !params?.row?.meal &&
                params?.row?.mealSelectionType === "Default"
              }
              handleClick={() => {
                handlePrintSticker({
                  clientName:
                    params?.row?.client?.fullName ||
                    params?.row?.client?.mobile,
                  meal: params?.row?.meal,
                  customeMealName: params?.row?.customeMealName || null,
                  mealSelectionType: params?.row?.mealSelectionType,
                  totalCalories: Number(params.row?.totalCalories).toFixed(0),
                  totalCarbohydrates: Number(
                    params.row?.totalCarbohydrates
                  ).toFixed(0),
                  totalFats: Number(params.row?.totalFats).toFixed(0),
                  totalProteins: Number(params.row?.totalProteins).toFixed(0),
                });
              }}
              childComp={
                <FaDownload
                  size={18}
                  color={
                    !params?.row?.meal && params?.row?.mealSelectionType
                      ? "#9b9b9b"
                      : "green"
                  }
                />
              }
            />

            {/* Details */}
            <AppIconButton
              label='table.actions.details'
              handleClick={() => {
                handleDetails(params?.row);
              }}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />
          </div>
        );
      },
    },
  ];
  return clientIdParams
    ? DailyMealSelectionsColumns
    : clientObjects.concat(DailyMealSelectionsColumns);
};
