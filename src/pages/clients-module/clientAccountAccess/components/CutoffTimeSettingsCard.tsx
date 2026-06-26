/** @format */

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Alert,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type Props = {
  cutoffValue: number;
  cutoffUnit: string;
  enabled: boolean;
  onCutoffValueChange: (value: number) => void;
  onCutoffUnitChange: (unit: string) => void;
  onEnabledChange: (enabled: boolean) => void;
};

const CutoffTimeSettingsCard = ({
  cutoffValue,
  cutoffUnit,
  enabled,
  onCutoffValueChange,
  onCutoffUnitChange,
  onEnabledChange,
}: Props) => {
  const { messages } = useIntl();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AccessTimeIcon color="primary" fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id="clientAccountAccess.cutoffSettings" />
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {messages["clientAccountAccess.cutoffDescription"] as string}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              size="small"
            />
          }
          label={messages["clientAccountAccess.cutoffEnabled"] as string}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            type="number"
            size="small"
            disabled={!enabled}
            label="Duration"
            value={cutoffValue}
            onChange={(e) => onCutoffValueChange(Number(e.target.value))}
            sx={{ width: 120 }}
          />
          <Select
            size="small"
            disabled={!enabled}
            value={cutoffUnit}
            onChange={(e) => onCutoffUnitChange(e.target.value as string)}
            sx={{ width: 120 }}
          >
            <MenuItem value="Hours">Hours</MenuItem>
            <MenuItem value="Days">Days</MenuItem>
          </Select>
          <Typography sx={{ alignSelf: "center", color: "text.secondary", fontSize: 14 }}>
            before delivery
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CutoffTimeSettingsCard;
