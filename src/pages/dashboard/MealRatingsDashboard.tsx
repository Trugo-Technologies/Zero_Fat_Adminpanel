import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Collapse,
  InputAdornment,
  OutlinedInput,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import dayjs from "dayjs";
import { baseImageUrl } from "src/env/base-url";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  useGetAllMealRatingsQuery,
  useGetMealRatingByDailyMealQuery,
  useReplyMealRatingMutation,
} from "./mealRatings/services/api";
import { IMealRating } from "src/types/modules/clientsManagement/mealRatings";

const ALL_RATINGS = "All Ratings";

const RATING_FILTER_TO_VALUE: Record<string, number | undefined> = {
  [ALL_RATINGS]: undefined,
  "Not Good": 0,
  Good: 1,
  Awesome: 2,
};

type AppliedFilters = {
  fromDate: string;
  toDate: string;
  rating: string;
};

const getReplyStatus = (item: IMealRating) =>
  item.adminReply ? "Resolved" : "Pending";

const getFeedbackText = (item: IMealRating) =>
  item.feedback ||
  item.additionalComment ||
  (item.improvementTags?.length ? item.improvementTags.join(", ") : "");

const getCustomerAvatar = (imageUrl: string | null) =>
  imageUrl ? `${baseImageUrl}/${imageUrl}` : undefined;

const MealRatingsDashboard = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;

  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IMealRating | null>(
    null
  );
  const [replyText, setReplyText] = useState("");

  const [replyMealRating, { isLoading: isReplying }] =
    useReplyMealRatingMutation();

  const {
    data: mealRatingDetails,
    isFetching: isLoadingDetails,
  } = useGetMealRatingByDailyMealQuery(
    { id: selectedFeedback?.dailyMealSelectionId! },
    {
      skip:
        !openReplyModal ||
        !isViewOnly ||
        !selectedFeedback?.dailyMealSelectionId,
    }
  );

  const viewDetails = mealRatingDetails?.data;

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    fromDate: "",
    toDate: "",
    rating: ALL_RATINGS,
  });

  const {
    data,
    isFetching,
    page,
    limit,
    totalRecords,
    changePage,
    changeLimit,
    setParameter,
    refetch,
  } = usePaginateData(useGetAllMealRatingsQuery);

  const syncFiltersToQuery = useCallback(
    (filters: AppliedFilters, keyword: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        keyword: keyword || undefined,
        rating: RATING_FILTER_TO_VALUE[filters.rating],
        dateFrom: filters.fromDate || undefined,
        dateTo: filters.toDate || undefined,
      }));
    },
    [setParameter]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    syncFiltersToQuery(appliedFilters, value);
  };

  const handleFilterChange = (next: AppliedFilters) => {
    setAppliedFilters(next);
    syncFiltersToQuery(next, searchQuery);
  };

  const handleClear = () => {
    const cleared: AppliedFilters = {
      fromDate: "",
      toDate: "",
      rating: ALL_RATINGS,
    };
    setAppliedFilters(cleared);
    setSearchQuery("");
    setParameter((prev) => {
      const { rating, dateFrom, dateTo, keyword, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const tableRows = data?.data ?? [];

  const handleOpenReply = (fb: IMealRating) => {
    setSelectedFeedback(fb);
    setIsViewOnly(false);
    setReplyText("");
    setOpenReplyModal(true);
  };

  const handleOpenView = (fb: IMealRating) => {
    setSelectedFeedback(fb);
    setIsViewOnly(true);
    setReplyText("");
    setOpenReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
    setSelectedFeedback(null);
    setIsViewOnly(false);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!selectedFeedback?.id || !replyText.trim()) return;

    try {
      await replyMealRating({
        id: selectedFeedback.id,
        reply: replyText.trim(),
      }).unwrap();
      handleCloseReplyModal();
      refetch();
    } catch {
      // Error toast handled in mutation
    }
  };

  const getRatingChip = (ratingLabel: string) => {
    const normalized = ratingLabel?.toLowerCase();
    switch (normalized) {
      case "awesome":
        return (
          <Chip
            label="Awesome"
            size="small"
            sx={{
              bgcolor: alpha(primaryGreen, 0.1),
              color: primaryGreen,
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      case "good":
        return (
          <Chip
            label="Good"
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#D97706",
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      case "not good":
        return (
          <Chip
            label="Not Good"
            size="small"
            sx={{
              bgcolor: "#FEE2E2",
              color: "#EF4444",
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      default:
        return (
          <Chip
            label={ratingLabel}
            size="small"
            sx={{ fontWeight: 700, height: 24 }}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}
          >
            Meal Rating
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            Track meal performance and review customer feedback
          </Typography>
        </Box>
      </Box>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          border: "1px solid #F1F5F9",
        }}
      >
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <OutlinedInput
              size="small"
              placeholder="Search by feedback, user..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                width: 300,
                borderRadius: 2,
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#E2E8F0" },
              }}
            />
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterListIcon />}
              sx={{
                height: 36,
                px: 3,
                borderRadius: 2,
                borderColor: "#E2E8F0",
                color: "#0F172A",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              Filters
            </Button>
          </Box>

          <Collapse in={showFilters}>
            <Box
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: 3,
                p: 3,
                mb: 3,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  Rating
                </Typography>
                <Select
                  size="small"
                  value={appliedFilters.rating}
                  onChange={(e) =>
                    handleFilterChange({
                      ...appliedFilters,
                      rating: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    minWidth: 150,
                    "& fieldset": { borderColor: "#E2E8F0" },
                  }}
                >
                  <MenuItem value={ALL_RATINGS}>All</MenuItem>
                  <MenuItem value="Awesome">Awesome</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Not Good">Not Good</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  From Date
                </Typography>
                <OutlinedInput
                  type="date"
                  size="small"
                  value={appliedFilters.fromDate}
                  onChange={(e) =>
                    handleFilterChange({
                      ...appliedFilters,
                      fromDate: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    minWidth: 150,
                    "& fieldset": { borderColor: "#E2E8F0" },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  To Date
                </Typography>
                <OutlinedInput
                  type="date"
                  size="small"
                  value={appliedFilters.toDate}
                  onChange={(e) =>
                    handleFilterChange({
                      ...appliedFilters,
                      toDate: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    minWidth: 150,
                    "& fieldset": { borderColor: "#E2E8F0" },
                  }}
                />
              </Box>

              <Button
                onClick={handleClear}
                variant="outlined"
                sx={{
                  height: 36,
                  px: 3,
                  borderRadius: 2,
                  borderColor: "#E2E8F0",
                  color: "#0F172A",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#F8FAFC" },
                }}
              >
                Clear filters
              </Button>
            </Box>
          </Collapse>

          <Box sx={{ position: "relative", minHeight: 200 }}>
            {isFetching && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,0.6)",
                  zIndex: 1,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            )}

            <Table
              sx={{
                minWidth: 650,
                "& th": {
                  borderBottom: "1px solid #E2E8F0",
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: 13,
                  py: 2,
                  px: 2,
                },
                "& td": {
                  borderBottom: "1px solid #F1F5F9",
                  py: 2,
                  px: 2,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Dish</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Additional Comment</TableCell>
                  <TableCell sx={{ minWidth: 250 }}>Feedback</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.length > 0 ? (
                  tableRows.map((fb) => {
                    const replyStatus = getReplyStatus(fb);
                    return (
                      <TableRow
                        key={fb.id}
                        sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              src={getCustomerAvatar(fb.customerImageUrl)}
                              sx={{ width: 36, height: 36 }}
                            >
                              {fb.customerName?.charAt(0)}
                            </Avatar>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#0F172A",
                              }}
                            >
                              {fb.customerName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            {fb.dishName}
                          </Typography>
                        </TableCell>
                        <TableCell>{getRatingChip(fb.ratingLabel)}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#475569",
                              fontWeight: 600,
                            }}
                          >
                            {fb.additionalComment || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#475569",
                              lineHeight: 1.5,
                            }}
                          >
                            {getFeedbackText(fb) || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          >
                            {fb.mealDate
                              ? dayjs(fb.mealDate).format("YYYY-MM-DD")
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {fb.canReply ? (
                            <Button
                              size="small"
                              onClick={() => handleOpenReply(fb)}
                              variant={
                                replyStatus === "Pending"
                                  ? "contained"
                                  : "outlined"
                              }
                              sx={{
                                bgcolor:
                                  replyStatus === "Pending"
                                    ? primaryGreen
                                    : "transparent",
                                color:
                                  replyStatus === "Pending"
                                    ? "#fff"
                                    : "text.secondary",
                                borderColor:
                                  replyStatus === "Pending"
                                    ? primaryGreen
                                    : "#E2E8F0",
                                boxShadow: "none",
                                textTransform: "none",
                                borderRadius: 2,
                                fontSize: 12,
                                fontWeight: 600,
                                "&:hover": {
                                  boxShadow: "none",
                                  bgcolor:
                                    replyStatus === "Pending"
                                      ? primaryGreen
                                      : "#F8FAFC",
                                },
                              }}
                            >
                              {replyStatus === "Pending"
                                ? "Reply"
                                : "View Details"}
                            </Button>
                          ) : (
                            <IconButton
                              size="small"
                              onClick={() => handleOpenView(fb)}
                              sx={{
                                color: "text.secondary",
                                border: "1px solid #E2E8F0",
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#F8FAFC" },
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {isFetching
                          ? "Loading feedback..."
                          : "No feedback matches the selected filters."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={totalRecords ?? 0}
            page={(page ?? 1) - 1}
            onPageChange={(_, newPage) => changePage(newPage + 1)}
            rowsPerPage={limit ?? 10}
            onRowsPerPageChange={(e) => changeLimit(e.target.value)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ borderTop: "1px solid #F1F5F9", mt: 1 }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openReplyModal}
        onClose={handleCloseReplyModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #F1F5F9",
            pb: 2,
          }}
        >
          <Typography
            sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}
          >
            Feedback Details
          </Typography>
          <IconButton onClick={handleCloseReplyModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {isViewOnly && isLoadingDetails ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 6,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : selectedFeedback ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    src={getCustomerAvatar(
                      selectedFeedback.customerImageUrl
                    )}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: primaryGreen,
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  >
                    {selectedFeedback.customerName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}
                    >
                      {selectedFeedback.customerName}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                      {selectedFeedback.dishName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getRatingChip(
                    isViewOnly && viewDetails
                      ? viewDetails.ratingLabel
                      : selectedFeedback.ratingLabel
                  )}
                  <Chip
                    label="Feedback"
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: "#FFEDD5",
                      color: "#EA580C",
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    label={
                      isViewOnly ||
                      getReplyStatus(selectedFeedback) !== "Pending"
                        ? "Replied"
                        : "Pending"
                    }
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor:
                        isViewOnly ||
                        getReplyStatus(selectedFeedback) !== "Pending"
                          ? "#CCFBF1"
                          : "#FEE2E2",
                      color:
                        isViewOnly ||
                        getReplyStatus(selectedFeedback) !== "Pending"
                          ? "#0D9488"
                          : "#EF4444",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>

              {(isViewOnly
                ? viewDetails?.improvementTags
                : selectedFeedback.improvementTags
              )?.length ? (
                <>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#64748B",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    Improvement Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                    {(isViewOnly
                      ? viewDetails?.improvementTags
                      : selectedFeedback.improvementTags
                    )?.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </>
              ) : null}

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#64748B",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Additional Comment
              </Typography>
              <Typography
                sx={{ fontSize: 15, color: "#0F172A", mb: 3, fontWeight: 600 }}
              >
                {(isViewOnly
                  ? viewDetails?.additionalComment
                  : selectedFeedback.additionalComment) || "-"}
              </Typography>

              {!isViewOnly && (
                <>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#64748B",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    Full Message
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: "#0F172A", mb: 1 }}>
                    {getFeedbackText(selectedFeedback) || "-"}
                  </Typography>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                  py: 1,
                  borderTop: "1px solid #F1F5F9",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Meal date:{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "#0F172A" }}
                  >
                    {selectedFeedback.mealDate
                      ? dayjs(selectedFeedback.mealDate).format("MMM D, YYYY")
                      : "-"}
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Submitted:{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "#0F172A" }}
                  >
                    {selectedFeedback.submittedOn
                      ? dayjs(selectedFeedback.submittedOn).format(
                          "MMM D, YYYY h:mm A"
                        )
                      : "-"}
                  </Box>
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#64748B",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Admin Reply
              </Typography>
              {isViewOnly ? (
                <Box
                  sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    p: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ fontSize: 15, color: "#0F172A" }}>
                    {viewDetails?.adminReply || "-"}
                  </Typography>
                  {viewDetails?.adminRepliedOn && (
                    <Typography
                      sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}
                    >
                      Replied:{" "}
                      {dayjs(viewDetails.adminRepliedOn).format(
                        "MMM D, YYYY h:mm A"
                      )}
                    </Typography>
                  )}
                </Box>
              ) : getReplyStatus(selectedFeedback) === "Pending" ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isReplying}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#fff",
                      "& fieldset": { borderColor: "#E2E8F0" },
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    p: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ fontSize: 15, color: "#0F172A" }}>
                    {selectedFeedback.adminReply}
                  </Typography>
                  {selectedFeedback.adminRepliedOn && (
                    <Typography
                      sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}
                    >
                      Replied:{" "}
                      {dayjs(selectedFeedback.adminRepliedOn).format(
                        "MMM D, YYYY h:mm A"
                      )}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={handleCloseReplyModal}
            disabled={isReplying}
            sx={{
              color: "#0F172A",
              borderColor: "#E2E8F0",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
            }}
          >
            Close
          </Button>
          {!isViewOnly &&
            selectedFeedback &&
            getReplyStatus(selectedFeedback) === "Pending" &&
            selectedFeedback.canReply && (
              <Button
                variant="contained"
                onClick={handleSendReply}
                disabled={isReplying || !replyText.trim()}
                sx={{
                  bgcolor: primaryGreen,
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealRatingsDashboard;
