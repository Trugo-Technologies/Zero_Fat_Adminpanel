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
import { useCallback, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import {
  ALL_DURATIONS,
  ALL_OFFER_TYPES,
  ALL_STATUS,
  DURATION_OPTIONS,
  DiscountRuleAppliedFilters,
  OFFER_TYPE_OPTIONS,
  buildDiscountRuleFilterQueryParams,
  createDefaultDiscountRuleFilters,
  dateInputSx,
  selectSx,
} from "./discountRuleFilterHelpers";
import {
  useActiveAllDiscountRulesMutation,
  useDeleteAllDiscountRulesMutation,
  useGetAllDiscountRulesQuery,
} from "./services/api";
import useDiscountRules from "./useDiscountRules";

function DiscountRulesPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    refetch,
    sortBy,
    totalRecords,
    setSearchValue,
    page,
    limit,
    isFetching,
    setParameter,
  } = usePaginateData(useGetAllDiscountRulesQuery);
  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useDiscountRules();

  const [deleteAllQuery, { isLoading: deleteAllLoading }] =
    useDeleteAllDiscountRulesMutation();

  const [activeAllQuery, { isLoading: activeAllLoading }] =
    useActiveAllDiscountRulesMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<DiscountRuleAppliedFilters>(
    createDefaultDiscountRuleFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: DiscountRuleAppliedFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildDiscountRuleFilterQueryParams(filters),
      }));
    },
    [setParameter]
  );

  const updateFilter = <K extends keyof DiscountRuleAppliedFilters>(
    key: K,
    value: DiscountRuleAppliedFilters[K]
  ) => {
    const next = { ...appliedFilters, [key]: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClear = () => {
    const cleared = createDefaultDiscountRuleFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const {
        startDateFrom,
        startDateTo,
        expirationDateFrom,
        expirationDateTo,
        duration,
        offerType,
        isActive,
        startDate,
        endDate,
        ...rest
      } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="startDateFrom">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.filter.startDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.startDateFrom}
        onChange={(e) => updateFilter("startDateFrom", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="startDateTo">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.filter.startDateTo"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.startDateTo}
        onChange={(e) => updateFilter("startDateTo", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="expirationDateFrom">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.filter.expirationDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.expirationDateFrom}
        onChange={(e) => updateFilter("expirationDateFrom", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="expirationDateTo">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.filter.expirationDateTo"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.expirationDateTo}
        onChange={(e) => updateFilter("expirationDateTo", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="duration">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.duration"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.duration}
        onChange={(e) => updateFilter("duration", e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}
      >
        <MenuItem value={ALL_DURATIONS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DURATION_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="offerType">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["discountRules.offerType"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.offerType}
        onChange={(e) => updateFilter("offerType", e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}
      >
        <MenuItem value={ALL_OFFER_TYPES} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {OFFER_TYPE_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="status">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.status"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.status}
        onChange={(e) => updateFilter("status", e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="Active" sx={{ fontSize: 13 }}>
          {messages["columns.active"] as string}
        </MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
          {messages["columns.inactive"] as string}
        </MenuItem>
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
            { name: messages["sidebar.discounts"] },
          ]}
          currentPathName={"discountRules.name"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="discountRules.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.discountRules().pathname}/filter`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  deleteAllQuery={deleteAllQuery}
                  deleteAllQueryLoading={deleteAllLoading}
                  activeAllQuery={activeAllQuery}
                  activeAllQueryLoading={activeAllLoading}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="discountRules"
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
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        maxRedemptions: false,
                        redemptionsUsed: false,
                        maxRedemptionsPerClient: false,
                      },
                    },
                  }}
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result ?? []);
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

export default DiscountRulesPage;
