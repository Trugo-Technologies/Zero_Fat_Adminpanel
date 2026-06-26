/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IMenus } from "src/types/modules/nutriplan/menuManagement/menus";
import { MdContentCopy } from "react-icons/md";

export const MenusColumns = (
  handleDetails = (row: IMenus) => {},
  handleUpdatePublish = (row: IMenus) => {},
  handleDelete = (row: IMenus) => {},
  handleCopy = (row: IMenus) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const MenusColumns: GridColDef[] = [
    {
      field: "nameEn",
      headerName: messages["common.nameEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.nameEn} />,
    },
    {
      field: "nameAr",
      headerName: messages["common.nameAr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.nameAr} />,
    },
    {
      field: "isPublished",
      headerName: messages["menus.isPublished"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <AppIconButton
            label={
              params?.row?.isPublished
                ? "mealPlans.unPublishTitle"
                : "mealPlans.publishTitle"
            }
            handleClick={() => {
              handleUpdatePublish(params.row);
            }}
            childComp={
              params?.row?.isPublished ? (
                <CheckIcon color='success' />
              ) : (
                <CloseIcon color='error' />
              )
            }
          />
        </>
      ),
    },

    {
      field: "startDate",
      headerName: messages["common.startDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => (
        <AppDataGridCell
          value={moment(params.row?.startDate).format("YYYY-MM-DD")}
        />
      ),
    },

    {
      field: "endDate",
      headerName: messages["common.endDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => (
        <AppDataGridCell
          value={moment(params.row?.endDate).format("YYYY-MM-DD")}
        />
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
      hideable: false,

      renderCell: (params) => {
        return (
          <div>
            {/* Details  nutriplan/menuManagement/menus*/}
            <AppIconButton
              label='table.actions.details'
              handleClick={() => {
                handleDetails(params.row);
              }}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

            <AppIconButton
              label='menus.copy'
              handleClick={() => {
                handleCopy(params.row);
              }}
              childComp={<MdContentCopy color='#9b9b9b' size={16} />}
            />

            <AppIconButton
              label='table.actions.details'
              withLink
              toPathLink={`/nutriplan/menuManagement/menus/${params?.row?.id}`}
              childComp={
                <RestaurantMenuIcon
                  fontSize='small'
                  sx={{ color: "#cbb321" }}
                />
              }
            />

            {/* Edit */}
            {/* <AppIconButton
              label="table.actions.edit"
              handleClick={() => {
                handleUpdate(params.row);
              }}
              childComp={
                <EditOutlinedIcon fontSize="small" sx={{ color: "#9b9b9b" }} />
              }
            /> */}

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

  return MenusColumns;
};
