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
import moment from "moment";
import { useMemo, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { IPromoCode } from "src/types/modules/clientsManagement/discounts/promoCodes";
import { MOCK_PROMO_CODES } from "./mockData";
import {
  ALL_DURATIONS,
  ALL_STATUS,
  DURATION_OPTIONS,
  PromoCodeAppliedFilters,
  createDefaultPromoCodeFilters,
  dateInputSx,
  selectSx,
} from "./promoCodeFilterHelpers";
import usePromoCodes from "./usePromoCodes";

function PromoCodesPage() {
  const { messages } = useIntl();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<PromoCodeAppliedFilters>(
    createDefaultPromoCodeFilters
  );

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = usePromoCodes(refresh);

  const updateFilter = <K extends keyof PromoCodeAppliedFilters>(
    key: K,
    value: PromoCodeAppliedFilters[K]
  ) => {
    setAppliedFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClear = () => {
    setAppliedFilters(createDefaultPromoCodeFilters());
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    void refreshKey;
    const keyword = searchValue.trim().toLowerCase();
    return MOCK_PROMO_CODES.filter((row: IPromoCode) => {
      const matchesKeyword =
        !keyword ||
        row.code.toLowerCase().includes(keyword) ||
        (row.descriptionEn || "").toLowerCase().includes(keyword) ||
        (row.descriptionAr || "").toLowerCase().includes(keyword);

      const matchesDuration =
        appliedFilters.duration === ALL_DURATIONS ||
        row.duration === appliedFilters.duration;

      const matchesStatus =
        appliedFilters.status === ALL_STATUS ||
        (appliedFilters.status === "Active" && row.isActive) ||
        (appliedFilters.status === "Inactive" && !row.isActive);

      const matchesStartFrom =
        !appliedFilters.startDateFrom ||
        !moment(row.startDate).isBefore(appliedFilters.startDateFrom, "day");

      const matchesStartTo =
        !appliedFilters.startDateTo ||
        !moment(row.startDate).isAfter(appliedFilters.startDateTo, "day");

      const matchesExpFrom =
        !appliedFilters.expirationDateFrom ||
        (!!row.expirationDate &&
          !moment(row.expirationDate).isBefore(
            appliedFilters.expirationDateFrom,
            "day"
          ));

      const matchesExpTo =
        !appliedFilters.expirationDateTo ||
        (!!row.expirationDate &&
          !moment(row.expirationDate).isAfter(
            appliedFilters.expirationDateTo,
            "day"
          ));

      return (
        matchesKeyword &&
        matchesDuration &&
        matchesStatus &&
        matchesStartFrom &&
        matchesStartTo &&
        matchesExpFrom &&
        matchesExpTo
      );
    });
  }, [searchValue, appliedFilters, refreshKey]);

  const pagedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const advanceFiltersInputs = [
    <Box key='startDateFrom'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["promoCodes.filter.startDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type='date'
        size='small'
        value={appliedFilters.startDateFrom}
        onChange={(e) => updateFilter("startDateFrom", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key='startDateTo'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["promoCodes.filter.startDateTo"] as string}
      </Typography>
      <OutlinedInput
        type='date'
        size='small'
        value={appliedFilters.startDateTo}
        onChange={(e) => updateFilter("startDateTo", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key='expirationDateFrom'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["promoCodes.filter.expirationDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type='date'
        size='small'
        value={appliedFilters.expirationDateFrom}
        onChange={(e) => updateFilter("expirationDateFrom", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key='expirationDateTo'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["promoCodes.filter.expirationDateTo"] as string}
      </Typography>
      <OutlinedInput
        type='date'
        size='small'
        value={appliedFilters.expirationDateTo}
        onChange={(e) => updateFilter("expirationDateTo", e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key='duration'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["promoCodes.duration"] as string}
      </Typography>
      <Select
        size='small'
        value={appliedFilters.duration}
        onChange={(e) => updateFilter("duration", e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}>
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
    <Box key='status'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["common.status"] as string}
      </Typography>
      <Select
        size='small'
        value={appliedFilters.status}
        onChange={(e) => updateFilter("status", e.target.value)}
        sx={selectSx}>
        <MenuItem value={ALL_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value='Active' sx={{ fontSize: 13 }}>
          {messages["columns.active"] as string}
        </MenuItem>
        <MenuItem value='Inactive' sx={{ fontSize: 13 }}>
          {messages["columns.inactive"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key='clear' sx={{ ml: "auto" }}>
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
        }}>
        {(messages["common.clear"] as string) || "Clear filters"}
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
          currentPathName='promoCodes.name'
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='promoCodes.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                    setPage(0);
                  }}
                  successUrl=''
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refresh}
                  showMultipleActivation={false}
                  showMultipleDeactivation={false}
                  showMultipleDeletion={false}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={filteredRows.length}
                  pageNumber={page + 1}
                  tableName='promoCodes'
                  onPageSizeChange={(size: number) => {
                    setPageSize(size);
                    setPage(0);
                  }}
                  onPageChange={(pageNumber: number) => {
                    setPage(pageNumber);
                  }}
                  pageSize={pageSize}
                  columns={columns}
                  rows={pagedRows}
                  loading={false}
                  onSelectionModelChange={setSelectionModel}
                  checkboxSelection={false}
                  selectionModel={selectionModel}
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        maxRedemptions: false,
                        redemptionsUsed: false,
                        maxRedemptionsPerClient: false,
                        durationInMonths: false,
                        firstTimeClientsOnly: false,
                        createdByName: false,
                        lastModifiedByName: false,
                        createdOn: false,
                        lastModifiedOn: false,
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

export default PromoCodesPage;
