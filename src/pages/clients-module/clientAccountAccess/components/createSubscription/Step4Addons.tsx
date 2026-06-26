import { Box, Typography, Stack, Button, Grid, Tabs, Tab, IconButton, alpha } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const tabs = ["Meals", "Snacks", "Drinks", "Supplements"];

const products = [
  { id: "p1", name: "Protein Bar", description: "20g protein, chocolate flavor", price: 20, category: "Snacks" },
  { id: "p2", name: "Meal Prep Snack", description: "Mixed nuts and dried berries", price: 15, category: "Snacks" },
  { id: "p3", name: "Protein Shake", description: "30g whey isolate", price: 25, category: "Drinks" },
  { id: "p4", name: "Green Smoothie", description: "Kale, spinach, apple, ginger", price: 22, category: "Drinks" },
  { id: "p5", name: "Extra Chicken Breast", description: "150g grilled chicken", price: 30, category: "Meals" },
  { id: "p6", name: "Multivitamin Pack", description: "30 day supply", price: 120, category: "Supplements" },
];

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  addonTab: number;
  setAddonTab: (val: number) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onBack: () => void;
  onNext: () => void;
};

const Step4Addons = (props: Props) => {
  const activeCategory = tabs[props.addonTab];
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

  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Additional Items</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 4 }}>Add extra meals, snacks, or drinks to the subscription</Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={props.addonTab} onChange={(_, val) => props.setAddonTab(val)} aria-label="addon tabs">
          {tabs.map(t => (
            <Tab key={t} label={t} sx={{ fontWeight: 600, textTransform: "none", fontSize: 15 }} />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
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
                bgcolor: isSelected ? alpha("#10B981", 0.03) : "#fff",
                display: "flex",
                alignItems: "center"
              }}>
                <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <Typography sx={{ fontSize: 20 }}>📦</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A", mb: 0.5 }}>{prod.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>{prod.description}</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "primary.main" }}>{prod.price} AED</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: isSelected ? "primary.main" : "#F8FAFC", borderRadius: 2, p: 0.5 }}>
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

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
          Back
        </Button>
        <Button variant="contained" size="large" onClick={props.onNext} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step4Addons;
