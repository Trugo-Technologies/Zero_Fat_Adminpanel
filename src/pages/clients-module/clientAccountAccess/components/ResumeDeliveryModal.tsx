import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  Alert,
  alpha,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { IDeliveryCalendarPauseStatus } from "src/types/modules/clientsManagement/clientAccountAccess";

type Props = {
  open: boolean;
  pauseStatus?: IDeliveryCalendarPauseStatus | null;
  canBypassResumeWindow?: boolean;
  onClose: () => void;
  onSave: (resumeDate: string, bypassResumeWindow: boolean) => void | Promise<void>;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const ResumeDeliveryModal = ({
  open,
  pauseStatus,
  canBypassResumeWindow = false,
  onClose,
  onSave,
  isSaving = false,
  errorMessage = null,
}: Props) => {
  const { messages } = useIntl();
  const [resumeDate, setResumeDate] = useState<Dayjs | null>(null);
  const [bypassResumeWindow, setBypassResumeWindow] = useState(false);

  const maxAllowedResumeDate = pauseStatus?.maxAllowedResumeDate
    ? dayjs(pauseStatus.maxAllowedResumeDate)
    : null;
  // Resume must happen after the pause anchor and not in the past.
  const minResumeDate = (() => {
    const today = dayjs().startOf("day");
    const afterPause = pauseStatus?.pauseDate
      ? dayjs(pauseStatus.pauseDate).add(1, "day")
      : today;
    return afterPause.isAfter(today) ? afterPause : today;
  })();

  useEffect(() => {
    if (!open) {
      setResumeDate(null);
      setBypassResumeWindow(false);
      return;
    }

    const defaultDate = pauseStatus?.pauseDate
      ? dayjs(pauseStatus.pauseDate).add(1, "day")
      : dayjs().add(1, "day");
    setResumeDate(defaultDate.isBefore(dayjs(), "day") ? dayjs() : defaultDate);
  }, [open, pauseStatus?.pauseDate]);

  const isOutsideWindow =
    Boolean(resumeDate && maxAllowedResumeDate) &&
    resumeDate!.isAfter(maxAllowedResumeDate!, "day");

  const isSaveDisabled =
    isSaving || !resumeDate || (isOutsideWindow && !bypassResumeWindow);

  const handleSave = async () => {
    if (!resumeDate) return;
    await onSave(resumeDate.format("YYYY-MM-DD"), bypassResumeWindow);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px -12px rgba(15, 23, 42, 0.25)",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: alpha("#10B981", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayCircleOutlineIcon sx={{ color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1A2B48", letterSpacing: "-0.01em" }}>
            Resume Delivery
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary", "&:hover": { bgcolor: "#F1F5F9" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Stack spacing={0.5} sx={{ mb: 3 }}>
          {pauseStatus?.pauseDate ? (
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Deliveries are paused since{" "}
              <Typography component="span" sx={{ fontWeight: 700, color: "#1A2B48" }}>
                {dayjs(pauseStatus.pauseDate).format("MMM D, YYYY")}
              </Typography>
              {pauseStatus.pausedDayCount > 0
                ? ` (${pauseStatus.pausedDayCount} paused ${
                    pauseStatus.pausedDayCount === 1 ? "day" : "days"
                  })`
                : ""}
              .
            </Typography>
          ) : null}
          {maxAllowedResumeDate ? (
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Resume is allowed until{" "}
              <Typography component="span" sx={{ fontWeight: 700, color: "#1A2B48" }}>
                {maxAllowedResumeDate.format("MMM D, YYYY")}
              </Typography>
              .
            </Typography>
          ) : null}
        </Stack>

        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#1A2B48", mb: 2 }}>
          Select the resume date:
        </Typography>
        <DatePicker
          label="Resume Date"
          value={resumeDate}
          onChange={setResumeDate}
          minDate={minResumeDate}
          maxDate={
            bypassResumeWindow ? undefined : maxAllowedResumeDate ?? undefined
          }
          slotProps={{
            textField: { fullWidth: true },
          }}
        />
        {isOutsideWindow && !bypassResumeWindow ? (
          <Typography sx={{ fontSize: 12, color: "error.main", mt: 1 }}>
            The resume date must be on or before{" "}
            {maxAllowedResumeDate!.format("MMM D, YYYY")}.
          </Typography>
        ) : null}

        {canBypassResumeWindow ? (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#F8FAFC",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={bypassResumeWindow}
                  onChange={(e) => setBypassResumeWindow(e.target.checked)}
                  sx={{ "&.Mui-checked": { color: "primary.main" } }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1A2B48" }}>
                    Bypass resume window
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Allow resuming on a date beyond the allowed window.
                  </Typography>
                </Box>
              }
              sx={{ m: 0, alignItems: "flex-start" }}
            />
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #F1F5F9", bgcolor: "#F8FAFC" }}>
        <Button
          onClick={onClose}
          disabled={isSaving}
          sx={{ color: "text.secondary", fontWeight: 600, px: 3 }}
        >
          {messages["common.cancel"] as string}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
          sx={{
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 4,
            borderRadius: "10px",
            minWidth: 140,
          }}
        >
          {isSaving ? <CircularProgress size={22} color="inherit" /> : "Resume Delivery"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumeDeliveryModal;
