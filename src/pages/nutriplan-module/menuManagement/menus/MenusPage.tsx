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
import { IMenusListDto } from "src/types/modules/nutriplan/menuManagement/menus";
import {
  ALL_PUBLISH_STATUS,
  MenuAppliedFilters,
  buildMenuFilterQueryParams,
  createDefaultMenuFilters,
  dateInputSx,
  selectSx,
} from "./menuFilterHelpers";
import { useGetAllMenusQuery } from "./services/api";
import useMenus from "./useMenus";

const MenusPage = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useMenus();
  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    refetch,
    setParameter,
  } = usePaginateData<IMenusListDto>(useGetAllMenusQuery);

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MenuAppliedFilters>(
    createDefaultMenuFilters
  );

  const syncFiltersToQuery = useCallback(
    (filters: MenuAppliedFilters) => {
      const filterParams = buildMenuFilterQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        isPublished: filterParams.isPublished,
        startDateFrom: filterParams.startDateFrom,
        startDateTo: filterParams.startDateTo,
        endDateFrom: filterParams.endDateFrom,
        endDateTo: filterParams.endDateTo,
      }));
    },
    [setParameter]
  );

  const updateFilters = (
    updater: (current: MenuAppliedFilters) => MenuAppliedFilters
  ) => {
    const next = updater(appliedFilters);
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handlePublishStatusChange = (value: string) => {
    updateFilters((current) => ({ ...current, publishStatus: value }));
  };

  const handleStartDateFromChange = (value: string) => {
    updateFilters((current) => ({ ...current, startDateFrom: value }));
  };

  const handleStartDateToChange = (value: string) => {
    updateFilters((current) => ({ ...current, startDateTo: value }));
  };

  const handleEndDateFromChange = (value: string) => {
    updateFilters((current) => ({ ...current, endDateFrom: value }));
  };

  const handleEndDateToChange = (value: string) => {
    updateFilters((current) => ({ ...current, endDateTo: value }));
  };

  const handleClear = () => {
    setAppliedFilters(createDefaultMenuFilters());
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      isPublished: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
    }));
  };

  const advanceFiltersInputs = [
    <Box key="isPublished">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["menus.isPublished"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedFilters.publishStatus}
        onChange={(e) => handlePublishStatusChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_PUBLISH_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="Published" sx={{ fontSize: 13 }}>
          {messages["menus.isPublished"] as string}
        </MenuItem>
        <MenuItem value="Unpublished" sx={{ fontSize: 13 }}>
          {messages["menus.filter.unpublished"] as string}
        </MenuItem>
      </Select>
    </Box>,
    <Box key="startDateFrom">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["menus.filter.startDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.startDateFrom}
        onChange={(e) => handleStartDateFromChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="startDateTo">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["menus.filter.startDateTo"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.startDateTo}
        onChange={(e) => handleStartDateToChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="endDateFrom">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["menus.filter.endDateFrom"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.endDateFrom}
        onChange={(e) => handleEndDateFromChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="endDateTo">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["menus.filter.endDateTo"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.endDateTo}
        onChange={(e) => handleEndDateToChange(e.target.value)}
        sx={dateInputSx}
      />
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
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.menusManagement.title"] },
          ]}
          currentPathName={"sidebar.menus"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="menus.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.menus().pathname}/filter`}
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
                  tableName="menus"
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

export default MenusPage;
