/** @format */

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import PaymentStatusBadge from "src/Components/baseComponents/badge/PaymentStatusBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IPayments } from "src/types/modules/clientsManagement/payments";

export const PaymentsColumns = (
  handleDetails = (_: IPayments) => {}
): GridColDef[] => {
  const { messages } = useIntl();
  const { clientIdParams } = useParams();

  const clientObjects: GridColDef[] = [
    {
      field: "client.fullName",
      headerName: messages["clients.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.client?.fullName || params?.row?.client?.mobile}
        />
      ),
    },
  ];
  const PaymentsColumns: GridColDef[] = [
    {
      field: "amount",
      headerName: messages["payments.amount"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params?.row?.amount} />,
    },

    {
      field: "currency",
      headerName: messages["payments.currency"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params?.row?.currency} />,
    },

    {
      field: "invoiceNumber",
      headerName: messages["payments.invoiceNumber"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.invoiceNumber} />
      ),
    },

    {
      field: "paymentGateway",
      headerName: messages["payments.paymentGateway"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.paymentGateway} />
      ),
    },

    {
      field: "paymentMethod",
      headerName: messages["payments.paymentMethod"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.paymentMethod} />
      ),
    },

    {
      field: "transactionId",
      headerName: messages["payments.transactionId"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.transactionId} />
      ),
    },

    {
      field: "paymentDate",
      headerName: messages["payments.paymentDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.paymentDate
              ? moment(params?.row?.paymentDate).format("YYYY-MM-DD")
              : "-"
          }
        />
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
      field: "paymentStatus",
      headerName: messages["payments.paymentStatus"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,

      renderCell: (params) => (
        <AppDataGridCell
          value={<PaymentStatusBadge label={params?.row?.paymentStatus!} />}
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
      headerClassName: "super-app-theme--header",
      hideable: false,
      minWidth: 120,
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
          </div>
        );
      },
    },
  ];

  return clientIdParams
    ? PaymentsColumns
    : clientObjects.concat(PaymentsColumns);
};
