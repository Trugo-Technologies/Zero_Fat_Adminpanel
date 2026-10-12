/** @format */

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import {
  canCancelChallenge,
  ChallengeListStatus,
  getChallengeStatusMeta,
  IChallenge,
} from "src/types/modules/clientsManagement/challenges";

const canPublishChallenge = (row?: IChallenge | null) => {
  if (!row) return false;
  if (row.isPublished === true) return false;
  const status = Number(row.status);
  if (!Number.isNaN(status) && status !== ChallengeListStatus.Draft) {
    return false;
  }
  if (
    typeof row.status === "string" &&
    row.status !== "Draft" &&
    row.status !== String(ChallengeListStatus.Draft)
  ) {
    return false;
  }
  return true;
};

const statusChipColor = (
  status?: number | string | null
): "default" | "success" | "warning" | "info" | "error" => {
  const numeric = Number(status);
  switch (numeric) {
    case ChallengeListStatus.Draft:
      return "default";
    case ChallengeListStatus.Published:
      return "info";
    case ChallengeListStatus.Active:
      return "success";
    case ChallengeListStatus.Ended:
      return "warning";
    case ChallengeListStatus.Cancelled:
      return "error";
    default:
      return "default";
  }
};

export const ChallengesColumns = (
  handleDetails = (_row: IChallenge) => {},
  handleUpdate = (_row: IChallenge) => {},
  handlePublish = (_row: IChallenge) => {},
  handleCancel = (_row: IChallenge) => {},
  handleParticipants = (_row: IChallenge) => {}
): GridColDef[] => {
  const { messages } = useIntl();

  return [
    {
      field: "title",
      headerName: messages["challenges.title"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 140,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params.row?.title || params.row?.nameEn || "—"}
        />
      ),
    },
    {
      field: "badgeLabel",
      headerName: messages["challenges.badgeLabel"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row?.badgeLabel ? (
          <Chip size='small' label={params.row.badgeLabel} sx={{ fontWeight: 700 }} />
        ) : (
          <AppDataGridCell value='—' />
        ),
    },
    {
      field: "status",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const meta = getChallengeStatusMeta(params.row?.status);
        if (!meta) return <AppDataGridCell value='—' />;
        const label =
          (messages[meta.labelKey] as string) || meta.fallback;
        return (
          <Chip
            size='small'
            label={label}
            color={statusChipColor(params.row?.status)}
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
    {
      field: "startDate",
      headerName: messages["common.startDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params.row?.startDate
              ? moment(params.row.startDate).format("YYYY-MM-DD")
              : "—"
          }
        />
      ),
    },
    {
      field: "endDate",
      headerName: messages["common.endDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params.row?.endDate
              ? moment(params.row.endDate).format("YYYY-MM-DD")
              : "—"
          }
        />
      ),
    },
    {
      field: "isFeaturedOnHome",
      headerName: messages["challenges.isFeaturedOnHome"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 110,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params.row?.isFeaturedOnHome
              ? (messages["common.yes"] as string) || "Yes"
              : (messages["common.no"] as string) || "No"
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
      flex: 0.22,
      minWidth: 180,
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
          {canPublishChallenge(params.row) && (
            <AppIconButton
              label='challenges.publish'
              handleClick={() => handlePublish(params.row)}
              childComp={
                <PublishedWithChangesIcon
                  fontSize='small'
                  sx={{ color: "#9b9b9b" }}
                />
              }
            />
          )}
          {canCancelChallenge(params.row) && (
            <AppIconButton
              label='challenges.cancel'
              handleClick={() => handleCancel(params.row)}
              childComp={
                <CancelOutlinedIcon
                  fontSize='small'
                  sx={{ color: "#9b9b9b" }}
                />
              }
            />
          )}
          <AppIconButton
            label='challenges.participants'
            handleClick={() => handleParticipants(params.row)}
            childComp={
              <GroupOutlinedIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
            }
          />
        </div>
      ),
    },
  ];
};
