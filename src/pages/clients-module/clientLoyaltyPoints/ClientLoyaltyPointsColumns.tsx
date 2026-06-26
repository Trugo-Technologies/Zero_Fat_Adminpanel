/** @format */

import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";

export const ClientLoyaltyPointsColumns = (): GridColDef[] => {
  const { messages } = useIntl();

  const ClientLoyaltyPointsColumns: GridColDef[] = [
    {
      field: "points",
      headerName: messages["clientLoyaltyPoints.points"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={`${params?.row?.points}`} />
      ),
    },

    {
      field: "clientLoyaltyPoints.type",
      headerName: messages["clientLoyaltyPoints.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[`clientLoyaltyPoints.type.${params?.row?.type}`] as string
          }
        />
      ),
    },
    {
      field: "reason",
      headerName: messages["clientLoyaltyPoints.reason"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.reason}
          style={{ whiteSpace: "break-spaces" }}
        />
      ),
    },
    {
      field: "source",
      headerName: messages["clientLoyaltyPoints.source"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.source}
          style={{ whiteSpace: "break-spaces" }}
        />
      ),
    },

    {
      field: "dateEarned",
      headerName: messages["clientLoyaltyPoints.dateEarned"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.dateEarned
              ? moment(params?.row?.dateEarned).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "expiryDate",
      headerName: messages["clientLoyaltyPoints.expiryDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.expiryDate
              ? moment(params?.row?.expiryDate).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },
  ];

  return ClientLoyaltyPointsColumns;
};
