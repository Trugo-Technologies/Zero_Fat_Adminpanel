/** @format */

import { Chip, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import MainCard from "src/Components/cards/Main-card";
import { getCurrentLanguage } from "src/Helpers";
import { useGetIngredientsQuery } from "src/pages/nutriplan-module/ingredients/services/api";

const IngredientDetails = () => {
  const sensitivesObj = {
    isDairyFree: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isLowGI: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isSeasonal: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isOrganic: "/assets/icon/ingredientsTagsIcons/low-gi.png",
    isGlutenFree: "/assets/icon/ingredientsTagsIcons/gluten-free.png",
  };
  const { id } = useParams();
  const { messages, locale } = useIntl();
  const {
    data: IngredientItem,
    isLoading,
    error,
  } = useGetIngredientsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  const currentLanguage = getCurrentLanguage();
  const ln = currentLanguage.locale === "en" ? "En" : "Ar";
  return (
    <Grid container xs={12} spacing={2}>
      {/* left section */}
      <Grid item xs={12} md={6}>
        <MainCard title={messages["ingredients.basicInformation"]}>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.name"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data[`name${ln}`]}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.description"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data[`description${ln}`]}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.storageInstructions"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    IngredientItem?.data[`storageInstructions${ln}`] ?? "",
                }}
              />
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.storageInstructions"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {Object.keys(sensitivesObj).map(
                (key) =>
                  IngredientItem?.data[key as keyof typeof sensitivesObj] && (
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
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.basicUnit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip
                size='small'
                label={IngredientItem?.data?.basicUnit}
                color={
                  IngredientItem?.data?.basicUnit == "Solid"
                    ? "primary"
                    : "info"
                }
                variant='filled'
              />
            </Grid>
            {/* row */}
            <Grid container item xs={12} style={{ marginBottom: "10px" }}>
              <Grid item xs={6} md={3}>
                {messages["ingredients.status"] as string}
              </Grid>
              <Grid item xs={6} md={3}>
                {IngredientItem?.data?.status}
              </Grid>
            </Grid>
            {/* row */}
            <Grid container item xs={12} style={{ marginBottom: "10px" }}>
              <Grid item xs={6} md={3}>
                {messages["ingredients.type"] as string}
              </Grid>
              <Grid item xs={6} md={3}>
                {IngredientItem?.data?.type}
              </Grid>
            </Grid>
            {/* row */}
            <Grid container item xs={12} style={{ marginBottom: "10px" }}>
              <Grid item xs={6} md={3}>
                {messages["ingredients.tags"] as string}
              </Grid>
              <Grid item xs={6} md={3}>
                {IngredientItem?.data?.tags.join(",")}
              </Grid>
            </Grid>
            {/* row */}
            <Grid container item xs={12} style={{ marginBottom: "10px" }}>
              <Grid item xs={6} md={3}>
                {messages["ingredients.allergens"] as string}
              </Grid>
              <Grid item xs={6} md={3}>
                {IngredientItem?.data?.allergens
                  .map((item: any) => item[`name${ln}`])
                  .join(",")}
              </Grid>
            </Grid>

            {/* row */}
            <Grid container item xs={12} style={{ marginBottom: "10px" }}>
              <Grid item xs={6} md={3}>
                {messages["ingredients.category"] as string}
              </Grid>
              <Grid item xs={6} md={3}>
                {IngredientItem?.data?.category[`name${ln}`]}
              </Grid>
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.caloriesUnit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.caloriesUnit}
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* right section  */}
      <Grid item xs={12} md={6}>
        <MainCard title={messages["ingredients.otherInformation"]}>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.costPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.costPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.density"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.density}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.caloriesPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.caloriesPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.fatPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.fatPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.carbsPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.carbsPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.proteinPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.proteinPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.fiberPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.fiberPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.sugarPer100Unit"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.sugarPer100Unit}
            </Grid>
          </Grid>
          {/* row */}
          <Grid container item xs={12} style={{ marginBottom: "10px" }}>
            <Grid item xs={6} md={3}>
              {messages["ingredients.waterPer100g"] as string}
            </Grid>
            <Grid item xs={6} md={3}>
              {IngredientItem?.data?.waterPer100g}
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default IngredientDetails;
