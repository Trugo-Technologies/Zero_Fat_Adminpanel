/** @format */

import { Chip, Divider, Grid, IconButton, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import { useGetIngredientsQuery } from "src/pages/nutriplan-module/mealPlanning/ingredients/services/api";
import { IIngredients } from "src/types/modules/nutriplan/mealPlanning/ingredients";
import IngredientTypeBadge from "src/Components/baseComponents/badge/IngredientTypeBadge";
import IngredientStatusBadge from "src/Components/baseComponents/badge/IngredientStatusBadge";
import DietaryPreferenceBadge from "src/Components/baseComponents/badge/DietaryPreferenceBadge";
import BasicUnitBadge from "src/Components/baseComponents/badge/BasicUnitBadge";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { basicUnit } from "src/types/enums";
import FoodEnergyDetails from "./FoodEnergyDetails";
interface IIngredientDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const IngredientDetails = (props: IIngredientDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale, messages } = useIntl();

  const sensitivesObj = {
    isDairyFree: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isLowGI: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isSeasonal: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isOrganic: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isGlutenFree: "/assets/icon/ingredientsTagsIcons/gluten-free.png",
  };

  const {
    data: ingredientItem,
    isLoading,
    error,
  } = useGetIngredientsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && ingredientItem?.data?.nameEn!
            ? `- ${ingredientItem?.data?.nameEn!}`
            : `- ${ingredientItem?.data?.nameAr!}`
        }
        label='ingredients.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={isLoading}
        errorMessage={error}
        moreDetails={ingredientItem?.data as IIngredients}
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
                  value={ingredientItem?.data?.nameAr}
                  column={3}
                />
                <AppItemView
                  label='common.nameEn'
                  value={ingredientItem?.data?.nameEn}
                  column={3}
                />
                <AppItemView
                  label='ingredients.type'
                  value={
                    <IngredientTypeBadge label={ingredientItem?.data?.type!} />
                  }
                  column={3}
                />
                <AppItemView
                  label='ingredients.status'
                  value={
                    <IngredientStatusBadge
                      label={ingredientItem?.data?.status!}
                    />
                  }
                  column={3}
                />
                <AppItemView
                  label='ingredients.dietaryPreference'
                  value={
                    <DietaryPreferenceBadge
                      label={ingredientItem?.data?.dietaryPreference!}
                    />
                  }
                  column={3}
                />
                <AppItemView
                  label='ingredients.basicUnit'
                  value={
                    <BasicUnitBadge label={ingredientItem?.data?.basicUnit!} />
                  }
                  column={3}
                />
                {ingredientItem?.data?.basicUnit === basicUnit.Liquid && (
                  <AppItemView
                    label='ingredients.density'
                    value={ingredientItem?.data?.density}
                    column={3}
                  />
                )}

                <AppItemView
                  label='categories.name'
                  value={getValueBasedOnCurrentLanguage(
                    ingredientItem?.data?.category?.nameAr!,
                    ingredientItem?.data?.category?.nameEn!
                  )}
                  column={3}
                />
                <Grid item xs={3}>
                  <Grid item xs={6} md={3}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      {messages["exercises.type"] as string}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3} mt={2}>
                    {Object.keys(sensitivesObj).map(
                      (key) =>
                        ingredientItem?.data[
                          key as keyof typeof sensitivesObj
                        ] && (
                          <img
                            src={
                              sensitivesObj[
                                key as keyof typeof sensitivesObj
                              ] as string
                            }
                            style={{ marginLeft: "2px" }}
                          />
                        )
                    )}
                  </Grid>
                </Grid>

                <AppItemView
                  label='ingredients.tags'
                  value={ingredientItem?.data?.tags
                    ?.map((item: string) => item)
                    .join(", ")}
                  column={12}
                />

                <AppItemView
                  label='ingredients.costPer100Unit'
                  value={ingredientItem?.data?.costPer100Unit}
                  column={3}
                />

                <AppItemView
                  label='sidebar.allergens'
                  value={getValueBasedOnCurrentLanguage(
                    ingredientItem?.data?.allergens
                      ?.map((item) => item?.nameAr)
                      .join(", ") || "",
                    ingredientItem?.data?.allergens
                      ?.map((item) => item?.nameEn)
                      .join(", ") || ""
                  )}
                  column={6}
                />

                <Grid item xs={12}>
                  <Divider
                    sx={{
                      color: "#a5d060",
                      fontWeight: Fonts.SEMI_BOLD,
                    }}
                    variant='fullWidth'>
                    {/* <IntlMessages id='sidebar.workoutsExercises' /> */}
                    <Chip
                      label={messages["sidebar.measurementUnits"] as string}
                      size='medium'
                      color='primary'
                      sx={{ fontSize: 17 }}
                    />
                  </Divider>
                </Grid>

                <Grid item container xs={12}>
                  <Grid item xs={4}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id={"common.name"} />
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
                      <IntlMessages id='ingredients.ingredientMeasurementUnits.equivalentInUnit' />{" "}
                      {ingredientItem?.data?.basicUnit === basicUnit.Liquid
                        ? "(ml)"
                        : "(g)"}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  {ingredientItem?.data?.ingredientMeasurementUnits?.map(
                    (item) => {
                      return (
                        <Grid item container xs={12}>
                          <Grid item xs={4}>
                            <Typography
                              sx={{ fontSize: 14, fontWeight: Fonts.REGULAR }}>
                              {getValueBasedOnCurrentLanguage(
                                item?.measurementUnit?.nameAr!,
                                item?.measurementUnit?.nameEn!
                              )}
                              - {item?.measurementUnit?.code}
                            </Typography>
                          </Grid>

                          <Grid item container xs={3} alignItems={"center"}>
                            <Grid xs={8}>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: Fonts.REGULAR,
                                }}>
                                {item?.equivalentInUnit}

                                {/* {`(${
                                  ingredientItem?.data?.basicUnit ===
                                  basicUnit.Liquid
                                    ? '100ml'
                                    : '100g'
                                })`} */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    }
                  )}
                </Grid>

                <AppItemView
                  label='ingredients.storageInstructionsAr'
                  value={removeHTMLTags(
                    ingredientItem?.data?.storageInstructionsAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='ingredients.storageInstructionsEn'
                  value={removeHTMLTags(
                    ingredientItem?.data?.storageInstructionsEn! ?? ""
                  )}
                  column={6}
                />

                <AppItemView
                  label='common.descriptionAr'
                  value={removeHTMLTags(
                    ingredientItem?.data?.descriptionAr! ?? ""
                  )}
                  column={6}
                />
                <AppItemView
                  label='common.descriptionEn'
                  value={removeHTMLTags(
                    ingredientItem?.data?.descriptionEn! ?? ""
                  )}
                  column={6}
                />
              </Grid>
            ),
          },

          {
            id: "2",
            label: "ingredients.foodEnergy",
            component: <FoodEnergyDetails data={ingredientItem?.data} />,
          },

          {
            id: "3",
            label: "additionalInfo",
            component: <AppMoreDetails moreDetails={ingredientItem?.data!} />,
          },
        ]}
        children={<></>}
      />
    </>
  );
};

export default IngredientDetails;
