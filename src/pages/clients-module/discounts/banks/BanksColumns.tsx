/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import useIntl from "react-intl/lib/src/components/useIntl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IPromoBank } from "src/types/modules/clientsManagement/discounts/banks";

const MAX_VISIBLE_BINS = 2;

const BinPrefixesCell = ({ prefixes }: { prefixes: string[] }) => {
  if (!prefixes.length) {
    return <AppDataGridCell value='—' />;
  }

  const visible = prefixes.slice(0, MAX_VISIBLE_BINS);
  const hidden = prefixes.slice(MAX_VISIBLE_BINS);
  const hiddenLabel = hidden.join(", ");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        flexWrap: "nowrap",
        width: "100%",
        overflow: "hidden",
      }}>
      {visible.map((bin) => (
        <Box
          key={bin}
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "#F1F5F9",
            border: "1px solid #E2E8F0",
            flexShrink: 0,
          }}>
          <Typography
            sx={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.4,
              lineHeight: 1.4,
              color: "#0F172A",
            }}>
            {bin}
          </Typography>
        </Box>
      ))}
      {hidden.length > 0 ? (
        <Tooltip title={hiddenLabel} arrow>
          <Box
            sx={{
              px: 0.85,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "#E2E8F0",
              flexShrink: 0,
              cursor: "default",
            }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: "#475569",
                lineHeight: 1.4,
              }}>
              +{hidden.length}
            </Typography>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
};

function banksColumns(
  handleDetails = (_: IPromoBank) => {},
  handleUpdate = (_: IPromoBank) => {},
  handleDelete = (_: IPromoBank) => {},
  handleToggleActive = (_: IPromoBank) => {}
) {
  const { messages } = useIntl();

  const columns: GridColDef[] = [
    {
      field: "nameEn",
      headerName: messages["common.nameEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.22,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.nameEn} />,
    },
    {
      field: "nameAr",
      headerName: messages["common.nameAr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.22,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.nameAr} />,
    },
    {
      field: "cardBinPrefixes",
      headerName:
        (messages["promoBanks.cardBinPrefixes"] as string) || "BIN Prefixes",
      headerAlign: "center",
      align: "center",
      flex: 0.28,
      minWidth: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const prefixes: string[] = params.row?.cardBinPrefixes?.length
          ? params.row.cardBinPrefixes
          : params.row?.code
            ? [params.row.code]
            : [];
        return <BinPrefixesCell prefixes={prefixes} />;
      },
    },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
    },
    {
      field: "createdOn",
      headerName: messages["createdOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
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

export default banksColumns;
