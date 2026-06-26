/** @format */

import AdvertisementsPage from "src/pages/core-module/advertisements/advertisementsPage";
import BannersPage from "src/pages/core-module/banners/BannersPage";
import FaqPage from "src/pages/core-module/faq/faqPage";
import FaqCategoriesPage from "src/pages/core-module/faqCategories/faqCategoriesPage";
import PhysicalActivityLevelsPage from "src/pages/core-module/physicalActivityLevels/physicalActivityLevelsPage";
// import SubscriptionPlansPage from "src/pages/core-module/subscriptionPlans";

export const coreModuleRoutes = [
  { element: <FaqCategoriesPage />, path: "/core-module/faq-categories" },
  { element: <FaqPage />, path: "/core-module/faq" },
  { element: <AdvertisementsPage />, path: "/core-module/advertisements" },
  { element: <BannersPage />, path: "/core-module/banners" },

  {
    element: <PhysicalActivityLevelsPage />,
    path: "/core-module/physical-activity-levels",
  },

  // {
  //   element: <SubscriptionPlansPage />,
  //   path: "/core-module/subscriptionPlans",
  // },
];
