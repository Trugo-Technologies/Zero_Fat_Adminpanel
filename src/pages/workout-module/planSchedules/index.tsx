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
import AddPlanSchedule from "src/Components/wrokout-module/catalog/planSchedules/AddPlanSchedule";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import {
  IPlanSchedule,
  IPlanSchedulesListDto,
} from "src/types/modules/workout/planSchedules";
import { PlanSchedulesColumns } from "./PlanSchedulesColumns";
import {
  useDeletePlanScheduleMutation,
  useEditPlanScheduleMutation,
  useGetAllPlanSchedulesQuery,
} from "./services/api";
interface IPlanSchedulesProps {
  planId: string;
  daysPerWeek: number;
}

const PlanSchedulesPages: React.FC<IPlanSchedulesProps> = (props) => {
  const { messages } = useIntl();

  const { planId, daysPerWeek } = props;
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
  } = usePaginateData<IPlanSchedulesListDto>(
    useGetAllPlanSchedulesQuery,
    {},
    {
      planId: planId || "",
    }
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [selectedRow, setSelectedRow] = useState<IPlanSchedule | null>(null);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [editPlanSchedules, { isSuccess, isLoading }] =
    useEditPlanScheduleMutation();
  const [deletePlanSchedules, { isLoading: deleteLoading }] =
    useDeletePlanScheduleMutation();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = useCallback((row: IPlanSchedule) => {
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

  const handleSaveClick = useCallback((row: IPlanSchedule) => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: {
        mode: GridRowModes.View,
        ignoreModifications: false,
        cellToFocusAfter: "none",
      },
    });
  }, []);

  const handleCancelClick = useCallback((row: IPlanSchedule) => {
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

  const handleDelete = useCallback((row: IPlanSchedule) => {
    // setSelectedRow(row);

    deletePlanSchedules(row?.id)
      .unwrap()
      .then((data) => {});
  }, []);
  const columns = PlanSchedulesColumns(
    handleDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    rowModesModel,
    daysPerWeek
  );

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend setRowModesModel
      const response = await editPlanSchedules({
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
                addTitle='planSchedule.add'
                showAddButton={false}
                setShowAddModal={setShowAddModal}
                onChangeKeywordValue={(
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  setSearchValue(event.target.value);
                }}
                successUrl={`${endPoints.workoutBodyParts().pathname}/search`}
                selectionModel={selectionModel as string[]}
                setSelectionModel={setSelectionModel}
                refetch={refetch}
              />
            </Grid>
            <Grid item xs={12}>
              <AddPlanSchedule
                label='planSchedule.add'
                planId={planId}
                daysPerWeek={daysPerWeek}
              />
            </Grid>
            <Grid item xs={12} mt={6}>
              <AppDataGrid
                rowCount={totalRecords ?? 0}
                pageNumber={page ?? 0}
                tableName='planSchedules'
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

export default PlanSchedulesPages;
