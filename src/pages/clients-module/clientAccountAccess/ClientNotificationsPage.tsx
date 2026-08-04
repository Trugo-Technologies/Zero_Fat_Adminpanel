/** @format */

import React, { useCallback, useEffect, useState } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  NotificationChannelValue,
  NotificationLogStatus,
  NotificationLogStatusValue,
  IClientNotification,
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
} from "src/pages/dashboard/notificationLogs/notificationLogHelpers";
import { useGetClientNotificationsQuery } from "src/pages/dashboard/notificationLogs/services/api";

const ClientNotificationsPage = () => {
  const theme = useTheme();
  const primaryGreen = theme.palette.primary.main;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId") || "";
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
  } = usePaginateData(
    useGetClientNotificationsQuery,
    { skip: !clientId },
    { clientId, pageSize: 20 }
  );

  useEffect(() => {
    if (!clientId) return;
    setParameter((prev) => ({
      ...prev,
      clientId,
      pageNumber: 1,
    }));
  }, [clientId, setParameter]);

  const syncFiltersToQuery = useCallback(
    (filters: NotificationLogFilters, search: string) => {
      setParameter((prev) => ({
        pageNumber: 1,
        pageSize: prev.pageSize ?? 20,
        clientId,
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
    [clientId, setParameter]
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
    setParameter({
      pageNumber: 1,
      pageSize: 20,
      clientId,
    });
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

  const getReadChip = (isRead: boolean) => (
    <Chip
      label={
        isRead
          ? (messages["clientAccountAccess.notifications.read"] as string)
          : (messages["clientAccountAccess.notifications.unread"] as string)
      }
      size="small"
      sx={{
        fontWeight: 700,
        height: 24,
        bgcolor: isRead ? alpha(primaryGreen, 0.1) : "#FEF3C7",
        color: isRead ? primaryGreen : "#D97706",
      }}
    />
  );

  const formatDateTime = (value?: string | null) =>
    value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "—";

  const backToAccountAccess = () => {
    navigate(
      clientId
        ? `/clientsManagement/clientAccountAccess?clientId=${clientId}`
        : "/clientsManagement/clientAccountAccess"
    );
  };

  if (!clientId) {
    return (
      <Box sx={{ p: 0 }}>
        <AppBreadcrumb
          paths={[
            {
              name: messages["sidebar.clientsManagement.title"],
              path: "/clientsManagement/clients",
            },
            {
              name: messages["sidebar.clientAccountAccess"],
              path: "/clientsManagement/clientAccountAccess",
            },
          ]}
          currentPathName="clientAccountAccess.notifications.title"
        />
        <Card sx={{ borderRadius: 4, mt: 2 }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, color: "text.secondary", mb: 2 }}>
              {messages["clientAccountAccess.notifications.missingClient"] as string}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={backToAccountAccess}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
            >
              {messages["clientAccountAccess.notifications.back"] as string}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      <AppBreadcrumb
        paths={[
          {
            name: messages["sidebar.clientsManagement.title"],
            path: "/clientsManagement/clients",
          },
          {
            name: messages["sidebar.clientAccountAccess"],
            path: `/clientsManagement/clientAccountAccess?clientId=${clientId}`,
          },
        ]}
        currentPathName="clientAccountAccess.notifications.title"
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={backToAccountAccess}
            sx={{
              mb: 1,
              px: 0,
              textTransform: "none",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {messages["clientAccountAccess.notifications.back"] as string}
          </Button>
          <Typography
            sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}
          >
            {messages["clientAccountAccess.notifications.title"] as string}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            {messages["clientAccountAccess.notifications.subtitle"] as string}
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
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <OutlinedInput
              size="small"
              placeholder={
                messages[
                  "clientAccountAccess.notifications.searchPlaceholder"
                ] as string
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
                {(
                  [
                    "notificationLogs.table.channel",
                    "notificationLogs.table.message",
                    "common.status",
                    "clientAccountAccess.notifications.readStatus",
                    "notificationLogs.table.sentBy",
                    "notificationLogs.table.sentOn",
                  ] as const
                ).map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      fontWeight: 700,
                      color: "#64748B",
                      fontSize: 12,
                      textTransform: "uppercase",
                      width: key === "notificationLogs.table.message" ? "30%" : undefined,
                    }}
                  >
                    {messages[key] as string}
                  </TableCell>
                ))}
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
                tableRows.map((row: IClientNotification) => (
                  <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                    <TableCell>{getChannelChip(row.channel)}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#0F172A",
                          mb: 0.5,
                        }}
                      >
                        {row.title || "—"}
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
                        {stripHtml(row.message) || "—"}
                      </Typography>
                      {row.errorMessage ? (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#EF4444",
                            mt: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          {row.errorMessage}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell>{getReadChip(Boolean(row.isRead))}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        {row.sentByLabel || "—"}
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
                        {formatDateTime(row.sentOn || row.createdOn)}
                      </Typography>
                    </TableCell>
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
                      {
                        messages[
                          "clientAccountAccess.notifications.empty"
                        ] as string
                      }
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
            rowsPerPage={limit ?? 20}
            onRowsPerPageChange={(e) => changeLimit(e.target.value)}
            rowsPerPageOptions={[10, 20, 25, 50, 100]}
            sx={{ borderTop: "1px solid #F1F5F9", mt: 1 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientNotificationsPage;
