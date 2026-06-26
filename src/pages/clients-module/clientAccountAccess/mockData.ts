/** @format */

import dayjs from "dayjs";
import {
  ActivityLogRow,
  ClientAccountData,
  DeliveryDay,
  MealSlot,
} from "./types";

export const mockClient: ClientAccountData = {
  id: "1",
  customerId: "CLT-2024-00847",
  fullName: "Sarah Al-Mansouri",
  email: "sarah.mansouri@email.com",
  phone: "+971 50 123 4567",
  gender: "Female",
  birthDate: "1992-03-18",
  deliveryAddress: "Marina Tower, Apt 1204, Dubai Marina, Dubai, UAE",
  subscriptionStatus: "Active",
  subscriptionStartDate: "2025-01-15",
  subscriptionEndDate: "2025-04-15",
  isActive: true,
  activeMealPlan: "Lean Muscle — 1800 kcal",
  calories: 1800,
  mealsPerDay: 4,
  remainingDays: 42,
  totalDeliveredMeals: 186,
  upcomingDeliveries: 28,
  accessStatus: "Active",
  lastLoginDate: "2026-06-14T09:32:00",
  heightInCM: 168,
  weightInKG: 72,
  targetWeightInKG: 65,
  bodyFat: 24.5,
  bmi: 25.5,
  bmr: 1480,
  tdee: 2100,
  activityValue: 1.55,
  dietitianGoal: "LoseWeight",
  neededCaloriesToReachGoal: 1650,
  timeToReachGoalInDays: 84,
  clientAllergics: [
    { nameEn: "Peanuts", nameAr: "فول سوداني" },
    { nameEn: "Shellfish", nameAr: "محار" },
    { nameEn: "Dairy", nameAr: "ألبان" },
  ],
};

const mealPlans = [
  "Grilled Chicken Bowl",
  "Mediterranean Salad",
  "Salmon & Quinoa",
  "Protein Oats",
  "Turkey Wrap",
  "Greek Yogurt Parfait",
];

const statuses: Array<DeliveryDay["status"]> = [
  "Delivered",
  "Pending",
  "Skipped",
  "Moved",
];

export const buildDeliveryCalendar = (month: dayjs.Dayjs): DeliveryDay[] => {
  const days: DeliveryDay[] = [];
  const start = month.startOf("month");
  const end = month.endOf("month");

  for (
    let d = start;
    d.isBefore(end) || d.isSame(end, "day");
    d = d.add(1, "day")
  ) {
    const dayNum = d.date();
    const status = statuses[dayNum % statuses.length];
    days.push({
      date: d.format("YYYY-MM-DD"),
      status,
      deliveryMethod: "Online",
      mealPlan: "Lean Muscle — 1800 kcal",
      breakfast: mealPlans[dayNum % mealPlans.length],
      lunch: mealPlans[(dayNum + 1) % mealPlans.length],
      dinner: mealPlans[(dayNum + 2) % mealPlans.length],
      postWorkout: mealPlans[(dayNum + 3) % mealPlans.length],
      ...(status === "Moved" ? { movedToDate: d.add(2, "day").format("YYYY-MM-DD") } : {}),
    });
  }
  return days;
};

export const mockActivityLogs: ActivityLogRow[] = [
  {
    id: "1",
    action: "Delivery Moved",
    performedBy: "Admin — John Smith",
    previousValue: "2025-06-10",
    newValue: "2025-06-12",
    date: "2025-06-08",
    time: "14:32",
  },
  {
    id: "2",
    action: "Meal Plan Changed",
    performedBy: "Admin — Jane Doe",
    previousValue: "1600 kcal Standard",
    newValue: "1800 kcal Lean Muscle",
    date: "2025-06-05",
    time: "09:15",
  },
  {
    id: "3",
    action: "Additional Item Added",
    performedBy: "Admin — John Smith",
    previousValue: "—",
    newValue: "Protein Shake x2",
    date: "2025-06-03",
    time: "16:48",
  },
  {
    id: "4",
    action: "Delivery Cancelled",
    performedBy: "System",
    previousValue: "Pending — 2025-06-01",
    newValue: "Cancelled",
    date: "2025-05-31",
    time: "22:00",
  },
  {
    id: "5",
    action: "Client Unblocked",
    performedBy: "Admin — Jane Doe",
    previousValue: "Blocked",
    newValue: "Active",
    date: "2025-05-28",
    time: "11:20",
  },
];

export const mockMealSlots: MealSlot[] = [
  { slot: "Breakfast", currentMeal: "Protein Oats with Berries" },
  { slot: "Lunch", currentMeal: "Grilled Chicken Bowl" },
  { slot: "Dinner", currentMeal: "Salmon & Quinoa" },
  { slot: "Post Workout", currentMeal: "Greek Yogurt Parfait" },
];

export const dishOptions = [
  "Grilled Chicken Bowl",
  "Mediterranean Salad",
  "Salmon & Quinoa",
  "Turkey Wrap",
  "Veggie Buddha Bowl",
  "Beef Stir Fry",
  "Tuna Poke Bowl",
];

export const additionalItemOptions = {
  Meals: ["Grilled Chicken Bowl", "Salmon & Quinoa", "Turkey Wrap"],
  Snacks: ["Protein Bar", "Mixed Nuts", "Rice Cakes"],
  Drinks: ["Protein Shake", "Green Smoothie", "Cold Brew Coffee"],
};
