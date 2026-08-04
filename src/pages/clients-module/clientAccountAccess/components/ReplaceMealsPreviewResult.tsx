import {
  Alert,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { IReplaceDeliveryCalendarMealsPreview } from "src/types/modules/clientsManagement/clientAccountAccess";

type Props = {
  preview: IReplaceDeliveryCalendarMealsPreview;
};

const ReplaceMealsPreviewResult = ({ preview }: Props) => {
  const lines = preview.lines ?? [];
  const totalUpgradeCost = preview.totalUpgradeCost ?? 0;

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 2 }}>
        Meal replacements saved successfully.
      </Alert>

      {preview.date ? (
        <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
          Delivery date:{" "}
          <Typography component="span" sx={{ fontWeight: 700, color: "#1A2B48" }}>
            {dayjs(preview.date).format("MMM D, YYYY")}
          </Typography>
        </Typography>
      ) : null}

      <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 14 }}>
        Replacements
      </Typography>
      <List sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 0, mb: 2 }}>
        {lines.map((line, index) => (
          <Box key={line.dailyMealSelectionId}>
            {index > 0 ? <Divider /> : null}
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>
                    {line.mealTypeName}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                    {line.currentMealName ? (
                      <Typography component="span" sx={{ fontSize: 13, display: "block" }}>
                        From: {line.currentMealName}
                      </Typography>
                    ) : null}
                    <Typography component="span" sx={{ fontSize: 13, display: "block" }}>
                      To: {line.newMealName}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                      Base AED {line.basePrice.toFixed(2)} → New menu AED{" "}
                      {line.newMenuPrice.toFixed(2)}
                    </Typography>
                  </Box>
                }
              />
              <Typography sx={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                {line.upgradeCost > 0
                  ? `+AED ${line.upgradeCost.toFixed(2)}`
                  : "No upgrade"}
              </Typography>
            </ListItem>
          </Box>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 500 }}>
          Total Upgrade Cost
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
          AED {totalUpgradeCost.toFixed(2)}
        </Typography>
        {preview.requiresPayment ? (
          <Chip
            label="Payment required"
            size="small"
            sx={{
              mt: 1,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "inherit",
              fontWeight: 600,
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ReplaceMealsPreviewResult;
