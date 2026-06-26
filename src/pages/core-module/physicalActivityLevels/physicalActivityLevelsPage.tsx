/** @format */

import React from "react";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllPhysicalActivityLevelsQuery } from "./services";
import { Card, CardContent, Grid } from "@mui/material";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { useIntl } from "react-intl";
import { endPoints } from "src/shared/end-points";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import usePhysicalActivityLevels from "./usePhysicalActivityLevels";
import { initialDataGridState } from "src/Helpers";

function PhysicalActivityLevelsPage() {
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
  } = usePaginateData(useGetAllPhysicalActivityLevelsQuery);
  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = usePhysicalActivityLevels();
  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.coreManagement.title"] }]}
          currentPathName={"sidebar.physicalActivityLevels"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='physicalActivityLevels.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.physicalActivityLevelsEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='physicalActivityLevels'
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

export default PhysicalActivityLevelsPage;
