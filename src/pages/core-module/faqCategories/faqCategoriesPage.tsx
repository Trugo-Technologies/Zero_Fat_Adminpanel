/** @format */

import React from "react";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllFaqCategoriesQuery } from "./services";
import { Card, CardContent, Grid } from "@mui/material";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import { endPoints } from "src/shared/end-points";
import { useIntl } from "react-intl";
import useFaqCategories from "./useFaqCategories";
import { initialDataGridState } from "src/Helpers";

function FaqCategoriesPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    isFetching,
    limit,
    page,
    refetch,
    totalRecords,
    sortBy,
    setSearchValue,
  } = usePaginateData(useGetAllFaqCategoriesQuery);
  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useFaqCategories();
  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.coreManagement.title"] }]}
          currentPathName={"sidebar.faqCategories"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='faqCategories.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.faqCategoriesEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='faqCategories'
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

export default FaqCategoriesPage;
