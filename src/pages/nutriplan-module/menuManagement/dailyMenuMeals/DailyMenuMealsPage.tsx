/** @format */

import { Card, CardContent, Grid } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { IDailyMenuMealsListDto } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import { dateFormatInBackendPayload } from "src/utilities/date.utility";
import { useGetAllDailyMenuMealsQuery } from "./services/api";
import useDailyMenuMeals from "./useDailyMenuMeals";

interface IDailyMenuMealsProps {
  date?: string;
  dates: string[];
  mealTypeId?: string;
  mealPlanId?: string;
  mealPlan?: IMealPlans;
  mealType?: IMealTypes;
}

const DailyMenuMealsPage: React.FC<IDailyMenuMealsProps> = (props) => {
  const { date, mealPlanId, mealTypeId, mealPlan, mealType, dates } = props;
  const { menuIdParams } = useParams();

  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
    setShowAddMealsModal,
    onClickMultipleExport,
  } = useDailyMenuMeals({
    date,
    mealPlanId,
    mealTypeId,
    mealPlan,
    mealType,
    dates,
  });

  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    parameter,
    setParameter,
    totalRecords,
    refetch,
  } = usePaginateData<IDailyMenuMealsListDto>(
    useGetAllDailyMenuMealsQuery,
    {
      skip: !(date && mealPlanId && mealTypeId),
    },
    {
      // moment(date, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      date: date ? dateFormatInBackendPayload(date) : "",
      mealPlanId,
      mealTypeId,
      menuId: menuIdParams,
    }
  );

  useEffect(() => {
    // moment(date, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    const formattedDate = date ? dateFormatInBackendPayload(date) : "";

    setParameter({
      ...parameter,
      date: formattedDate,
      mealPlanId,
      mealTypeId,
    });
  }, [date, mealPlanId, mealTypeId]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle='dailyMenuMeals.add'
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  setShowAddSecondModal={setShowAddMealsModal}
                  showAddSecondButton={true}
                  addSecondTitle='dailyMenuMealsMulti.add'
                  successUrl={`${endPoints.dailyMenuMeals().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  onClickMultipleExport={onClickMultipleExport}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  getRowId={(row) => row.mealId} // 💥 This is the missing piece
                  tableName='dailyMenuMeals'
                  //for pagination
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
                  //for selection
                  onSelectionModelChange={setSelectionModel}
                  initialState={initialDataGridState}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  //for sorting
                  onSortModelChange={(result: string[] | null) => {
                    // setSearch({
                    //   ...search,
                    //   orderBy: result,
                    // });
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
};

export default DailyMenuMealsPage;
