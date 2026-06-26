import { GridColDef } from "@mui/x-data-grid";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import moment from "moment";
function PlanReviewsColumns(): GridColDef[] {
  const { messages, locale } = useIntl();
  const PlanReviewsColumns: GridColDef[] = [
    {
      field: "effectivenessRate",
      headerName: messages["planReviews.effectivenessRate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      hideable: locale == "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params.row?.effectivenessRate} />
      ),
    },
    {
      field: "easyToUseRate",
      headerName: messages["planReviews.easyToUseRate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.easyToUseRate} />
      ),
    },

    {
      field: "enjoyabilityRate",
      headerName: messages["planReviews.enjoyabilityRate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.enjoyabilityRate} />
      ),
    },
    {
      field: "totalRate",
      headerName: messages["planReviews.totalRate"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.totalRate} />
      ),
    },
    {
      field: "content",
      headerName: messages["planReviews.content"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      sortable: false,
      headerClassName: "super-app-theme--header",
      // hideable: locale != "en-US",

      renderCell: (params) => <AppDataGridCell value={params?.row?.content} />,
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
  ];
  return PlanReviewsColumns;
}

export default PlanReviewsColumns;
