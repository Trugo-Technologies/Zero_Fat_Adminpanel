/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { IPromoBanksListDto } from "src/types/modules/clientsManagement/discounts/banks";
import { useGetAllBanksQuery } from "./services/api";
import useBanks from "./useBanks";

function BanksPage() {
  const { messages } = useIntl();
  const { columns, Modals, setShowAddModal } = useBanks();

  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    refetch,
  } = usePaginateData<IPromoBanksListDto>(useGetAllBanksQuery);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebar.discounts"] },
          ]}
          currentPathName='promoBanks.name'
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='promoBanks.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                    changePage(1);
                  }}
                  successUrl=''
                  selectionModel={[]}
                  setSelectionModel={() => {}}
                  refetch={refetch}
                  showMultipleActivation={false}
                  showMultipleDeactivation={false}
                  showMultipleDeletion={false}
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 1}
                  tableName='promoBanks'
                  getRowId={(row) => row.id}
                  onPageSizeChange={(size: number) => {
                    changeLimit(`${size}`);
                  }}
                  onPageChange={(pageNumber: number) => {
                    changePage(pageNumber + 1);
                  }}
                  pageSize={limit ?? 10}
                  columns={columns}
                  rows={data?.data ?? []}
                  loading={isFetching}
                  onSelectionModelChange={() => {}}
                  checkboxSelection={false}
                  selectionModel={[]}
                  initialState={initialDataGridState}
                  onSortModelChange={() => {}}
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

export default BanksPage;
