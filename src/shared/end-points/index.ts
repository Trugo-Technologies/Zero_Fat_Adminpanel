/** @format */

import { baseUrl } from "src/env/base-url";

const getEndPoint = (endPoint: string) => () => {
  const url = new URL(endPoint, baseUrl);
  return url;
};

export const endPoints = {
  // users-module
  loginEndPoint: getEndPoint("/users-module/Authentication/login"),
  admins: getEndPoint("/users-module/users"),
  planEndpoint: getEndPoint("/workout-module/Plans"),
  planReviews: getEndPoint("/workout-module/planReviews"),
  workoutStatistics: getEndPoint("/workout-module/Statistics"),
  ///measurementUnit module
  measurementUnit: getEndPoint("nutriplan-module/MeasurementUnits"),
  menus: getEndPoint("nutriplan-module/menus"),
  dailyMenuMeals: getEndPoint("nutriplan-module/dailyMenuMeals"),
  nutrientsAttributes: getEndPoint("nutriplan-module/NutrientsAttributes"),
  customizationGroups: getEndPoint("nutriplan-module/CustomizationGroups"),
  customizationOptions: getEndPoint("nutriplan-module/CustomizationOptions"),
  allergens: getEndPoint("nutriplan-module/Allergens"),
  nutriplanStatistics: getEndPoint("/nutriplan-module/Statistics"),
  clients: getEndPoint("clientPortal-module/clients"),
  clientAccountAccess: getEndPoint("clientPortal-module/ClientAccountAccess"),
  manageSubscriptions: getEndPoint("clientPortal-module/ManageSubscriptions"),
  clientStatistics: getEndPoint("clientPortal-module/Statistics"),
  paymentsEndpoint: getEndPoint("clientPortal-module/payments"),
  dailySelections: getEndPoint("clientPortal-module/dailySelections"),
  dailyMealSelections: getEndPoint("clientPortal-module/dailyMealSelections"),
  kitchenMealCount: getEndPoint("clientPortal-module/kitchen/meal-Count"),
  clientLoyaltyPoints: getEndPoint("clientPortal-module/clientLoyaltyPoints"),
  clientGoals: getEndPoint("clientPortal-module/clientGoals"),
  discountRules: getEndPoint("clientPortal-module/DiscountRules"),
  challenges: getEndPoint("clientPortal-module/Challenges"),
  banks: getEndPoint("clientPortal-module/Banks"),
  homeBanners: getEndPoint("clientPortal-module/HomeBanners"),

  kitchenOrderedMeal: getEndPoint("clientPortal-module/kitchen/ordered-meal"),

  clientSubscriptionsEndpoint: getEndPoint(
    "clientPortal-module/clientSubscriptions"
  ),
  clientLocations: getEndPoint("clientPortal-module/clientLocations"),
  clientPortalSettingsEndpoint: getEndPoint(
    "clientPortal-module/clientPortalSettings"
  ),
  mealRatings: getEndPoint("clientPortal-module/MealRatings"),
  subscriptionReports: getEndPoint("clientPortal-module/SubscriptionReports"),
  clientReports: getEndPoint("clientPortal-module/Reports"),
  notifications: getEndPoint("clientPortal-module/notifications"),
  manageNotifications: getEndPoint("clientPortal-module/ManageNotifications"),

  categories: getEndPoint("nutriplan-module/Categories"),
  mealTypes: getEndPoint("nutriplan-module/MealTypes"),
  meals: getEndPoint("nutriplan-module/meals"),
  extrasMeals: getEndPoint("nutriplan-module/extras"),

  ingredients: getEndPoint("nutriplan-module/Ingredients"),
  recipes: getEndPoint("nutriplan-module/recipes"),

  mealPlans: getEndPoint("nutriplan-module/mealPlans"),
  customizePricingTiers: getEndPoint("nutriplan-module/CustomizePricingTiers"),
  trainerEndpoint: getEndPoint("/workout-module/Trainers"),
  planGoalsEndpoint: getEndPoint("/workout-module/PlanGoals"),
  ///configuration
  configurationEndpoint: getEndPoint("nutriplan-module/NutriPlanSettings"),

  // cores
  faqCategoriesEndpoint: getEndPoint("/core-module/FaqCategories"),
  faqEndpoint: getEndPoint("/core-module/Faqs"),
  bannersEndpoint: getEndPoint("/core-module/Banners"),
  advertisementsEndpoint: getEndPoint("/core-module/Advertisements"),
  physicalActivityLevelsEndpoint: getEndPoint(
    "core-module/PhysicalActivityLevels"
  ),

  subscriptionPlansEndpoint: getEndPoint("core-module/subscriptionPlans"),
  //workout module Catalog
  workoutEquipmentCategories: getEndPoint("workout-module/equipmentCategories"),
  equipments: getEndPoint("workout-module/equipments"),
  equipmentCategoriesEndpoint: getEndPoint(
    "workout-module/equipmentCategories"
  ),
  workoutBodyParts: getEndPoint("workout-module/bodyParts"),
  workoutTypes: getEndPoint("workout-module/workoutTypes"),
  workoutExercises: getEndPoint("workout-module/workoutExercises"),
  workouts: getEndPoint("workout-module/workouts"),

  planGoals: getEndPoint("workout-module/planGoals"),
  planSchedules: getEndPoint("workout-module/planSchedules"),
  //workout module Training

  trainers: getEndPoint("workout-module/trainers"),
  exercises: getEndPoint("workout-module/exercises"),
  //workout module
  // workoutEquipmentCategories: getEndPoint("workout-module/equipmentCategories"),

  // equipments: getEndPoint("workout-module/equipments"),
  // equipmentCategoriesEndpoint: getEndPoint(
  //   "workout-module/equipmentCategories"
  // ),
  // workoutBodyParts: getEndPoint("workout-module/bodyParts"),
  // workoutTypes: getEndPoint("workout-module/workoutTypes"),
  // planGoals: getEndPoint("workout-module/planGoals"),
} as const;
