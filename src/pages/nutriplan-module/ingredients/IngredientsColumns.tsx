/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
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
    {
      field: "basicUnit",
      headerName: messages["ingredients.basicUnitType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,
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
      field: "",
      headerName: messages["ingredients.tags"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,
      renderCell: (params) => (
        <AppDataGridCell
          value={Object.keys(sensitivesObj).map(
            (key) =>
              params.row[key] && (
                <img
                  src={
                    sensitivesObj[key as keyof typeof sensitivesObj] as string
                  }
                  style={{ marginLeft: "2px" }}
                />
              )
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
      hideable: locale != "en-US" ? true : false,
      renderCell: (params) => <AppDataGridCell value={params.row?.density} />,
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
