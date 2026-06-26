import { Box, Typography, Grid, Chip, Stack, Button, Slider, alpha, useTheme, Divider, Select, MenuItem, FormControl, Switch, Tabs, Tab, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SpaIcon from "@mui/icons-material/Spa";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const addonTabs = ["Meals", "Snacks", "Drinks", "Supplements"];

const products = [
  { id: "p1", name: "Protein Bar", description: "20g protein, chocolate flavor", price: 20, category: "Snacks" },
  { id: "p2", name: "Meal Prep Snack", description: "Mixed nuts and dried berries", price: 15, category: "Snacks" },
  { id: "p3", name: "Protein Shake", description: "30g whey isolate", price: 25, category: "Drinks" },
  { id: "p4", name: "Green Smoothie", description: "Kale, spinach, apple, ginger", price: 22, category: "Drinks" },
  { id: "p5", name: "Extra Chicken Breast", description: "150g grilled chicken", price: 30, category: "Meals" },
  { id: "p6", name: "Multivitamin Pack", description: "30 day supply", price: 120, category: "Supplements" },
];

const plans = [
  {
    id: "lean_muscle",
    title: "Lean Muscle",
    calories: "1800 kcal",
    mealsPerDay: "4 meals/day",
    features: "High Protein",
    price: "850 AED / month",
    icon: <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />
  },
  {
    id: "weight_loss",
    title: "Weight Loss",
    calories: "1500 kcal",
    mealsPerDay: "4 meals/day",
    features: "Calorie Deficit",
    price: "750 AED / month",
    icon: <RestaurantMenuIcon sx={{ color: "primary.main" }} />
  },
  {
    id: "keto_balance",
    title: "Keto Balance",
    calories: "1700 kcal",
    mealsPerDay: "3 meals/day",
    features: "Low Carb",
    price: "820 AED / month",
    icon: <SpaIcon sx={{ color: "primary.main" }} />
  },
];

const variants = ["Standard", "Vegetarian", "Vegan", "Gluten Free"];
const calorieOptions = ["1500", "1800", "2000", "2500"];
const mealOptions = ["Breakfast", "Lunch", "Dinner", "Post Workout"];

type Props = {
  subscriptionMode: "new" | "renew";
  selectedPlan: string;
  setSelectedPlan: (val: string) => void;
  selectedVariant: string;
  setSelectedVariant: (val: string) => void;
  selectedCalories: string;
  setSelectedCalories: (val: string) => void;
  proteinTarget: number;
  setProteinTarget: (val: number) => void;
  selectedMeals: string[];
  setSelectedMeals: (val: string[]) => void;
  enableAddons: boolean;
  setEnableAddons: (val: boolean) => void;
  addonTab: number;
  setAddonTab: (val: number) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onNext: () => void;
  onBack?: () => void;
};

const Step1Configuration = (props: Props) => {
  const theme = useTheme();

  const activeCategory = addonTabs[props.addonTab];
  const displayedProducts = products.filter(p => p.category === activeCategory);

  const updateQuantity = (product: typeof products[0], delta: number) => {
    props.setCart((prevCart: CartItem[]) => {
      const existing = prevCart.find(c => c.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prevCart.filter(c => c.id !== product.id);
        return prevCart.map(c => c.id === product.id ? { ...c, quantity: newQty } : c);
      } else {
        if (delta > 0) {
          return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: delta }];
        }
        return prevCart;
      }
    });
  };

  const getQuantity = (id: string) => {
    return props.cart.find(c => c.id === id)?.quantity || 0;
  };

  const toggleMeal = (meal: string) => {
    props.setSelectedMeals(
      props.selectedMeals.includes(meal)
        ? props.selectedMeals.filter((m) => m !== meal)
        : [...props.selectedMeals, meal]
    );
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Meal Plan</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>Choose the best plan for your client.</Typography>
        <Typography sx={{ color: "primary.main", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View all plans →</Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {plans.map((plan) => {
          const isSelected = props.selectedPlan === plan.id;
          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Box
                onClick={() => props.setSelectedPlan(plan.id)}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "#E2E8F0",
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.02) : "#FFFFFF",
                  position: "relative",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isSelected ? "0 12px 24px -4px rgba(16, 185, 129, 0.15)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: isSelected ? "primary.main" : "#CBD5E1",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)"
                  }
                }}
              >
                {isSelected && (
                  <CheckCircleIcon sx={{ position: "absolute", top: 16, right: 16, color: "primary.main", fontSize: 24 }} />
                )}
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  {plan.icon}
                </Box>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>{plan.title}</Typography>
                <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2, fontWeight: 500 }}>
                  {plan.calories} • {plan.mealsPerDay}
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "primary.main", mt: "auto" }}>AED {plan.price.split(' ')[0]} <Typography component="span" sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>/ month</Typography></Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>Plan Variant</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>Select plan variant</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={props.selectedVariant}
                onChange={(e) => props.setSelectedVariant(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: "#F8FAFC", "& fieldset": { borderColor: "#E2E8F0" } }}
              >
                {variants.map((v) => (
                  <MenuItem key={v} value={v} sx={{ fontWeight: 500, fontSize: 14 }}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Calories</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>Daily calorie intake</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {calorieOptions.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  onClick={() => props.setSelectedCalories(c)}
                  sx={{
                    fontWeight: 600,
                    px: 1,
                    py: 2.5,
                    borderRadius: 2,
                    fontSize: 14,
                    border: "1px solid",
                    borderColor: props.selectedCalories === c ? "primary.main" : "#E2E8F0",
                    bgcolor: props.selectedCalories === c ? "primary.main" : "#F8FAFC",
                    color: props.selectedCalories === c ? "#fff" : "#475569",
                    "&:hover": { bgcolor: props.selectedCalories === c ? "primary.dark" : "#F1F5F9" }
                  }}
                />
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Protein Target</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>Daily protein goal</Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #E2E8F0", borderRadius: 2, p: 1, width: "100%", justifyContent: "space-between" }}>
              <Button size="small" onClick={() => props.setProteinTarget(Math.max(50, props.proteinTarget - 5))} sx={{ minWidth: 40, color: "text.secondary" }}>-</Button>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{props.proteinTarget}g</Typography>
              <Button size="small" onClick={() => props.setProteinTarget(Math.min(300, props.proteinTarget + 5))} sx={{ minWidth: 40, color: "text.secondary" }}>+</Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Meals Included</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>(Meals will be provided daily)</Typography>
            <Grid container spacing={3}>
              {mealOptions.map((meal) => {
                const isSelected = props.selectedMeals.includes(meal);
                const icons: Record<string, React.ReactNode> = {
                  "Breakfast": <FreeBreakfastIcon sx={{ fontSize: 20 }} />,
                  "Lunch": <LunchDiningIcon sx={{ fontSize: 20 }} />,
                  "Dinner": <DinnerDiningIcon sx={{ fontSize: 20 }} />,
                  "Post Workout": <FitnessCenterIcon sx={{ fontSize: 20 }} />
                };
                return (
                  <Grid item xs={6} md={3} key={meal}>
                    <Box
                      onClick={() => toggleMeal(meal)}
                      sx={{
                        px: 3,
                        py: 4,
                        borderRadius: 3,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        border: "2px solid",
                        borderColor: isSelected ? "primary.main" : "#E2E8F0",
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : "#fff",
                        "&:hover": { borderColor: "primary.main" },
                        transition: "all 0.2s",
                        position: "relative"
                      }}
                    >
                      <Box sx={{ color: isSelected ? "primary.main" : "text.secondary", display: "flex", alignItems: "center" }}>
                        {icons[meal]}
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: isSelected ? "primary.main" : "#475569" }}>
                        {meal}
                      </Typography>
                      {isSelected && <CheckCircleIcon sx={{ ml: "auto", fontSize: 18, color: "primary.main" }} />}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 6 }} />

      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>Additional Items</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 4 }}>Configure extra items to be included with this subscription.</Typography>

        <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
              <Tabs value={props.addonTab} onChange={(_, val) => props.setAddonTab(val)} aria-label="addon tabs">
                {addonTabs.map(t => (
                  <Tab key={t} label={t} sx={{ fontWeight: 600, textTransform: "none", fontSize: 15 }} />
                ))}
              </Tabs>
            </Box>

            <Grid container spacing={3}>
              {displayedProducts.map(prod => {
                const qty = getQuantity(prod.id);
                const isSelected = qty > 0;
                return (
                  <Grid item xs={12} md={6} key={prod.id}>
                    <Box sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "#E2E8F0",
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#F8FAFC",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                        <Typography sx={{ fontSize: 24 }}>📦</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>{prod.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>{prod.description}</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "primary.main" }}>{prod.price} AED</Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: isSelected ? "primary.main" : "#fff", border: "1px solid", borderColor: isSelected ? "primary.main" : "#E2E8F0", borderRadius: 2, p: 0.5 }}>
                        <IconButton size="small" onClick={() => updateQuantity(prod, -1)} sx={{ color: isSelected ? "#fff" : "text.secondary" }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: isSelected ? "#fff" : "#0F172A", minWidth: 20, textAlign: "center" }}>
                          {qty}
                        </Typography>
                        <IconButton size="small" onClick={() => updateQuantity(prod, 1)} sx={{ color: isSelected ? "#fff" : "text.secondary" }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {props.cart.length > 0 && (
              <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #E2E8F0" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 2 }}>Added Items</Typography>
                <Grid container spacing={2}>
                  {props.cart.map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 3, border: "1px solid #E2E8F0", bgcolor: "#F8FAFC" }}>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>{item.quantity}x {item.name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>{(item.price * item.quantity).toFixed(2)} AED</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: props.onBack ? "space-between" : "flex-end", alignItems: "center" }}>
        {props.onBack && (
          <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
            Back
          </Button>
        )}
        <Button variant="contained" size="large" onClick={props.onNext} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
          Next →
        </Button>
      </Box>
    </Box>
  );
};

export default Step1Configuration;
