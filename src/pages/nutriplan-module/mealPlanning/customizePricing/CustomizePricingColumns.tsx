/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import useIntl from "react-intl/lib/src/components/useIntl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import {
  CustomizeMacroType,
  ICustomizePricingTier,
} from "src/types/modules/nutriplan/customizePricing";

function customizePricingColumns(
  handleDetails = (_: ICustomizePricingTier) => {},
  handleUpdate = (_: ICustomizePricingTier) => {},
  handleDelete = (_: ICustomizePricingTier) => {},
  handleToggleActive = (_: ICustomizePricingTier) => {}
) {
  const { messages } = useIntl();

  const columns: GridColDef[] = [
    {
      field: "macroType",
      headerName: messages["customizePricing.macroType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const type = params.row?.macroType as CustomizeMacroType;
        const label =
          (messages[`customizePricing.macro.${type}`] as string) || type;
        return (
          <Chip
            size='small'
            label={label}
            color={type === CustomizeMacroType.Protein ? "primary" : "default"}
            sx={{ fontWeight: 700, fontSize: 11 }}
          />
        );
      },
    },
    {
      field: "range",
      headerName: messages["customizePricing.range"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={`${params.row?.fromGrams} – ${params.row?.toGrams} g`}
        />
      ),
    },
    {
      field: "price",
      headerName: messages["customizePricing.price"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={Number(params.row?.price || 0).toLocaleString()}
        />
      ),
    },
    // Meal plan / meal type temporarily hidden
    // {
    //   field: "mealPlan",
    //   ...
    // },
    // {
    //   field: "mealType",
    //   ...
    // },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
    },
    {
      field: "createdOn",
      headerName: messages["createdOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.createdOn
              ? moment(params.row.createdOn).format("YYYY-MM-DD")
              : "—"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: messages["common.actions"] as string,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div>
          <AppIconButton
            label='table.actions.details'
            handleClick={() => handleDetails(params.row)}
            childComp={
              <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
            }
          />
          <AppIconButton
            label='table.actions.edit'
            handleClick={() => handleUpdate(params.row)}
            childComp={
              <EditOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
            }
          />
          <AddDataGridActivation
            value={params.row?.isActive}
            handleClick={() => handleToggleActive(params.row)}
          />
          <AppIconButton
            label='table.actions.delete'
            handleClick={() => handleDelete(params.row)}
            childComp={
              <DeleteOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
            }
          />
        </div>
      ),
    },
  ];

  return columns;
}

export default customizePricingColumns;
