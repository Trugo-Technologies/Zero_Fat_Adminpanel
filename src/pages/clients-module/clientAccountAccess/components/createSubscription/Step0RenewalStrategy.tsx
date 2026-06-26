import { Box, Typography, Button, Grid, alpha } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type Props = {
  onNext: () => void;
  setRenewalStrategy: (val: "extend" | "future") => void;
  renewalStrategy: "extend" | "future";
};

const Step0RenewalStrategy = (props: Props) => {
  return (
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>Renewal Strategy</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 4 }}>
        This client currently has an active plan. How would you like to handle the renewal?
      </Typography>

      <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha("#F59E0B", 0.05), border: "1px solid", borderColor: alpha("#F59E0B", 0.3), mb: 5, display: "flex", gap: 2, alignItems: "flex-start" }}>
        <InfoOutlinedIcon sx={{ color: "#D97706", mt: 0.5 }} />
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#92400E", mb: 0.5 }}>Active Plan Detected</Typography>
          <Typography sx={{ fontSize: 14, color: "#B45309" }}>
            The client is currently on the <strong>Lean Muscle (Standard)</strong> plan. Their final delivery is scheduled for <strong>June 21, 2026</strong>.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Box
            onClick={() => props.setRenewalStrategy("extend")}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "2px solid",
              borderColor: props.renewalStrategy === "extend" ? "primary.main" : "#E2E8F0",
              bgcolor: props.renewalStrategy === "extend" ? alpha("#10B981", 0.02) : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              height: "100%",
              "&:hover": { borderColor: props.renewalStrategy === "extend" ? "primary.main" : "#CBD5E1" }
            }}
          >
            <Box sx={{ color: props.renewalStrategy === "extend" ? "primary.main" : "#64748B", mb: 2 }}>
              <EventRepeatIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 1 }}>Extend Current Plan</Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              The new subscription will automatically begin on the very next available delivery day after their current plan expires. <strong>Guarantees no overlap.</strong>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            onClick={() => props.setRenewalStrategy("future")}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "2px solid",
              borderColor: props.renewalStrategy === "future" ? "primary.main" : "#E2E8F0",
              bgcolor: props.renewalStrategy === "future" ? alpha("#10B981", 0.02) : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              height: "100%",
              "&:hover": { borderColor: props.renewalStrategy === "future" ? "primary.main" : "#CBD5E1" }
            }}
          >
            <Box sx={{ color: props.renewalStrategy === "future" ? "primary.main" : "#64748B", mb: 2 }}>
              <EventAvailableIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A", mb: 1 }}>Schedule Future Date</Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Manually pick a start date in the future. The system will still physically block you from selecting dates that overlap with their active plan.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" size="large" onClick={props.onNext} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
          Next: Configuration
        </Button>
      </Box>
    </Box>
  );
};

export default Step0RenewalStrategy;
