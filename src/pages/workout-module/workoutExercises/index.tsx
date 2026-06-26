/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import {
  GridEventListener,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AddWorkoutExercise from "src/Components/wrokout-module/catalog/workoutExercises/AddWorkoutExercise";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import {
  IWorkoutExercise,
  IWorkoutExercisesListDto,
} from "src/types/modules/workout/workoutExercises";
import {
  useDeleteWorkoutExerciseMutation,
  useEditWorkoutExerciseMutation,
  useGetAllWorkoutExercisesQuery,
} from "./services/api";
import { WorkoutExercisesColumns } from "./WorkoutExercisesColumns";
interface IWorkoutExercisesProps {
  workoutId: string;
  trainerId: string;
  sets: number;
}

const WorkoutExercisesPages: React.FC<IWorkoutExercisesProps> = (props) => {
  const { messages } = useIntl();
  const { workoutId, sets, trainerId } = props;
  const {
    changePage,
    data,
    isError,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    refetch,
  } = usePaginateData<IWorkoutExercisesListDto>(
    useGetAllWorkoutExercisesQuery,
    {},
    {
      workoutId: workoutId || "",
    }
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [selectedRow, setSelectedRow] = useState<IWorkoutExercise | null>(null);

  const [rows, setRows] = useState<Array<IWorkoutExercise>>(data?.data!);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [editWorkoutExercise, { isSuccess, isLoading }] =
    useEditWorkoutExerciseMutation();
  const [deleteWorkoutExercise, { isLoading: deleteLoading }] =
    useDeleteWorkoutExerciseMutation();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = useCallback((row: IWorkoutExercise) => {
    // setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } });
    setRowModesModel((prev) => ({
      ...prev,
      [row.id]: {
        mode: GridRowModes.Edit,
        ignoreModifications: false,
        cellToFocusAfter: "none",
      },
    }));
  }, []);

  const handleSaveClick = useCallback((row: IWorkoutExercise) => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: {
        mode: GridRowModes.View,
        ignoreModifications: false,
        cellToFocusAfter: "none",
      },
    });
  }, []);

  const handleCancelClick = useCallback((row: IWorkoutExercise) => {
    setRowModesModel((prev) => ({
      ...prev,
      [row.id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
        cellToFocusAfter: "none",
      },
    }));
    // const newRowModesModel: GridRowModesModel = {};
    // data?.data.forEach((row) => {
    //   newRowModesModel[row.id] = { mode: GridRowModes.View, ignoreModifications: true, cellToFocusAfter: 'none' };
    // });
    // setRowModesModel(newRowModesModel);
    // setRowModesModel({
    //   ...rowModesModel,
    //   [row.id]: { mode: GridRowModes.View, ignoreModifications: true, cellToFocusAfter: 'none' },
    // });
    // const editedRow = rows.find((item) => item.id === row.id);
    // setRows(rows.filter((row) => row.id !== row.id));
  }, []);

  const handleRowModesModelChange = useCallback(
    (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
    },
    []
  );

  const handleDelete = useCallback((row: IWorkoutExercise) => {
    // setSelectedRow(row);

    deleteWorkoutExercise(row?.id)
      .unwrap()
      .then((data) => {});
  }, []);
  const columns = WorkoutExercisesColumns(
    handleDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    sets,
    rowModesModel
  );

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend setRowModesModel
      const response = await editWorkoutExercise({
        id: newRow?.id,
        data: { ...newRow },
      });
      // setRowModesModel({});
      // Set all rows to view mode
      const newRowModesModel: GridRowModesModel = {};
      data?.data.forEach((row) => {
        newRowModesModel[row.id] = { mode: GridRowModes.View };
      });
      setRowModesModel(newRowModesModel);

      return response;
    },
    [data?.data]
  );

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid item xs={12} mb={6}>
              <AppFilters
                addTitle='workoutsExercises.add'
                showAddButton={false}
                setShowAddModal={setShowAddModal}
                onChangeKeywordValue={(
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  setSearchValue(event.target.value);
                }}
                successUrl={`${endPoints.workoutExercises().pathname}/search`}
                selectionModel={selectionModel as string[]}
                setSelectionModel={setSelectionModel}
                refetch={refetch}
              />
            </Grid>
            <Grid item xs={12}>
              <AddWorkoutExercise
                label='workoutsExercises.add'
                workoutId={workoutId}
                trainerId={trainerId}
                sets={sets}
              />
            </Grid>
            <Grid item xs={12} mt={6}>
              <AppDataGrid
                rowCount={totalRecords ?? 0}
                pageNumber={page ?? 0}
                tableName='trainers'
                editMode='row'
                rowModesModel={rowModesModel}
                handleRowModesModelChange={handleRowModesModelChange}
                handleRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                //for pagination
                onPageSizeChange={(pageSize: number) => {
                  changeLimit(`${pageSize}`);
                }}
                onPageChange={(pageNumber: number) => {
                  changePage(pageNumber + 1);
                }}
                pageSize={limit ?? 10}
                columns={columns}
                rows={data?.data ?? []}
                loading={isFetching || isLoading || deleteLoading}
                //for selection
                onSelectionModelChange={setSelectionModel}
                checkboxSelection={false}
                selectionModel={selectionModel}
                initialState={initialDataGridState}
                disableColumnSelector={true}
                //for sorting
                onSortModelChange={(result: string[] | null) => {
                  // setSearch({
                  //   ...search,
                  //   orderBy: result,
                  // });
                }}
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default WorkoutExercisesPages;
