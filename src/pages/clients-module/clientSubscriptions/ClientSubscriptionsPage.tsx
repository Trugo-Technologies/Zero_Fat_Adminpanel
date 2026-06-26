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
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllMealPlansQuery } from "src/pages/nutriplan-module/mealPlans/services/api";
import { endPoints } from "src/shared/end-points";
import {
  paymentStatus,
  subscriptionStatus,
  subscriptionType,
} from "src/types/enums";
import {
  IMealPlans,
  IMealPlansListDto,
} from "src/types/modules/nutriplan/mealPlans";
import { useGetAllClientSubscriptionsQuery } from "./services/api";
import useClientSubscriptions from "./useClientSubscriptions";

const ALL_SUBSCRIPTION_TYPES = "All Subscription Types";
const ALL_SUBSCRIPTION_STATUS = "All Subscription Status";
const ALL_PAYMENT_STATUS = "All Payment Status";

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

const SUBSCRIPTION_TYPE_OPTIONS = [
  {
    value: subscriptionType.OneWeek,
    labelKey: "subscriptionPlans.subscriptionType.OneWeek",
  },
  {
    value: subscriptionType.OneMonth,
    labelKey: "subscriptionPlans.subscriptionType.OneMonth",
  },
  {
    value: subscriptionType.ThreeMonths,
    labelKey: "subscriptionPlans.subscriptionType.ThreeMonths",
  },
] as const;

const SUBSCRIPTION_STATUS_OPTIONS = [
  {
    value: subscriptionStatus.Active,
    labelKey: "clients.subscriptionStatus.Active",
  },
  {
    value: subscriptionStatus.Pending,
    labelKey: "clients.subscriptionStatus.Pending",
  },
  {
    value: subscriptionStatus.Cancelled,
    labelKey: "clients.subscriptionStatus.Cancelled",
  },
  {
    value: subscriptionStatus.Expired,
    labelKey: "clients.subscriptionStatus.Expired",
  },
] as const;

const PAYMENT_STATUS_OPTIONS = [
  { value: paymentStatus.Pending, labelKey: "payments.paymentStatus.Pending" },
  { value: paymentStatus.Paid, labelKey: "payments.paymentStatus.Paid" },
  { value: paymentStatus.Failed, labelKey: "payments.paymentStatus.Failed" },
  { value: paymentStatus.Refunded, labelKey: "payments.paymentStatus.Refunded" },
  {
    value: paymentStatus.Cancelled,
    labelKey: "payments.paymentStatus.Cancelled",
  },
  {
    value: paymentStatus.PartiallyPaid,
    labelKey: "payments.paymentStatus.PartiallyPaid",
  },
] as const;

type AppliedFilters = {
  startDate: string;
  endDate: string;
  subscriptionType: string;
  subscriptionStatus: string;
  paymentStatus: string;
};

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

  const {
    changePage: changeMealPlanPage,
    data: mealPlansData,
    isFetching: isFetchingMealPlans,
    page: mealPlanPage,
    setSearchValue: setMealPlanSearchValue,
    refetch: refetchMealPlans,
  } = usePaginateData<IMealPlansListDto>(useGetAllMealPlansQuery);

  const { Modals, columns, selectionModel, setSelectionModel } =
    useClientSubscriptions();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<IMealPlans | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    startDate: "",
    endDate: "",
    subscriptionType: ALL_SUBSCRIPTION_TYPES,
    subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
    paymentStatus: ALL_PAYMENT_STATUS,
  });

  useEffect(() => {
    if (mealPlanPage && mealPlanPage > 1) refetchMealPlans();
  }, [mealPlanPage, refetchMealPlans]);

  const syncFiltersToQuery = useCallback(
    (filters: AppliedFilters, mealPlanId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        mealPlanId: mealPlanId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        subscriptionType:
          filters.subscriptionType === ALL_SUBSCRIPTION_TYPES
            ? undefined
            : filters.subscriptionType,
        subscriptionStatus:
          filters.subscriptionStatus === ALL_SUBSCRIPTION_STATUS
            ? undefined
            : filters.subscriptionStatus,
        paymentStatus:
          filters.paymentStatus === ALL_PAYMENT_STATUS
            ? undefined
            : filters.paymentStatus,
      }));
    },
    [setParameter]
  );

  const handleMealPlanChange = (_event: unknown, value: IMealPlans | null) => {
    setSelectedMealPlan(value);
    syncFiltersToQuery(appliedFilters, value?.id ?? null);
  };

  const handleStartDateChange = (value: string) => {
    const next = { ...appliedFilters, startDate: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedMealPlan?.id);
  };

  const handleEndDateChange = (value: string) => {
    const next = { ...appliedFilters, endDate: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedMealPlan?.id);
  };

  const handleSubscriptionTypeChange = (value: string) => {
    const next = { ...appliedFilters, subscriptionType: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedMealPlan?.id);
  };

  const handleSubscriptionStatusChange = (value: string) => {
    const next = { ...appliedFilters, subscriptionStatus: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedMealPlan?.id);
  };

  const handlePaymentStatusChange = (value: string) => {
    const next = { ...appliedFilters, paymentStatus: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next, selectedMealPlan?.id);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      startDate: "",
      endDate: "",
      subscriptionType: ALL_SUBSCRIPTION_TYPES,
      subscriptionStatus: ALL_SUBSCRIPTION_STATUS,
      paymentStatus: ALL_PAYMENT_STATUS,
    };
    setAppliedFilters(cleared);
    setSelectedMealPlan(null);
    setMealPlanSearchValue("");
    setParameter((prev) => {
      const {
        mealPlanId,
        startDate,
        endDate,
        subscriptionType: subType,
        subscriptionStatus: subStatus,
        paymentStatus: payStatus,
        ...rest
      } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="mealPlan" sx={{ minWidth: 220 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["mealPlans.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        label="mealPlans.name"
        isLoading={isFetchingMealPlans}
        options={mealPlansData?.data}
        hasNextPage={mealPlansData?.hasNextPage}
        pageNumber={mealPlanPage}
        changePage={changeMealPlanPage}
        value={selectedMealPlan}
        onChangeAutoComplete={handleMealPlanChange}
        onChangeTextField={(event) =>
          setMealPlanSearchValue(event.target.value)
        }
      />
    </Box>,
    <Box key="startDate">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.startDate"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.startDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="endDate">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.endDate"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.endDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="subscriptionType">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["subscriptionPlans.subscriptionType"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.subscriptionType}
        onChange={(e) => handleSubscriptionTypeChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 170 }}
      >
        <MenuItem value={ALL_SUBSCRIPTION_TYPES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {SUBSCRIPTION_TYPE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="subscriptionStatus">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clients.subscriptionStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.subscriptionStatus}
        onChange={(e) => handleSubscriptionStatusChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 170 }}
      >
        <MenuItem value={ALL_SUBSCRIPTION_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {SUBSCRIPTION_STATUS_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="paymentStatus">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["payments.paymentStatus"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.paymentStatus}
        onChange={(e) => handlePaymentStatusChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 170 }}
      >
        <MenuItem value={ALL_PAYMENT_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {PAYMENT_STATUS_OPTIONS.map(({ value, labelKey }) => (
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
  ];

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
                  successUrl={`${endPoints.clientSubscriptionsEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
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
