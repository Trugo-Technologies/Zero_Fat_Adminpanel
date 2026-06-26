/** @format */

import PaymentIcon from "@mui/icons-material/Payment";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { DeliveryDay } from "../types";

type Props = {
  selectedDelivery: DeliveryDay | null;
  deliveryMethod: string;
  cutoffEnabled: boolean;
  cutoffTime: string;
  onMethodChange: (method: string) => void;
  onSave: () => void;
};

const ChangeDeliveryMethodCard = ({
  selectedDelivery,
  deliveryMethod,
  cutoffEnabled,
  cutoffTime,
  onMethodChange,
  onSave,
}: Props) => {
  const { messages } = useIntl();
  const isPastCutoff =
    cutoffEnabled && dayjs().isAfter(dayjs(cutoffTime, "HH:mm"));

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PaymentIcon color="primary" fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}>
            <IntlMessages id="clientAccountAccess.changeDeliveryMethod" />
          </Typography>
        </Stack>

        {selectedDelivery ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {messages["clientAccountAccess.selectedDay"] as string}:{" "}
              <strong>{dayjs(selectedDelivery.date).format("MMM D, YYYY")}</strong>
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>
                {messages["clientAccountAccess.deliveryMethod"] as string}
              </InputLabel>
              <Select
                value={deliveryMethod}
                label={messages["clientAccountAccess.deliveryMethod"] as string}
                onChange={(e) => onMethodChange(e.target.value)}
                disabled={isPastCutoff}
              >
                <MenuItem value="Online">
                  {messages["clientAccountAccess.deliveryMethod.online"] as string}
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              size="small"
              disabled={isPastCutoff}
              onClick={onSave}
            >
              {messages["common.save"] as string}
            </Button>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {messages["clientAccountAccess.selectDayHint"] as string}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeDeliveryMethodCard;
