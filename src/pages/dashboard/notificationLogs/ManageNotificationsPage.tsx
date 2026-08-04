/** @format */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import ContentEditor from "src/Components/editor";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { NotificationType } from "src/types/modules/dashboard/notifications";
import { buildManageNotificationClientFilterInputs } from "./buildManageNotificationClientFilterInputs";
import { ManageNotificationClientColumns } from "./ManageNotificationClientColumns";
import {
  ManageNotificationClientFilters,
  ManageNotificationPeriod,
  buildManageNotificationClientQueryParams,
  createDefaultManageNotificationClientFilters,
} from "./manageNotificationClientFilterHelpers";
import {
  NOTIFICATION_TYPE_OPTIONS,
  isMessageEmpty,
  notificationTypeToChannel,
  selectSx,
} from "./notificationManageHelpers";
import {
  useGetManageNotificationClientsQuery,
  useLazyGetManageNotificationClientsQuery,
  useSendClientNotificationsMutation,
} from "./services/api";

const ManageNotificationsPage = () => {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const columns = ManageNotificationClientColumns();

  const {
    changeLimit,
    changePage,
    data,
    isFetching,
    limit,
    page,
    setSearchValue,
    refetch,
    sortBy,
    totalRecords,
    setParameter,
    parameter,
  } = usePaginateData(useGetManageNotificationClientsQuery);

  const [fetchAllClients, { isFetching: isFetchingAllClients }] =
    useLazyGetManageNotificationClientsQuery();
  const [sendNotifications, { isLoading: isSending }] =
    useSendClientNotificationsMutation();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [clientFilters, setClientFilters] =
    useState<ManageNotificationClientFilters>(
      createDefaultManageNotificationClientFilters
    );
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isSelectingAll, setIsSelectingAll] = useState(false);
  const [notificationType, setNotificationType] =
    useState<NotificationType>("Email");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editorResetKey, setEditorResetKey] = useState(0);

  const getClientRowId = (row: { clientId?: string; id?: string }) =>
    row.clientId || row.id || "";

  const handleSelectionModelChange = async (
    nextSelection: GridRowSelectionModel
  ) => {
    const currentPageIds = (data?.data ?? [])
      .map((row) => getClientRowId(row))
      .filter(Boolean);
    const total = totalRecords ?? 0;
    const previousHadAllCurrentPage =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selectionModel.includes(id));
    const nextHasAllCurrentPage =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => nextSelection.includes(id));
    const nextCurrentPageCount = currentPageIds.filter((id) =>
      nextSelection.includes(id)
    ).length;

    // Header unchecked: MUI only drops current-page ids when
    // keepNonExistentRowsSelected is on — clear the whole selection.
    if (
      nextSelection.length === 0 ||
      (previousHadAllCurrentPage && nextCurrentPageCount === 0)
    ) {
      setSelectionModel([]);
      return;
    }

    // Header checked on current page → select all matching filtered clients
    if (
      nextHasAllCurrentPage &&
      !previousHadAllCurrentPage &&
      total > currentPageIds.length
    ) {
      setIsSelectingAll(true);
      try {
        const result = await fetchAllClients({
          ...parameter,
          pageNumber: 1,
          pageSize: total,
        }).unwrap();

        const allIds = (result?.data ?? [])
          .map((row) => getClientRowId(row))
          .filter(Boolean);

        setSelectionModel(allIds);
      } catch {
        setSelectionModel(nextSelection);
      } finally {
        setIsSelectingAll(false);
      }
      return;
    }

    setSelectionModel(nextSelection);
  };

  const syncClientFiltersToQuery = useCallback(
    (filters: ManageNotificationClientFilters) => {
      const filterParams = buildManageNotificationClientQueryParams(filters);
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        isActive: filterParams.isActive,
        gender: filterParams.gender,
        dietitianGoal: filterParams.dietitianGoal,
        subscriptionStatus: filterParams.subscriptionStatus,
        period: filterParams.period,
        fromDate: filterParams.fromDate,
        toDate: filterParams.toDate,
      }));
      setSelectionModel([]);
    },
    [setParameter]
  );

  const updateClientFilters = (
    updater: (current: ManageNotificationClientFilters) => ManageNotificationClientFilters
  ) => {
    const next = updater(clientFilters);
    setClientFilters(next);
    syncClientFiltersToQuery(next);
  };

  const handleStatusChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, status: value }));
  };

  const handleGenderChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, gender: value }));
  };

  const handleDietitianGoalChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, dietitianGoal: value }));
  };

  const handleSubscriptionStatusChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, subscriptionStatus: value }));
  };

  const handlePeriodChange = (value: ManageNotificationPeriod) => {
    updateClientFilters((current) => ({
      ...current,
      period: value,
      fromDate: value === "custom" ? current.fromDate : "",
      toDate: value === "custom" ? current.toDate : "",
    }));
  };

  const handleFromDateChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, fromDate: value }));
  };

  const handleToDateChange = (value: string) => {
    updateClientFilters((current) => ({ ...current, toDate: value }));
  };

  const handleClearClientFilters = () => {
    const cleared = createDefaultManageNotificationClientFilters();
    setClientFilters(cleared);
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      isActive: undefined,
      gender: undefined,
      dietitianGoal: undefined,
      subscriptionStatus: undefined,
      period: undefined,
      fromDate: undefined,
      toDate: undefined,
    }));
    setSelectionModel([]);
  };

  const advanceFiltersInputs = buildManageNotificationClientFilterInputs({
    filters: clientFilters,
    messages,
    onStatusChange: handleStatusChange,
    onGenderChange: handleGenderChange,
    onDietitianGoalChange: handleDietitianGoalChange,
    onSubscriptionStatusChange: handleSubscriptionStatusChange,
    onPeriodChange: handlePeriodChange,
    onFromDateChange: handleFromDateChange,
    onToDateChange: handleToDateChange,
    onClear: handleClearClientFilters,
  });

  const selectedCount = selectionModel.length;
  const canSend =
    selectedCount > 0 &&
    title.trim().length > 0 &&
    !isMessageEmpty(message) &&
    !isSending;

  const handleSend = async () => {
    if (!canSend) return;

    try {
      await sendNotifications({
        channel: notificationTypeToChannel(notificationType),
        clientIds: selectionModel as string[],
        title: title.trim(),
        message,
      }).unwrap();

      setTitle("");
      setMessage("");
      setEditorResetKey((prev) => prev + 1);
      setSelectionModel([]);
    } catch {
      // Errors are handled in the mutation.
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/notification-logs")}
            sx={{
              mb: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {messages["notificationLogs.manage.back"] as string}
          </Button>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
            {messages["notificationLogs.manage.title"] as string}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            {messages["notificationLogs.manage.subtitle"] as string}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                  {messages["notificationLogs.manage.selectClients"] as string}
                </Typography>
                <Chip
                  label={(messages["notificationLogs.manage.selectedCount"] as string).replace(
                    "{count}",
                    String(selectedCount)
                  )}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              <AppFilters
                showAddButton={false}
                showMultipleActivation={false}
                showMultipleDeactivation={false}
                showMultipleDeletion={false}
                onChangeKeywordValue={(event) => {
                  setSearchValue(event.target.value);
                  setSelectionModel([]);
                }}
                successUrl={`${endPoints.manageNotifications().pathname}/clients`}
                selectionModel={selectionModel as string[]}
                setSelectionModel={setSelectionModel}
                refetch={refetch}
                showAdvanceFiltersButton
                isOpenAdvanceFilters={isOpenAdvanceFilters}
                setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                advanceFiltersInputs={advanceFiltersInputs}
              />

              <Box sx={{ mt: 4 }}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="manageNotificationClients"
                  onPageSizeChange={(pageSize: number) => {
                    changeLimit(`${pageSize}`);
                  }}
                  onPageChange={(pageNumber: number) => {
                    changePage(pageNumber + 1);
                  }}
                  pageSize={limit ?? 10}
                  columns={columns}
                  rows={data?.data ?? []}
                  loading={isFetching || isSelectingAll || isFetchingAllClients}
                  getRowId={(row) => getClientRowId(row)}
                  onSelectionModelChange={handleSelectionModelChange}
                  checkboxSelection
                  keepNonExistentRowsSelected
                  selectionModel={selectionModel}
                  initialState={initialDataGridState}
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result as string[]);
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #F1F5F9" }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 3 }}>
                {messages["notificationLogs.manage.compose"] as string}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
                  {messages["notificationLogs.manage.notificationType"] as string}
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={notificationType}
                  onChange={(e) =>
                    setNotificationType(e.target.value as NotificationType)
                  }
                  sx={selectSx}
                >
                  {NOTIFICATION_TYPE_OPTIONS.map(({ value, labelKey }) => (
                    <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
                      {messages[labelKey] as string}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
                  {messages["notificationLogs.manage.titleLabel"] as string}
                </Typography>
                <OutlinedInput
                  fullWidth
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={messages["notificationLogs.manage.titlePlaceholder"] as string}
                  sx={{
                    borderRadius: 2,
                    height: 40,
                    fontSize: 13,
                    "& fieldset": { borderColor: "#E2E8F0" },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
                  {messages["notificationLogs.manage.message"] as string}
                </Typography>
                <ContentEditor
                  key={editorResetKey}
                  value={message}
                  onChange={setMessage}
                  minHeight={280}
                  placeholder={
                    messages[
                      "notificationLogs.manage.messagePlaceholder"
                    ] as string
                  }
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSend}
                disabled={!canSend}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  height: 42,
                }}
              >
                {isSending
                  ? (messages["notificationLogs.manage.sending"] as string)
                  : (messages["notificationLogs.manage.send"] as string)}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageNotificationsPage;
