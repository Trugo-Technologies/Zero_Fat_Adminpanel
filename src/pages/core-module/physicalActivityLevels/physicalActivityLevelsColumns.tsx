/** @format */

import { GridColDef } from "@mui/x-data-grid";
import useIntl from "react-intl/lib/src/components/useIntl";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IPhysicalActivityLevels } from "src/types/modules/core/physicalActivityLevels";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import moment from "moment";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
const allCellsData = {
  headerAlign: "center",
  align: "center",
  flex: 0.2,
  headerClassName: "super-app-theme--header",
} as const;
function physicalActivityLevelsColumns(
  handleDetails = (_: IPhysicalActivityLevels) => {},
  handleUpdate = (_: IPhysicalActivityLevels) => {},
  handleDelete = (_: IPhysicalActivityLevels) => {},
  handleToggleActive = (_: IPhysicalActivityLevels) => {}
) {
  const { messages } = useIntl();
  const workoutPlansColumns: GridColDef[] = [
    {
      ...allCellsData,
      field: "imageUrl",
      headerName: messages["physicalActivityLevels.imageUrl"] as string,
      renderCell: (param) => <AppDataGridImage value={param.row.imageUrl} />,
    },
    {
      ...allCellsData,
      field: "exampleEn",
      headerName: messages["physicalActivityLevels.exampleEn"] as string,
    },
    {
      ...allCellsData,
      field: "exampleAr",
      headerName: messages["physicalActivityLevels.exampleAr"] as string,
    },

    {
      ...allCellsData,
      field: "activityValue",
      headerName: messages["physicalActivityLevels.activityValue"] as string,
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
      ...allCellsData,
      field: "isActive",
      headerName: messages["physicalActivityLevels.isActive"] as string,
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
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
  return workoutPlansColumns;
}

export default physicalActivityLevelsColumns;
