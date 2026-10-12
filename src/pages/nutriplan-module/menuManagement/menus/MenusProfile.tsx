/** @format */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import { useGetMenuQuery } from "./services/api";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { Fonts } from "src/@crema/constants/AppEnums";
import moment from "moment";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { TabContext, TabList } from "@mui/lab";
import LoadingAndErrorWrapper from "src/Components/baseComponents/other/LoadingAndErrorWrapper";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  IMealPlans,
  IMealPlansListDto,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
import { useGetAllMealPlansQuery } from "../../mealPlans/services/api";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DailyMenuMealsPage from "../dailyMenuMeals/DailyMenuMealsPage";
import CustomizeMealTypeMealsPanel from "../dailyMenuMeals/CustomizeMealTypeMealsPanel";
import { isCustomizeMealPlan } from "../dailyMenuMeals/customizeMenuHelpers";
import AddMultiMeals from "src/Components/nutriplan-module/menuManagement/dailyMenuMeals/AddMultiMeals";

const MenusProfile = () => {
  const { messages } = useIntl();
  const { menuIdParams } = useParams();
  const [showAddMultiMealsModal, setShowAddMultiMealsModal] = useState(false);
  const [dateArray, setDateArray] = useState<Array<string>>([]);

  const [value, setValue] = useState<string>(
    dateArray.length > 0 ? dateArray[0] : ""
  );

  const {
    data: menuItem,
    isLoading,
    error,
  } = useGetMenuQuery(
    { id: menuIdParams || "" },
    {
      skip: !menuIdParams,
    }
  );

  const {
    changePage: changePageMealPlans,
    data: mealPlansList,
    isError: isErrorMealPlans,
    isFetching: isFetchingMealPlans,
    limit: limitMealPlans,
    page: pageMealPlans,
    changeLimit: changeLimitMealPlans,
    setSearchValue: setSearchValueMealPlans,
    searchValue: searchValueMealPlans,
    totalRecords: totalRecordsMealPlans,
    handleDelete: handleDeleteMealPlans,
    refetch: refetchMealPlans,
  } = usePaginateData<IMealPlansListDto>(useGetAllMealPlansQuery);

  const [menuPlanItem, setMenuPlanItem] = useState<IMealPlans | null>(null);
  const startDate = dayjs(menuItem?.data?.startDate, "YYYY-MM-DD");
  const endDate = dayjs(menuItem?.data?.endDate, "YYYY-MM-DD");

  useEffect(() => {
    const dateArrayTemp: string[] = [];
    for (
      let date = startDate;
      date.isBefore(endDate.add(1, "day"));
      date = date.add(1, "day")
    ) {
      dateArrayTemp.push(date.format("DD/MM/YYYY"));
    }

    setDateArray(dateArrayTemp);
  }, [menuItem?.data]);

  useEffect(() => {
    if (dateArray?.length > 0 && value === "") setValue(dateArray[0]);
  }, [dateArray]);

  // Generate dates from startDate to endDate

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (pageMealPlans && pageMealPlans > 1) refetchMealPlans();
  }, [pageMealPlans]);

  const mealPlanOptions = useMemo(
    () => (mealPlansList?.data ?? []) as IMealPlans[],
    [mealPlansList?.data]
  );

  // Prefer Customize plan as default when present in API list
  useEffect(() => {
    if (!mealPlanOptions.length) return;

    if (!menuPlanItem) {
      const customize =
        mealPlanOptions.find((row) => isCustomizeMealPlanRow(row)) ||
        mealPlanOptions[0];
      setMenuPlanItem(customize);
      return;
    }

    const stillInOptions = mealPlanOptions.some(
      (plan) => plan.id === menuPlanItem.id
    );
    if (!stillInOptions) {
      const customize =
        mealPlanOptions.find((row) => isCustomizeMealPlanRow(row)) ||
        mealPlanOptions[0];
      setMenuPlanItem(customize);
    }
  }, [mealPlanOptions, menuPlanItem]);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.menusManagement.title"] },
            {
              name: messages["sidebar.menus"],
              path: "/nutriplan/menuManagement/menus",
            },
          ]}
          currentPathName={"menus.details"}
        />

        <Grid item xs={12}>
          <Card>
            <LoadingAndErrorWrapper isLoading={isLoading} errorMessage=''>
              <CardHeader
                sx={{
                  borderBottom: "1px solid #a5d060",

                  ".MuiTypography-root": {
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#a5d060",
                  },
                }}
                title={
                  <>
                    {`${messages["menus.details"] as string}: ${getValueBasedOnCurrentLanguage(menuItem?.data?.nameAr!, menuItem?.data?.nameEn!)}`}
                  </>
                }
              />
              <CardContent>
                <Grid item container xs={12} spacing={6}>
                  <Grid item xs={10} />
                  <Grid item xs={2}>
                    <Button
                      onClick={() => {
                        setShowAddMultiMealsModal(true);
                      }}
                      fullWidth
                      variant='contained'
                      color='primary'>
                      <IntlMessages id='dailyMenuMealsMulti.add' />
                    </Button>
                  </Grid>
                </Grid>

                <Grid item container xs={12} spacing={6}>
                  <Grid item>
                    <Typography
                      sx={{ fontSize: 22, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='menus.list' />{" "}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography
                      sx={{ fontSize: 22, fontWeight: Fonts.SEMI_BOLD }}>
                      {moment(menuItem?.data?.startDate).format("DD/MM/YYYY")}
                      {" - "}
                      {moment(menuItem?.data?.endDate).format("DD/MM/YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={4} mb={4}>
                  <TabContext value={value ?? dateArray[0]}>
                    <TabList onChange={handleChange} scrollButtons>
                      {dateArray.map((date) => (
                        <Tab key={date} label={date} value={date} />
                      ))}
                    </TabList>
                    {/* {dateArray.map((date) => (
                  <TabPanel key={date} value={date}>
                    Content for {date}
                  </TabPanel>
                ))} */}
                  </TabContext>
                </Grid>
                <Grid item xs={4}>
                  <AppBaseAutoComplete
                    label='mealPlans.name'
                    isLoading={isFetchingMealPlans}
                    options={mealPlanOptions}
                    hasNextPage={mealPlansList?.hasNextPage}
                    pageNumber={pageMealPlans}
                    changePage={changePageMealPlans}
                    value={menuPlanItem}
                    defaultValue={menuPlanItem}
                    onChangeAutoComplete={(event, value) => {
                      setMenuPlanItem(value ? value : null);
                      changePageMealPlans(1);
                    }}
                    searchText={searchValueMealPlans}
                    onChangeTextField={(value) => {
                      setSearchValueMealPlans(value.target.value);
                      changePageMealPlans(1);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LoadingAndErrorWrapper
                    isLoading={isFetchingMealPlans}
                    errorMessage=''>
                    {menuPlanItem &&
                      menuPlanItem?.mealPlanMealTypes?.map((item) => {
                        return (
                          <div style={{ margin: "2rem 0px" }}>
                            <Accordion
                              sx={{
                                margin: "2rem 0px",
                              }}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1-content'
                                id='panel1-header'>
                                <Typography
                                  sx={{
                                    fontSize: 18,
                                    fontWeight: Fonts.SEMI_BOLD,
                                  }}>
                                  {getValueBasedOnCurrentLanguage(
                                    item?.mealType?.nameAr!,
                                    item?.mealType?.nameEn!
                                  )}
                                  {item?.price != null && (
                                    <span style={{ color: "#a5d060" }}>
                                      {` - ${item?.price} AED`}
                                    </span>
                                  )}
                                  {isCustomizeMealPlan(menuPlanItem) && (
                                    <span style={{ color: "#64748B", fontSize: 14 }}>
                                      {" "}
                                      (
                                      {(messages[
                                        "mealPlans.customize.badge"
                                      ] as string) || "Customize"}
                                      )
                                    </span>
                                  )}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {isCustomizeMealPlan(menuPlanItem) ? (
                                  <CustomizeMealTypeMealsPanel
                                    date={value}
                                    dates={dateArray}
                                    mealTypeId={item?.mealType?.id}
                                    mealPlanId={menuPlanItem?.id}
                                    mealPlan={menuPlanItem}
                                    mealType={item?.mealType!}
                                  />
                                ) : (
                                  <DailyMenuMealsPage
                                    date={value}
                                    dates={dateArray}
                                    mealTypeId={item?.mealType?.id}
                                    mealPlanId={menuPlanItem?.id}
                                    mealPlan={menuPlanItem}
                                    mealType={item?.mealType!}
                                  />
                                )}
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        );
                      })}
                  </LoadingAndErrorWrapper>
                </Grid>
              </CardContent>
            </LoadingAndErrorWrapper>
          </Card>
        </Grid>
      </Grid>

      {showAddMultiMealsModal && dateArray.length > 0 && (
        <AddMultiMeals
          dates={dateArray}
          setShowAddModal={setShowAddMultiMealsModal}
          showAddModal={showAddMultiMealsModal}
        />
      )}
    </>
  );
};

export default MenusProfile;
