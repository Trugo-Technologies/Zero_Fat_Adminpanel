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
  Button,
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
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  NotificationChannelValue,
  NotificationLogStatus,
  NotificationLogStatusValue,
  INotificationLog,
} from "src/types/modules/dashboard/notifications";
import {
  ALL_CHANNELS,
  ALL_LOG_STATUSES,
  CHANNEL_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  channelToLabelKey,
  createDefaultNotificationLogFilters,
  NotificationLogFilters,
  statusToLabelKey,
  stripHtml,
} from "./notificationLogs/notificationLogHelpers";
import { useGetManageNotificationLogsQuery } from "./notificationLogs/services/api";

const NotificationLogsDashboard = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();
  const { messages, formatMessage } = useIntl();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<NotificationLogFilters>(
    createDefaultNotificationLogFilters
  );

  const {
    data,
    isFetching,
    page,
    limit,
    totalRecords,
    changePage,
    changeLimit,
    setParameter,
  } = usePaginateData(useGetManageNotificationLogsQuery);

  const syncFiltersToQuery = useCallback(
    (filters: NotificationLogFilters, search: string) => {
      setParameter((prev) => ({
        pageNumber: 1,
        pageSize: prev.pageSize ?? 10,
        search: search.trim() || undefined,
        channel:
          filters.channel !== ALL_CHANNELS
            ? Number(filters.channel)
            : undefined,
        status:
          filters.status !== ALL_LOG_STATUSES
            ? Number(filters.status)
            : undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      }));
    },
    [setParameter]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    syncFiltersToQuery(appliedFilters, value);
  };

  const handleFilterChange = (next: NotificationLogFilters) => {
    setAppliedFilters(next);
    syncFiltersToQuery(next, searchQuery);
  };

  const handleClear = () => {
    const cleared = createDefaultNotificationLogFilters();
    setAppliedFilters(cleared);
    setSearchQuery("");
    setParameter((prev) => ({
      pageNumber: 1,
      pageSize: prev.pageSize ?? 10,
    }));
  };

  const tableRows = data?.data ?? [];

  const getStatusChip = (status: NotificationLogStatusValue) => {
    const label = formatMessage({ id: statusToLabelKey(status) });

    switch (status) {
      case NotificationLogStatus.Sent:
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: alpha(primaryGreen, 0.1),
              color: primaryGreen,
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      case NotificationLogStatus.Pending:
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#D97706",
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      case NotificationLogStatus.Failed:
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: "#FEE2E2",
              color: "#EF4444",
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      case NotificationLogStatus.Partial:
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: "#E0E7FF",
              color: "#4338CA",
              fontWeight: 700,
              height: 24,
            }}
          />
        );
      default:
        return (
          <Chip label={label} size="small" sx={{ fontWeight: 700, height: 24 }} />
        );
    }
  };

  const getChannelChip = (channel: NotificationChannelValue) => (
    <Chip
      label={formatMessage({ id: channelToLabelKey(channel) })}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 700,
        height: 24,
        borderColor: "#E2E8F0",
        color: "#0F172A",
      }}
    />
  );

  const formatSentOn = (value?: string) =>
    value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "—";

  const renderRecipientSummary = (log: INotificationLog) => (
    <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>
      {(messages["notificationLogs.table.recipientsSummary"] as string)
        .replace("{total}", String(log.recipientCount ?? 0))
        .replace("{success}", String(log.successCount ?? 0))
        .replace("{failed}", String(log.failureCount ?? 0))}
    </Typography>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}
          >
            {messages["notificationLogs.title"] as string}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            {messages["notificationLogs.subtitle"] as string}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SettingsOutlinedIcon />}
          onClick={() => navigate("/notification-logs/manage")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            height: 40,
          }}
        >
          {messages["notificationLogs.manage"] as string}
        </Button>
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
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <OutlinedInput
              size="small"
              placeholder={
                messages["notificationLogs.searchPlaceholder"] as string
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                width: 320,
                maxWidth: "100%",
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
              {messages["notificationLogs.filters"] as string}
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
                  {messages["notificationLogs.filters.channel"] as string}
                </Typography>
                <Select
                  size="small"
                  value={appliedFilters.channel}
                  onChange={(e) =>
                    handleFilterChange({
                      ...appliedFilters,
                      channel: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    minWidth: 160,
                    "& fieldset": { borderColor: "#E2E8F0" },
                  }}
                >
                  {CHANNEL_FILTER_OPTIONS.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontSize: 13 }}
                    >
                      {formatMessage({ id: option.labelKey })}
                    </MenuItem>
                  ))}
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
                  {messages["common.status"] as string}
                </Typography>
                <Select
                  size="small"
                  value={appliedFilters.status}
                  onChange={(e) =>
                    handleFilterChange({
                      ...appliedFilters,
                      status: e.target.value,
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
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontSize: 13 }}
                    >
                      {formatMessage({ id: option.labelKey })}
                    </MenuItem>
                  ))}
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
                  {messages["notificationLogs.filters.fromDate"] as string}
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
                  {messages["notificationLogs.filters.toDate"] as string}
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

              <Box sx={{ ml: "auto" }}>
                <Button
                  onClick={handleClear}
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
                    height: 36,
                    px: 2,
                    borderRadius: 2,
                  }}
                >
                  {messages["notificationLogs.filters.clear"] as string}
                </Button>
              </Box>
            </Box>
          </Collapse>

          <Table
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px solid #F1F5F9",
                py: 2,
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {messages["notificationLogs.table.channel"] as string}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                    width: "35%",
                  }}
                >
                  {messages["notificationLogs.table.message"] as string}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {messages["notificationLogs.table.recipients"] as string}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {messages["notificationLogs.table.sentBy"] as string}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {messages["notificationLogs.table.sentOn"] as string}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {messages["common.status"] as string}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : tableRows.length > 0 ? (
                tableRows.map((log) => (
                  <TableRow key={log.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                    <TableCell>{getChannelChip(log.channel)}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#0F172A",
                          mb: 0.5,
                        }}
                      >
                        {log.title || "—"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {stripHtml(log.message) || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>{renderRecipientSummary(log)}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        {log.sentByLabel || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        {formatSentOn(log.sentOn)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(log.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "text.secondary",
                      }}
                    >
                      {messages["notificationLogs.empty"] as string}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalRecords ?? 0}
            page={Math.max((page ?? 1) - 1, 0)}
            onPageChange={(_, nextPage) => changePage(nextPage + 1)}
            rowsPerPage={limit ?? 10}
            onRowsPerPageChange={(e) => changeLimit(e.target.value)}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{ borderTop: "1px solid #F1F5F9", mt: 1 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationLogsDashboard;
