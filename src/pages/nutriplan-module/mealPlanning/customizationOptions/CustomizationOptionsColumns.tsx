/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { ICustomizationOption } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
export const CustomizationGroupsColumns = (
  handleDetails = (_: ICustomizationOption) => {},
  handleUpdate = (_: ICustomizationOption) => {},
  handleDelete = (_: ICustomizationOption) => {}
): GridColDef[] => {
  const { mealIdParams } = useParams();
  const { messages, locale } = useIntl();
  const CustomizationOptionsColumns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: messages["common.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
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
      field: locale == "en-US" ? "ingredient.nameEn" : "ingredient.nameAr",
      headerName: messages["ingredients.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.ingredient?.nameAr!,
            params?.row?.ingredient?.nameEn!
          )}
        />
      ),
    },

    {
      field: locale == "en-US" ? "group.nameEn" : "group.nameAr",
      headerName: messages["customizationGroups.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.group?.nameAr!,
            params?.row?.group?.nameEn!
          )}
        />
      ),
    },

    {
      field: "isDefault",
      headerName: messages["customizationOptions.isDefault"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.isDefault ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "priceAdjustment",
      headerName: messages["customizationOptions.priceAdjustment"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.priceAdjustment} />
      ),
    },

    {
      field: "caloriesAdjustment",
      headerName: messages["customizationOptions.caloriesAdjustment"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.caloriesAdjustment} />
      ),
    },

    {
      field: "fatAdjustment",
      headerName: messages["customizationOptions.fatAdjustment"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.fatAdjustment} />
      ),
    },

    {
      field: "carbsAdjustment",
      headerName: messages["customizationOptions.carbsAdjustment"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.carbsAdjustment} />
      ),
    },

    {
      field: "proteinAdjustment",
      headerName: messages["customizationOptions.proteinAdjustment"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.proteinAdjustment} />
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

  if (!mealIdParams) {
    CustomizationOptionsColumns.splice(
      CustomizationOptionsColumns.length - 1,
      0,
      {
        field: "isAllMeals",
        headerName: messages["customizationOptions.isAllMeals"] as string,
        headerAlign: "center",
        align: "center",
        flex: 0.1,
        headerClassName: "super-app-theme--header",
        renderCell: (params) => (
          <>
            {!params?.row?.meal ? (
              <CheckIcon color='success' />
            ) : (
              <CloseIcon color='error' />
            )}
          </>
        ),
      }
    );
  }
  return CustomizationOptionsColumns;
};
