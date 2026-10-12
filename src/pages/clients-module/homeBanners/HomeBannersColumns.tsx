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
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import {
  formatHomeBannerPlanSummary,
  IHomeBanner,
} from "src/types/modules/clientsManagement/homeBanners";
import { formatHomeBannerPlanNames } from "./homeBannerDisplayHelpers";

function homeBannersColumns(
  handleDetails = (_: IHomeBanner) => {},
  handleUpdate = (_: IHomeBanner) => {},
  handleDelete = (_: IHomeBanner) => {},
  handleToggleActive = (_: IHomeBanner) => {}
) {
  const { messages, locale } = useIntl();

  const audienceLabel = (type?: string) => {
    if (!type) return "—";
    return (messages[`homeBanners.audience.${type}`] as string) || type;
  };

  const subscriptionPlanLabel = (type?: string) => {
    if (!type) return "—";
    return (
      (messages[`homeBanners.subscriptionPlan.${type}`] as string) || type
    );
  };

  const columns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: messages["homeBanners.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 80,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridImage value={params.row?.imageUrl} />
      ),
    },
    {
      field: "title",
      headerName: messages["homeBanners.title"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            locale === "en-US" ? params.row?.titleEn : params.row?.titleAr
          }
        />
      ),
    },
    {
      field: "badgeText",
      headerName: messages["homeBanners.badge"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const label =
          locale === "en-US"
            ? params.row?.badgeTextEn
            : params.row?.badgeTextAr;
        return label ? (
          <Chip
            size='small'
            label={label}
            sx={{
              fontWeight: 700,
              fontSize: 11,
              bgcolor: "#C9A227",
              color: "#111",
            }}
          />
        ) : (
          <AppDataGridCell value='—' />
        );
      },
    },
    {
      field: "mealPlan",
      headerName: messages["homeBanners.mealPlan"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={formatHomeBannerPlanNames(
            locale === "en-US"
              ? params.row?.mealPlanNamesEn
              : params.row?.mealPlanNamesAr,
            params.row?.planIds || []
          )}
        />
      ),
    },
    {
      field: "subscriptionPlanType",
      headerName: messages["homeBanners.subscriptionPlan"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={subscriptionPlanLabel(params.row?.subscriptionPlanType)}
        />
      ),
    },
    {
      field: "planSummary",
      headerName: messages["homeBanners.planSummary"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.18,
      minWidth: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={formatHomeBannerPlanSummary(params.row)} />
      ),
    },
    {
      field: "audienceType",
      headerName: messages["homeBanners.audience"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={audienceLabel(params.row?.audienceType)} />
      ),
    },
    {
      field: "salePrice",
      headerName: messages["homeBanners.salePrice"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={`${params.row?.currency || "AED"} ${Number(
            params.row?.salePrice || 0
          ).toLocaleString()}`}
        />
      ),
    },
    {
      field: "sortOrder",
      headerName: messages["homeBanners.sortOrder"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.07,
      minWidth: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.sortOrder} />
      ),
    },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.08,
      minWidth: 80,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
    },
    {
      field: "createdOn",
      headerName: messages["createdOn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 100,
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

export default homeBannersColumns;
