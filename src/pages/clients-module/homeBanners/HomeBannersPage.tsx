/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import { useMemo } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import {
  IHomeBannersListDto,
  mapHomeBannerApiToUi,
} from "src/types/modules/clientsManagement/homeBanners";
import { useGetAllHomeBannersQuery } from "./services/api";
import useHomeBanners from "./useHomeBanners";

function HomeBannersPage() {
  const { messages } = useIntl();
  const { columns, Modals, setShowAddModal } = useHomeBanners();

  const {
    changeLimit,
    changePage,
    data,
    refetch,
    totalRecords,
    setSearchValue,
    page,
    limit,
    isFetching,
  } = usePaginateData<IHomeBannersListDto>(useGetAllHomeBannersQuery);

  const rows = useMemo(
    () => (data?.data ?? []).map(mapHomeBannerApiToUi),
    [data?.data]
  );

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
          currentPathName='homeBanners.name'
        />
        <Grid item xs={12}>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", overflowX: "auto" }}>
              <Grid container spacing={0} sx={{ width: "100%" }}>
                <Grid item xs={12}>
                  <AppFilters
                    addTitle='homeBanners.add'
                    setShowAddModal={setShowAddModal}
                    onChangeKeywordValue={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      setSearchValue(event.target.value);
                      changePage(1);
                    }}
                    successUrl={`${endPoints.homeBanners().pathname}/filter`}
                    selectionModel={[]}
                    setSelectionModel={() => {}}
                    refetch={refetch}
                    showMultipleActivation={false}
                    showMultipleDeactivation={false}
                    showMultipleDeletion={false}
                  />
                </Grid>
                <Grid item xs={12} mt={4} sx={{ width: "100%", minWidth: 0 }}>
                  <AppDataGrid
                    rowCount={totalRecords ?? 0}
                    pageNumber={page ?? 1}
                    tableName='homeBanners'
                    getRowId={(row) => row.id}
                    onPageSizeChange={(size: number) => {
                      changeLimit(`${size}`);
                    }}
                    onPageChange={(pageNumber: number) => {
                      changePage(pageNumber + 1);
                    }}
                    pageSize={limit ?? 10}
                    columns={columns}
                    rows={rows}
                    loading={isFetching}
                    onSelectionModelChange={() => {}}
                    checkboxSelection={false}
                    selectionModel={[]}
                    initialState={initialDataGridState}
                    onSortModelChange={() => {}}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {Modals}
    </>
  );
}

export default HomeBannersPage;
