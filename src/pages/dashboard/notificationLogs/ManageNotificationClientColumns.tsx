/** @format */

import { GridColDef } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";

export const ManageNotificationClientColumns = (): GridColDef[] => {
  const { messages } = useIntl();

  return [
    {
      field: "imageUrl",
      headerName: messages["common.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.15,
      sortable: false,
      renderCell: (params) => <AppDataGridImage value={params.row?.imageUrl} />,
    },
    {
      field: "fullName",
      headerName: messages["common.fullName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.3,
      renderCell: (params) => (
        <AppDataGridCell
          value={params.row?.fullName || params.row?.mobile || "—"}
        />
      ),
    },
    {
      field: "email",
      headerName: messages["common.email"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.3,
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.email || "—"} />
      ),
    },
    {
      field: "mobile",
      headerName: messages["common.mobile"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.25,
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.mobile || "—"} />
      ),
    },
  ];
};
