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
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { dietitianGoal, gender } from "src/types/enums";
import { useGetAllClientsQuery } from "./services/api";
import useClients from "./useClients";

const ALL_GENDERS = "All Genders";
const ALL_DIETITIAN_GOALS = "All Dietitian Goals";
const ALL_STATUS = "All Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const GENDER_OPTIONS = [
  { value: gender.Male, labelKey: "common.gender.Male" },
  { value: gender.Female, labelKey: "common.gender.Female" },
] as const;

const DIETITIAN_GOAL_OPTIONS = [
  {
    value: dietitianGoal.GeneralHealth,
    labelKey: "clients.dietitianGoal.GeneralHealth",
  },
  {
    value: dietitianGoal.LoseWeight,
    labelKey: "clients.dietitianGoal.LoseWeight",
  },
  {
    value: dietitianGoal.GainWeight,
    labelKey: "clients.dietitianGoal.GainWeight",
  },
  { value: dietitianGoal.LoseFat, labelKey: "clients.dietitianGoal.LoseFat" },
  {
    value: dietitianGoal.BuildMuscles,
    labelKey: "clients.dietitianGoal.BuildMuscles",
  },
] as const;

type AppliedFilters = {
  gender: string;
  dietitianGoal: string;
  status: string;
};

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

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    gender: ALL_GENDERS,
    dietitianGoal: ALL_DIETITIAN_GOALS,
    status: ALL_STATUS,
  });

  const syncFiltersToQuery = useCallback(
    (filters: AppliedFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        gender: filters.gender === ALL_GENDERS ? undefined : filters.gender,
        dietitianGoal:
          filters.dietitianGoal === ALL_DIETITIAN_GOALS
            ? undefined
            : filters.dietitianGoal,
        isActive:
          filters.status === "Active"
            ? true
            : filters.status === "Inactive"
              ? false
              : undefined,
      }));
    },
    [setParameter]
  );

  const handleGenderChange = (value: string) => {
    const next = { ...appliedFilters, gender: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleDietitianGoalChange = (value: string) => {
    const next = { ...appliedFilters, dietitianGoal: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleStatusChange = (value: string) => {
    const next = { ...appliedFilters, status: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      gender: ALL_GENDERS,
      dietitianGoal: ALL_DIETITIAN_GOALS,
      status: ALL_STATUS,
    };
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const { gender: _, dietitianGoal: __, isActive, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="gender">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.gender"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.gender}
        onChange={(e) => handleGenderChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_GENDERS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {GENDER_OPTIONS.map(({ value, labelKey }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {messages[labelKey] as string}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key="dietitianGoal">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["clinets.dietitianGoal"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.dietitianGoal}
        onChange={(e) => handleDietitianGoalChange(e.target.value)}
        sx={{ ...selectSx, minWidth: 180 }}
      >
        <MenuItem value={ALL_DIETITIAN_GOALS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {DIETITIAN_GOAL_OPTIONS.map(({ value, labelKey }) => (
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
        onChange={(e) => handleStatusChange(e.target.value)}
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
                  successUrl={`${endPoints.clients().pathname}/search`}
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
