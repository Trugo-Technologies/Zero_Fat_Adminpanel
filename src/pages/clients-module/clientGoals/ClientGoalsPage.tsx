/** @format */

import React from "react";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { Card, CardContent, Grid } from "@mui/material";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { endPoints } from "src/shared/end-points";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import { initialDataGridState } from "src/Helpers";
import { useGetAllClientGoalsQuery } from "./services/api";
import { useParams } from "react-router-dom";
import useClientGoals from "./useClientGoals";

function ClientGoalsPage() {
  const { clientIdParams } = useParams();

  const {
    changeLimit,
    changePage,
    data,
    isFetching,
    limit,
    page,
    setSearchValue,
    refetch,
    sortBy,
    totalRecords,
  } = usePaginateData(
    useGetAllClientGoalsQuery,
    {},
    {
      clientId: clientIdParams,
    }
  );
  const { columns, selectionModel, setSelectionModel } = useClientGoals();

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
                  successUrl={`${endPoints.clientGoals().pathname}`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>

              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='clientGoals'
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
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        bodyFat: false,
                        tdee: false,
                        timeToReachGoalInDays: false,
                        neededCaloriesToReachGoal: false,
                        heightMeasurement: false,
                        weightMeasurement: false,
                        targetWeightMeasurement: false,
                      },
                    },
                  }}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  //for sorting
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result as string[]);
                  }}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ClientGoalsPage;
