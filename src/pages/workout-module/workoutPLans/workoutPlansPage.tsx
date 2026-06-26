/** @format */

import { Card, CardContent, Grid, Box, Typography, Select, MenuItem, Button } from "@mui/material";
import React, { useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import {
  useActiveAllPlansMutation,
  useDeleteAllPlansMutation,
  useGetAllPlansQuery,
} from "./services/api";
import useWorkoutPlans from "./useWorkoutPlans";

function WorkoutPlansPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    refetch,
    sortBy,
    totalRecords,
    setSearchValue,
    page,
    limit,
    isFetching,
  } = usePaginateData(useGetAllPlansQuery);
  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useWorkoutPlans();

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllPlansMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllPlansMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ planGoal: "All Goals", level: "All Levels", status: "All Status" });

  const handleClear = () => {
    setAppliedFilters({ planGoal: "All Goals", level: "All Levels", status: "All Status" });
  };

  const advanceFiltersInputs = [
    <Box key="planGoal">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Plan Goal</Typography>
      <Select size="small" value={appliedFilters.planGoal} onChange={(e) => setAppliedFilters({...appliedFilters, planGoal: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Goals" sx={{ fontSize: 13 }}>All Goals</MenuItem>
        <MenuItem value="Weight Loss" sx={{ fontSize: 13 }}>Weight Loss</MenuItem>
        <MenuItem value="Muscle Gain" sx={{ fontSize: 13 }}>Muscle Gain</MenuItem>
        <MenuItem value="Endurance" sx={{ fontSize: 13 }}>Endurance</MenuItem>
        <MenuItem value="Flexibility" sx={{ fontSize: 13 }}>Flexibility</MenuItem>
      </Select>
    </Box>,
    <Box key="level">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Level</Typography>
      <Select size="small" value={appliedFilters.level} onChange={(e) => setAppliedFilters({...appliedFilters, level: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Levels" sx={{ fontSize: 13 }}>All Levels</MenuItem>
        <MenuItem value="Beginner" sx={{ fontSize: 13 }}>Beginner</MenuItem>
        <MenuItem value="Intermediate" sx={{ fontSize: 13 }}>Intermediate</MenuItem>
        <MenuItem value="Advanced" sx={{ fontSize: 13 }}>Advanced</MenuItem>
      </Select>
    </Box>,
    <Box key="status">
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>Status</Typography>
      <Select size="small" value={appliedFilters.status} onChange={(e) => setAppliedFilters({...appliedFilters, status: e.target.value})} sx={{ borderRadius: 2, height: 36, fontSize: 13, minWidth: 150, "& fieldset": { borderColor: "#E2E8F0" } }}>
        <MenuItem value="All Status" sx={{ fontSize: 13 }}>All Status</MenuItem>
        <MenuItem value="Active" sx={{ fontSize: 13 }}>Active</MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>Inactive</MenuItem>
      </Select>
    </Box>,
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button onClick={handleClear} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 700, "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" }, height: 36, px: 2, borderRadius: 2 }}>
        Clear filters
      </Button>
    </Box>
  ];

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.workoutManagement.title"] },
            { name: messages["sidebar.training.title"] },
          ]}
          currentPathName={"sidebar.workoutPlan"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='workoutPlan.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.planEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  deleteAllQuery={deleteAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
                  activeAllQuery={activeAllQuery}
                  activeAllQueryLoading={activeAllLoading}
                  showAdvanceFiltersButton={true}
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                {" "}
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='plans'
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
                  loading={isFetching}
                  //for selection
                  onSelectionModelChange={setSelectionModel}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  initialState={initialDataGridState}
                  //for sorting
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result ?? []);
                  }}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {Modals}
    </>
  );
}

export default WorkoutPlansPage;
