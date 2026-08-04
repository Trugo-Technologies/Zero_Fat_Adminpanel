/** @format */

export interface StateCardType {
  name: string;
  label?: string;
  value: string | number;
  color: string;
  icon: string | React.ReactNode;
}

export type MinBarChartType = {
  name: string;
  value: number;
  color: string;
};

export type MinPieChartType = {
  color: string;
  title: string;
  value: number;
};

export interface WorkoutStatistics {
  trainers: number;
  plans: number;
  exercsises: number;
  workouts: number;
  plansByLevel: { Advanced: number; Beginner: number; Intermediate: number };
  plansByEnvironment: { Gym: number; Home: number };
  workoutsByFormat: { FollowAlong: number; SetsReps: number };
}

export interface NutriplanStatistics {
  mealPlans: number;
  meals: number;
  ingredients: number;
  menus: number;
  mealByCuisineType: {
    Chinese: number;
    Indian: number;
    Italian: number;
    Mediterranean: number;
    MiddleEastern: number;
  };
}
export interface ClientsStatistics {
  clients: number;
  maleCount: number;
  femaleCount: number;
  subscriptions: number;
  totalPaymentsLastMonth: number;
  clientsByDietitianGoal: {
    GainWeight: number;
    LoseWeight: number;
    LoseFat: number;
    BuildMuscles: number;
  };
  subscriptionsByType: {
    OneMonth: number;
    OneWeek: number;
    ThreeMonths: number;
  };
}

export interface ClientsReportSummary {
  period: string | null;
  fromDate: string | null;
  toDate: string | null;
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  deletedAccounts: number;
  clientsWithSubscription: number;
  clientsWithoutSubscription: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  renewSubscriptions: number;
  totalSubscriptionRevenue: number;
  bySubscriptionStatus: Record<string, number>;
  byGender: Record<string, number>;
  byDietitianGoal: Record<string, number>;
  byBlockOption: Record<string, number>;
  byMealPlan: Record<string, number>;
  byCity: Record<string, number>;
  byAddOnCategory: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  byPlatform: Record<string, number>;
}

export interface KitchenMealCountReportSummary {
  period?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  [key: string]: string | number | null | undefined | Record<string, number>;
}

export interface MealRatingsSummary {
  totalRatings: number;
  notGood: number;
  good: number;
  awesome: number;
}

export interface DashboardSubscriptionCounts {
  active: number;
  pending: number;
  expired: number;
  cancelled: number;
}

export interface DashboardPaymentCounts {
  paid: number;
  pending: number;
  failed: number;
  refunded: number;
  cancelled: number;
  partiallyPaid: number;
}

export interface InfoWidgetType {
  icon: React.ReactNode;
  count: string | number;
  title: string;
  color?: string;
}
