/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { useGetAllClientLoyaltyPointsQuery } from "./services/api";
import useClientLoyaltyPoints from "./useClientLoyaltyPoints";

function ClientLoyaltyPointsPage() {
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
    useGetAllClientLoyaltyPointsQuery,
    {},
    {
      clientId: clientIdParams,
    }
  );
  const { columns, selectionModel, setSelectionModel } =
    useClientLoyaltyPoints();

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
                  successUrl={`${endPoints.clientLoyaltyPoints().pathname}`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>

              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='clientLoyaltyPoints'
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
                  initialState={initialDataGridState}
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

export default ClientLoyaltyPointsPage;
