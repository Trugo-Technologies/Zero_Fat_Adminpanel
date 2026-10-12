/** @format */
import { BsFillBarChartLineFill, BsStar, BsBell } from "react-icons/bs";
// import { MdDashboard } from "react-icons/md";

const routesConfig = [
  {
    id: "dashboard",
    messageId: "sidebar.dashboard",
    title: "dashboard",
    type: "item",
    url: "/dashboard",
    icon: <BsFillBarChartLineFill size={21} />,
  },
  {
    id: "meal-ratings",
    messageId: "sidebar.mealRatings",
    title: "Meal Ratings",
    type: "item",
    url: "/meal-ratings",
    icon: <BsStar size={21} />,
  },
  {
    id: "notification-logs",
    messageId: "sidebar.notificationLogs",
    title: "Notification Logs",
    type: "item",
    url: "/notification-logs",
    icon: <BsBell size={21} />,
  },
  {
    id: "workout-module",
    messageId: "sidebar.workoutManagement.title",
    title: "workout-module",
    type: "group",
    children: [
      {
        id: "catalog",
        messageId: "sidebar.catalog.title",
        title: "Catalog",
        type: "collapse",
        children: [
          {
            id: "workoutBodyParts",
            messageId: "sidebar.workoutBodyParts",
            title: "workoutBodyParts",
            type: "item",
            url: "/workout/catalog/bodyParts",
          },

          {
            id: "equipmentCategories",
            messageId: "sidebar.equipmentCategories",
            title: "equipmentCategories",
            type: "item",
            url: "/workout/catalog/equipmentCategories",
          },
          {
            id: "equipments",
            messageId: "sidebar.equipments",
            title: "equipments",
            type: "item",
            url: "/workout/catalog/equipments",
          },
          {
            id: "workoutTypes",
            messageId: "sidebar.workoutTypes",
            title: "workoutTypes",
            type: "item",
            url: "/workout/catalog/workoutTypes",
          },

          {
            id: "planGoals",
            messageId: "sidebar.planGoals",
            title: "planGoals",
            type: "item",
            url: "/workout/catalog/planGoals",
          },

          //workout/catalog/planGoals
        ],
      },
      {
        id: "training",
        messageId: "sidebar.training.title",
        title: "training",
        type: "collapse",
        children: [
          {
            id: "trainers",
            messageId: "sidebar.trains",
            title: "trainers",
            type: "item",
            url: "/workout/training/trainers",
          },
          {
            id: "exercises",
            messageId: "sidebar.exercises",
            title: "exercises",
            type: "item",
            url: "/workout/training/exercises",
          },
          {
            id: "workouts",
            messageId: "sidebar.workouts",
            title: "workouts",
            type: "item",
            url: "/workout/training/workouts",
          },
          {
            id: "plans",
            messageId: "sidebar.workoutPlan",
            title: "plans",
            type: "item",
            url: "/workout/training/plan",
          },
        ],
      },
    ],
  },

  {
    id: "nutriplan-module",
    messageId: "sidebar.nutriplanManagement.title",
    title: "nutriplan-module",
    type: "group",
    children: [
      {
        id: "nutriplan-module-setting",
        messageId: "sidebar.setting.title",
        title: "nutriplan-module-setting",
        type: "collapse",
        children: [
          {
            id: "allergens",
            messageId: "sidebar.allergens",
            title: "allergens",
            type: "item",
            url: "/nutriplan/setting/allergens",
          },
          {
            id: "categories",
            messageId: "sidebar.categories",
            title: "categories",
            type: "item",
            url: "/nutriplan/catalog/categories",
          },
          {
            id: "measurementUnits",
            messageId: "sidebar.measurementUnits",
            title: "measurementUnits",
            type: "item",
            url: "/nutriplan/setting/measurementUnits",
          },
          {
            id: "nutrientsAttributes",
            messageId: "sidebar.nutrientsAttributes",
            title: "nutrientsAttributes",
            type: "item",
            url: "/nutriplan/setting/nutrientsAttributes",
          },
          {
            id: "mealTypes",
            messageId: "sidebar.mealTypes",
            title: "mealPlans",
            type: "item",
            url: "/nutriplan/setting/mealTypes",
          },
          {
            id: "mealPlans",
            messageId: "sidebar.mealPlans",
            title: "mealPlans",
            type: "item",
            url: "/nutriplan/setting/mealPlans",
            permittedRole: [],
          },
        ],
      },
      {
        id: "nutriplan-module-mealPlanning",
        messageId: "sidebar.mealPlanning.title",
        title: "sidebar.mealPlanning.title",
        type: "collapse",
        children: [
          {
            id: "ingredients",
            messageId: "sidebar.ingredients",
            title: "ingredients",
            type: "item",
            url: "/nutriplan/mealPlanning/ingredients",
            permittedRole: [],
          },
          {
            id: "recipes",
            messageId: "sidebar.recipes",
            title: "recipes",
            type: "item",
            url: "/nutriplan/mealPlanning/recipes",
            permittedRole: [],
          },

          {
            id: "meals",
            messageId: "sidebar.meals",
            title: "meals",
            type: "item",
            url: "/nutriplan/mealPlanning/meals",
            permittedRole: [],
          },
          {
            id: "customizationGroups",
            messageId: "sidebar.customizationGroups",
            title: "customizationGroups",
            type: "item",
            url: "/nutriplan/mealPlanning/customizationGroups",
            permittedRole: [],
          },
          {
            id: "customizationOptions",
            messageId: "sidebar.customizationOptions",
            title: "customizationOptions",
            type: "item",
            url: "/nutriplan/mealPlanning/customizationOptions",
            permittedRole: [],
          },
          {
            id: "customizePricing",
            messageId: "sidebar.customizePricing",
            title: "customizePricing",
            type: "item",
            url: "/nutriplan/mealPlanning/customizePricing",
            permittedRole: [],
          },
        ],
      },

      {
        id: "nutriplan-module-menusManagement",
        messageId: "sidebar.menusManagement.title",
        title: "sidebar.menusManagement.title",
        type: "collapse",
        children: [
          {
            id: "menus",
            messageId: "sidebar.menus",
            title: "menus",
            type: "item",
            url: "/nutriplan/menuManagement/menus",
            permittedRole: [],
          },
        ],

        //nutriplan/menuManagement/menus
      },
    ],
  },
  {
    id: "core-module",
    messageId: "sidebar.coreManagement.title",
    title: "workcoreout-module",
    type: "group",
    children: [
      {
        id: "core-module-submodule",
        messageId: "sidebar.core",
        title: "sidebar.core",
        type: "collapse",
        children: [
          {
            id: "coreModule.advertisements",
            messageId: "sidebar.advertisements",
            title: "coreModuleAdvertisements",
            type: "item",
            url: "core-module/advertisements",
          },
          {
            id: "coreModule.PhysicalActivityLevels",
            messageId: "coreModule.PhysicalActivityLevels",
            title: "coreModulePhysicalActivityLevels",
            type: "item",
            url: "/core-module/physical-activity-levels",
          },

          // {
          //   id: "coreModule.subscriptionPlans",
          //   messageId: "sidebar.subscriptionPlans",
          //   title: "subscriptionPlans",
          //   type: "item",
          //   url: "/core-module/subscriptionPlans",
          // },
          {
            id: "coreModule.banners",
            messageId: "sidebar.banners",
            title: "coreModuleBanners",
            type: "item",
            url: "core-module/banners",
          },
          //core-module/clientsManagement/payments
        ],
      },

      {
        id: "faqManagement",
        messageId: "sidebar.faqManagement.title",
        title: "sidebar.faqManagement.title",
        type: "collapse",
        children: [
          {
            id: "faqCategories",
            messageId: "sidebar.faqCategories",
            title: "faqCategories",
            type: "item",
            url: "core-module/faq-categories",
          },
          {
            id: "faqs",
            messageId: "sidebar.faqs",
            title: "faqs",
            type: "item",
            url: "core-module/faq",
          },
        ],
      },
    ],
  },

  {
    id: "clientsManagement",
    messageId: "sidebar.clientsManagement.title",
    title: "sidebar.clientsManagement.title",
    type: "group",
    children: [
      {
        id: "clients",
        messageId: "sidebar.clients",
        title: "clients",
        type: "collapse",
        children: [
          {
            id: "clientsss",
            messageId: "sidebar.clients",
            title: "clientss",
            type: "item",
            url: "/clientsManagement/clients",
          },
          {
            id: "payments",
            messageId: "sidebar.payments",
            title: "payments",
            type: "item",
            url: "/clientsManagement/payments",
          },

          {
            id: "clientSubscriptions",
            messageId: "sidebar.clientSubscriptions",
            title: "clientSubscriptions",
            type: "item",
            url: "/clientsManagement/clientSubscriptions",
          },
          {
            id: "clientAccountAccess",
            messageId: "sidebar.clientAccountAccess",
            title: "clientAccountAccess",
            type: "item",
            url: "/clientsManagement/clientAccountAccess",
          },
        ],
      },

      {
        id: "clientSlelections",
        messageId: "sidebare.clientSlelections",
        title: "clientSlelections",
        type: "collapse",
        children: [
          {
            id: "dailyMealSelections",
            messageId: "sidebar.dailyMealSelections",
            title: "dailyMealSelections",
            type: "item",
            url: "/clientsManagement/dailyMealSelections",
          },

          {
            id: "dailySelections",
            messageId: "sidebar.dailySelections",
            title: "dailySelections",
            type: "item",
            url: "/clientsManagement/dailySelections",
          },
        ],
      },

      {
        id: "kitchen",
        messageId: "sidebar.kitchen",
        title: "sidebar.kitchen",
        type: "collapse",
        children: [
          {
            id: "mealCount",
            messageId: "sidebar.kitchen.mealCount",
            title: "mealCount",
            type: "item",
            url: "/clientsManagement/kitchen/mealCount",
          },
          {
            id: "orderedMeal",
            messageId: "sidebar.kitchen.orderedMeal",
            title: "orderedMeal",
            type: "item",
            url: "/clientsManagement/kitchen/orderedMeals",
          },
        ],
      },
      {
        id: "discounts",
        messageId: "sidebar.discounts",
        title: "sidebar.discounts",
        type: "collapse",
        children: [
          {
            id: "discountRules",
            messageId: "discountRules.name",
            title: "discountRules",
            type: "item",
            url: "/clientsManagement/discounts/discountRules",
          },
          // Promo Codes UI merged into Discount Rules (same DiscountRules API)
          // {
          //   id: "promoCodes",
          //   messageId: "promoCodes.name",
          //   title: "promoCodes",
          //   type: "item",
          //   url: "/clientsManagement/discounts/promoCodes",
          // },
          {
            id: "promoBanks",
            messageId: "promoBanks.name",
            title: "promoBanks",
            type: "item",
            url: "/clientsManagement/discounts/banks",
          },
        ],
      },

      {
        id: "challenges",
        messageId: "sidebar.challenges",
        title: "challenges",
        type: "item",
        url: "/clientsManagement/challenges",
      },

      {
        id: "leaderboard",
        messageId: "sidebar.leaderboard",
        title: "leaderboard",
        type: "item",
        url: "/clientsManagement/leaderboard",
      },

      {
        id: "homeBanners",
        messageId: "sidebar.homeBanners",
        title: "homeBanners",
        type: "item",
        url: "/clientsManagement/homeBanners",
      },

      {
        id: "clientPortalSettings",
        messageId: "sidebar.clientPortalSettings",
        title: "clientPortalSettings",
        type: "item",
        url: "/clientsManagement/clientPortalSettings",
      },

      //clientsManagement/clientPortalSettings clientsManagement/dailySelections
    ],
  },

  {
    id: "usersManagement",
    messageId: "sidebar.usersManagement.title",
    title: "sidebar.usersManagement.title",
    type: "group",
    children: [
      {
        id: "admins",
        messageId: "sidebar.admins",
        title: "admins",
        type: "item",
        url: "/usersManagement/admins",
      },
    ],
  },
];
console.log("ROUTES CONFIG RELOADED", routesConfig);
export default routesConfig;
