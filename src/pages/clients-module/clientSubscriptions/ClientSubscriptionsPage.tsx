/** @format */

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button, Card, CardContent, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { buildClientSubscriptionExportFilterInputs } from "./buildClientSubscriptionExportFilterInputs";
import { buildClientSubscriptionFilterInputs } from "./buildClientSubscriptionFilterInputs";
import {
  ClientSubscriptionAppliedFilters,
  ClientSubscriptionExportFilters,
  ClientSubscriptionExportPeriod,
  ClientSubscriptionExportType,
  buildClientSubscriptionFilterQueryParams,
  createDefaultClientSubscriptionExportFilters,
  createDefaultClientSubscriptionFilters,
} from "./clientSubscriptionFilterHelpers";
import {
  useExportClientSubscriptionsMutation,
  useGetAllClientSubscriptionsQuery,
} from "./services/api";
import useClientSubscriptions from "./useClientSubscriptions";

function ClientSubscriptionsPage() {
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
    setParameter,
  } = usePaginateData(
    useGetAllClientSubscriptionsQuery,
    {},
    clientIdParams ? { clientId: clientIdParams } : {}
  );

  const { Modals, columns, selectionModel, setSelectionModel } =
    useClientSubscriptions();
  const [exportClientSubscriptions, { isLoading: isExporting }] =
    useExportClientSubscriptionsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ClientSubscriptionAppliedFilters>(
      createDefaultClientSubscriptionFilters
    );
  const [exportFilters, setExportFilters] =
    useState<ClientSubscriptionExportFilters>(
      createDefaultClientSubscriptionExportFilters
    );

  const syncFiltersToQuery = useCallback(
    (filters: ClientSubscriptionAppliedFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildClientSubscriptionFilterQueryParams(filters),
      }));
    },
    [setParameter]
  );

  const updateListFilters = (
    updater: (
      current: ClientSubscriptionAppliedFilters
    ) => ClientSubscriptionAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handlePeriodChange = (value: ClientSubscriptionExportPeriod) => {
    updateListFilters((current) => ({
      ...current,
      period: value,
      fromDate: value === "custom" ? current.fromDate : "",
      toDate: value === "custom" ? current.toDate : "",
    }));
  };

  const handleFromDateChange = (value: string) => {
    updateListFilters((current) => ({ ...current, fromDate: value }));
  };

  const handleToDateChange = (value: string) => {
    updateListFilters((current) => ({ ...current, toDate: value }));
  };

  const handleStartDateFromChange = (value: string) => {
    updateListFilters((current) => ({ ...current, startDateFrom: value }));
  };

  const handleStartDateToChange = (value: string) => {
    updateListFilters((current) => ({ ...current, startDateTo: value }));
  };

  const handleEndDateFromChange = (value: string) => {
    updateListFilters((current) => ({ ...current, endDateFrom: value }));
  };

  const handleEndDateToChange = (value: string) => {
    updateListFilters((current) => ({ ...current, endDateTo: value }));
  };

  const handleSubscriptionTypeChange = (value: string) => {
    updateListFilters((current) => ({ ...current, subscriptionType: value }));
  };

  const handleSubscriptionStatusChange = (value: string) => {
    updateListFilters((current) => ({
      ...current,
      subscriptionStatus: value,
    }));
  };

  const handlePaymentStatusChange = (value: string) => {
    updateListFilters((current) => ({ ...current, paymentStatus: value }));
  };

  const handleClearListFilters = () => {
    const cleared = createDefaultClientSubscriptionFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      period: undefined,
      fromDate: undefined,
      toDate: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
      subscriptionType: undefined,
      subscriptionStatus: undefined,
      paymentStatus: undefined,
    }));
  };

  const handleExportTypeChange = (value: ClientSubscriptionExportType) => {
    setExportFilters((current) => ({ ...current, exportType: value }));
  };

  const handleExportPaymentStatusChange = (value: string) => {
    setExportFilters((current) => ({ ...current, paymentStatus: value }));
  };

  const handleExportSubscriptionStatusChange = (value: string) => {
    setExportFilters((current) => ({
      ...current,
      subscriptionStatus: value,
    }));
  };

  const handleExportPeriodChange = (value: ClientSubscriptionExportPeriod) => {
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
    setExportFilters(createDefaultClientSubscriptionExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportClientSubscriptions(exportFilters).unwrap();
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

  const advanceFiltersInputs = buildClientSubscriptionFilterInputs({
    filters: appliedFilters,
    messages,
    onPeriodChange: handlePeriodChange,
    onFromDateChange: handleFromDateChange,
    onToDateChange: handleToDateChange,
    onStartDateFromChange: handleStartDateFromChange,
    onStartDateToChange: handleStartDateToChange,
    onEndDateFromChange: handleEndDateFromChange,
    onEndDateToChange: handleEndDateToChange,
    onSubscriptionTypeChange: handleSubscriptionTypeChange,
    onSubscriptionStatusChange: handleSubscriptionStatusChange,
    onPaymentStatusChange: handlePaymentStatusChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildClientSubscriptionExportFilterInputs({
    filters: exportFilters,
    messages,
    onExportTypeChange: handleExportTypeChange,
    onPaymentStatusChange: handleExportPaymentStatusChange,
    onSubscriptionStatusChange: handleExportSubscriptionStatusChange,
    onPeriodChange: handleExportPeriodChange,
    onFromDateChange: handleExportFromDateChange,
    onToDateChange: handleExportToDateChange,
    onClear: handleClearExportFilters,
    trailingActions: (
      <Button
        variant="outlined"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleDownloadExport}
        disabled={!exportFilters.exportType || isExporting}
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
            { name: messages["sidebar.clients"] },
          ]}
          currentPathName={"sidebar.clientSubscriptions"}
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
                  successUrl={`${endPoints.clientSubscriptionsEndpoint().pathname}/filter`}
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
                  tableName="clientSubscriptions"
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
                        "clientLocation.type": false,
                        "clientLocation.area": false,
                        "clientLocation.street": false,
                        "clientLocation.building": false,
                        "clientLocation.postalCode": false,
                        "clientLocation.office": false,
                        "clientLocation.fullAddressEn": false,
                        averageCalories: false,
                        selectedMealTypes: false,
                        cancelAt: false,
                        nextRenewalDate: false,
                        paymentDate: false,
                        renewalCount: false,
                        isAutoRenewalEnabled: false,
                        preferredDeliveryTime: false,
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

export default ClientSubscriptionsPage;
