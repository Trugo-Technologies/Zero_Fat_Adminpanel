/** @format */

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ReportColors } from "src/assets/colors/colorSet";

const paymentMethodColors: Record<string, string> = {
  Card: ReportColors.green,
  Tamara: ReportColors.teal,
  Unknown: ReportColors.orange,
};

type ClientPaymentSummaryProps = {
  byPaymentMethod?: Record<string, number>;
};

const ClientPaymentSummary = ({
  byPaymentMethod = {},
}: ClientPaymentSummaryProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { messages } = useIntl();
  const primaryGreen = theme.palette.primary.main;

  const paymentMethods = Object.entries(byPaymentMethod);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid #E2E8F0",
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 800,
            color: "#0F172A",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          <IntlMessages id="sidebar.payments" />
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/clientsManagement/payments")}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            color: primaryGreen,
            py: 0.25,
          }}
        >
          <IntlMessages id="dashboard.viewAllPayments" />
        </Button>
      </Box>

      <Grid container spacing={1.5}>
        {paymentMethods.map(([method, count]) => {
          const color =
            paymentMethodColors[method] ?? ReportColors.purple;
          const labelKey = `dashboard.paymentMethod.${method}`;
          const label =
            messages[labelKey] != null
              ? String(messages[labelKey])
              : method;

          return (
            <Grid item xs={6} key={method}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #E2E8F0",
                  bgcolor: alpha(color, 0.06),
                }}
              >
                <Typography
                  sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}
                >
                  {count}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.secondary",
                    mt: 0.25,
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ClientPaymentSummary;
