/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import useIntl from "react-intl/lib/src/components/useIntl";
import DurationBadge from "src/Components/baseComponents/badge/DurationBadge";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IPromoCode } from "src/types/modules/clientsManagement/discounts/promoCodes";
import { getBankNames, getPlanNames, getSubscriptionTypeNames } from "./mockData";

const isPromoPublished = (row?: IPromoCode | null) => {
  if (!row) return false;
  if (row.isPublished === true) return true;
  return typeof row.stripeId === "string" && row.stripeId.trim().length > 0;
};

function promoCodesColumns(
  handleDetails = (_: IPromoCode) => {},
  handleUpdate = (_: IPromoCode) => {},
  handleDelete = (_: IPromoCode) => {},
  handleToggleActive = (_: IPromoCode) => {},
  handlePublish = (_: IPromoCode) => {}
) {
  const { messages, locale } = useIntl();

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: messages["promoCodes.code"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.16,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.code} />,
    },
    {
      field: "applyMode",
      headerName: messages["promoCodes.applyMode"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            (messages[
              `promoCodes.applyMode.${params.row?.applyMode}`
            ] as string) || params.row?.applyMode
          }
        />
      ),
    },
    {
      field: "eligibilityType",
      headerName: messages["promoCodes.eligibilityType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            (messages[
              `promoCodes.eligibilityType.${params.row?.eligibilityType}`
            ] as string) || params.row?.eligibilityType
          }
        />
      ),
    },
    {
      field: "rewardType",
      headerName: messages["promoCodes.rewardType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            (messages[
              `promoCodes.rewardType.${params.row?.rewardType}`
            ] as string) || params.row?.rewardType
          }
        />
      ),
    },
    {
      field: "percentOff",
      headerName: messages["promoCodes.percentOff"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.percentOff} />
      ),
    },
    {
      field: "amountOff",
      headerName: messages["promoCodes.amountOff"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.amountOff} />,
    },
    {
      field: "minOrderCredits",
      headerName: messages["promoCodes.minOrderCredits"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.minOrderCredits ?? "—"} />
      ),
    },
    {
      field: "banks",
      headerName: messages["promoCodes.banks"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.16,
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={getBankNames(params.row?.bankIds || [], locale)}
        />
      ),
    },
    {
      field: "plans",
      headerName: messages["promoCodes.plans"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.16,
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={getPlanNames(params.row?.planIds || [], locale)}
        />
      ),
    },
    {
      field: "subscriptionTypes",
      headerName: messages["promoCodes.subscriptionTypes"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={getSubscriptionTypeNames(
            params.row?.subscriptionTypes || [],
            locale
          )}
        />
      ),
    },
    {
      field: "duration",
      headerName: messages["promoCodes.duration"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <DurationBadge label={params.row?.duration} />,
    },
    {
      field: "durationInMonths",
      headerName: messages["promoCodes.durationInMonths"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.durationInMonths} />
      ),
    },
    {
      field: "startDate",
      headerName: messages["common.startDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.startDate} />,
    },
    {
      field: "expirationDate",
      headerName: messages["promoCodes.expirationDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.expirationDate} />
      ),
    },
    {
      field: "maxRedemptions",
      headerName: messages["promoCodes.maxRedemptions"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.maxRedemptions} />
      ),
    },
    {
      field: "redemptionsUsed",
      headerName: messages["promoCodes.redemptionsUsed"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.redemptionsUsed} />
      ),
    },
    {
      field: "maxRedemptionsPerClient",
      headerName: messages["promoCodes.maxRedemptionsPerClient"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.maxRedemptionsPerClient} />
      ),
    },
    {
      field: "firstTimeClientsOnly",
      headerName: messages["promoCodes.firstTimeClientsOnly"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params?.row?.firstTimeClientsOnly ? (
          <CheckIcon color='success' />
        ) : (
          <CloseIcon color='error' />
        ),
    },
    {
      field: "stripeId",
      headerName: messages["menus.isPublished"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      minWidth: 90,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        isPromoPublished(params?.row) ? (
          <CheckIcon color='success' />
        ) : (
          <CloseIcon color='error' />
        ),
    },
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
      field: "createdByName",
      headerName: messages["createdByName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
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
      flex: 0.12,
      minWidth: 110,
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
      flex: 0.12,
      minWidth: 110,
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
      flex: 0.12,
      minWidth: 110,
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
      minWidth: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div>
          <AppIconButton
            label='table.actions.details'
            handleClick={() => handleDetails(params?.row)}
            childComp={
              <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
            }
          />
          {!isPromoPublished(params?.row) && (
            <AppIconButton
              label='table.actions.publish'
              handleClick={() => handlePublish(params.row)}
              childComp={
                <PublishedWithChangesIcon
                  fontSize='small'
                  sx={{ color: "#9b9b9b" }}
                />
              }
            />
          )}
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
          {!isPromoPublished(params?.row) && (
            <AppIconButton
              label='table.actions.delete'
              handleClick={() => handleDelete(params.row)}
              childComp={
                <DeleteOutlinedIcon
                  fontSize='small'
                  sx={{ color: "#9b9b9b" }}
                />
              }
            />
          )}
        </div>
      ),
    },
  ];

  return columns;
}

export default promoCodesColumns;
