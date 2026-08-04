/** @format */

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import DietitianGoalBadge from "src/Components/baseComponents/badge/DietitianGoalBadge";
import GenderBadge from "src/Components/baseComponents/badge/GenderBadge";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import SubscriptionBadge from "src/Components/baseComponents/badge/SubscriptionBadge";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppDataGridImage from "src/Components/baseComponents/dataGrid/AppDataGridImage";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IClient } from "src/types/modules/clientsManagement/clients";
import { IAllergens } from "src/types/modules/nutriplan/allergens";

export const ClientsColumns = (
  handleDetails = (_: IClient) => {},
  handleToggleActive = (_: IClient) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const ClientsColumns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: messages["common.image"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <AppDataGridImage value={params.row?.imageUrl} />,
    },
    {
      field: "fullName",
      headerName: messages["common.fullName"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US" ? true : false,

      renderCell: (params) => <AppDataGridCell value={params.row?.fullName} />,
    },

    {
      field: "birthDate",
      headerName: messages["common.birthDate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={moment(params?.row?.birthDate).format("YYYY-MM-DD")}
        />
      ),
    },

    {
      field: "email",
      headerName: messages["common.email"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.email} />,
    },

    {
      field: "mobile",
      headerName: messages["common.mobile"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.mobile} />,
    },

    {
      field: "weightInKG",
      headerName: messages["clinets.weightInKG"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.weightInKG && `${params?.row?.weightInKG}`}
        />
      ),
    },
    {
      field: "targetWeightInKG",
      headerName: messages["clinets.targetWeightInKG"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.targetWeightInKG && `${params?.row?.targetWeightInKG}`
          }
        />
      ),
    },
    {
      field: "activityValue",
      headerName: messages["physicalActivityLevels.activityValue"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.activityValue && `${params?.row?.activityValue}`}
        />
      ),
    },

    {
      field: "bmi",
      headerName: messages["clinets.bmi"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.bmi && `${params?.row?.bmi}`} />
      ),
    },

    {
      field: "bmr",
      headerName: messages["clinets.bmr"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.bmr && `${params?.row?.bmr}`} />
      ),
    },

    {
      field: "bodyFat",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={params?.row?.bodyFat && `${params?.row?.bodyFat}`}
        />
      ),
    },

    {
      field: "tdee",
      headerName: messages["clients.tdee"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.tdee && `${params?.row?.tdee}`} />
      ),
    },

    {
      field: "timeToReachGoalInDays",
      headerName: messages["clinets.timeToReachGoalInDays"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.timeToReachGoalInDays &&
            `${params?.row?.timeToReachGoalInDays}`
          }
        />
      ),
    },

    {
      field: "neededCaloriesToReachGoal",
      headerName: messages["clinets.neededCaloriesToReachGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.neededCaloriesToReachGoal &&
            `${params?.row?.neededCaloriesToReachGoal}`
          }
        />
      ),
    },

    {
      field: "clientAllergics",
      headerName: messages["sidebar.allergens"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.clientAllergics
              ?.map((item: IAllergens) => item?.nameAr)
              .join(", ") || "",
            params?.row?.clientAllergics
              ?.map((item: IAllergens) => item?.nameEn)
              .join(", ") || ""
          )}
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
      field: "gender",
      headerName: messages["common.gender"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,

      renderCell: (params) => (
        <AppDataGridCell value={<GenderBadge label={params.row?.gender} />} />
      ),
    },
    {
      field: "dietitianGoal",
      headerName: messages["clinets.dietitianGoal"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      minWidth: 120,
      renderCell: (params) => (
        <AppDataGridCell
          value={<DietitianGoalBadge label={params?.row?.dietitianGoal!} />}
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
      minWidth: 140,
      renderCell: (params) => (
        <AppDataGridCell
          value={
            <SubscriptionBadge label={params?.row?.subscriptionStatus!} />
          }
        />
      ),
    },
    {
      field: "isActive",
      headerName: messages["common.status"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,

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
      minWidth: 160,
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
              withLink
              toPathLink={`/clientsManagement/clients/profile/${params?.row?.id}`}
              childComp={
                <RemoveRedEyeIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

            <AppIconButton
              label='table.actions.clientAccess'
              withLink
              toPathLink={`/clientsManagement/clientAccountAccess?clientId=${params?.row?.id}`}
              childComp={
                <ManageAccountsIcon fontSize='small' sx={{ color: "#9b9b9b" }} />
              }
            />

            {/**ACTIVE */}

            <AddDataGridActivation
              value={params.row?.isActive}
              handleClick={() => handleToggleActive(params.row)}
            />
          </div>
        );
      },
    },
  ];

  return ClientsColumns;
};
