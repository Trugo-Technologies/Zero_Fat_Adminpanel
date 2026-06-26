/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import IngredientStatusBadge from "src/Components/baseComponents/badge/IngredientStatusBadge";
import IngredientTypeBadge from "src/Components/baseComponents/badge/IngredientTypeBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
import { IIngredients } from "src/types/modules/nutriplan/Ingredients";

export const IngredientsColumns = (
  handleDetails = (row: IIngredients) => {},
  handleUpdate = (row: IIngredients) => {},
  handleDelete = (row: IIngredients) => {}
): GridColDef[] => {
  const sensitivesObj = {
    isDairyFree: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isLowGI: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isSeasonal: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isOrganic: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isGlutenFree: "/assets/icon/ingredientsTagsIcons/gluten-free.png",
  };
  const { messages, locale } = useIntl();

  const IngredientsColumns: GridColDef[] = [
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

    // {
    //   field: "type",
    //   headerName: messages["exercises.type"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",
    //   sortable: false,
    //   renderCell: (params) => (
    //     <AppDataGridCell
    //       value={Object.keys(sensitivesObj).map(
    //         (key) =>
    //           params.row[key] && (
    //             <img
    //               src={
    //                 sensitivesObj[key as keyof typeof sensitivesObj] as string
    //               }
    //               style={{ marginLeft: "2px" }}
    //             />
    //           )
    //       )}
    //     />
    //   ),
    // },

    {
      field: "tags",
      headerName: messages["ingredients.tags"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.tags?.join(", ")} />
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
      field: "density",
      headerName: messages["ingredients.density"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.density} />,
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

    // {
    //   field: "ingredientMeasurementUnits",
    //   headerName: messages["sidebar.measurementUnits"] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",
    //   sortable: false,
    //   renderCell: (params) => (
    //     <AppDataGridCell
    //       value={params?.row?.ingredientMeasurementUnits
    //         ?.map((item: IMeasurmentUnits) => item?.code)
    //         .join(", ")}
    //     />
    //   ),
    // },

    {
      field: "waterPer100g",
      headerName: messages["ingredients.waterPer100g"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.waterPer100g} />
      ),
    },
  

    {
      field: "carbsPer100Unit",
      headerName: messages["ingredients.carbsPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.carbsPer100Unit} />
      ),
    },
    {
      field: "fatPer100Unit",
      headerName: messages["ingredients.fatPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.fatPer100Unit} />
      ),
    },

    {
      field: "fiberPer100Unit",
      headerName: messages["ingredients.fiberPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.fiberPer100Unit} />
      ),
    },
    {
      field: "proteinPer100Unit",
      headerName: messages["ingredients.proteinPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.proteinPer100Unit} />
      ),
    },
    {
      field: "sugarPer100Unit",
      headerName: messages["ingredients.sugarPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.sugarPer100Unit} />
      ),
    },
    {
      field: "caloriesPer100Unit",
      headerName: messages["ingredients.caloriesPer100Unit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.caloriesPer100Unit} />
      ),
    },

    {
      field: "caloriesUnit",
      headerName: messages["ingredients.caloriesUnit"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.caloriesUnit} />
      ),
    },

    {
      field: "costPer100Unit",
      headerName: messages["ingredients.price"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.costPer100Unit} />
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
      field: "basicUnit",
      headerName: messages["ingredients.BasicUnitType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            <Chip
              size='small'
              label={params.row?.basicUnit}
              color={params.row?.basicUnit == "Solid" ? "primary" : "info"}
              variant='filled'
            />
          }
        />
      ),
    },

    {
      field: "type",
      headerName: messages["ingredients.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 100,

      renderCell: (params) => (
        <AppDataGridCell
          value={<IngredientTypeBadge label={params?.row?.type!} />}
        />
      ),
    },

    {
      field: "status",
      headerName: messages["ingredients.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 100,
      renderCell: (params) => (
        <AppDataGridCell
          value={<IngredientStatusBadge label={params?.row?.status!} />}
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
      minWidth: 160,

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
              toPathLink={`/nutriplan/mealPlanning/ingredients/edit/${params?.row?.id}`}
              childComp={
                <EditOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
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

  return IngredientsColumns;
};
