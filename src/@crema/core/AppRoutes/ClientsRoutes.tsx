/** @format */

import ClientPortalSettingsPage from "src/pages/clients-module/clientPortalSettings/ClientPortalSettingsPage";
import ClientsPage from "src/pages/clients-module/clients/ClientsPage";
import ClientsProfile from "src/pages/clients-module/clients/ClientsProfile";
import ClientSubscriptionsPage from "src/pages/clients-module/clientSubscriptions/ClientSubscriptionsPage";
import DailyMealSelectionsPage from "src/pages/clients-module/dailyMealSelections/DailyMealSelectionsPage";
import DailySelectionsPage from "src/pages/clients-module/dailySelections/DailySelectionsPage";
import DiscountRulesPage from "src/pages/clients-module/discounts/discountRules/DiscountRulesPage";
import KitchenMealCountPage from "src/pages/clients-module/kitchen/mealCount/KitchenMealCountPage";
import KitchenOrderedMealPage from "src/pages/clients-module/kitchen/orderedMeal/KitchenOrderedMealPage";
import PaymentsPage from "src/pages/clients-module/payments/PaymentsPage";
import ClientAccountAccessPage from "src/pages/clients-module/clientAccountAccess";
import CreateSubscriptionPage from "src/pages/clients-module/clientAccountAccess/CreateSubscriptionPage";

export const clientsModuleRoutes = [
  { element: <ClientsPage />, path: "/clientsManagement/clients" },
  {
    element: <ClientAccountAccessPage />,
    path: "/clientsManagement/clientAccountAccess",
  },
  {
    element: <CreateSubscriptionPage />,
    path: "/clientsManagement/createSubscription",
  },
  { element: <PaymentsPage />, path: "/clientsManagement/payments" },

  {
    element: <ClientsProfile />,
    path: "/clientsManagement/clients/profile/:clientIdParams/*",
  },

  {
    element: <ClientSubscriptionsPage />,
    path: "/clientsManagement/clientSubscriptions",
  },

  {
    element: <ClientPortalSettingsPage />,
    path: "/clientsManagement/clientPortalSettings",
  },

  {
    element: <DailySelectionsPage />,
    path: "/clientsManagement/dailySelections",
  },

  {
    element: <DailyMealSelectionsPage />,
    path: "/clientsManagement/dailyMealSelections",
  },

  {
    element: <KitchenMealCountPage />,
    path: "/clientsManagement/kitchen/mealCount",
  },

  {
    element: <KitchenOrderedMealPage />,
    path: "/clientsManagement/kitchen/orderedMeals",
  },

  // discounts
  {
    element: <DiscountRulesPage />,
    path: "/clientsManagement/discounts/discountRules",
  },
  //ClientPortalSettingsPage ClientsProfile DailySelectionsPage DailyMealSelectionsPage sidebar.kitchen.mealCount
];
