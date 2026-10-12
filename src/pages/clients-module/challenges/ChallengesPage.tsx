/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  CHALLENGE_STATUS_ALL,
} from "src/types/modules/clientsManagement/challenges";
import {
  ChallengeAppliedFilters,
  CHALLENGE_STATUS_OPTIONS,
  createDefaultChallengeFilters,
  selectSx,
} from "./challengeFilterHelpers";
import {
  useGetAllChallengesQuery,
} from "./services/api";
import useChallenges from "./useChallenges";

const ChallengesPage = () => {
  const { messages } = useIntl();
  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ChallengeAppliedFilters>(
    createDefaultChallengeFilters
  );

  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useChallenges();

  const {
    data,
    isLoading,
    isFetching,
    changePage,
    changeLimit,
    setSearchValue,
    setParameter,
    parameter,
    refetch,
  } = usePaginateData(useGetAllChallengesQuery, undefined, {
    status: CHALLENGE_STATUS_ALL,
  });

  const updateFilter = <K extends keyof ChallengeAppliedFilters>(
    key: K,
    value: ChallengeAppliedFilters[K]
  ) => {
    setAppliedFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "status") {
      setParameter((prev) => ({
        ...prev,
        status: value === CHALLENGE_STATUS_ALL ? CHALLENGE_STATUS_ALL : Number(value),
        pageNumber: 1,
      }));
    }
  };

  const handleClearFilters = () => {
    const defaults = createDefaultChallengeFilters();
    setAppliedFilters(defaults);
    setParameter((prev) => ({
      ...prev,
      status: CHALLENGE_STATUS_ALL,
      pageNumber: 1,
    }));
  };

  const rows = useMemo(() => data?.data || [], [data?.data]);

  const advanceFiltersInputs = [
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
        {CHALLENGE_STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            value={String(option.value)}
            sx={{ fontSize: 13 }}>
            {(messages[option.labelKey] as string) || option.fallback}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key='clear' sx={{ ml: "auto" }}>
      <Button
        onClick={handleClearFilters}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}>
        {messages["challenges.filter.clear"] as string}
      </Button>
    </Box>,
  ];

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
          currentPathName='sidebar.challenges'
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='challenges.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl=''
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showMultipleActivation={false}
                  showMultipleDeactivation={false}
                  showMultipleDeletion={false}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={data?.totalCount || rows.length}
                  pageNumber={(parameter.pageNumber as number) || 1}
                  tableName='challenges'
                  onPageSizeChange={(size: number) => {
                    changeLimit(String(size));
                  }}
                  onPageChange={(pageNumber: number) => {
                    changePage(pageNumber);
                  }}
                  pageSize={(parameter.pageSize as number) || 10}
                  columns={columns}
                  rows={rows}
                  loading={isLoading || isFetching}
                  onSelectionModelChange={setSelectionModel}
                  initialState={initialDataGridState}
                  checkboxSelection={false}
                  selectionModel={selectionModel}
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

export default ChallengesPage;
