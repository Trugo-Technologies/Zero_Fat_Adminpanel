/** @format */

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { mapLeaderboardApiEntryToUi } from "src/types/modules/clientsManagement/leaderboard";
import { selectSx } from "../challenges/challengeFilterHelpers";
import {
  useGetAllChallengesQuery,
  useGetChallengeLeaderboardQuery,
} from "../challenges/services/api";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const podiumStyles = [
  { order: 2, height: 148, label: "1st", avatar: 68 },
  { order: 1, height: 124, label: "2nd", avatar: 56 },
  { order: 3, height: 108, label: "3rd", avatar: 52 },
] as const;

const LeaderboardPage = () => {
  const { messages } = useIntl();
  const theme = useTheme();
  const [challengeId, setChallengeId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);

  const { data: challengesResponse, isFetching: isChallengesFetching } =
    useGetAllChallengesQuery({ pageNumber: 1, pageSize: 100 });

  const challengeOptions = useMemo(
    () =>
      (challengesResponse?.data ?? []).map((challenge) => ({
        id: challenge.id,
        label: challenge.title || challenge.nameEn || challenge.id,
      })),
    [challengesResponse?.data]
  );

  useEffect(() => {
    if (!challengeId && challengeOptions.length > 0) {
      setChallengeId(challengeOptions[0].id);
    }
  }, [challengeId, challengeOptions]);

  const {
    data: leaderboardResponse,
    isFetching: isLeaderboardFetching,
    refetch,
  } = useGetChallengeLeaderboardQuery(
    { id: challengeId, top: 100 },
    { skip: !challengeId }
  );

  const leaderboard = leaderboardResponse?.data;

  const selectedChallengeLabel =
    leaderboard?.title ||
    challengeOptions.find((item) => item.id === challengeId)?.label ||
    challengeId;

  const sourceRows = useMemo(() => {
    if (!leaderboard || !challengeId) return [];
    const entries =
      (leaderboard.top?.length ? leaderboard.top : leaderboard.top3) || [];
    return entries.map((entry, index) =>
      mapLeaderboardApiEntryToUi(entry, challengeId, index)
    );
  }, [leaderboard, challengeId]);

  const filteredRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return sourceRows;
    return sourceRows.filter((row) =>
      row.clientName.toLowerCase().includes(keyword)
    );
  }, [sourceRows, searchValue]);

  const topThree = useMemo(() => {
    if (leaderboard?.top3?.length) {
      return leaderboard.top3.map((entry, index) =>
        mapLeaderboardApiEntryToUi(entry, challengeId, index)
      );
    }
    return filteredRows.slice(0, 3);
  }, [leaderboard?.top3, filteredRows, challengeId]);

  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  const tableRows = filteredRows;
  const isLoading = isChallengesFetching || isLeaderboardFetching;

  const handleClearFilters = () => {
    if (challengeOptions[0]?.id) setChallengeId(challengeOptions[0].id);
    setSearchValue("");
  };

  const advanceFiltersInputs = [
    <Box key='challenge'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {(messages["leaderboard.challenge"] as string) || "Challenge"}
      </Typography>
      <Select
        size='small'
        value={challengeId}
        displayEmpty
        onChange={(e) => setChallengeId(e.target.value)}
        sx={{ ...selectSx, minWidth: 220 }}>
        {challengeOptions.length === 0 ? (
          <MenuItem value='' disabled>
            —
          </MenuItem>
        ) : (
          challengeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id} sx={{ fontSize: 13 }}>
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
    </Box>,
    <Box key='clear' sx={{ ml: "auto" }}>
      <Button
        onClick={handleClearFilters}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}>
        {(messages["challenges.filter.clear"] as string) || "Clear Filters"}
      </Button>
    </Box>,
  ];

  return (
    <Grid container spacing={3}>
      <AppBreadcrumb
        paths={[{ name: messages["sidebar.clientsManagement.title"] }]}
        currentPathName='sidebar.leaderboard'
      />

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid item xs={12}>
              <AppFilters
                showAddButton={false}
                onChangeKeywordValue={(
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  setSearchValue(event.target.value);
                }}
                successUrl=''
                selectionModel={[]}
                setSelectionModel={() => {}}
                refetch={() => {
                  setSearchValue("");
                  refetch();
                }}
                showMultipleActivation={false}
                showMultipleDeactivation={false}
                showMultipleDeletion={false}
                showAdvanceFiltersButton
                isOpenAdvanceFilters={isOpenAdvanceFilters}
                setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                advanceFiltersInputs={advanceFiltersInputs}
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent='space-between'
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2.5}
              mb={3}>
              <Stack direction='row' spacing={2} alignItems='center' minWidth={0}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    flexShrink: 0,
                  }}>
                  <EmojiEventsOutlinedIcon />
                </Box>
                <Box minWidth={0}>
                  <Typography
                    variant='h5'
                    sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                    {selectedChallengeLabel ||
                      (messages["sidebar.leaderboard"] as string) ||
                      "Leaderboard"}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {leaderboard?.daysRemaining != null
                      ? `${leaderboard.daysRemaining} ${
                          (messages["leaderboard.daysRemaining"] as string) ||
                          "days remaining"
                        }`
                      : (messages["leaderboard.subtitle"] as string) ||
                        "Rankings by steps synced from health apps."}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant='body2'
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}>
                {filteredRows.length}{" "}
                {(messages["leaderboard.users"] as string) || "users"}
              </Typography>
            </Stack>

            {isLoading ? (
              <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={36} />
              </Box>
            ) : (
              <>
                {topThree.length > 0 && (
                  <Box
                    sx={{
                      mb: 3.5,
                      px: { xs: 1.5, md: 3 },
                      py: 2.75,
                      borderRadius: 3,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                      border: "1px solid",
                      borderColor: (t) => alpha(t.palette.primary.main, 0.12),
                    }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.7,
                        textTransform: "uppercase",
                        color: "text.secondary",
                        mb: 2.5,
                      }}>
                      {(messages["leaderboard.topPerformers"] as string) ||
                        "Top Performers"}
                    </Typography>

                    <Stack
                      direction='row'
                      justifyContent='center'
                      alignItems='flex-end'
                      spacing={{ xs: 1.25, md: 2.5 }}
                      sx={{ minHeight: 200 }}>
                      {podiumOrder.map((entry) => {
                        if (!entry) return null;
                        const style =
                          entry.rank === 1
                            ? podiumStyles[0]
                            : entry.rank === 2
                              ? podiumStyles[1]
                              : podiumStyles[2];
                        const isFirst = entry.rank === 1;
                        return (
                          <Stack
                            key={entry.id}
                            alignItems='center'
                            spacing={1}
                            sx={{
                              width: { xs: 100, md: 150 },
                              order: style.order,
                            }}>
                            <Avatar
                              src={entry.avatarUrl || undefined}
                              sx={{
                                width: style.avatar,
                                height: style.avatar,
                                bgcolor: isFirst
                                  ? "primary.main"
                                  : (t) => alpha(t.palette.primary.main, 0.15),
                                color: isFirst
                                  ? "primary.contrastText"
                                  : "primary.main",
                                fontWeight: 800,
                                fontSize: isFirst ? 22 : 16,
                                border: "2px solid",
                                borderColor: isFirst
                                  ? "primary.main"
                                  : (t) => alpha(t.palette.primary.main, 0.35),
                                boxShadow: isFirst
                                  ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`
                                  : "none",
                              }}>
                              {getInitials(entry.clientName)}
                            </Avatar>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: 12, md: 14 },
                                color: "text.primary",
                                textAlign: "center",
                                lineHeight: 1.3,
                              }}>
                              {entry.clientName}
                            </Typography>
                            <Chip
                              size='small'
                              label={`${entry.stepsCount.toLocaleString()} steps`}
                              sx={{
                                fontWeight: 700,
                                bgcolor: (t) =>
                                  alpha(t.palette.primary.main, 0.1),
                                color: "primary.main",
                                border: "1px solid",
                                borderColor: (t) =>
                                  alpha(t.palette.primary.main, 0.25),
                              }}
                            />
                            <Box
                              sx={{
                                width: "100%",
                                height: style.height,
                                borderRadius: "12px 12px 6px 6px",
                                bgcolor:
                                  entry.rank === 1
                                    ? "primary.main"
                                    : entry.rank === 2
                                      ? (t) => alpha(t.palette.primary.main, 0.72)
                                      : (t) => alpha(t.palette.primary.main, 0.48),
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                pt: 1.25,
                                color: "primary.contrastText",
                                fontWeight: 800,
                                fontSize: 16,
                                boxShadow: `0 8px 18px ${alpha(
                                  theme.palette.primary.main,
                                  0.18
                                )}`,
                              }}>
                              {style.label}
                            </Box>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                <Box
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                  }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "48px 1fr 72px",
                        md: "64px 1.2fr 1fr 100px",
                      },
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}>
                    {[
                      "leaderboard.rank",
                      "leaderboard.user",
                      "leaderboard.syncedApp",
                      "leaderboard.steps",
                    ].map((key, index) => (
                      <Typography
                        key={key}
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          color: "text.secondary",
                          display: {
                            xs:
                              index === 0 || index === 1 || index === 3
                                ? "block"
                                : "none",
                            md: "block",
                          },
                        }}>
                        {(messages[key] as string) || key.split(".").pop()}
                      </Typography>
                    ))}
                  </Box>

                  {tableRows.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                      <Typography color='text.secondary'>
                        {(messages["leaderboard.empty"] as string) ||
                          "No users found for this challenge."}
                      </Typography>
                    </Box>
                  ) : (
                    tableRows.map((entry, index) => (
                      <Box
                        key={entry.id}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "48px 1fr 72px",
                            md: "64px 1.2fr 1fr 100px",
                          },
                          gap: 1.5,
                          px: 2,
                          py: 1.75,
                          alignItems: "center",
                          borderBottom:
                            index === tableRows.length - 1
                              ? "none"
                              : "1px solid",
                          borderColor: "divider",
                          bgcolor:
                            entry.rank <= 3
                              ? (t) => alpha(t.palette.primary.main, 0.05)
                              : "background.paper",
                          transition: "background 0.15s ease",
                          "&:hover": {
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                          },
                        }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: 15,
                            color:
                              entry.rank <= 3 ? "primary.main" : "text.primary",
                          }}>
                          #{entry.rank}
                        </Typography>

                        <Stack
                          direction='row'
                          spacing={1.25}
                          alignItems='center'
                          minWidth={0}>
                          <Avatar
                            src={entry.avatarUrl || undefined}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: (t) =>
                                alpha(t.palette.primary.main, 0.12),
                              color: "primary.main",
                              fontSize: 13,
                              fontWeight: 700,
                            }}>
                            {getInitials(entry.clientName)}
                          </Avatar>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
                            {entry.clientName}
                          </Typography>
                        </Stack>

                        <Chip
                          size='small'
                          label={entry.syncedApp}
                          sx={{
                            display: { xs: "none", md: "inline-flex" },
                            fontWeight: 600,
                            fontSize: 12,
                            justifySelf: "start",
                            bgcolor: (t) => alpha(t.palette.info.main, 0.1),
                            color: "info.main",
                            border: "1px solid",
                            borderColor: (t) => alpha(t.palette.info.main, 0.25),
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: 14,
                            color: "primary.main",
                          }}>
                          {entry.stepsCount.toLocaleString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LeaderboardPage;
