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
import { IDeliveryCalendarActionPreview } from "src/types/modules/clientsManagement/clientAccountAccess";
import { getDeliveryPreviewLines, getDeliveryPreviewTotal } from "../getDeliveryPreviewTotal";

type Props = {
  preview: IDeliveryCalendarActionPreview;
};

const AdditionalItemsPreviewResult = ({ preview }: Props) => {
  const lines = getDeliveryPreviewLines(preview);
  const total = getDeliveryPreviewTotal(preview);
  const requiresPayment =
    preview.requiresPayment ?? preview.paymentRequired ?? false;

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 2 }}>
        Additional items added successfully.
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
        Items
      </Typography>
      <List sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 0, mb: 2 }}>
        {lines.map((line, index) => {
          const lineTotal = line.lineTotal ?? line.amount ?? 0;
          const quantity = line.quantity ?? 1;
          const unitPrice = line.unitPrice ?? 0;
          const label = line.mealName || line.nameEn || line.name || "Item";

          return (
            <Box key={line.mealId ?? `${label}-${index}`}>
              {index > 0 ? <Divider /> : null}
              <ListItem>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>
                      {label}
                    </Typography>
                  }
                  secondary={`AED ${unitPrice.toFixed(2)} x ${quantity}`}
                  secondaryTypographyProps={{ fontSize: 13 }}
                />
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                  AED {lineTotal.toFixed(2)}
                </Typography>
              </ListItem>
            </Box>
          );
        })}
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
          Total Price
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
          {total !== null ? `AED ${total.toFixed(2)}` : "—"}
        </Typography>
        {requiresPayment ? (
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

export default AdditionalItemsPreviewResult;
