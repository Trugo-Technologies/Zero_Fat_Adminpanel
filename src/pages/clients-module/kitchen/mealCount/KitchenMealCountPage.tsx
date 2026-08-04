/** @format */

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button, Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { buildKitchenMealCountExportFilterInputs } from "./buildKitchenMealCountExportFilterInputs";
import { buildKitchenMealCountFilterInputs } from "./buildKitchenMealCountFilterInputs";
import {
  KitchenMealCountAppliedFilters,
  KitchenMealCountExportFilters,
  KitchenMealCountExportPeriod,
  buildKitchenMealCountFilterQueryParams,
  createDefaultKitchenMealCountExportFilters,
  createDefaultKitchenMealCountFilters,
} from "./kitchenMealCountFilterHelpers";
import {
  useExportKitchenMealCountMutation,
  useGetAllKitchenMealCountQuery,
} from "./services/api";
import useKitchenMealCount from "./useKitchenMealCount";

function KitchenMealCountPage() {
  const { messages } = useIntl();
  const { clientIdParams } = useParams();
  const currentDate = moment().format("YYYY-MM-DD");

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
    setParameter,
  } = usePaginateData(
    useGetAllKitchenMealCountQuery,
    {},
    {
      clientId: clientIdParams,
      date: currentDate,
    }
  );
  const { columns, selectionModel, setSelectionModel, Modals } =
    useKitchenMealCount();
  const [exportKitchenMealCount, { isLoading: isExporting }] =
    useExportKitchenMealCountMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<KitchenMealCountAppliedFilters>(() =>
      createDefaultKitchenMealCountFilters(currentDate)
    );
  const [exportFilters, setExportFilters] =
    useState<KitchenMealCountExportFilters>(
      createDefaultKitchenMealCountExportFilters
    );

  const syncFiltersToQuery = useCallback(
    (filters: KitchenMealCountAppliedFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildKitchenMealCountFilterQueryParams(filters, currentDate),
      }));
    },
    [setParameter, currentDate]
  );

  const handleDateChange = (value: string) => {
    const next = { ...appliedFilters, date: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClearListFilters = () => {
    const cleared = createDefaultKitchenMealCountFilters(currentDate);
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      date: currentDate,
    }));
  };

  const handleExportPeriodChange = (value: KitchenMealCountExportPeriod) => {
    setExportFilters((current) => ({
      ...current,
      period: value,
      fromDate: value === "custom" ? current.fromDate : "",
      toDate: value === "custom" ? current.toDate : "",
    }));
  };

  const handleExportFromDateChange = (value: string) => {
    setExportFilters((current) => ({ ...current, fromDate: value }));
  };

  const handleExportToDateChange = (value: string) => {
    setExportFilters((current) => ({ ...current, toDate: value }));
  };

  const handleClearExportFilters = () => {
    setExportFilters(createDefaultKitchenMealCountExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportKitchenMealCount(exportFilters).unwrap();
    } catch {
      // Errors are handled in the mutation.
    }
  };

  const handleToggleExportFilters = () => {
    const next = !isOpenExportFilters;
    setIsOpenExportFilters(next);
    if (next) {
      setIsOpenAdvanceFilters(false);
    }
  };

  const advanceFiltersInputs = buildKitchenMealCountFilterInputs({
    filters: appliedFilters,
    messages,
    onDateChange: handleDateChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildKitchenMealCountExportFilterInputs({
    filters: exportFilters,
    messages,
    onPeriodChange: handleExportPeriodChange,
    onFromDateChange: handleExportFromDateChange,
    onToDateChange: handleExportToDateChange,
    onClear: handleClearExportFilters,
    trailingActions: (
      <Button
        variant="outlined"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleDownloadExport}
        disabled={isExporting}
        sx={{
          height: 36,
          px: 3,
          borderRadius: 2,
          borderColor: "#E2E8F0",
          color: "#0F172A",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { bgcolor: "#F8FAFC" },
        }}
      >
        {isExporting ? "Downloading..." : (messages["common.download"] as string)}
      </Button>
    ),
  });

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebar.kitchen"] },
          ]}
          currentPathName={"sidebar.kitchen.mealCount"}
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
                  successUrl={`${endPoints.kitchenMealCount().pathname}`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={(open: boolean) => {
                    setIsOpenAdvanceFilters(open);
                    if (open) {
                      setIsOpenExportFilters(false);
                    }
                  }}
                  advanceFiltersInputs={advanceFiltersInputs}
                  isOpenExportFilters={isOpenExportFilters}
                  exportFiltersInputs={exportFiltersInputs}
                  showExportFiltersButton
                  onToggleExportFilters={handleToggleExportFilters}
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="mealCount"
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
                  onSelectionModelChange={setSelectionModel}
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        "meal.weightInGrams": false,
                        "meal.calories": false,
                        "meal.fat": false,
                        "meal.carbs": false,
                        "meal.protein": false,
                        "meal.water": false,
                        "meal.priceForCustomer": false,
                        "meals.isAddOn": false,
                        "meal.allergens": false,
                      },
                    },
                  }}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
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

export default KitchenMealCountPage;
