/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import PlanReviewsColumns from "./PlanReviewsColumns";
import { useGetAllPlanReviewsQuery } from "./services/api";
import { IPlanReviewsListDto } from "src/types/modules/workout/planReviews";
import { useState } from "react";
import { useParams } from "react-router-dom";

const PlanReviewsPages = () => {
  const { workoutPlanIdParams } = useParams();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const columns = PlanReviewsColumns();
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
    handleDelete,
    refetch,
  } = usePaginateData<IPlanReviewsListDto>(
    useGetAllPlanReviewsQuery,
    {
      skip: !workoutPlanIdParams,
    },
    {
      planId: workoutPlanIdParams,
    }
  );

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  showAddButton={false}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.planReviews().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='planReviews'
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
      </Grid>
    </>
  );
};

export default PlanReviewsPages;
