/** @format */

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button, Card, CardContent, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IMealPlansListDto } from "src/types/modules/nutriplan/mealPlans";
import {
  buildMealPlanExportFilterInputs,
  buildMealPlanListFilterInputs,
} from "./buildMealPlanFilterInputs";
import {
  buildMealPlanListFilterQueryParams,
  createDefaultMealPlanExportFilters,
  createDefaultMealPlanListFilters,
  DatePeriod,
  MealPlanExportFilters,
  MealPlanListFilters,
} from "./mealPlanFilterHelpers";
import {
  useExportMealPlansMutation,
  useGetActiveMealPlansQuery,
  useGetAllMealPlansQuery,
} from "./services/api";
import useMealPlans from "./useMealPlans";

const MealPlansPages = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useMealPlans();
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
    setParameter,
  } = usePaginateData<IMealPlansListDto>(useGetAllMealPlansQuery);

  const { data: activeMealPlansData } = useGetActiveMealPlansQuery();
  const [exportMealPlans, { isLoading: isExporting }] =
    useExportMealPlansMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MealPlanListFilters>(
    createDefaultMealPlanListFilters
  );
  const [exportFilters, setExportFilters] = useState<MealPlanExportFilters>(
    createDefaultMealPlanExportFilters
  );

  const mealPlanOptions = activeMealPlansData?.data ?? [];

  const syncFiltersToQuery = useCallback(
    (filters: MealPlanListFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildMealPlanListFilterQueryParams(filters),
      }));
    },
    [setParameter]
  );

  const handleStatusChange = (value: string) => {
    const next = { ...appliedFilters, status: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleExportDatePeriodChange = (value: DatePeriod) => {
    setExportFilters((current) => ({
      ...current,
      datePeriod: value,
      startDate: value === "custom" ? current.startDate : "",
      endDate: value === "custom" ? current.endDate : "",
    }));
  };

  const handleExportStartDateChange = (value: string) => {
    setExportFilters((current) => ({ ...current, startDate: value }));
  };

  const handleExportEndDateChange = (value: string) => {
    setExportFilters((current) => ({ ...current, endDate: value }));
  };

  const handleExportMealPlanChange = (value: string) => {
    setExportFilters((current) => ({ ...current, mealPlanId: value }));
  };

  const handleExportDietitianGoalChange = (value: string) => {
    setExportFilters((current) => ({ ...current, defaultDietitianGoal: value }));
  };

  const handleClearListFilters = () => {
    const cleared = createDefaultMealPlanListFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const { isActive: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const handleClearExportFilters = () => {
    setExportFilters(createDefaultMealPlanExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportMealPlans(exportFilters).unwrap();
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

  const advanceFiltersInputs = buildMealPlanListFilterInputs({
    filters: appliedFilters,
    messages,
    onStatusChange: handleStatusChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildMealPlanExportFilterInputs({
    filters: exportFilters,
    messages,
    mealPlans: mealPlanOptions,
    onDatePeriodChange: handleExportDatePeriodChange,
    onStartDateChange: handleExportStartDateChange,
    onEndDateChange: handleExportEndDateChange,
    onMealPlanChange: handleExportMealPlanChange,
    onDietitianGoalChange: handleExportDietitianGoalChange,
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
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.setting.title"] },
          ]}
          currentPathName={"sidebar.mealPlans"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="mealPlans.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.mealPlans().pathname}/search`}
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
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="mealPlans"
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
                  checkboxSelection={true}
                  selectionModel={selectionModel}
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
};

export default MealPlansPages;
