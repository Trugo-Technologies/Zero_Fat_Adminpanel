import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { additionalItemOptions } from "../mockData";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

const categories = ["Meals", "Snacks", "Drinks"] as const;

type CartItem = {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

const AdditionalItemsModal = ({ open, onClose, onSave }: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  const category = categories[tab];
  const items = additionalItemOptions[category];
  const unitPrice = 12.5;

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const existingItemIndex = cart.findIndex((item) => item.name === selectedItem);
    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(),
          name: selectedItem,
          quantity,
          unitPrice,
          category,
        },
      ]);
    }
    setSelectedItem("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    setSelectedItem("");
    setQuantity(1);
    setCart([]);
    onClose();
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {messages["clientAccountAccess.additionalItems"] as string}
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setSelectedItem(""); }} sx={{ mb: 2 }}>
          {categories.map((cat) => (
            <Tab
              key={cat}
              label={messages[`clientAccountAccess.category.${cat.toLowerCase()}` as keyof typeof messages] as string}
            />
          ))}
        </Tabs>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>{messages["clientAccountAccess.selectItem"] as string}</InputLabel>
            <Select
              value={selectedItem}
              label={messages["clientAccountAccess.selectItem"] as string}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {items.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, px: 1 }}>
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || !selectedItem}
            >
              <RemoveIcon fontSize="small" color="primary" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 24, textAlign: "center" }}>
              {quantity}
            </Typography>
            <IconButton size="small" onClick={() => setQuantity((q) => q + 1)} disabled={!selectedItem}>
              <AddIcon fontSize="small" color="primary" />
            </IconButton>
          </Stack>
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          disabled={!selectedItem}
          onClick={handleAddToCart}
          sx={{ mb: 3 }}
        >
          Add to List
        </Button>

        {cart.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 14 }}>
              Items Added
            </Typography>
            <List sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 0 }}>
              {cart.map((item, index) => (
                <Box key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={`AED ${item.unitPrice.toFixed(2)} x ${item.quantity}`}
                      secondaryTypographyProps={{ fontSize: 13 }}
                    />
                    <ListItemSecondaryAction>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, display: "inline-block", mr: 2 }}>
                        AED {(item.unitPrice * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id)}>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="body2">Total Price</Typography>
          <Typography variant="h5" fontWeight={700}>
            AED {cartTotal.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} sx={{ borderRadius: 2 }}>
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={() => { onSave(); handleClose(); }}
          disabled={cart.length === 0}
          sx={{ borderRadius: 2 }}
        >
          {messages["common.save"] as string}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalItemsModal;
