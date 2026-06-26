/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppBoxBadge from "src/Components/baseComponents/badge/AppBoxBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IRecipes } from "src/types/modules/nutriplan/mealPlanning/recipes";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { FcEditImage } from "react-icons/fc";

export const RecipesColumns = (
  handleDetails = (row: IRecipes) => {},
  handleDelete = (row: IRecipes) => {},
  handleUpdateImage = (row: IRecipes) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const RecipesColumns: GridColDef[] = [
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
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.nameAr} />,
    },
    {
      field: "nameEn",
      headerName: messages["common.nameEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.nameEn} />,
    },

    {
      field: "servings",
      headerName: messages["recipes.servings"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.servings} />,
    },

    {
      field: "cookingTime",
      headerName: messages["recipes.cookingTime"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.cookingTime} />
      ),
    },

    {
      field: "preparationTime",
      headerName: messages["recipes.preparationTime"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.preparationTime} />
      ),
    },
    {
      field: locale == "en-US" ? "category.nameEn" : "category.nameAr",
      headerName: messages["categories.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.category?.nameAr!,
            params?.row?.category?.nameEn!
          )}
        />
      ),
    },

    {
      field: "mealTypes",
      headerName: messages["sidebar.mealTypes"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,

      headerClassName: "super-app-theme--header",
      minWidth: 160,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.mealTypes
              ?.map((item: IMealTypes) => item?.nameAr)
              .join(", ") || "",
            params?.row?.mealTypes
              ?.map((item: IMealTypes) => item?.nameEn)
              .join(", ") || ""
          )}
        />
      ),
    },

    {
      field: "cuisine",
      headerName: messages["recipes.cuisine"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={messages[`recipes.cuisine.${params?.row?.cuisine}`] as string}
        />
      ),
    },

    {
      field: "difficulty",
      headerName: messages["recipes.difficulty"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[`recipes.difficulty.${params?.row?.difficulty}`] as string
          }
        />
      ),
    },

    {
      field: "dietaryCategories",
      headerName: messages["recipes.dietaryCategories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[
              `recipes.dietaryCategories.${params?.row?.dietaryCategories}`
            ] as string
          }
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
      field: "actions",
      headerName: messages["common.actions"] as string,
      sortable: false,
      align: "center",
      filterable: false,
      headerAlign: "center",
      flex: 0.1,
      minWidth: 140,
      headerClassName: "super-app-theme--header",
      hideable: false,

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
              withLink
              toPathLink={`/nutriplan/mealPlanning/recipes/edit/${params?.row?.id}`}
              childComp={
                <EditOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

            {/* Edit-image */}
            <AppIconButton
              label='table.actions.editImage'
              handleClick={() => {
                handleUpdateImage(params.row);
              }}
              childComp={<FcEditImage size={20} />}
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

  return RecipesColumns;
};
