import { IRecipeIngredient } from "src/types/modules/nutriplan/mealPlanning/recipes";

export const calculateTotalProteinPer100Unit = (
  recipeIngredients: Array<IRecipeIngredient>
) => {
  return recipeIngredients
    .map(
      (x) =>
        (((x.ingredient?.proteinPer100Unit ?? 0) *
          (x.amount ?? 0) *
          (x.measurementUnit?.equivalentInUnit ?? 1)) /
          100) *
        (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
    )
    .reduce((acc, protein) => acc + protein, 0);
};

export const calculateTotalCaloriesPer100Unit = (
  recipeIngredients: Array<IRecipeIngredient>
) => {
  return recipeIngredients
    .map(
      (x) =>
        (((x.ingredient?.caloriesPer100Unit ?? 0) *
          (x.amount ?? 0) *
          (x.measurementUnit?.equivalentInUnit ?? 1)) /
          100) *
        (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
    )
    .reduce((acc, protein) => acc + protein, 0);
};

export const calculateTotalFatPer100Unit = (
  recipeIngredients: Array<IRecipeIngredient>
) => {
  return recipeIngredients
    .map(
      (x) =>
        (((x.ingredient?.fatPer100Unit ?? 0) *
          (x.amount ?? 0) *
          (x.measurementUnit?.equivalentInUnit ?? 1)) /
          100) *
        (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
    )
    .reduce((acc, protein) => acc + protein, 0);
};

export const calculateTotalCarbsPer100Unit = (
  recipeIngredients: Array<IRecipeIngredient>
) => {
  return recipeIngredients
    .map(
      (x) =>
        (((x.ingredient?.carbsPer100Unit ?? 0) *
          (x.amount ?? 0) *
          (x.measurementUnit?.equivalentInUnit ?? 1)) /
          100) *
        (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
    )
    .reduce((acc, protein) => acc + protein, 0);
};

export const calculateTotalWaterPer100g = (
  recipeIngredients: Array<IRecipeIngredient>
) => {
  return recipeIngredients
    .map(
      (x) =>
        (((x.ingredient?.waterPer100g ?? 0) *
          (x.amount ?? 0) *
          (x.measurementUnit?.equivalentInUnit ?? 1)) /
          100) *
        (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
    )
    .reduce((acc, protein) => acc + protein, 0);
};

// export const calculateTotalWeightInGrams = (
//   recipeIngredients: Array<IRecipeIngredient>
// ) => {
//   return recipeIngredients
//     .map(
//       (x) =>
//         (((x.ingredient?.waterPer100g ?? 0) *
//           (x.amount ?? 0) *
//           (x.measurementUnit?.equivalentInUnit ?? 1)) /
//           100) *
//         (x.ingredient?.caloriesUnit === "g" ? 1 : (x.ingredient?.density ?? 1))
//     )
//     .reduce((acc, protein) => acc + protein, 0);
// };
