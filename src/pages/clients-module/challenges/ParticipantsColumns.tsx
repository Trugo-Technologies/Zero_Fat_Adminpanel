/** @format */

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IChallengeParticipant } from "src/types/modules/clientsManagement/challenges";

const formatDateTime = (value: string | null) =>
  value ? moment(value).format("YYYY-MM-DD HH:mm") : "-";

export const ParticipantsColumns = (
  handleDetails = (_row: IChallengeParticipant) => {}
): GridColDef[] => {
  const { messages } = useIntl();

  return [
    {
      field: "rank",
      headerName: (messages["leaderboard.rank"] as string) || "Rank",
      headerAlign: "center",
      align: "center",
      flex: 0.08,
      minWidth: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params.row?.rank != null ? `#${params.row.rank}` : "—"}
        />
      ),
    },
    {
      field: "clientName",
      headerName: messages["challenges.participant.clientName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.18,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.clientName} />
      ),
    },
    {
      field: "email",
      headerName: messages["common.email"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.email} />,
    },
    {
      field: "stepsCount",
      headerName: (messages["leaderboard.steps"] as string) || "Steps",
      headerAlign: "center",
      align: "center",
      flex: 0.12,
      minWidth: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={Number(params.row?.stepsCount || 0).toLocaleString()}
        />
      ),
    },
    {
      field: "startedAt",
      headerName: messages["challenges.participant.startedAt"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.14,
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={formatDateTime(params.row?.startedAt)} />
      ),
    },
    {
      field: "actions",
      headerName: messages["common.actions"] as string,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      flex: 0.1,
      minWidth: 80,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppIconButton
          label='table.actions.details'
          handleClick={() => handleDetails(params.row)}
          childComp={
            <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
          }
        />
      ),
    },
  ];
};
