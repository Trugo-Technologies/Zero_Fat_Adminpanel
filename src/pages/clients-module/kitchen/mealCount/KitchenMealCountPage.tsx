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
import moment from "moment";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { useGetAllKitchenMealCountQuery } from "./services/api";
import useKitchenMealCount from "./useKitchenMealCount";

const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

function KitchenMealCountPage() {
  const { messages } = useIntl();
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
    useGetAllKitchenMealCountQuery,
    {},
    {
      clientId: clientIdParams,
      date: currentDate,
    }
  );
  const { columns, selectionModel, setSelectionModel, Modals } =
    useKitchenMealCount();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedDate, setAppliedDate] = useState(currentDate);

  const syncDateToQuery = useCallback(
    (date: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        date: date || currentDate,
      }));
    },
    [setParameter, currentDate]
  );

  const handleDateChange = (value: string) => {
    setAppliedDate(value);
    syncDateToQuery(value);
  };

  const handleClear = () => {
    setAppliedDate(currentDate);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      date: currentDate,
    }));
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
        value={appliedDate}
        onChange={(e) => handleDateChange(e.target.value)}
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
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebar.kitchen"] },
          ]}
          currentPathName={"sidebar.kitchen.mealCount"}
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
                  successUrl={`${endPoints.kitchenMealCount().pathname}`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
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
                        "meal.weightInGrams": false,
                        "meal.calories": false,
                        "meal.fat": false,
                        "meal.carbs": false,
                        "meal.protein": false,
                        "meal.water": false,
                        "meal.priceForCustomer": false,
                        "meals.isAddOn": false,
                        "meal.allergens": false,
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

export default KitchenMealCountPage;
