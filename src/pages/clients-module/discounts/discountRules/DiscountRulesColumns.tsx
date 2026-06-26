/** @format */

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import useIntl from "react-intl/lib/src/components/useIntl";
import DurationBadge from "src/Components/baseComponents/badge/DurationBadge";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IDiscountRule } from "src/types/modules/clientsManagement/discounts/discountRules";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
function discountRulesColumns(
  handleDetails = (_: IDiscountRule) => {},
  handleUpdate = (_: IDiscountRule) => {},
  handleDelete = (_: IDiscountRule) => {},
  handleToggleActive = (_: IDiscountRule) => {},
  handlePublish = (_: IDiscountRule) => {}
) {
  const { messages } = useIntl();
  const discountRulesColumns: GridColDef[] = [
    {
      field: "code",
      headerName: messages["discountRules.code"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridCell value={params.row?.code} />,
    },
    {
      field: "percentOff",
      headerName: messages["discountRules.percentOff"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params.row?.percentOff} />
      ),
    },

    {
      field: "amountOff",
      headerName: messages["discountRules.amountOff"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.amountOff} />,
    },

    {
      field: "duration",
      headerName: messages["discountRules.duration"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <DurationBadge label={params.row?.duration} />,
    },
    {
      field: "durationInMonths",
      headerName: messages["discountRules.durationInMonths"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
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
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.startDate} />,
    },
    {
      field: "expirationDate",
      headerName: messages["discountRules.expirationDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.expirationDate} />
      ),
    },
    {
      field: "maxRedemptions",
      headerName: messages["discountRules.maxRedemptions"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.maxRedemptions} />
      ),
    },
    {
      field: "redemptionsUsed",
      headerName: messages["discountRules.redemptionsUsed"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.redemptionsUsed} />
      ),
    },
    {
      field: "maxRedemptionsPerClient",
      headerName: messages["discountRules.maxRedemptionsPerClient"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.maxRedemptionsPerClient} />
      ),
    },

    {
      field: "firstTimeClientsOnly",
      headerName: messages["discountRules.firstTimeClientsOnly"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.firstTimeClientsOnly ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "stripeId",
      headerName: messages["menus.isPublished"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.stripeId ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
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
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
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
      // hideable: false,

      renderCell: (params) => {
        return (
          <div>
            {/* Details */}
            <AppIconButton
              label='table.actions.details'
              handleClick={() => {
                handleDetails(params?.row);
              }}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

            {!params?.row?.stripeId && (
              <>
                {/* publish */}
                <AppIconButton
                  label='table.actions.publish'
                  handleClick={() => {
                    handlePublish(params.row);
                  }}
                  childComp={
                    <PublishedWithChangesIcon
                      fontSize='small'
                      sx={{ color: "#9b9b9b" }}
                    />
                  }
                />
                {/* Edit */}
                <AppIconButton
                  label='table.actions.edit'
                  handleClick={() => {
                    handleUpdate(params.row);
                  }}
                  childComp={
                    <EditOutlinedIcon
                      fontSize='small'
                      sx={{ color: "#9b9b9b" }}
                    />
                  }
                />
              </>
            )}

            {/**ACTIVE */}
            <AddDataGridActivation
              value={params.row?.isActive}
              handleClick={() => handleToggleActive(params.row)}
            />

            {/* Delete */}
            {!params?.row?.stripeId && (
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
            )}
          </div>
        );
      },
    },
  ];
  return discountRulesColumns;
}

export default discountRulesColumns;
