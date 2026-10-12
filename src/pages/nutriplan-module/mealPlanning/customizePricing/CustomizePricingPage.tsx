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
  ICustomizePricingListDto,
  mapCustomizePricingApiToUi,
} from "src/types/modules/nutriplan/customizePricing";
import { useGetAllCustomizePricingQuery } from "./services/api";
import useCustomizePricing from "./useCustomizePricing";

function CustomizePricingPage() {
  const { messages } = useIntl();
  const { columns, Modals, setShowAddModal } = useCustomizePricing();

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
  } = usePaginateData<ICustomizePricingListDto>(
    useGetAllCustomizePricingQuery
  );

  const rows = useMemo(
    () => (data?.data ?? []).map(mapCustomizePricingApiToUi),
    [data?.data]
  );

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.nutriplanManagement.title"] }]}
          currentPathName='customizePricing.name'
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='customizePricing.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                    changePage(1);
                  }}
                  successUrl={`${endPoints.customizePricingTiers().pathname}/search`}
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
                  tableName='customizePricing'
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
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns
                          ?.columnVisibilityModel,
                        sortOrder: false,
                      },
                    },
                  }}
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

export default CustomizePricingPage;
