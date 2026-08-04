/** @format */

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button, Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IClient, IClientsListDto } from "src/types/modules/clientsManagement/clients";
import { useGetAllClientsQuery } from "../../clients/services/api";
import { buildKitchenOrderedMealExportFilterInputs } from "./buildKitchenOrderedMealExportFilterInputs";
import { buildKitchenOrderedMealFilterInputs } from "./buildKitchenOrderedMealFilterInputs";
import {
  KitchenOrderedMealAppliedFilters,
  KitchenOrderedMealExportFilters,
  KitchenOrderedMealExportPeriod,
  buildKitchenOrderedMealFilterQueryParams,
  createDefaultKitchenOrderedMealExportFilters,
  createDefaultKitchenOrderedMealFilters,
} from "./kitchenOrderedMealFilterHelpers";
import {
  useExportKitchenOrderedMealMutation,
  useGetAllKitchenOrderedMealQuery,
} from "./services/api";
import useKitchenOrderedMeal from "./useKitchenOrderedMeal";

function KitchenOrderedMealPage() {
  const { messages, locale } = useIntl();
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
    useGetAllKitchenOrderedMealQuery,
    {},
    {
      clientId: clientIdParams,
      date: currentDate,
    }
  );
  const { columns, selectionModel, setSelectionModel } =
    useKitchenOrderedMeal();
  const [exportKitchenOrderedMeal, { isLoading: isExporting }] =
    useExportKitchenOrderedMealMutation();

  const {
    changePage: changePageClients,
    data: clientsList,
    isFetching: isFetchingClients,
    page: pageClients,
    setSearchValue: setSearchValueClients,
    searchValue: searchValueClients,
    refetch: refetchClients,
  } = usePaginateData<IClientsListDto>(useGetAllClientsQuery, {
    skip: Boolean(clientIdParams),
  });

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [isOpenExportFilters, setIsOpenExportFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<KitchenOrderedMealAppliedFilters>(() =>
      createDefaultKitchenOrderedMealFilters(currentDate)
    );
  const [exportFilters, setExportFilters] =
    useState<KitchenOrderedMealExportFilters>(
      createDefaultKitchenOrderedMealExportFilters
    );
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  useEffect(() => {
    if (pageClients && pageClients > 1) refetchClients();
  }, [pageClients, refetchClients]);

  const syncFiltersToQuery = useCallback(
    (filters: KitchenOrderedMealAppliedFilters, clientId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildKitchenOrderedMealFilterQueryParams(
          filters,
          currentDate,
          clientIdParams ?? clientId
        ),
      }));
    },
    [setParameter, clientIdParams, currentDate]
  );

  const handleDateChange = (value: string) => {
    const next = { ...appliedFilters, date: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedClient?.id ?? null);
  };

  const handleClientChange = (_event: unknown, value: IClient | null) => {
    setSelectedClient(value);
    syncFiltersToQuery(appliedFilters, value?.id ?? null);
  };

  const handleClientSearchChange = (value: string) => {
    setSearchValueClients(value);
    changePageClients(1);
  };

  const handleClearListFilters = () => {
    const cleared = createDefaultKitchenOrderedMealFilters(currentDate);
    setAppliedFilters(cleared);
    if (!clientIdParams) {
      setSelectedClient(null);
      setSearchValueClients("");
    }
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      date: currentDate,
      clientId: clientIdParams ?? null,
    }));
  };

  const handleExportPeriodChange = (value: KitchenOrderedMealExportPeriod) => {
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

  const handleExportStatusChange = (value: string) => {
    setExportFilters((current) => ({ ...current, status: value }));
  };

  const handleClearExportFilters = () => {
    setExportFilters(createDefaultKitchenOrderedMealExportFilters());
  };

  const handleDownloadExport = async () => {
    try {
      await exportKitchenOrderedMeal(exportFilters).unwrap();
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

  const advanceFiltersInputs = buildKitchenOrderedMealFilterInputs({
    filters: appliedFilters,
    messages,
    locale,
    showClientFilter: !clientIdParams,
    selectedClient,
    clientsList,
    isFetchingClients,
    pageClients,
    searchValueClients: searchValueClients ?? "",
    changePageClients,
    onDateChange: handleDateChange,
    onClientChange: handleClientChange,
    onClientSearchChange: handleClientSearchChange,
    onClear: handleClearListFilters,
  });

  const exportFiltersInputs = buildKitchenOrderedMealExportFilterInputs({
    filters: exportFilters,
    messages,
    onPeriodChange: handleExportPeriodChange,
    onFromDateChange: handleExportFromDateChange,
    onToDateChange: handleExportToDateChange,
    onStatusChange: handleExportStatusChange,
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
          currentPathName={"sidebar.kitchen.orderedMeal"}
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
                  successUrl={`${endPoints.kitchenOrderedMeal().pathname}`}
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
                        "client.fullNameEn": clientIdParams ? false : true,
                        "client.fullNameAr": clientIdParams ? false : true,
                        "clientLocation.type": false,
                        "clientLocation.area": false,
                        "clientLocation.street": false,
                        "clientLocation.building": false,
                        "clientLocation.postalCode": false,
                        "clientLocation.office": false,
                        "clientLocation.fullAddressEn": false,
                        notes: false,
                        specialInstructions: false,
                        totalCalories: false,
                        totalFats: false,
                        totalCarbohydrates: false,
                        totalProteins: false,
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
    </>
  );
}

export default KitchenOrderedMealPage;
