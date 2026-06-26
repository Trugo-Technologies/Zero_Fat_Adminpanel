/** @format */

import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";

type ScopeOption = "thisDay" | "upcoming" | "entireOrder" | "mealPlanOnly";

type Props = {
  cancelScope: ScopeOption;
  moveScope: ScopeOption;
  moveDate: Dayjs | null;
  onCancelScopeChange: (scope: ScopeOption) => void;
  onMoveScopeChange: (scope: ScopeOption) => void;
  onMoveDateChange: (date: Dayjs | null) => void;
};

const scopeOptions: { value: ScopeOption; labelKey: string }[] = [
  { value: "thisDay", labelKey: "clientAccountAccess.scope.thisDay" },
  { value: "upcoming", labelKey: "clientAccountAccess.scope.upcoming" },
  { value: "entireOrder", labelKey: "clientAccountAccess.scope.entireOrder" },
  { value: "mealPlanOnly", labelKey: "clientAccountAccess.scope.mealPlanOnly" },
];

const DeliveryManagementPanel = ({
  cancelScope,
  moveScope,
  moveDate,
  onCancelScopeChange,
  onMoveScopeChange,
  onMoveDateChange,
}: Props) => {
  const { messages } = useIntl();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD, mb: 2 }}>
              <IntlMessages id="clientAccountAccess.cancelDelivery" />
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={cancelScope}
                onChange={(e) =>
                  onCancelScopeChange(e.target.value as ScopeOption)
                }
              >
                {scopeOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    value={opt.value}
                    control={<Radio size="small" />}
                    label={messages[opt.labelKey] as string}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD, mb: 2 }}>
              <IntlMessages id="clientAccountAccess.moveDelivery" />
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                value={moveScope}
                onChange={(e) =>
                  onMoveScopeChange(e.target.value as ScopeOption)
                }
              >
                {scopeOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    value={opt.value}
                    control={<Radio size="small" />}
                    label={messages[opt.labelKey] as string}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <DatePicker
              label={messages["clientAccountAccess.newDeliveryDate"] as string}
              value={moveDate}
              onChange={onMoveDateChange}
              minDate={dayjs()}
              slotProps={{
                textField: { fullWidth: true, size: "small" },
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DeliveryManagementPanel;
