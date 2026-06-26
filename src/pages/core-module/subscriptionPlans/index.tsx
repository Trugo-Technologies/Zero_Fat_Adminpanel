/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { useGetAllSubscriptionPlansQuery } from "./services/api";
import useSubscriptionPlans from "./useSubscriptionPlans";

function SubscriptionPlansPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    totalRecords,
    sortBy,
    setSearchValue,
    refetch,
    page,
    limit,
    isFetching,
  } = usePaginateData(useGetAllSubscriptionPlansQuery);
  const { Modals, columns, selectionModel, setSelectionModel } =
    useSubscriptionPlans();
  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.coreManagement.title"] }]}
          currentPathName={"sidebar.subscriptionPlans"}
        />
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
                  successUrl={`${endPoints.subscriptionPlansEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='subscriptionPlans'
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
      {Modals}
    </>
  );
}

export default SubscriptionPlansPage;
