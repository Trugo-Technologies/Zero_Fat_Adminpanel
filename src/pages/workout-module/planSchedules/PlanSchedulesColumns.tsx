/** @format */

import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { IPlanSchedule } from "src/types/modules/workout/planSchedules";

export const PlanSchedulesColumns = (
  //   handleDetails = (row: IPlanGoal) => {},
  handleDelete = (row: IPlanSchedule) => {},
  handleEditClick = (row: IPlanSchedule) => {},
  handleCancelClick = (row: IPlanSchedule) => {},
  handleSaveClick = (row: IPlanSchedule) => {},

  rowModesModel: GridRowModesModel = {},
  daysPerWeek: number
  // handleUpdate = (row: IWorkoutExercise) => {}, handleDelete = (row: IWorkoutExercise) => {}

  //   handleToggleActive = (row: IPlanGoal) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();
  const getDayText = (value: number) => {
    switch (value) {
      case 0:
        return messages["exercises.type.Sunday"] as string;
      case 1:
        return messages["planSchedules.day.Monday"] as string;
      case 2:
        return messages["exercises.type.Tuesday"] as string;
      case 3:
        return messages["exercises.type.Wednesday"] as string;
      case 4:
        return messages["exercises.type.Thursday"] as string;
      case 5:
        return messages["exercises.type.Friday"] as string;
      case 6:
        return messages["exercises.type.Saturday"] as string;
      default:
        return null; // or a default message if needed
    }
  };

  const PlanSchedulesColumns: GridColDef[] = [
    {
      field: locale == "en-US" ? "workout.nameEn" : "workout.nameAr",
      headerName: messages["workout.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      editable: false,
      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.workout?.nameAr!,
            params?.row?.workout?.nameEn!
          )}
        />
      ),
    },

    {
      field: "day",
      headerName: messages["planSchedules.day"] as string,
      flex: 0.2,
      editable: true,
      type: "singleSelect",
      // valueOptions: ['Market', 'Finance', 'Development'],
      renderEditCell: (params) => (
        <FormControl variant='outlined' fullWidth size='small'>
          <InputLabel id='select-footer'>
            {messages["planSchedules.day"] as string}
          </InputLabel>
          <Select
            fullWidth
            size='small'
            name='day'
            labelId='planSchedules.day'
            label={messages["planSchedules.day"] as string}
            value={params.value}
            onChange={(event: { target: { value: any } }) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue,
              });
            }}
            sx={{ width: "80%" }}>
            {daysPerWeek &&
              Number(daysPerWeek) > 0 &&
              Array(Number(daysPerWeek) || 0)
                .fill(null)
                .map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    <IntlMessages id='common.today' /> {i + 1}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      ),
      renderCell: (params) => (
        <AppDataGridCell
          value={
            <>
              <IntlMessages id='common.today' /> {params?.row?.day}
            </>
          }
        />
      ),
    },

    {
      field: "daytime",
      headerName: messages["planSchedules.daytime"] as string,
      flex: 0.2,
      editable: true,
      type: "singleSelect",
      valueOptions: ["AM", "PM"],
      renderEditCell: (params) => (
        <FormControl variant='outlined' fullWidth size='small'>
          <InputLabel id='select-footer'>
            {messages["planSchedules.daytime"] as string}
          </InputLabel>

          <Select
            fullWidth
            size='small'
            name='daytime'
            labelId='planSchedules.daytime'
            label={messages["planSchedules.daytime"] as string}
            value={!params.value ? "null" : params.value}
            sx={{ width: 160 }}
            onChange={(event: { target: { value: any } }) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue === "null" ? null : newValue,
              });
            }}>
            <MenuItem value={"null"}>
              <IntlMessages id='common.noValue' />
            </MenuItem>
            <MenuItem value={"AM"}>
              <IntlMessages id='planSchedules.daytime.AM' />
            </MenuItem>
            <MenuItem value={"PM"}>
              <IntlMessages id='planSchedules.daytime.PM' />
            </MenuItem>
          </Select>
        </FormControl>
      ),
      renderCell: (params) => (
        <AppDataGridCell
          value={
            <>
              {params?.value === null ? (
                <IntlMessages id='common.noValue' />
              ) : (
                <IntlMessages id={`planSchedules.daytime.${params?.value}`} />
              )}
            </>
          }
        />
      ),
    },

    // {
    //   field: 'isActive',
    //   headerName: messages['common.status'] as string,
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.2,
    //   headerClassName: 'super-app-theme--header',
    //   renderCell: (params) => <StatusBadge isActive={params.row?.isActive} />,
    // },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.row?.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label={messages["common.save"] as string}
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(params?.row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              color='inherit'
              onClick={() => handleCancelClick(params.row)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            color='inherit'
            onClick={() => handleEditClick(params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            color='inherit'
            onClick={() => handleDelete(params.row)}
          />,
        ];
      },
    },
  ];

  return PlanSchedulesColumns;
};
