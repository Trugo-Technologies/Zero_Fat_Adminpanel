/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IClientLocationsListDto } from "src/types/modules/clientsManagement/clientLocations";
import { IClient } from "src/types/modules/clientsManagement/clients";
import { useGetAllClientLocationsQuery } from "./services/api";
import useClientLocations from "./useClientLocations";

const ClientLocationsPages = ({ clientItem }: { clientItem: IClient }) => {
  const { clientIdParams } = useParams();

  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useClientLocations({ clientItem });
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
  } = usePaginateData<IClientLocationsListDto>(
    useGetAllClientLocationsQuery,
    { skip: !clientIdParams },
    { clientId: clientIdParams }
  );

  return (
    <>
      <Grid container spacing={3}>
        {/* <AppBreadcrumb
          paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
          currentPathName={"sidebar.clientLocations"}
        /> */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='clientLocations.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.clientLocations().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName='clientLocations'
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

      {Modals}
    </>
  );
};

export default ClientLocationsPages;
