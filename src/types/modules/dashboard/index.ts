/** @format */

export interface StateCardType {
  name: string;
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

export interface InfoWidgetType {
  icon: React.ReactNode;
  count: string | number;
  title: string;
  color?: string;
}
