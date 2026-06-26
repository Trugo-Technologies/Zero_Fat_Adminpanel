import { Box, Typography, Stack, Button, Grid, TextField, alpha } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";

const savedAddresses = [
  { id: "home", label: "Home", type: "home", icon: <HomeIcon /> },
  { id: "office", label: "Office", type: "office", icon: <BusinessIcon /> },
  { id: "add_new", label: "Add New Address", type: "new", icon: <AddIcon /> },
];

type Props = {
  selectedAddressId: string;
  setSelectedAddressId: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const Step3Address = (props: Props) => {
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Delivery Address</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 4 }}>Select a saved address or enter a new one</Typography>

      <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 2 }}>Saved Addresses</Typography>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {savedAddresses.map((addr) => {
          const isSelected = props.selectedAddressId === addr.id;
          return (
            <Grid item xs={12} md={4} key={addr.id}>
              <Box
                onClick={() => props.setSelectedAddressId(addr.id)}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "#E2E8F0",
                  bgcolor: isSelected ? alpha("#10B981", 0.03) : "#fff",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? "0 4px 12px rgba(16, 185, 129, 0.1)" : "none",
                  "&:hover": { borderColor: isSelected ? "primary.main" : "#CBD5E1" }
                }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: isSelected ? "primary.main" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: isSelected ? "#fff" : "#475569", mb: 1.5 }}>
                  {addr.icon}
                </Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: isSelected ? "primary.main" : "#0F172A" }}>{addr.label}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {props.selectedAddressId === "add_new" && (
        <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#fff", mb: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Address Line 1</Typography>
              <TextField fullWidth size="small" placeholder="Enter street address" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Address Line 2 (Optional)</Typography>
              <TextField fullWidth size="small" placeholder="Apt, Suite, Bldg" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Area</Typography>
              <TextField fullWidth size="small" placeholder="e.g. Downtown" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>City</Typography>
              <TextField fullWidth size="small" placeholder="e.g. Dubai" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Emirate</Typography>
              <TextField fullWidth size="small" placeholder="e.g. Dubai" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Building</Typography>
              <TextField fullWidth size="small" placeholder="Building name/number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Apartment Number</Typography>
              <TextField fullWidth size="small" placeholder="Apt number" />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569", mb: 1 }}>Delivery Notes</Typography>
              <TextField fullWidth multiline rows={3} placeholder="Any special instructions for the driver" />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ height: 200, width: "100%", borderRadius: 3, bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #CBD5E1" }}>
                <Stack alignItems="center" spacing={1}>
                  <MapIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                  <Typography sx={{ color: "#64748B", fontWeight: 500 }}>Mini Map Preview Placeholder</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" size="large" onClick={props.onBack} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, color: "#475569", borderColor: "#E2E8F0" }}>
          Back
        </Button>
        <Button variant="contained" size="large" onClick={props.onNext} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
          Next: Additional Items
        </Button>
      </Box>
    </Box>
  );
};

export default Step3Address;
