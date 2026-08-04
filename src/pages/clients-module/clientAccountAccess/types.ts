/** @format */

import { ActivityLogActionTypeFilter } from "./activityLogActionTypes";

export type DeliveryStatus =
  | "Delivered"
  | "Pending"
  | "Skipped"
  | "Moved"
  | "Unavailable"
  | "Cancelled";

export type AccessStatus = "Active" | "Blocked" | "TemporaryBlock";

export interface ClientAllergen {
  nameEn: string;
  nameAr: string;
}

export interface ClientAccountData {
  id: string;
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  deliveryAddress: string;
  deliveryAddresses?: any[];
  subscriptionStatus: string;
  /** From API `subscription.subscriptionOrderType` — e.g. "New" or "Renewal". */
  subscriptionOrderType?: string;
  isRenewalSubscription?: boolean;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  isActive: boolean;
  avatarUrl?: string;
  activeMealPlan: string;
  calories: number;
  mealsPerDay: number;
  remainingDays: number;
  totalDeliveredMeals: number;
  upcomingDeliveries: number;
  accessStatus: AccessStatus;
  rawAccessStatus: string;
  blockOption: number;
  blockedOn?: string;
  blockExpiryDate?: string;
  lastLoginDate?: string;
  // Health & goals (from client detail screen)
  heightInCM: number;
  weightInKG: number;
  targetWeightInKG: number;
  bodyFat: number;
  bmi: number;
  bmr: number;
  tdee: number;
  activityValue: number;
  dietitianGoal: string;
  neededCaloriesToReachGoal: number;
  timeToReachGoalInDays: number;
  clientAllergics: ClientAllergen[];
}

export interface DeliveryDay {
  date: string;
  status: DeliveryStatus;
  scheduleLabel?: string | null;
  mealCount?: number;
  dailySelectionId?: string | null;
  deliveryMethod?: string;
  mealPlan?: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  postWorkout?: string;
  movedToDate?: string;
}

export interface ActivityLogRow {
  id: string;
  action: string;
  actionType?: number;
  performedBy: string;
  previousValue: string;
  newValue: string;
  date: string;
  time: string;
}

export type ActivityLogFilters = {
  date: string;
  actionType: ActivityLogActionTypeFilter;
};

export const defaultActivityLogFilters: ActivityLogFilters = {
  date: "",
  actionType: "all",
};

export const emptyClientAccountData: ClientAccountData = {
  id: "",
  customerId: "",
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  deliveryAddress: "",
  subscriptionStatus: "",
  subscriptionOrderType: "",
  isRenewalSubscription: false,
  subscriptionStartDate: "",
  subscriptionEndDate: "",
  isActive: false,
  activeMealPlan: "",
  calories: 0,
  mealsPerDay: 0,
  remainingDays: 0,
  totalDeliveredMeals: 0,
  upcomingDeliveries: 0,
  accessStatus: "Active",
  rawAccessStatus: "Active",
  blockOption: 0,
  heightInCM: 0,
  weightInKG: 0,
  targetWeightInKG: 0,
  bodyFat: 0,
  bmi: 0,
  bmr: 0,
  tdee: 0,
  activityValue: 0,
  dietitianGoal: "",
  neededCaloriesToReachGoal: 0,
  timeToReachGoalInDays: 0,
  clientAllergics: [],
};

export interface MealSlot {
  slot: "Breakfast" | "Lunch" | "Dinner" | "Post Workout";
  currentMeal: string;
}
