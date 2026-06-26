/** @format */
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IAdmin } from "src/types/modules/users-module/adminsManagement/admins";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { MdOutlineLockReset } from "react-icons/md";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
type Params = GridRenderCellParams<IAdmin>;
export const AdminsColumns = (
  handleDetails = (row: IAdmin) => {},
  handleUpdate = (row: IAdmin) => {},
  handleDelete = (row: IAdmin) => {},
  handleToggleActive = (row: IAdmin) => {},
  handleResetPassword = (row: IAdmin) => {}
): GridColDef[] => {
  const { messages } = useIntl();

  const AdminsColumns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: messages["common.imageUrl"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <AppDataGridImage value={params.row?.imageUrl} />
      ),
    },
    {
      field: "fullName",
      headerName: messages["common.fullName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <AppDataGridCell value={params.row?.fullName} />
      ),
    },

    {
      field: "userName",
      headerName: messages["common.userName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <AppDataGridCell value={params.row?.userName} />
      ),
    },
    {
      field: "email",
      headerName: messages["common.email"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <AppDataGridCell value={params.row?.email} />
      ),
    },
    {
      field: "phoneNumber",
      headerName: messages["common.phoneNumber"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <AppDataGridCell value={params.row?.phoneNumber} />
      ),
    },

    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params: Params) => (
        <StatusBadge isActive={params.row?.isActive} />
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

            {/* Reset password */}
            <AppIconButton
              label='common.resetPassword'
              handleClick={() => {
                handleResetPassword(params.row);
              }}
              childComp={<MdOutlineLockReset color='red' size={20} />}
            />
            {/**ACTIVE */}
            <AddDataGridActivation
              value={params.row?.isActive}
              handleClick={() => handleToggleActive(params.row)}
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
  return AdminsColumns;
};
