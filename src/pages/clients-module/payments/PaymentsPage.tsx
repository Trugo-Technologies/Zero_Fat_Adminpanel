/** @format */

import React from "react";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { Card, CardContent, Grid } from "@mui/material";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { endPoints } from "src/shared/end-points";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import { useIntl } from "react-intl";
import { initialDataGridState } from "src/Helpers";
import usePayments from "./usePayments";
import { useGetAllPaymentsQuery } from "./services/api";
import { useParams } from "react-router-dom";

function PaymentsPage() {
  const { messages } = useIntl();
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
  } = usePaginateData(useGetAllPaymentsQuery, {}, { clientId: clientIdParams });

  const { Modals, columns, selectionModel, setSelectionModel } = usePayments();

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebar.clients"] },
          ]}
          currentPathName={"sidebar.payments"}
          isShow={!clientIdParams}
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
                  successUrl={`${endPoints.paymentsEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='payments'
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
      {Modals}
    </>
  );
}

export default PaymentsPage;
