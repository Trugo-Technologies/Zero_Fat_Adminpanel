/** @format */

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import {
  DeliveryCutoffSettings,
  formatDeliveryCutoffLabel,
} from "../deliveryCutoff";

type Props = {
  settings?: DeliveryCutoffSettings | null;
  isLoading?: boolean;
  canBypassCutoff?: boolean;
  bypassCutoffEnabled?: boolean;
  onBypassCutoffEnabledChange?: (enabled: boolean) => void;
};

const CutoffTimeSettingsCard = ({
  settings,
  isLoading = false,
  canBypassCutoff = false,
  bypassCutoffEnabled = false,
  onBypassCutoffEnabledChange,
}: Props) => {
  const { messages } = useIntl();
  const cutoffLabel = formatDeliveryCutoffLabel(settings);
  const isEnabled = settings?.enableCutoffRestriction !== false;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <AccessTimeIcon color="primary" fontSize="small" />
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
              <IntlMessages id="clientAccountAccess.cutoffSettings" />
            </Typography>
          </Stack>
          {canBypassCutoff ? (
            <FormControlLabel
              sx={{ m: 0, flexShrink: 0 }}
              control={
                <Switch
                  checked={bypassCutoffEnabled}
                  onChange={(e) =>
                    onBypassCutoffEnabledChange?.(e.target.checked)
                  }
                  color="warning"
                />
              }
              label={
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Disable Validation
                </Typography>
              }
            />
          ) : null}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {messages["clientAccountAccess.cutoffDescription"] as string}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block">
                {isEnabled ? "Cutoff restriction" : "Cutoff restriction disabled"}
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: Fonts.SEMI_BOLD, mt: 0.5 }}>
                {cutoffLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Actions such as replace meals and add-ons are only allowed before this
                cutoff for the selected delivery date.
              </Typography>
            </Box>
            {canBypassCutoff && bypassCutoffEnabled ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Cut-off validation is bypassed for the selected delivery date.
              </Alert>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CutoffTimeSettingsCard;
