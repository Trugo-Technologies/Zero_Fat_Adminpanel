/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import ExportExcelButton from "src/Components/baseComponents/exportExcelButton";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import exportToExcel from "src/Helpers/export-to-excel";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { dailySelectionsStatus, preferredMealTime } from "src/types/enums";
import { IClient, IClientsListDto } from "src/types/modules/clientsManagement/clients";
import { useGetAllClientsQuery } from "../clients/services/api";
import { useGetAllDailySelectionsQuery } from "./services/api";
import useDailySelections from "./useDailySelections";

const ALL_DELIVERY_TIMES = "All Delivery Times";
const ALL_DAILY_SELECTION_STATUS = "All Daily Selection Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const DELIVERY_TIME_OPTIONS = [
  {
    value: preferredMealTime.EarlyMorning,
    labelKey: "payments.preferredMealTime.EarlyMorning",
  },
  { value: preferredMealTime.Morning, labelKey: "payments.preferredMealTime.Morning" },
  { value: preferredMealTime.Evening, labelKey: "payments.preferredMealTime.Evening" },
] as const;

const DAILY_SELECTION_STATUS_OPTIONS = [
  {
    value: dailySelectionsStatus.Pending,
    labelKey: "dailySelections.dailySelectionStatus.Pending",
  },
  {
    value: dailySelectionsStatus.Initialized,
    labelKey: "dailySelections.dailySelectionStatus.Initialized",
  },
  {
    value: dailySelectionsStatus.Confirmed,
    labelKey: "dailySelections.dailySelectionStatus.Confirmed",
  },
  {
    value: dailySelectionsStatus.Preparing,
    labelKey: "dailySelections.dailySelectionStatus.Preparing",
  },
  {
    value: dailySelectionsStatus.OutForDelivery,
    labelKey: "dailySelections.dailySelectionStatus.OutForDelivery",
  },
  {
    value: dailySelectionsStatus.Delivered,
    labelKey: "dailySelections.dailySelectionStatus.Delivered",
  },
  {
    value: dailySelectionsStatus.Missed,
    labelKey: "dailySelections.dailySelectionStatus.Missed",
  },
  {
    value: dailySelectionsStatus.Paused,
    labelKey: "dailySelections.dailySelectionStatus.Paused",
  },
  {
    value: dailySelectionsStatus.Cancelled,
    labelKey: "dailySelections.dailySelectionStatus.Cancelled",
  },
] as const;

type AppliedFilters = {
  date: string;
  deliveryTime: string;
  dailySelectionStatus: string;
};

function DailySelectionsPage({ clientName }: { clientName?: string }) {
  const { messages, locale } = useIntl();
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
    useGetAllDailySelectionsQuery,
    {},
    { clientId: clientIdParams, date: null }
  );
  const { columns, selectionModel, setSelectionModel, Modals } =
    useDailySelections();

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
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    date: "",
    deliveryTime: ALL_DELIVERY_TIMES,
    dailySelectionStatus: ALL_DAILY_SELECTION_STATUS,
  });

  useEffect(() => {
    if (pageClients && pageClients > 1) refetchClients();
  }, [pageClients, refetchClients]);

  const syncFiltersToQuery = useCallback(
    (filters: AppliedFilters, clientId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        date: filters.date || null,
        clientId: clientIdParams ?? clientId ?? null,
        deliveryTime:
          filters.deliveryTime === ALL_DELIVERY_TIMES
            ? undefined
            : filters.deliveryTime,
        dailySelectionStatus:
          filters.dailySelectionStatus === ALL_DAILY_SELECTION_STATUS
            ? undefined
            : filters.dailySelectionStatus,
      }));
    },
    [setParameter, clientIdParams]
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

  const handleDeliveryTimeChange = (value: string) => {
    const next = { ...appliedFilters, deliveryTime: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedClient?.id ?? null);
  };

  const handleDailySelectionStatusChange = (value: string) => {
    const next = { ...appliedFilters, dailySelectionStatus: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedClient?.id ?? null);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      date: "",
      deliveryTime: ALL_DELIVERY_TIMES,
      dailySelectionStatus: ALL_DAILY_SELECTION_STATUS,
    };
    setAppliedFilters(cleared);
    if (!clientIdParams) {
      setSelectedClient(null);
      setSearchValueClients("");
    }
    setParameter((prev) => {
      const {
        deliveryTime,
        dailySelectionStatus,
        date,
        ...rest
      } = prev;
      return {
        ...rest,
        pageNumber: 1,
        date: null,
        clientId: clientIdParams ?? null,
      };
    });
  };

  const handleExport = () => {
    const getNestedValue = (obj: Record<string, unknown>, path: string) =>
      path.split(".").reduce<any>((acc, key) => acc?.[key], obj);

    const exportedRows = data?.data?.map((row) => {
      const newRow: Record<string, unknown> = {};
      for (const col of columns) {
        if (col.field === "actions") continue;
        const field = col.field as string;
        const value = getNestedValue(row, field);
        if (field === "client.fullName" && !value) {
          newRow[col.headerName || field] = getNestedValue(row, "client.mobile");
        } else {
          newRow[col.headerName || field] = value;
        }
      }
      return newRow;
    });

    exportToExcel(
      exportedRows ?? [],
      clientName
        ? `${messages["sidebar.dailySelections"]} - ${clientName}`
        : (messages["sidebar.dailySelections"] as string)
    );
  };

  const advanceFiltersInputs = [
    <Box key="date">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["dailySelections.date"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.date}
        onChange={(e) => handleDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    !clientIdParams ? (
      <Box key="client" sx={{ minWidth: 220 }}>
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
        >
          {messages["sidebar.clients"] as string}
        </Typography>
        <AppBaseAutoComplete
          label="sidebar.clients"
          isLoading={isFetchingClients}
          options={clientsList?.data}
          hasNextPage={clientsList?.hasNextPage}
          getOptionLabel={(option) =>
            locale === "ar-SA"
              ? (option?.fullNameAr ?? option?.mobile)
              : (option?.fullNameEn ?? option?.mobile)
          }
          filterKey={locale === "ar-SA" ? "fullNameAr" : "fullNameEn"}
          anotherFilterKey="mobile"
          pageNumber={pageClients}
          changePage={changePageClients}
          value={selectedClient}
          onChangeAutoComplete={handleClientChange}
          searchText={searchValueClients}
          onChangeTextField={(event) => {
            setSearchValueClients(event.target.value);
            changePageClients(1);
          }}
        />
      </Box>
    ) : null,
    <Box key="deliveryTime">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["dailySelections.deliveryTime"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.deliveryTime}
        onChange={(e) => handleDeliveryTimeChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 170 }}
      >
        <MenuItem value={ALL_DELIVERY_TIMES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DELIVERY_TIME_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="dailySelectionStatus">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["dailySelections.dailySelectionStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.dailySelectionStatus}
        onChange={(e) => handleDailySelectionStatusChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DAILY_SELECTION_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DAILY_SELECTION_STATUS_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button
        onClick={handleClear}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}
      >
        Clear filters
      </Button>
    </Box>,
  ].filter(Boolean);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebare.clientSlelections"] },
          ]}
          currentPathName={"sidebar.dailySelections"}
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
                  successUrl={`${endPoints.dailySelections().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                  toolbarActions={
                    <ExportExcelButton
                      disabled={!data?.data?.length}
                      onClick={handleExport}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="dailySelections"
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
      {Modals}
    </>
  );
}

export default DailySelectionsPage;
