/** @format */

import React from "react";
const DashboardPage = React.lazy(() => import("src/pages/dashboard"));
const MealRatingsDashboard = React.lazy(() => import("src/pages/dashboard/MealRatingsDashboard"));
const TopRatedDishes = React.lazy(() => import("src/pages/dashboard/TopRatedDishes"));
const DishRatingDetails = React.lazy(() => import("src/pages/dashboard/DishRatingDetails"));
const LowRatingAlerts = React.lazy(() => import("src/pages/dashboard/LowRatingAlerts"));
const AllFeedback = React.lazy(() => import("src/pages/dashboard/AllFeedback"));
const NotificationLogsDashboard = React.lazy(() => import("src/pages/dashboard/NotificationLogsDashboard"));
const ManageNotificationsPage = React.lazy(() => import("src/pages/dashboard/notificationLogs/ManageNotificationsPage"));

export const DashboardRoutes = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/meal-ratings",
    element: <MealRatingsDashboard />,
  },
  {
    path: "/notification-logs",
    element: <NotificationLogsDashboard />,
  },
  {
    path: "/notification-logs/manage",
    element: <ManageNotificationsPage />,
  },
  {
    path: "/meal-ratings/top-rated-dishes",
    element: <TopRatedDishes />,
  },
  {
    path: "/meal-ratings/low-rating-alerts",
    element: <LowRatingAlerts />,
  },
  {
    path: "/meal-ratings/dish-rating-details",
    element: <DishRatingDetails />,
  },
  {
    path: "/meal-ratings/all-feedback",
    element: <AllFeedback />,
  },
];
