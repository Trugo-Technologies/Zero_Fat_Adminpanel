/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";

export const MealsColumns = (
  handleDetails = (row: IMeals) => {},
  handleUpdate = (row: IMeals) => {},
  handleDelete = (row: IMeals) => {},
  handleToggleActive = (row: IMeals) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const MealsColumns: GridColDef[] = [
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
      field: "weightInGrams",
      headerName: messages["dailyMenuMeals.weightInGrams"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.weightInGrams} />
      ),
    },

    {
      field: "calories",
      headerName: messages["dailyMenuMeals.calories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.calories} />,
    },

    {
      field: "fat",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.fat} />,
    },

    {
      field: "carbs",
      headerName: messages["dailyMenuMeals.carbs"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.carbs} />,
    },

    {
      field: "protein",
      headerName: messages["dailyMenuMeals.protein"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.protein} />,
    },

    {
      field: "water",
      headerName: messages["dailyMenuMeals.water"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.water} />,
    },

    {
      field: "priceForCustomer",
      headerName: messages["meals.priceForCustomer"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.priceForCustomer} />
      ),
    },
    {
      field: "suitableForFreezing",
      headerName: messages["recipes.suitableForFreezing"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.suitableForFreezing ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },
    {
      field: "isAddOn",
      headerName: messages["meals.isAddOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.isAddOn ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "allergens",
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
            params?.row?.allergens
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
      field: "specification",
      headerName: messages["recipes.specification"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 200,

      headerClassName: "super-app-theme--header",
      sortable: false,
      renderCell: (params) => (
        <AppDataGridCell
          style={{
            whiteSpace: "break-spaces",
            padding: "1rem 0px",
          }}
          value={
            <>
              {params?.row?.isCold && (
                <AppBoxBadge label='recipes.isCold' backgroundColor='#646405' />
              )}
              {params?.row?.isWarm && (
                <AppBoxBadge
                  label='recipes.isWarm'
                  backgroundColor='#c91c1cbd'
                />
              )}
              {params?.row?.isDairyFree && (
                <AppBoxBadge
                  label='ingredients.isDairyFree'
                  backgroundColor='#a5d060'
                />
              )}
              {params?.row?.isGlutenFree && (
                <AppBoxBadge
                  label='ingredients.isGlutenFree'
                  backgroundColor='#71714c'
                />
              )}
              {params?.row?.isLowGI && (
                <AppBoxBadge
                  label='ingredients.isLowGI'
                  backgroundColor='#4d9998'
                />
              )}
              {!params?.row?.isCold &&
                !params?.row?.isWarm &&
                !params?.row?.isDairyFree &&
                !params?.row?.isGlutenFree &&
                !params?.row?.isLowGI &&
                "-"}
            </>
          }
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
      minWidth: 120,
      headerClassName: "super-app-theme--header",
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
              toPathLink={`/nutriplan/mealPlanning/meals/${params?.row?.id}`}
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

  return MealsColumns;
};
