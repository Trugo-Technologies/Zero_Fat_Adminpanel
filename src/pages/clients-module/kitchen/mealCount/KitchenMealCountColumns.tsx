/** @format */

import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IKitchenMealCount } from "src/types/modules/clientsManagement/kitchen/mealCount";
import { FaDownload } from "react-icons/fa";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";

export const KitchenMealCountColumns = (
  handlePrintSticker = (_: IKitchenMealCount) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const KitchenMealCountColumns: GridColDef[] = [
    {
      field: locale == "en-US" ? "meal.nameEn" : "meal.nameAr",
      headerName: messages["meal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.meal?.nameAr!,
            params?.row?.meal?.nameEn!
          )}
        />
      ),
    },

    {
      field: "meal.weightInGrams",
      headerName: messages["dailyMenuMeals.weightInGrams"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.weightInGrams} />
      ),
    },

    {
      field: "meal.calories",
      headerName: messages["dailyMenuMeals.calories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.calories} />
      ),
    },

    {
      field: "meal.fat",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.meal?.fat} />,
    },

    {
      field: "meal.carbs",
      headerName: messages["dailyMenuMeals.carbs"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.carbs} />
      ),
    },

    {
      field: "meal.protein",
      headerName: messages["dailyMenuMeals.protein"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.protein} />
      ),
    },

    {
      field: "meal.water",
      headerName: messages["dailyMenuMeals.water"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.water} />
      ),
    },

    {
      field: "meal.priceForCustomer",
      headerName: messages["meals.priceForCustomer"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.meal?.priceForCustomer} />
      ),
    },

    {
      field: "meals.isAddOn",
      headerName: messages["meals.isAddOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.meal?.isAddOn ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "meal.allergens",
      headerName: messages["sidebar.allergens"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,

      headerClassName: "super-app-theme--header",
      minWidth: 160,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.meal?.allergens
              ?.map((item: IAllergens) => item?.nameAr)
              .join(", ") || "",
            params?.row?.allergens
              ?.map((item: IAllergens) => item?.nameEn)
              .join(", ") || ""
          )}
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
      field: "requestCount",
      headerName: messages["kitchen.requestCount"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.requestCount} />
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
              handleClick={() => {
                handlePrintSticker(params?.row);
              }}
              childComp={<FaDownload size={18} color='#9b9b9b' />}
            />
          </div>
        );
      },
    },
  ];

  return KitchenMealCountColumns;
};
