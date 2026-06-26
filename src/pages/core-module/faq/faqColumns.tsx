/** @format */

import { GridColDef } from "@mui/x-data-grid";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import AppIconButton from "src/Components/baseComponents/other/AppIconButton";
import { IFaq } from "src/types/modules/core/faq";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddDataGridActivation from "src/Components/baseComponents/dataGrid/AddDataGridActivation";
import StatusBadge from "src/Components/baseComponents/badge/StatusBadge";
import moment from "moment";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";

function faqColumns(
  handleDetails = (_: IFaq) => {},
  handleUpdate = (_: IFaq) => {},
  handleDelete = (_: IFaq) => {},
  handleToggleActive = (_: IFaq) => {}
) {
  const { messages, locale } = useIntl();
  const workoutPlansColumns: GridColDef[] = [
    {
      field: "question",
      headerName: messages["faqs.question"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <AppDataGridCell value={params.row?.question} />,
    },

    {
      field: locale == "en-US" ? "faqCategory.nameEn" : "faqCategory.nameAr",
      headerName: messages["faqCategories.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.faqCategory?.nameAr!,
            params?.row?.faqCategory?.nameEn!
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

export default faqColumns;
