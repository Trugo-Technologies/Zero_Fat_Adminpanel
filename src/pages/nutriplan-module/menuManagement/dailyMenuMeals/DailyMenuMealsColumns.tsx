/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IDailyMenuMeals } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
export const DailyMenuMealsColumns = (
  handleDetails = (row: IDailyMenuMeals) => {},
  handleUpdate = (row: IDailyMenuMeals) => {},

  handleUpdateDefault = (row: IDailyMenuMeals) => {},
  handleDelete = (row: IDailyMenuMeals) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const DailyMenuMealsColumns: GridColDef[] = [
    {
      field: "meal.imageUrl",
      headerName: messages["common.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,
      renderCell: (params) => (
        <AppDataGridImage value={params.row?.meal?.imageUrl} />
      ),
    },
    {
      field: "meal.nameEn",
      headerName: messages["common.nameEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.nameEn} />
      ),
    },
    {
      field: "meal.nameAr",
      headerName: messages["common.nameAr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.meal?.nameAr} />
      ),
    },

    // {
    //   field: "meal.weightInGrams",
    //   headerName: messages["dailyMenuMeals.weightInGrams"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",

    //   renderCell: (params) => (
    //     <AppDataGridCell value={params.row?.weightInGrams} />
    //   ),
    // },

    // {
    //   field: "meal.calories",
    //   headerName: messages["dailyMenuMeals.calories"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",
    //   renderCell: (params) => (
    //     <AppDataGridCell value={params.row?.meal?.calories} />
    //   ),
    // },

    // {
    //   field: "meal.fat",
    //   headerName: messages["dailyMenuMeals.fat"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",

    //   renderCell: (params) => <AppDataGridCell value={params.row?.meal?.fat} />,
    // },

    // {
    //   field: "meal.carbs",
    //   headerName: messages["dailyMenuMeals.carbs"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",

    //   renderCell: (params) => (
    //     <AppDataGridCell value={params.row?.meal?.carbs} />
    //   ),
    // },

    // {
    //   field: "meal.protein",
    //   headerName: messages["dailyMenuMeals.protein"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",

    //   renderCell: (params) => (
    //     <AppDataGridCell value={params.row?.meal?.protein} />
    //   ),
    // },

    // {
    //   field: "meal.water",
    //   headerName: messages["dailyMenuMeals.water"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",

    //   renderCell: (params) => (
    //     <AppDataGridCell value={params.row?.meal?.water} />
    //   ),
    // },
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
      field: "suitableForFreezing",
      headerName: messages["recipes.suitableForFreezing"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,
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
      field: "isDefault",
      headerName: messages["dailyMenuMeals.isDefault"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <AppIconButton
            label={
              params?.row?.isDefault
                ? "dailyMenuMeals.unDefaultTitle"
                : "dailyMenuMeals.defaultTitle"
            }
            handleClick={() => {
              handleUpdateDefault(params.row);
            }}
            childComp={
              params?.row?.isDefault ? (
                <CheckIcon color='success' />
              ) : (
                <CloseIcon color='error' />
              )
            }
          />
        </>
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
              {params?.row?.meal?.isCold && (
                <AppBoxBadge label='recipes.isCold' backgroundColor='#646405' />
              )}
              {params?.row?.meal?.isWarm && (
                <AppBoxBadge
                  label='recipes.isWarm'
                  backgroundColor='#c91c1cbd'
                />
              )}
              {params?.row?.meal?.isDairyFree && (
                <AppBoxBadge
                  label='ingredients.isDairyFree'
                  backgroundColor='#a5d060'
                />
              )}
              {params?.row?.meal?.isGlutenFree && (
                <AppBoxBadge
                  label='ingredients.isGlutenFree'
                  backgroundColor='#71714c'
                />
              )}
              {params?.row?.meal?.isLowGI && (
                <AppBoxBadge
                  label='ingredients.isLowGI'
                  backgroundColor='#4d9998'
                />
              )}
              {!params?.row?.meal?.isCold &&
                !params?.row?.meal?.isWarm &&
                !params?.row?.meal?.isDairyFree &&
                !params?.row?.meal?.isGlutenFree &&
                !params?.row?.meal?.isLowGI &&
                "-"}
            </>
          }
        />
      ),
    },

    {
      field: "meal.cuisine",
      headerName: messages["recipes.cuisine"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[`recipes.cuisine.${params?.row?.meal?.cuisine}`] as string
          }
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
      minWidth: 160,
      headerClassName: "super-app-theme--header",
      hideable: false,

      renderCell: (params) => {
        return (
          <div>
            {/* Details  nutriplan/menuManagement/menus*/}
            {/* <AppIconButton
              label="table.actions.details"
              handleClick={() => {
                handleDetails(params.row);
              }}
              childComp={
                <RemoveRedEyeIcon fontSize="small" sx={{ color: "#9b9b9b" }} />
              }
            /> */}

            {/* <AppIconButton
              label="table.actions.details"
              childComp={
                <RestaurantMenuIcon
                  fontSize="small"
                  sx={{ color: "#cbb321" }}
                />
              }
            /> */}

            {/* Edit */}
            {/* <AppIconButton
              label="table.actions.edit"
              childComp={
                <EditOutlinedIcon fontSize="small" sx={{ color: "#9b9b9b" }} />
              }
            /> */}

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

  return DailyMenuMealsColumns;
};
