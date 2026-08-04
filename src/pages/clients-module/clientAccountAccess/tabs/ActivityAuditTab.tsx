/** @format */

import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ActivityLogsTable from "../components/ActivityLogsTable";
import { parseActivityLogActionTypeFilter } from "../activityLogActionTypes";
import { mapActivityLogToRow } from "../mapClientAccountData";
import { useGetClientAccountActivityLogsQuery, useExportClientAccountActivityLogsMutation } from "../services/api";
import {
  ActivityLogRow,
  defaultActivityLogFilters,
} from "../types";

type Props = {
  clientId?: string | null;
  fallbackLogs: ActivityLogRow[];
};

const ActivityAuditTab = ({ clientId, fallbackLogs }: Props) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(defaultActivityLogFilters);
  const [exportActivityLogs, { isLoading: isExporting }] =
    useExportClientAccountActivityLogsMutation();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, appliedFilters]);

  const { data, isFetching } = useGetClientAccountActivityLogsQuery(
    {
      clientId: clientId || "",
      pageNumber: page + 1,
      pageSize,
      search: debouncedSearch || undefined,
      actionType: parseActivityLogActionTypeFilter(appliedFilters.actionType),
      date: appliedFilters.date || undefined,
    },
    { skip: !clientId }
  );

  const logs = useMemo(
    () =>
      clientId
        ? (data?.data ?? []).map(mapActivityLogToRow)
        : fallbackLogs,
    [clientId, data?.data, fallbackLogs]
  );

  const handleExport = async () => {
    if (!clientId) return;

    try {
      await exportActivityLogs({
        clientId,
        search: debouncedSearch || undefined,
        actionType: parseActivityLogActionTypeFilter(appliedFilters.actionType),
        date: appliedFilters.date || undefined,
      }).unwrap();
    } catch {
      // Errors are handled in the mutation.
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ActivityLogsTable
          logs={logs}
          loading={Boolean(clientId) && isFetching}
          serverPagination={Boolean(clientId)}
          rowCount={data?.totalCount ?? 0}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          search={searchInput}
          onSearchChange={setSearchInput}
          appliedFilters={appliedFilters}
          onAppliedFiltersChange={setAppliedFilters}
          onExport={handleExport}
          isExporting={isExporting}
          exportDisabled={!clientId}
        />
      </Grid>
    </Grid>
  );
};

export default ActivityAuditTab;
