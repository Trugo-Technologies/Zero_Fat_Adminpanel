/** @format */

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button, Card, CardContent, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { buildClientsFilterInputs } from "./buildClientsFilterInputs";
import { buildClientsExportFilterInputs } from "./buildClientsExportFilterInputs";
import {
  buildClientFilterQueryParams,
  ClientAppliedFilters,
  ClientExportFilters,
  ClientExportPeriod,
  createDefaultClientFilters,
  createDefaultClientExportFilters,
} from "./clientFilterHelpers";
import { useExportClientsMutation, useGetAllClientsQuery } from "./services/api";
import useClients from "./useClients";

function ClientsPage() {
  const { messages } = useIntl();
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
  } = usePaginateData(useGetAllClientsQuery);

  const { Modals, columns, selectionModel, setSelectionModel } = useClients();
  const [exportClients, { isLoading: isExporting }] = useExportClientsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ClientAppliedFilters>(
    createDefaultClientFilters
  );
  const [exportFilters, setExportFilters] = useState<ClientExportFilters>(
    createDefaultClientExportFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: ClientAppliedFilters) => {
      const filterParams = buildClientFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        gender: filterParams.gender,
        dietitianGoal: filterParams.dietitianGoal,
        isActive: filterParams.isActive,
        subscriptionStatus: filterParams.subscriptionStatus,
        period: filterParams.period,
        fromDate: filterParams.fromDate,
        toDate: filterParams.toDate,
      }));
    },
    [setParameter]
  );

  const updateListFilters = (
    updater: (current: ClientAppliedFilters) => ClientAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleListGenderChange = (value: string) => {
    updateListFilters((current) => ({ ...current, gender: value }));
  };

  const handleListDietitianGoalChange = (value: string) => {
    updateListFilters((current) => ({ ...current, dietitianGoal: value }));
  };

  const handleListStatusChange = (value: string) => {
    updateListFilters((current) => ({ ...current, status: value }));
  };

  const handleListSubscriptionStatusChange = (value: string) => {
    updateListFilters((current) => ({ ...current, subscriptionStatus: value }));
  };

  const handleListPeriodChange = (value: ClientExportPeriod) => {
    updateListFilters((current) => ({
      ...current,
      period: value,
      fromDate: value === "custom" ? current.fromDate : "",
      toDate: value === "custom" ? current.toDate : "",
    }));
  };

  const handleListFromDateChange = (value: string) => {
    updateListFilters((current) => ({ ...current, fromDate: value }));
  };

  const handleListToDateChange = (value: string) => {
    updateListFilters((current) => ({ ...current, toDate: value }));
  };

  const handleExportGenderChange = (value: string) => {
    setExportFilters((current) => ({ ...current, gender: value }));
  };

  const handleExportDietitianGoalChange = (value: string) => {
    setExportFilters((current) => ({ ...current, dietitianGoal: value }));
  };

  const handleExportIsActiveChange = (value: string) => {
    setExportFilters((current) => ({ ...current, isActive: value }));
  };

  const handleExportSubscriptionStatusChange = (value: string) => {
    setExportFilters((current) => ({ ...current, subscriptionStatus: value }));
  };

  const handleExportPeriodChange = (value: ClientExportPeriod) => {
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

  const handleClearListFilters = () => {
    const cleared = createDefaultClientFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      gender: undefined,
      dietitianGoal: undefined,
      isActive: undefined,
      subscriptionStatus: undefined,
      period: undefined,
      fromDate: undefined,
      toDate: undefined,
    }));
  };

  const handleClearExportFilters = () => {
    setExportFilters(createDefaultClientExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportClients(exportFilters).unwrap();
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

  const advanceFiltersInputs = buildClientsFilterInputs({
    filters: appliedFilters,
    messages,
    onGenderChange: handleListGenderChange,
    onDietitianGoalChange: handleListDietitianGoalChange,
    onStatusChange: handleListStatusChange,
    onSubscriptionStatusChange: handleListSubscriptionStatusChange,
    onPeriodChange: handleListPeriodChange,
    onFromDateChange: handleListFromDateChange,
    onToDateChange: handleListToDateChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildClientsExportFilterInputs({
    filters: exportFilters,
    messages,
    onIsActiveChange: handleExportIsActiveChange,
    onGenderChange: handleExportGenderChange,
    onSubscriptionStatusChange: handleExportSubscriptionStatusChange,
    onDietitianGoalChange: handleExportDietitianGoalChange,
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
          paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
          currentPathName={"sidebar.clients"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="clients.add"
                  showAddButton={false}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.clients().pathname}/filter`}
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
                  tableName="clients"
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
                        bodyFat: false,
                        tdee: false,
                        timeToReachGoalInDays: false,
                        neededCaloriesToReachGoal: false,
                        bmr: false,
                        bmi: false,
                        activityValue: false,
                        targetWeightInKG: false,
                        weightInKG: false,
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

export default ClientsPage;
