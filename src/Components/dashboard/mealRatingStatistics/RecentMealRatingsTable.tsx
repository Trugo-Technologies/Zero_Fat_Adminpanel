/** @format */

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { baseImageUrl } from "src/env/base-url";
import { useGetRecentMealRatingsQuery } from "src/pages/dashboard/services/api";
import { IMealRating } from "src/types/modules/clientsManagement/mealRatings";

const RECENT_RATINGS_LIMIT = 5;

const getCustomerAvatar = (imageUrl: string | null) =>
  imageUrl ? `${baseImageUrl}/${imageUrl}` : undefined;

const getFeedbackPreview = (item: IMealRating) => {
  const text =
    item.feedback ||
    item.additionalComment ||
    (item.improvementTags?.length ? item.improvementTags.join(", ") : "");

  if (!text) return "-";
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
};

const RecentMealRatingsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const primaryGreen = theme.palette.primary.main;

  const { data, isFetching, isError } = useGetRecentMealRatingsQuery({
    limit: RECENT_RATINGS_LIMIT,
  });

  const rows = data?.data ?? [];

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
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid #E2E8F0",
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          <IntlMessages id="dashboard.recentRatings" />
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/meal-ratings")}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            color: primaryGreen,
          }}
        >
          <IntlMessages id="dashboard.viewAllMealRatings" />
        </Button>
      </Box>

      {isError && (
        <Typography sx={{ fontSize: 13, color: "warning.main", mb: 2 }}>
          Recent ratings could not be loaded.
        </Typography>
      )}

      <Box sx={{ position: "relative", minHeight: 120 }}>
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
            <CircularProgress size={28} />
          </Box>
        )}

        <Table
          sx={{
            minWidth: 650,
            "& th": {
              borderBottom: "1px solid #E2E8F0",
              color: "text.secondary",
              fontWeight: 700,
              fontSize: 12,
              py: 1.5,
              px: 1.5,
            },
            "& td": {
              borderBottom: "1px solid #F1F5F9",
              py: 1.5,
              px: 1.5,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Dish</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                      }}
                    >
                      <Avatar
                        src={getCustomerAvatar(row.customerImageUrl)}
                        sx={{ width: 32, height: 32, fontSize: 13 }}
                      >
                        {row.customerName?.charAt(0)}
                      </Avatar>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {row.customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#475569" }}
                    >
                      {row.dishName}
                    </Typography>
                  </TableCell>
                  <TableCell>{getRatingChip(row.ratingLabel)}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#475569" }}>
                      {getFeedbackPreview(row)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      {row.submittedOn
                        ? dayjs(row.submittedOn).format("YYYY-MM-DD")
                        : row.mealDate
                          ? dayjs(row.mealDate).format("YYYY-MM-DD")
                          : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography
                    sx={{
                      py: 3,
                      textAlign: "center",
                      fontSize: 13,
                      color: "text.secondary",
                    }}
                  >
                    <IntlMessages id="dashboard.noRecentRatings" />
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default RecentMealRatingsTable;
