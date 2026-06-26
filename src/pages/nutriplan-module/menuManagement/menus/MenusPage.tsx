/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  OutlinedInput,
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
import { useGetAllMenusQuery } from "./services/api";
import useMenus from "./useMenus";

const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

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
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const syncDateRangeToQuery = useCallback(
    (fromDate: string, toDate: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
      }));
    },
    [setParameter]
  );

  const handleFromDateChange = (value: string) => {
    const next = { ...appliedFilters, fromDate: value };
    setAppliedFilters(next);
    syncDateRangeToQuery(next.fromDate, next.toDate);
  };

  const handleToDateChange = (value: string) => {
    const next = { ...appliedFilters, toDate: value };
    setAppliedFilters(next);
    syncDateRangeToQuery(next.fromDate, next.toDate);
  };

  const handleClear = () => {
    setAppliedFilters({ fromDate: "", toDate: "" });
    setParameter((prev) => {
      const { startDate: _, endDate: __, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="fromDate">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.startDate"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.fromDate}
        onChange={(e) => handleFromDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    <Box key="toDate">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.endDate"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedFilters.toDate}
        onChange={(e) => handleToDateChange(e.target.value)}
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
                  successUrl={`${endPoints.menus().pathname}/search`}
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
