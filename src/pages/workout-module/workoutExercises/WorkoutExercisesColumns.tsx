/** @format */

import {
  GridActionsCellItem,
  GridColDef,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { useIntl } from "react-intl";
import AppDataGridCell from "src/Components/baseComponents/dataGrid/AppDataGridCell";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { exerciseType } from "src/types/enums";
import { IWorkoutExercise } from "src/types/modules/workout/workoutExercises";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  handleKeyDown,
  handleWheel,
} from "src/@crema/components/AppFormComponents/AppTextField";
import ExerciseTypeBadge from "src/Components/baseComponents/badge/ExerciseTypeBadge";

export const WorkoutExercisesColumns = (
  handleDelete = (row: IWorkoutExercise) => {},
  handleEditClick = (row: IWorkoutExercise) => {},
  handleCancelClick = (row: IWorkoutExercise) => {},
  handleSaveClick = (row: IWorkoutExercise) => {},
  sets: number,
  rowModesModel: GridRowModesModel = {} // handleUpdate = (row: IWorkoutExercise) => {}, handleDelete = (row: IWorkoutExercise) => {}
): GridColDef[] => {
  const { messages, locale } = useIntl();

  const WorkoutExercisesColumns: GridColDef[] = [
    {
      field: "index",
      headerName: messages["workoutsExercises.setIndex"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      editable: true,
      type: "number",

      renderCell: (params) => <AppDataGridCell value={params.row?.index} />,
    },

    {
      field: "sets",
      headerName: messages["workoutsExercises.sets"] as string,
      flex: 0.2,
      editable: true,
      type: "singleSelect",
      valueOptions: Array.from({ length: sets }, (_, index) => index + 1),
      renderEditCell: (params) => (
        <FormControl variant='outlined' fullWidth size='small'>
          <InputLabel id='select-footer'>
            {messages["workoutsExercises.sets"] as string}
          </InputLabel>

          <Select
            fullWidth
            size='small'
            name='sets'
            labelId='workoutsExercises.sets'
            label={messages["workoutsExercises.sets"] as string}
            value={params.value}
            // sx={{ width: 160 }}
            onChange={(event: { target: { value: any } }) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue === "null" ? null : newValue,
              });
            }}>
            {Array.from({ length: sets }, (_, index) => index + 1).map(
              (item) => (
                <MenuItem value={item}>
                  <IntlMessages id='workouts.setNumber' /> {item}
                </MenuItem>
              )
            )}
            {!sets && (
              <MenuItem disabled>
                <IntlMessages id='workouts.noSets' />
              </MenuItem>
            )}
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
                <>
                  <IntlMessages id={`workouts.setNumber`} /> {params?.row?.sets}
                </>
              )}
            </>
          }
        />
      ),
    },

    {
      field: "reps",
      headerName: messages["workoutsExercises.reps"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      editable: true,
      type: "number",

      renderCell: (params) => <AppDataGridCell value={params?.row?.reps} />,
      renderEditCell: (params) => (
        <>
          {
            //params?.row?.exercise?.type
            <TextField
              type='reps'
              label={<IntlMessages id='workoutsExercises.reps' />}
              name={`weight`}
              variant='outlined'
              size='small'
              fullWidth
              sx={{ width: "60%" }}
              onWheel={(event) => handleWheel(event)} // Prevent mouse wheel input
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
              disabled={params?.row?.exercise?.type === exerciseType.Duration}
              value={params?.value}
              onChange={(event) => {
                const newValue = event.target.value;
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: newValue,
                });
              }}
            />
          }
        </>
      ),
    },

    {
      field: "weight",
      headerName: messages["workoutsExercises.weight"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      editable: true,
      type: "number",
      renderCell: (params) => <AppDataGridCell value={params?.row?.weight} />,
      renderEditCell: (params) => (
        <>
          {
            //params?.row?.exercise?.type
            <TextField
              type='number'
              label={<IntlMessages id='workoutsExercises.weight' />}
              name={`weight`}
              variant='outlined'
              size='small'
              fullWidth
              sx={{ width: "60%" }}
              onWheel={(event) => handleWheel(event)} // Prevent mouse wheel input
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
              disabled={
                params?.row?.exercise?.type != exerciseType.WeightAndReps
              }
              value={params?.value}
              onChange={(event) => {
                const newValue = event.target.value;
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: newValue,
                });
              }}
            />
          }
        </>
      ),
    },
    {
      field: "durationInSec",
      headerName: messages["workoutsExercises.durationInSec"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      editable: true,

      type: "number",
      renderCell: (params) => (
        <AppDataGridCell value={params?.row?.durationInSec} />
      ),
      renderEditCell: (params) => (
        <>
          {
            //params?.row?.exercise?.type
            <TextField
              type='number'
              label={<IntlMessages id='workoutsExercises.durationInSec' />}
              name={`durationInSec`}
              variant='outlined'
              size='small'
              fullWidth
              sx={{ width: "60%" }}
              onWheel={(event) => handleWheel(event)} // Prevent mouse wheel input
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
              disabled={params?.row?.exercise?.type != exerciseType.Duration}
              value={params?.value}
              onChange={(event) => {
                const newValue = event.target.value;
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: newValue,
                });
              }}
            />
          }
        </>
      ),
    },

    {
      field: locale == "en-US" ? "exercise.nameEn" : "exercise.nameAr",
      headerName: messages["exercises.name"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <AppDataGridCell
          value={getValueBasedOnCurrentLanguage(
            params?.row?.exercise?.nameAr!,
            params?.row?.exercise?.nameEn!
          )}
        />
      ),
    },
    {
      field: "type",
      headerName: messages["exercises.type"] as string,
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      minWidth: 120,
      editable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <ExerciseTypeBadge label={params?.row?.exercise?.type} />
      ),

      // renderCell: (params) => <AppDataGridCell value={messages[`exercises.type.${params?.row?.type}`] as string} />,
    },
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
    // {
    //   field: 'actions',
    //   headerName: messages['common.actions'] as string,
    //   sortable: false,
    //   align: 'center',
    //   filterable: false,
    //   headerAlign: 'center',
    //   flex: 0.1,
    //   minWidth: 120,
    //   headerClassName: 'super-app-theme--header',
    //   // hideable: false,

    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {/* Edit */}
    //         {/* <AppIconButton
    //           label='table.actions.edit'
    //           handleClick={() => {
    //             // handleUpdate(params.row);
    //           }}
    //           childComp={<EditOutlinedIcon fontSize='small' sx={{ color: '#9b9b9b' }} />}
    //         /> */}

    //         {/* Delete */}
    //         <AppIconButton
    //           label='table.actions.delete'
    //           handleClick={() => {
    //             handleDelete(params.row);
    //           }}
    //           childComp={<DeleteOutlinedIcon fontSize='small' sx={{ color: '#9b9b9b' }} />}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  return WorkoutExercisesColumns;
};
