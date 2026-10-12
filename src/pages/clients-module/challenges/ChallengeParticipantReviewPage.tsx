/** @format */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import moment from "moment";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useIntl from "react-intl/lib/src/components/useIntl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import { MOCK_CHALLENGES, MOCK_PARTICIPANTS } from "./mockData";

const ChallengeParticipantReviewPage = () => {
  const { messages, locale } = useIntl();
  const navigate = useNavigate();
  const { challengeId, participantId } = useParams<{
    challengeId: string;
    participantId: string;
  }>();

  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reasonError, setReasonError] = useState("");

  const challenge = useMemo(
    () => MOCK_CHALLENGES.find((item) => item.id === challengeId),
    [challengeId]
  );

  const participant = useMemo(
    () =>
      MOCK_PARTICIPANTS.find(
        (item) => item.id === participantId && item.challengeId === challengeId
      ),
    [challengeId, participantId]
  );

  const challengeName =
    locale === "en-US"
      ? challenge?.title || challenge?.nameEn || challengeId
      : challenge?.title || challenge?.nameAr || challengeId;

  const participantsPath = `/clientsManagement/challenges/${challengeId}/participants`;

  const backToParticipants = () => navigate(participantsPath);

  const updateParticipant = (
    updater: (
      item: (typeof MOCK_PARTICIPANTS)[number]
    ) => (typeof MOCK_PARTICIPANTS)[number]
  ) => {
    const index = MOCK_PARTICIPANTS.findIndex(
      (item) => item.id === participantId && item.challengeId === challengeId
    );
    if (index >= 0) {
      MOCK_PARTICIPANTS[index] = updater(MOCK_PARTICIPANTS[index]);
    }
  };

  const handleApprove = () => {
    updateParticipant((item) => ({
      ...item,
      status: "Active",
      completedAt: new Date().toISOString(),
      rejectionReason: null,
      pointsEarned: challenge?.rewardPoints ?? item.pointsEarned,
      rewardLabel: challenge?.rewardType ?? item.rewardLabel ?? "Coupon",
      rewardStatus: "Pending",
    }));
    backToParticipants();
  };

  const handleRejectClick = () => {
    setShowRejectReason(true);
    setReasonError("");
  };

  const handleConfirmReject = () => {
    const trimmed = rejectionReason.trim();
    if (!trimmed) {
      setReasonError(
        (messages["validation.required"] as string) || "Required"
      );
      return;
    }
    updateParticipant((item) => ({
      ...item,
      status: "Left",
      completedAt: null,
      rejectionReason: trimmed,
      pointsEarned: 0,
      rewardLabel: null,
      rewardStatus: "NotEligible",
    }));
    backToParticipants();
  };

  if (!participant) {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AppBreadcrumb
            paths={[
              {
                name: messages["sidebar.clientsManagementModule"],
                path: "/clientsManagement",
              },
              {
                name: messages["sidebar.challenges"],
                path: "/clientsManagement/challenges",
              },
            ]}
            currentPathName='challenges.participant.review'
          />
          <Typography mt={4}>
            {(messages["common.noData"] as string) || "Not found"}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={backToParticipants}
            sx={{ mt: 2 }}>
            {messages["challenges.backToParticipants"] as string}
          </Button>
        </Grid>
      </Grid>
    );
  }

  const initials = participant.clientName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AppBreadcrumb
          paths={[
            {
              name: messages["sidebar.clientsManagementModule"],
              path: "/clientsManagement",
            },
            {
              name: messages["sidebar.challenges"],
              path: "/clientsManagement/challenges",
            },
            {
              name: challengeName,
              path: `/clientsManagement/challenges`,
            },
            {
              name: messages["challenges.participants"],
              path: participantsPath,
            },
          ]}
          currentPathName='challenges.participant.review'
        />
      </Grid>

      <Grid item xs={12}>
        <Card
          sx={{
            overflow: "hidden",
            borderLeft: "4px solid",
            borderLeftColor: "primary.main",
          }}>
          <CardContent sx={{ py: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent='space-between'
              alignItems={{ xs: "stretch", md: "center" }}
              spacing={2}>
              <Stack direction='row' spacing={2} alignItems='center' minWidth={0}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    color: "primary.main",
                    fontWeight: 800,
                    fontSize: 17,
                    flexShrink: 0,
                    border: "1px solid",
                    borderColor: (t) => alpha(t.palette.primary.main, 0.25),
                  }}>
                  {initials}
                </Avatar>

                <Box minWidth={0} flex={1}>
                  <Stack
                    direction='row'
                    spacing={1}
                    alignItems='center'
                    flexWrap='wrap'
                    useFlexGap
                    mb={0.5}>
                    <Typography
                      variant='h5'
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.3,
                      }}>
                      {participant.clientName}
                    </Typography>
                    <Chip
                      size='small'
                      label={participant.status}
                      color='warning'
                      sx={{ height: 22, fontWeight: 700, fontSize: 11 }}
                    />
                  </Stack>

                  <Typography
                    variant='body2'
                    sx={{ color: "primary.main", fontWeight: 600, mb: 1.25 }}>
                    <IntlMessages id='challenges.participant.review' />
                    {" · "}
                    {challengeName}
                  </Typography>

                  <Chip
                    size='small'
                    icon={
                      <CalendarTodayOutlinedIcon
                        sx={{ fontSize: "13px !important" }}
                      />
                    }
                    label={
                      participant.submittedAt
                        ? moment(participant.submittedAt).format(
                            "DD MMM YYYY, HH:mm"
                          )
                        : "-"
                    }
                    variant='outlined'
                    sx={{
                      height: 28,
                      bgcolor: "background.paper",
                      borderColor: "divider",
                      "& .MuiChip-label": {
                        fontSize: 12,
                        color: "text.secondary",
                      },
                      "& .MuiChip-icon": { color: "text.disabled" },
                    }}
                  />
                </Box>
              </Stack>

              <Stack
                direction='row'
                spacing={1.25}
                alignItems='center'
                justifyContent='flex-end'
                flexWrap='wrap'
                useFlexGap
                sx={{ ml: { md: "auto" } }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  variant='text'
                  color='inherit'
                  onClick={backToParticipants}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}>
                  {messages["challenges.backToParticipants"] as string}
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<CloseRoundedIcon />}
                  onClick={handleRejectClick}
                  sx={{ textTransform: "none", fontWeight: 700 }}>
                  <IntlMessages id='challenges.participant.reject' />
                </Button>
                {!showRejectReason && (
                  <Button
                    variant='contained'
                    color='primary'
                    disableElevation
                    startIcon={<CheckRoundedIcon />}
                    onClick={handleApprove}
                    sx={{ textTransform: "none", fontWeight: 700 }}>
                    <IntlMessages id='challenges.participant.approve' />
                  </Button>
                )}
                {showRejectReason && (
                  <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    onClick={handleConfirmReject}
                    sx={{ textTransform: "none", fontWeight: 700 }}>
                    <IntlMessages id='challenges.participant.reject' />
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {participant.submissionNote ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction='row' spacing={1} alignItems='center' mb={1.5}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    color: "primary.main",
                  }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  variant='subtitle2'
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: "text.secondary",
                    fontSize: 12,
                  }}>
                  {(messages["challenges.participant.submissionNote"] as string) ||
                    "Submission Note"}
                </Typography>
              </Stack>
              <Typography
                variant='body1'
                sx={{ color: "text.primary", lineHeight: 1.7, pl: 0.5 }}>
                {participant.submissionNote}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null}

      {/* Submitted proof — temporarily hidden */}

      {showRejectReason && (
        <Grid item xs={12}>
          <Card
            sx={{
              borderColor: "error.light",
              bgcolor: (t) => alpha(t.palette.error.main, 0.04),
            }}>
            <CardContent>
              <Typography
                variant='subtitle2'
                sx={{
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "error.main",
                  fontSize: 12,
                  mb: 1.5,
                }}>
                {messages["challenges.participant.rejectionReason"] as string}
              </Typography>
              <TextField
                autoFocus
                fullWidth
                multiline
                minRows={3}
                placeholder={
                  messages[
                    "challenges.participant.rejectionReasonPlaceholder"
                  ] as string
                }
                value={rejectionReason}
                error={Boolean(reasonError)}
                helperText={reasonError}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ChallengeParticipantReviewPage;
