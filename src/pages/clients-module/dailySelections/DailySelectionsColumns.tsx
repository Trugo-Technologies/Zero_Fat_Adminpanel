/** @format */

import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useIntl } from "react-intl";
import PreferredMealTimeBadge from "src/Components/baseComponents/badge/PreferredMealTimeBadge";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { IDailySelections } from "src/types/modules/clientsManagement/dailySelections";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DailySelectionsStatusBadge from "src/Components/baseComponents/badge/DailySelectionsStatusBadge";
import { MdOutlineLocationOn } from "react-icons/md";

export const DailySelectionsColumns = (
  handleDetails = (_: IDailySelections) => {},
  handleLocation = (_: IDailySelections) => {}
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

  const DailySelectionsColumns: GridColDef[] = [
    {
      field: "totalCalories",
      headerName: messages["dailyMenuMeals.calories"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.totalCalories).toFixed(0)} />
      ),
    },

    {
      field: "totalFats",
      headerName: messages["dailyMenuMeals.fat"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.totalFats).toFixed(0)} />
      ),
    },

    {
      field: "totalCarbohydrates",
      headerName: messages["dailyMenuMeals.carbs"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={Number(params.row?.totalCarbohydrates).toFixed(0)}
        />
      ),
    },

    {
      field: "totalProteins",
      headerName: messages["dailyMenuMeals.protein"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell value={Number(params.row?.totalProteins).toFixed(0)} />
      ),
    },

    {
      field: "hasCutlery",
      headerName: messages[
        "dailySelections.dailySelectionStatus.hasCutlery"
      ] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          {params?.row?.hasCutlery ? (
            <CheckIcon color='success' />
          ) : (
            <CloseIcon color='error' />
          )}
        </>
      ),
    },

    {
      field: "date",
      headerName: messages["dailySelections.date"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            params?.row?.date
              ? moment(params?.row?.date).format("YYYY-MM-DD")
              : "-"
          }
        />
      ),
    },

    {
      field: "deliveryTime",
      headerName: messages["dailySelections.deliveryTime"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={<PreferredMealTimeBadge label={params?.row?.deliveryTime!} />}
        />
      ),
    },

    {
      field: "dailySelectionStatus",
      headerName: messages["dailySelections.dailySelectionStatus"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={
            <DailySelectionsStatusBadge
              label={params?.row?.dailySelectionStatus!}
            />
          }
        />
      ),
    },

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

            {/* Location */}
            <AppIconButton
              label='common.location'
              handleClick={() => {
                handleLocation(params.row);
              }}
              childComp={<MdOutlineLocationOn color='#9b9b9b' size={20} />}
            />
          </div>
        );
      },
    },
  ];

  return clientIdParams
    ? DailySelectionsColumns
    : clientObjects.concat(DailySelectionsColumns);
};
