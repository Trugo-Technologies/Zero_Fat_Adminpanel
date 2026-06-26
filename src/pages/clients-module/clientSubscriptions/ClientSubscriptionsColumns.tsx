/** @format */

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import PaymentStatusBadge from "src/Components/baseComponents/badge/PaymentStatusBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import {
  IClientSubscriptions,
  ISelectedMealTypes,
} from "src/types/modules/clientsManagement/clientSubscriptions";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PreferredDeliveryTimeBadge from "src/Components/baseComponents/badge/PreferredDeliveryTimeBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
import SubscriptionTypeBadge from "src/Components/baseComponents/badge/SubscriptionTypeBadge";
import { useParams } from "react-router-dom";

export const ClientSubscriptionsColumns = (
  handleDetails = (row: IClientSubscriptions) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();
  const { clientIdParams } = useParams();

  // const daysOfWeek = [
  //   messages["common.days.Sunday"],
  //   messages["common.days.Monday"],
  //   messages["common.days.Tuesday"],
  //   messages["common.days.Wednesday"],
  //   messages["common.days.Thursday"],
  //   messages["common.days.Friday"],
  //   messages["common.days.Saturday"],
  // ];

  // const getDayString = (dayNumber: number) => {
  //   return daysOfWeek[dayNumber];
  // };

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

  const ClientSubscriptionsColumns: GridColDef[] = [
    {
      field: "clientLocation.type",
      headerName: messages["clientLocations.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            messages[
              `clientLocations.type.${params.row?.clientLocation?.type}`
            ] as string
          }
        />
      ),
    },
    {
      field: "clientLocation.area",
      headerName: messages["clientLocations.area"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.area} />
      ),
    },
    {
      field: "clientLocation.street",
      headerName: messages["clientLocations.street"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.street} />
      ),
    },

    {
      field: "clientLocation.building",
      headerName: messages["clientLocations.building"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.building} />
      ),
    },

    {
      field: "clientLocation.postalCode",
      headerName: messages["clientLocations.postalCode"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.postalCode} />
      ),
    },

    {
      field: "clientLocation.office",
      headerName: messages["clientLocations.office"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.clientLocation?.office} />
      ),
    },

    {
      field: "clientLocation.fullAddressEn",
      headerName: messages["clientLocations.fullAddressEn"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.clientLocation?.fullAddressEn}
          style={{ whiteSpace: "break-spaces", textAlign: "left" }}
        />
      ),
    },

    {
      field: locale == "en-US" ? "mealPlan.nameEn" : "mealPlan.nameAr",
      headerName: messages["mealPlans.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.mealPlan?.nameAr!,
            params?.row?.mealPlan?.nameEn!
          )}
        />
      ),
    },

    {
      field: "selectedMealTypes",
      headerName: messages["sidebar.mealTypes"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,
      headerClassName: "super-app-theme--header",
      minWidth: 160,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.selectedMealTypes
              ?.map(
                (item: ISelectedMealTypes) =>
                  `${item?.mealType?.nameAr} (${item?.quantityPerDay})`
              )
              .join(", ") || "",
            params?.row?.selectedMealTypes
              ?.map(
                (item: ISelectedMealTypes) =>
                  `${item?.mealType?.nameEn} (${item?.quantityPerDay})`
              )
              .join(", ") || ""
          )}
        />
      ),
    },
    // {
    //   field: "selectedDeliveryDays",
    //   headerName: messages[
    //     "clients.subscriptionStatus.selectedDeliveryDays"
    //   ] as string,
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 0.2,
    //   headerClassName: "super-app-theme--header",
    //   renderCell: (params) => (
    //     <AppDataGridCell
    //       value={
    //         params?.row?.daysPerWeek
    //           ? params?.row?.daysPerWeek?.map(getDayString).join(", ")
    //           : "-"
    //       }
    //       style={{
    //         whiteSpace: "break-spaces",
    //         textAlign: "left",
    //       }}
    //     />
    //   ),
    // },
    {
      field: "averageCalories",
      headerName: messages["mealPlans.averageCalories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.averageCalories} />
      ),
    },

    {
      field: "startDate",
      headerName: messages["common.startDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.startDate
              ? moment(params?.row?.startDate).format("YYYY-MM-DD")
              : "-"
          }
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
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.endDate
              ? moment(params?.row?.endDate).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "paymentDate",
      headerName: messages["clients.subscriptionStatus.paymentDate"] as string,
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
      field: "nextRenewalDate",
      headerName: messages[
        "clients.subscriptionStatus.nextRenewalDate"
      ] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.nextRenewalDate
              ? moment(params?.row?.nextRenewalDate).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },
    {
      field: "cancelAt",
      headerName: messages["clients.subscriptionStatus.cancelAt"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.cancelAt
              ? moment(params?.row?.cancelAt).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "renewalCount",
      headerName: messages["clients.subscriptionStatus.renewalCount"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.renewalCount} />
      ),
    },

    {
      field: "preferredDeliveryTime",
      headerName: messages[
        "clients.subscriptionStatus.preferredDeliveryTime"
      ] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <PreferredDeliveryTimeBadge
          label={params?.row?.preferredDeliveryTime}
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
      field: "totalCost",
      headerName: messages["payments.totalCost"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.totalCost!} />
      ),
    },

    {
      field: "isAutoRenewalEnabled",
      headerName: messages[
        "client.clientSubscription.isAutoRenewalEnabled"
      ] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.isAutoRenewalEnabled ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "subscriptionType",
      headerName: messages["subscriptionPlans.subscriptionType"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            <SubscriptionTypeBadge label={params?.row?.subscriptionType!} />
          }
        />
      ),
    },

    {
      field: "subscriptionStatus",
      headerName: messages["clients.subscriptionStatus"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={<SubscriptionBadge label={params?.row?.subscriptionStatus!} />}
        />
      ),
    },

    {
      field: "paymentQuickLink",
      headerName: messages["subscriptionPlans.paymentQuickLink"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <>
          {params?.row?.paymentQuickLink ? (
            <a target='_blank' href={params?.row?.paymentQuickLink}>
              {messages["clickHere"] as string}
            </a>
          ) : (
            "-"
          )}
        </>
      ),
    },

    {
      field: "paymentStatus",
      headerName: messages["payments.paymentStatus"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

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
    ? ClientSubscriptionsColumns
    : clientObjects.concat(ClientSubscriptionsColumns);
};
