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
import { buildPaymentFilterInputs } from "./buildPaymentFilterInputs";
import { buildPaymentExportFilterInputs } from "./buildPaymentExportFilterInputs";
import {
  buildPaymentFilterQueryParams,
  createDefaultPaymentExportFilters,
  createDefaultPaymentFilters,
  PaymentAppliedFilters,
  PaymentExportFilters,
  PaymentExportPeriod,
} from "./paymentFilterHelpers";
import {
  useExportPaymentsMutation,
  useGetAllPaymentsQuery,
} from "./services/api";
import usePayments from "./usePayments";

function PaymentsPage() {
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
    useGetAllPaymentsQuery,
    {},
    clientIdParams ? { clientId: clientIdParams } : {}
  );

  const { Modals, columns, selectionModel, setSelectionModel } = usePayments();
  const [exportPayments, { isLoading: isExporting }] =
    useExportPaymentsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<PaymentAppliedFilters>(
    createDefaultPaymentFilters
  );
  const [exportFilters, setExportFilters] = useState<PaymentExportFilters>(
    createDefaultPaymentExportFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: PaymentAppliedFilters) => {
      const filterParams = buildPaymentFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        paymentGateway: filterParams.paymentGateway,
        paymentMethod: filterParams.paymentMethod,
        paymentStatus: filterParams.paymentStatus,
        period: filterParams.period,
        fromDate: filterParams.fromDate,
        toDate: filterParams.toDate,
        amountMin: filterParams.amountMin,
        amountMax: filterParams.amountMax,
      }));
    },
    [setParameter]
  );

  const updateListFilters = (
    updater: (current: PaymentAppliedFilters) => PaymentAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handlePaymentGatewayChange = (value: string) => {
    updateListFilters((current) => ({ ...current, paymentGateway: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    updateListFilters((current) => ({ ...current, paymentMethod: value }));
  };

  const handlePaymentStatusChange = (value: string) => {
    updateListFilters((current) => ({ ...current, paymentStatus: value }));
  };

  const handleListPeriodChange = (value: PaymentExportPeriod) => {
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

  const handleListAmountMinChange = (value: string) => {
    updateListFilters((current) => ({ ...current, amountMin: value }));
  };

  const handleListAmountMaxChange = (value: string) => {
    updateListFilters((current) => ({ ...current, amountMax: value }));
  };

  const handleExportPaymentGatewayChange = (value: string) => {
    setExportFilters((current) => ({ ...current, paymentGateway: value }));
  };

  const handleExportPaymentMethodChange = (value: string) => {
    setExportFilters((current) => ({ ...current, paymentMethod: value }));
  };

  const handleExportPaymentStatusChange = (value: string) => {
    setExportFilters((current) => ({ ...current, paymentStatus: value }));
  };

  const handleExportPeriodChange = (value: PaymentExportPeriod) => {
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

  const handleExportMinAmountChange = (value: string) => {
    setExportFilters((current) => ({ ...current, minAmount: value }));
  };

  const handleExportMaxAmountChange = (value: string) => {
    setExportFilters((current) => ({ ...current, maxAmount: value }));
  };

  const handleExportIsDiscountAppliedChange = (value: string) => {
    setExportFilters((current) => ({ ...current, isDiscountApplied: value }));
  };

  const handleClearListFilters = () => {
    const cleared = createDefaultPaymentFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      paymentGateway: undefined,
      paymentMethod: undefined,
      paymentStatus: undefined,
      period: undefined,
      fromDate: undefined,
      toDate: undefined,
      amountMin: undefined,
      amountMax: undefined,
    }));
  };

  const handleClearExportFilters = () => {
    setExportFilters(createDefaultPaymentExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportPayments({
        ...exportFilters,
        ...(clientIdParams ? { clientId: clientIdParams } : {}),
      }).unwrap();
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

  const advanceFiltersInputs = buildPaymentFilterInputs({
    filters: appliedFilters,
    messages,
    onPaymentGatewayChange: handlePaymentGatewayChange,
    onPaymentMethodChange: handlePaymentMethodChange,
    onPaymentStatusChange: handlePaymentStatusChange,
    onPeriodChange: handleListPeriodChange,
    onFromDateChange: handleListFromDateChange,
    onToDateChange: handleListToDateChange,
    onAmountMinChange: handleListAmountMinChange,
    onAmountMaxChange: handleListAmountMaxChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildPaymentExportFilterInputs({
    filters: exportFilters,
    messages,
    onPaymentStatusChange: handleExportPaymentStatusChange,
    onPeriodChange: handleExportPeriodChange,
    onFromDateChange: handleExportFromDateChange,
    onToDateChange: handleExportToDateChange,
    onMinAmountChange: handleExportMinAmountChange,
    onMaxAmountChange: handleExportMaxAmountChange,
    onIsDiscountAppliedChange: handleExportIsDiscountAppliedChange,
    onPaymentGatewayChange: handleExportPaymentGatewayChange,
    onPaymentMethodChange: handleExportPaymentMethodChange,
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
            { name: messages["sidebar.clients"] },
          ]}
          currentPathName={"sidebar.payments"}
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
                  successUrl={`${endPoints.paymentsEndpoint().pathname}/filter`}
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
                  tableName="payments"
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
                  initialState={initialDataGridState}
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

export default PaymentsPage;
