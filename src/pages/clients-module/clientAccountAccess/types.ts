/** @format */

export type DeliveryStatus = "Delivered" | "Pending" | "Skipped" | "Moved";

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
  deliveryMethod: string;
  mealPlan: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  postWorkout: string;
  movedToDate?: string;
}

export interface ActivityLogRow {
  id: string;
  action: string;
  performedBy: string;
  previousValue: string;
  newValue: string;
  date: string;
  time: string;
}

export interface MealSlot {
  slot: "Breakfast" | "Lunch" | "Dinner" | "Post Workout";
  currentMeal: string;
}
