/** @format */

import { Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { useGetRecipesQuery } from "src/pages/nutriplan-module/mealPlanning/recipes/services/api";
import { IRecipes } from "src/types/modules/nutriplan/mealPlanning/recipes";
interface IRecipeDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const RecipeDetails = (props: IRecipeDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const {
    data: recipeItem,
    isLoading,
    error,
  } = useGetRecipesQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && recipeItem?.data?.nameEn!
            ? `- ${recipeItem?.data?.nameEn!}`
            : `- ${recipeItem?.data?.nameAr!}`
        }
        label='recipes.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={recipeItem?.data as IRecipes}
        maxWidth='md'
        columns={12}
        tabs={[
          {
            id: "1",
            label: "details",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='common.nameAr'
                  value={recipeItem?.data?.nameAr}
                  column={4}
                />
                <AppItemView
                  label='common.nameEn'
                  value={recipeItem?.data?.nameEn}
                  column={4}
                />
                <AppItemView
                  label='categories.name'
                  value={getValueBasedOnCurrentLanguage(
                    recipeItem?.data?.category?.nameAr!,
                    recipeItem?.data?.category?.nameEn!
                  )}
                  column={4}
                />

                <AppItemView
                  label='recipes.preparationTime'
                  value={recipeItem?.data?.preparationTime!}
                  column={4}
                />
                <AppItemView
                  label='recipes.cookingTime'
                  value={recipeItem?.data?.cookingTime}
                  column={4}
                />
                <AppItemView
                  label='recipes.servings'
                  value={recipeItem?.data?.servings}
                  column={4}
                />
                <AppItemView
                  label='recipes.difficulty'
                  value={
                    messages[
                      `recipes.difficulty.${recipeItem?.data?.difficulty}`
                    ] as string
                  }
                  column={4}
                />
                <AppItemView
                  label='recipes.cuisine'
                  value={
                    messages[
                      `recipes.cuisine.${recipeItem?.data?.cuisine}`
                    ] as string
                  }
                  column={4}
                />
                <AppItemView
                  label='sidebar.mealTypes'
                  value={getValueBasedOnCurrentLanguage(
                    recipeItem?.data?.mealTypes
                      ?.map((item) => item?.nameAr)
                      .join(", ") || "",
                    recipeItem?.data?.mealTypes
                      ?.map((item) => item?.nameEn)
                      .join(", ") || ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='recipes.dietaryCategories'
                  value={recipeItem?.data?.dietaryCategories
                    ?.map((item) => item)
                    .join(", ")}
                  column={6}
                />

                <AppItemView
                  label='ingredients.tags'
                  value={recipeItem?.data?.tags
                    ?.map((item: string) => item)
                    .join(", ")}
                  column={6}
                />

                <AppItemView
                  type='image'
                  label='common.image'
                  value={recipeItem?.data?.imageUrl}
                  column={12}
                />
                <AppItemView
                  label='recipes.preparationMethodAr'
                  value={removeHTMLTags(
                    recipeItem?.data?.preparationMethodAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='recipes.preparationMethodEn'
                  value={removeHTMLTags(
                    recipeItem?.data?.preparationMethodEn! ?? ""
                  )}
                  column={6}
                />

                <AppItemView
                  label='recipes.heatingInstructionsAr'
                  value={removeHTMLTags(
                    recipeItem?.data?.heatingInstructionsAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='recipes.heatingInstructionsEn'
                  value={removeHTMLTags(
                    recipeItem?.data?.heatingInstructionsEn! ?? ""
                  )}
                  column={6}
                />

                <AppItemView
                  label='recipes.servingInstructionsAr'
                  value={removeHTMLTags(
                    recipeItem?.data?.servingInstructionsAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='recipes.servingInstructionsEn'
                  value={removeHTMLTags(
                    recipeItem?.data?.servingInstructionsEn! ?? ""
                  )}
                  column={6}
                />

                <AppItemView
                  label='recipes.fullRecipeTextAr'
                  value={removeHTMLTags(
                    recipeItem?.data?.fullRecipeTextAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='recipes.fullRecipeTextEn'
                  value={removeHTMLTags(
                    recipeItem?.data?.fullRecipeTextEn! ?? ""
                  )}
                  column={6}
                />
              </Grid>
            ),
          },

          {
            id: "2",
            label: "sidebar.ingredients",
            component: (
              <Grid container spacing={5} item xs={12}>
                <Grid
                  item
                  container
                  xs={12}
                  // columnGap={3}
                  // columnSpacing={3}
                  // rowSpacing={3}
                >
                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.caloriesPer100Unit' />{" "}
                    </Typography>
                    <div>{recipeItem?.data?.calories}</div>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id={"ingredients.proteinPer100Unit"} />
                    </Typography>
                    <div>{recipeItem?.data?.protein}</div>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.fatPer100Unit' />{" "}
                    </Typography>
                    <div>{recipeItem?.data?.fat}</div>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.carbsPer100Unit' />{" "}
                    </Typography>
                    <div>{recipeItem?.data?.carbs}</div>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.waterPer100g' />{" "}
                    </Typography>

                    <div>{recipeItem?.data?.water}</div>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.weight' />{" "}
                    </Typography>

                    <div>{recipeItem?.data?.weightInGrams}</div>
                  </Grid>
                  {/* 
                  <Grid item>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                    >
                      <IntlMessages id="ingredients.costPer100Unit" />{" "}
                    </Typography>

                    <div>
                      <Typography
                        sx={{ fontSize: 14, fontWeight: Fonts.LIGHT }}
                      >
                        <IntlMessages id={"ingredients.costPer100Unit"} />
                      </Typography>
                    </div>
                  </Grid> */}
                </Grid>
                <Grid item container xs={12}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #000", // Border for the entire table
                    }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000", // Border for each header cell
                          }}>
                          <IntlMessages id={"ingredients.name"} />
                        </th>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000", // Border for each header cell
                          }}>
                          <IntlMessages id='measurementUnits.name' />
                        </th>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000", // Border for each header cell
                          }}>
                          <IntlMessages id='recipeIngredients.amount' />
                        </th>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000", // Border for each header cell
                          }}>
                          <IntlMessages id='recipes.hideOnCustomerPorter' />
                        </th>
                        <th
                          style={{
                            fontSize: 14,
                            fontWeight: Fonts.SEMI_BOLD,
                            textAlign: "left",
                            padding: "8px",
                            backgroundColor: "#a5d060",
                            border: "1px solid #000", // Border for each header cell
                          }}>
                          <IntlMessages id='recipes.isOptional' />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeItem?.data?.recipeIngredients?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                fontSize: 14,
                                fontWeight: Fonts.REGULAR,
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000", // Border for each data cell
                              }}>
                              {getValueBasedOnCurrentLanguage(
                                item?.ingredient?.nameAr!,
                                item?.ingredient?.nameEn!
                              )}
                            </td>
                            <td
                              style={{
                                fontSize: 14,
                                fontWeight: Fonts.REGULAR,
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000", // Border for each data cell
                              }}>
                              {item?.measurementUnitCode}
                              {/* {getValueBasedOnCurrentLanguage(
            item?.measurementUnit?.nameAr!,
            item?.measurementUnit?.nameEn!
          )} */}
                            </td>
                            <td
                              style={{
                                fontSize: 14,
                                fontWeight: Fonts.REGULAR,
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000", // Border for each data cell
                              }}>
                              {item?.amount}
                            </td>
                            <td
                              style={{
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000", // Border for each data cell
                              }}>
                              <AppItemView
                                value={item?.hideOnCustomerPorter}
                                type='isExist'
                                column={3}
                              />
                            </td>
                            <td
                              style={{
                                textAlign: "left",
                                padding: "8px",
                                border: "1px solid #000", // Border for each data cell
                              }}>
                              <AppItemView
                                value={item?.isOptional}
                                type='isExist'
                                column={1}
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </Grid>
              </Grid>
            ),
          },

          {
            id: "3",
            label: "trainers.additionalInfo",
            component: (
              <Grid container spacing={5} item xs={12}>
                <AppItemView
                  label='recipes.isVegan'
                  value={recipeItem?.data?.isVegan}
                  type='isExist'
                  column={3}
                />
                <AppItemView
                  label='recipes.isVegetarian'
                  value={recipeItem?.data?.isVegetarian}
                  type='isExist'
                  column={3}
                />

                <AppItemView
                  label='ingredients.isGlutenFree'
                  value={recipeItem?.data?.isGlutenFree}
                  type='isExist'
                  column={3}
                />
                <AppItemView
                  label='ingredients.isDairyFree'
                  value={recipeItem?.data?.isDairyFree}
                  type='isExist'
                  column={3}
                />
                <AppItemView
                  label='ingredients.isLowGI'
                  value={recipeItem?.data?.isLowGI}
                  type='isExist'
                  column={3}
                />
                <AppItemView
                  label='recipes.isCold'
                  value={recipeItem?.data?.isCold}
                  type='isExist'
                  column={3}
                />
                <AppItemView
                  label='recipes.isWarm'
                  value={recipeItem?.data?.isWarm}
                  type='isExist'
                  column={3}
                />
                {/* <AppItemView
                  label="recipes.suitableForFreezing"
                  value={recipeItem?.data?.suitableForFreezing}
                  type="isExist"
                  column={3}
                /> */}
              </Grid>
            ),
          },

          {
            id: "4",
            label: "additionalInfo",
            component: <AppMoreDetails moreDetails={recipeItem?.data!} />,
          },
        ]}
        children={<></>}
      />
    </>
  );
};

export default RecipeDetails;
