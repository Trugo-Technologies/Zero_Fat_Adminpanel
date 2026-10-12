/** @format */

import ClientPortalSettingsPage from "src/pages/clients-module/clientPortalSettings/ClientPortalSettingsPage";
import ClientsPage from "src/pages/clients-module/clients/ClientsPage";
import ClientsProfile from "src/pages/clients-module/clients/ClientsProfile";
import ClientSubscriptionsPage from "src/pages/clients-module/clientSubscriptions/ClientSubscriptionsPage";
import DailyMealSelectionsPage from "src/pages/clients-module/dailyMealSelections/DailyMealSelectionsPage";
import DailySelectionsPage from "src/pages/clients-module/dailySelections/DailySelectionsPage";
import DiscountRulesPage from "src/pages/clients-module/discounts/discountRules/DiscountRulesPage";
// import PromoCodesPage from "src/pages/clients-module/discounts/promoCodes/PromoCodesPage";
import BanksPage from "src/pages/clients-module/discounts/banks/BanksPage";
import KitchenMealCountPage from "src/pages/clients-module/kitchen/mealCount/KitchenMealCountPage";
import KitchenOrderedMealPage from "src/pages/clients-module/kitchen/orderedMeal/KitchenOrderedMealPage";
import PaymentsPage from "src/pages/clients-module/payments/PaymentsPage";
import ClientAccountAccessPage from "src/pages/clients-module/clientAccountAccess";
import ClientNotificationsPage from "src/pages/clients-module/clientAccountAccess/ClientNotificationsPage";
import CreateSubscriptionPage from "src/pages/clients-module/clientAccountAccess/CreateSubscriptionPage";
import ChallengesPage from "src/pages/clients-module/challenges/ChallengesPage";
import ChallengeParticipantsPage from "src/pages/clients-module/challenges/ChallengeParticipantsPage";
import ChallengeParticipantDetailsPage from "src/pages/clients-module/challenges/ChallengeParticipantDetailsPage";
import ChallengeParticipantReviewPage from "src/pages/clients-module/challenges/ChallengeParticipantReviewPage";
import LeaderboardPage from "src/pages/clients-module/leaderboard/LeaderboardPage";
import HomeBannersPage from "src/pages/clients-module/homeBanners/HomeBannersPage";

export const clientsModuleRoutes = [
  { element: <ClientsPage />, path: "/clientsManagement/clients" },
  {
    element: <ClientAccountAccessPage />,
    path: "/clientsManagement/clientAccountAccess",
  },
  {
    element: <ClientNotificationsPage />,
    path: "/clientsManagement/clientAccountAccess/notifications",
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
  // Promo Codes merged into Discount Rules
  // {
  //   element: <PromoCodesPage />,
  //   path: "/clientsManagement/discounts/promoCodes",
  // },
  {
    element: <BanksPage />,
    path: "/clientsManagement/discounts/banks",
  },

  // challenges (UI-only / mock data)
  {
    element: <ChallengesPage />,
    path: "/clientsManagement/challenges",
  },
  {
    element: <ChallengeParticipantsPage />,
    path: "/clientsManagement/challenges/:challengeId/participants",
  },
  {
    element: <ChallengeParticipantReviewPage />,
    path: "/clientsManagement/challenges/:challengeId/participants/:participantId/review",
  },
  {
    element: <ChallengeParticipantDetailsPage />,
    path: "/clientsManagement/challenges/:challengeId/participants/:participantId",
  },

  // leaderboard (UI-only / mock data)
  {
    element: <LeaderboardPage />,
    path: "/clientsManagement/leaderboard",
  },

  // home banners / meal offers for mobile home (UI-only / mock data)
  {
    element: <HomeBannersPage />,
    path: "/clientsManagement/homeBanners",
  },
];
