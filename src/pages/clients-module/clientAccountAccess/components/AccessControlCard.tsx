/** @format */

import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  alpha,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { blockOptionToUiType } from "../mapClientAccountData";
import { ClientAccountData } from "../types";

type Props = {
  client: ClientAccountData;
  onUnblock: () => void | Promise<void>;
  onBlock: (
    type: "oneDay" | "custom" | "permanent",
    expiry?: Dayjs
  ) => void | Promise<void>;
  isBlocking?: boolean;
  isUnblocking?: boolean;
};

type BlockOption = "oneDay" | "custom" | "permanent";

const blockOptions: { value: BlockOption; titleKey: string; descKey: string }[] = [
  {
    value: "oneDay",
    titleKey: "clientAccountAccess.block.oneDay",
    descKey: "clientAccountAccess.block.oneDayDesc",
  },
  {
    value: "custom",
    titleKey: "clientAccountAccess.block.custom",
    descKey: "clientAccountAccess.block.customDesc",
  },
  {
    value: "permanent",
    titleKey: "clientAccountAccess.block.permanent",
    descKey: "clientAccountAccess.block.permanentDesc",
  },
];

const AccessControlCard = ({
  client,
  onUnblock,
  onBlock,
  isBlocking = false,
  isUnblocking = false,
}: Props) => {
  const { messages } = useIntl();
  const theme = useTheme();
  const [blockType, setBlockType] = useState<BlockOption>("oneDay");
  const [customDate, setCustomDate] = useState<Dayjs | null>(dayjs().add(1, "day"));

  const isBlocked = client.blockOption > 0;

  useEffect(() => {
    if (!isBlocked) {
      setBlockType("oneDay");
      setCustomDate(dayjs().add(1, "day"));
      return;
    }

    setBlockType(blockOptionToUiType(client.blockOption));
    if (client.blockExpiryDate) {
      setCustomDate(dayjs(client.blockExpiryDate));
    }
  }, [client.id, client.blockOption, client.blockExpiryDate, isBlocked]);

  const handleBlock = async () => {
    if (blockType === "custom") {
      await onBlock("custom", customDate ?? undefined);
    } else {
      await onBlock(blockType);
    }
  };

  const handleUnblock = async () => {
    await onUnblock();
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: "16px",
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.02)}`,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>
        <IntlMessages id="clientAccountAccess.accessControl" />
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600, mb: 1, textTransform: "uppercase" }}>
          <IntlMessages id="clientAccountAccess.blockOptions" />
        </Typography>

        <RadioGroup
          value={blockType}
          onChange={(e) => setBlockType(e.target.value as BlockOption)}
        >
          <Stack spacing={1}>
            {blockOptions.map((opt) => {
              const selected = blockType === opt.value;
              return (
                <Box
                  key={opt.value}
                  onClick={() => {
                    if (!isBlocked) {
                      setBlockType(opt.value);
                    }
                  }}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    border: `1px solid ${
                      selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.4)
                    }`,
                    bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : "transparent",
                    cursor: isBlocked ? "not-allowed" : "pointer",
                    opacity: isBlocked ? 0.6 : 1,
                    transition: "all 0.2s",
                    "&:hover": isBlocked
                      ? {}
                      : {
                          borderColor: selected
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        },
                  }}
                >
                  <FormControlLabel
                    value={opt.value}
                    control={<Radio size="small" disabled={isBlocked} />}
                    label={
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                          {messages[opt.titleKey] as string}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                          {messages[opt.descKey] as string}
                        </Typography>
                      </Box>
                    }
                    disabled={isBlocked}
                    sx={{ m: 0, alignItems: "flex-start" }}
                  />
                </Box>
              );
            })}
          </Stack>
        </RadioGroup>
      </Box>

      {blockType === "custom" && !isBlocked && (
        <Box sx={{ mb: 2.5 }}>
          <DateTimePicker
            label={messages["clientAccountAccess.blockDateTime"] as string}
            value={customDate}
            onChange={setCustomDate}
            disabled={isBlocked}
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
          />
        </Box>
      )}

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          color="error"
          startIcon={<BlockIcon />}
          onClick={handleBlock}
          disabled={isBlocked || isBlocking || isUnblocking}
          fullWidth
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", boxShadow: "none" }}
        >
          <IntlMessages id="clientAccountAccess.blockClient" />
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<LockOpenIcon />}
          onClick={handleUnblock}
          disabled={!isBlocked || isUnblocking || isBlocking}
          fullWidth
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
        >
          <IntlMessages id="clientAccountAccess.unblockClient" />
        </Button>
      </Stack>
    </Box>
  );
};

export default AccessControlCard;
