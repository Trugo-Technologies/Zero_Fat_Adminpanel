/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IClientLocations } from "src/types/modules/clientsManagement/clientLocations";
export const ClientLocationsColumns = (
  handleDetails = (row: IClientLocations) => {},
  handleUpdate = (row: IClientLocations) => {},
  handleDelete = (row: IClientLocations) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const ClientLocationsColumns: GridColDef[] = [
    {
      field: "type",
      headerName: messages["clientLocations.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US",

      renderCell: (params) => (
        <AppDataGridCell
          value={messages[`clientLocations.type.${params.row?.type}`] as string}
        />
      ),
    },
    {
      field: "area",
      headerName: messages["clientLocations.area"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US",

      renderCell: (params) => <AppDataGridCell value={params?.row?.area} />,
    },
    {
      field: "street",
      headerName: messages["clientLocations.street"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US",

      renderCell: (params) => <AppDataGridCell value={params?.row?.street} />,
    },
    {
      field: "postalCode",
      headerName: messages["clientLocations.postalCode"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.postalCode} />
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
      headerClassName: "super-app-theme--header",
      // hideable: false,
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

  return ClientLocationsColumns;
};
