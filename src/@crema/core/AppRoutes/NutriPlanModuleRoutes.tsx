/** @format */

import AddIngredient from "src/Components/nutriplan-module/mealPlanning/ingredients/AddIngredient";
import EditIngredient from "src/Components/nutriplan-module/mealPlanning/ingredients/EditIngredient";
import AddRecipes from "src/Components/nutriplan-module/mealPlanning/recipes/AddRecipes";
import EditRecipes from "src/Components/nutriplan-module/mealPlanning/recipes/EditRecipes";
import AllergensPage from "src/pages/nutriplan-module/Allergens/AllergensPage";
import CategoriesPage from "src/pages/nutriplan-module/Categories/CategoriesPage";
import ConfigurtionForm from "src/pages/nutriplan-module/configuration/ConfigurtionForm";
import CustomizationOptionsPage from "src/pages/nutriplan-module/mealPlanning/customizationOptions/CustomizationOptionsPage";
import CustomizationGroupsPage from "src/pages/nutriplan-module/mealPlanning/customizationGroups/CustomizationGroupsPage";
import CustomizePricingPage from "src/pages/nutriplan-module/mealPlanning/customizePricing/CustomizePricingPage";
import IngredientsPage from "src/pages/nutriplan-module/mealPlanning/ingredients/IngredientsPage";
import MealsPage from "src/pages/nutriplan-module/mealPlanning/meals/MealsPage";
import MealsProfile from "src/pages/nutriplan-module/mealPlanning/meals/MealsProfile";
import RecipesPage from "src/pages/nutriplan-module/mealPlanning/recipes/RecipesPage";
import MealPlansPages from "src/pages/nutriplan-module/mealPlans";
import MealTypesPage from "src/pages/nutriplan-module/MealTypes/MealTypesPage";
import MeasurementUnitsPage from "src/pages/nutriplan-module/measurementUnits/MeasurementUnitsPage";
import MenusPage from "src/pages/nutriplan-module/menuManagement/menus/MenusPage";
import MenusProfile from "src/pages/nutriplan-module/menuManagement/menus/MenusProfile";
import NutrientsAttributesPage from "src/pages/nutriplan-module/nutrientsAttributes/NutrientsAttributesPage";
export const nutriPlanModulePages = [
  {
    path: "/nutriplan/setting/measurementUnits",
    element: <MeasurementUnitsPage />,
  },
  {
    path: "/nutriplan/setting/nutrientsAttributes",
    element: <NutrientsAttributesPage />,
  },
  { path: "/nutriplan/setting/configurtion", element: <ConfigurtionForm /> },
  { path: "/nutriplan/setting/allergens", element: <AllergensPage /> },
  { path: "/nutriplan/setting/mealTypes", element: <MealTypesPage /> },
  { path: "/nutriplan/catalog/categories", element: <CategoriesPage /> },
  { path: "/nutriplan/setting/mealPlans", element: <MealPlansPages /> },

  { path: "/nutriplan/menuManagement/menus", element: <MenusPage /> },
  {
    path: "/nutriplan/menuManagement/menus/:menuIdParams/*",
    element: <MenusProfile />,
  },

  {
    path: "/nutriplan/mealPlanning/meals/:mealIdParams/*",
    element: <MealsProfile />,
  },

  //MealsProfile

  //MealsPage
  { path: "/nutriplan/mealPlanning/meals", element: <MealsPage /> },
  // CustomizationGroupsPage
  {
    path: "/nutriplan/mealPlanning/customizationGroups",
    element: <CustomizationGroupsPage />,
  },
  // CustomizationOptionsPage
  {
    path: "/nutriplan/mealPlanning/customizationOptions",
    element: <CustomizationOptionsPage />,
  },
  {
    path: "/nutriplan/mealPlanning/customizePricing",
    element: <CustomizePricingPage />,
  },

  //MealPlansPages MenusPage MenusProfile
  { path: "/nutriplan/mealPlanning/ingredients", element: <IngredientsPage /> },
  {
    path: "/nutriplan/mealPlanning/ingredients/add",
    element: <AddIngredient />,
  },

  {
    path: "/nutriplan/mealPlanning/ingredients/edit/:ingredientIdParams/*",
    element: <EditIngredient />,
  },

  { path: "/nutriplan/mealPlanning/recipes", element: <RecipesPage /> },
  {
    path: "/nutriplan/mealPlanning/recipes/add",
    element: <AddRecipes />,
  },

  {
    path: "/nutriplan/mealPlanning/recipes/edit/:recipeIdParams/*",
    element: <EditRecipes />,
  },
];
