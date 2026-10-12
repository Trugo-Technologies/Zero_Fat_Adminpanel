/** @format */

import { Box, Card, CardContent, Grid } from "@mui/material";
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
import { CustomizeMenuMacroType } from "./customizeMenuHelpers";
import { useGetAllDailyMenuMealsQuery } from "./services/api";
import useDailyMenuMeals from "./useDailyMenuMeals";

interface IDailyMenuMealsProps {
  date?: string;
  dates: string[];
  mealTypeId?: string;
  mealPlanId?: string;
  mealPlan?: IMealPlans;
  mealType?: IMealTypes;
  /** Present for Customize plan sections (UI-only until API supports it). */
  macroType?: CustomizeMenuMacroType;
  isCustomizeSection?: boolean;
}

const DailyMenuMealsPage: React.FC<IDailyMenuMealsProps> = (props) => {
  const {
    date,
    mealPlanId,
    mealTypeId,
    mealPlan,
    mealType,
    dates,
    macroType,
    isCustomizeSection = false,
  } = props;
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
    macroType,
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
      date: date ? dateFormatInBackendPayload(date) : "",
      mealPlanId,
      mealTypeId,
      menuId: menuIdParams,
      ...(macroType ? { macroCategory: macroType } : {}),
    }
  );

  useEffect(() => {
    const formattedDate = date ? dateFormatInBackendPayload(date) : "";

    setParameter({
      ...parameter,
      date: formattedDate,
      mealPlanId,
      mealTypeId,
      ...(macroType ? { macroCategory: macroType } : {}),
    });
  }, [date, mealPlanId, mealTypeId, macroType]);

  const content = (
    <Grid container spacing={2}>
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
          showAddSecondButton
          addSecondTitle='dailyMenuMealsMulti.add'
          successUrl={`${endPoints.dailyMenuMeals().pathname}/search`}
          selectionModel={selectionModel as string[]}
          setSelectionModel={setSelectionModel}
          refetch={refetch}
          onClickMultipleExport={
            isCustomizeSection ? undefined : onClickMultipleExport
          }
        />
      </Grid>
      <Grid item xs={12} mt={isCustomizeSection ? 2 : 6}>
        <AppDataGrid
          rowCount={totalRecords ?? 0}
          pageNumber={page ?? 0}
          getRowId={(row) => row.mealId || row.id}
          tableName={
            macroType ? `dailyMenuMeals-${macroType}` : "dailyMenuMeals"
          }
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
          checkboxSelection={!isCustomizeSection}
          selectionModel={selectionModel}
          onSortModelChange={() => {}}
        />
      </Grid>
    </Grid>
  );

  return (
    <>
      {isCustomizeSection ? (
        <Box>{content}</Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>{content}</CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {Modals}
    </>
  );
};

export default DailyMenuMealsPage;
