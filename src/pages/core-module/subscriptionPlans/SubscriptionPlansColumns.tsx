/** @format */

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { ISubscriptionPlan } from "src/types/modules/core/subscriptionPlans";
export const SubscriptionPlansColumns = (
  handleDetails = (_: ISubscriptionPlan) => {},
  handleUpdatePublish = (_: ISubscriptionPlan) => {},
  handleToggleActive = (_: ISubscriptionPlan) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const SubscriptionPlansColumns: GridColDef[] = [
    {
      field: "titleEn",
      headerName: messages["common.titleEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale != "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.titleEn} />,
    },
    {
      field: "titleAr",
      headerName: messages["common.titleAr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.titleAr} />,
    },
    {
      field: "discountAmount",
      headerName: messages["subscriptionPlans.discountAmount"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.discountAmount} />
      ),
    },
    {
      field: "paymobId",
      headerName: "Paymob Id",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.paymobId} />,
    },
    {
      field: "isPublished",
      headerName: messages["menus.isPublished"] as string,
      headerAlign: "center",
      sortable: false,
      align: "center",
      flex: 0.2,
      minWidth: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <AppIconButton
            label={"subscriptionPlans.publishSubscriptionPlanTitle"}
            handleClick={() => {
              handleUpdatePublish(params.row);
            }}
            disabled={params?.row?.paymobId}
            childComp={
              params?.row?.paymobId ? (
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

            {/**ACTIVE */}
            {params?.row?.paymobId && (
              <>
                <AddDataGridActivation
                  value={params.row?.isActive}
                  handleClick={() => handleToggleActive(params.row)}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  return SubscriptionPlansColumns;
};
