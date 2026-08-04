/** @format */

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Collapse,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ACTIVITY_LOG_ACTION_TYPES } from "../activityLogActionTypes";
import {
  ActivityLogFilters,
  ActivityLogRow,
  defaultActivityLogFilters,
} from "../types";
import type { ActivityLogActionTypeFilter } from "../activityLogActionTypes";

const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

type Props = {
  logs: ActivityLogRow[];
  loading?: boolean;
  serverPagination?: boolean;
  rowCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  appliedFilters?: ActivityLogFilters;
  onAppliedFiltersChange?: (filters: ActivityLogFilters) => void;
  onExport?: () => void;
  isExporting?: boolean;
  exportDisabled?: boolean;
};

const ActivityLogsTable = ({
  logs,
  loading = false,
  serverPagination = false,
  rowCount = 0,
  paginationModel,
  onPaginationModelChange,
  search: searchProp,
  onSearchChange,
  appliedFilters: appliedFiltersProp,
  onAppliedFiltersChange,
  onExport,
  isExporting = false,
  exportDisabled = false,
}: Props) => {
  const { messages } = useIntl();
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilters, setInternalFilters] = useState<ActivityLogFilters>(
    defaultActivityLogFilters
  );
  const [showFilters, setShowFilters] = useState(false);

  const search = searchProp ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;
  const appliedFilters = appliedFiltersProp ?? internalFilters;
  const setAppliedFilters = onAppliedFiltersChange ?? setInternalFilters;

  const filteredRows = useMemo(() => {
    if (serverPagination) {
      return logs;
    }

    return logs.filter((row) => {
      const matchesSearch =
        !search ||
        row.action.toLowerCase().includes(search.toLowerCase()) ||
        row.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        row.previousValue.toLowerCase().includes(search.toLowerCase()) ||
        row.newValue.toLowerCase().includes(search.toLowerCase());
      const matchesActionType =
        appliedFilters.actionType === "all" ||
        row.actionType === Number(appliedFilters.actionType);
      const matchesDate =
        !appliedFilters.date || row.date === appliedFilters.date;

      return matchesSearch && matchesActionType && matchesDate;
    });
  }, [logs, search, appliedFilters, serverPagination]);

  const handleClearFilters = () => {
    setAppliedFilters(defaultActivityLogFilters);
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: messages["clientAccountAccess.log.action"] as string,
      flex: 1,
      minWidth: 160,
    },
    {
      field: "performedBy",
      headerName: messages["clientAccountAccess.log.performedBy"] as string,
      flex: 1,
      minWidth: 160,
    },
    {
      field: "previousValue",
      headerName: messages["clientAccountAccess.log.previousValue"] as string,
      flex: 1,
      minWidth: 140,
    },
    {
      field: "newValue",
      headerName: messages["clientAccountAccess.log.newValue"] as string,
      flex: 1,
      minWidth: 140,
    },
    {
      field: "date",
      headerName: messages["clientAccountAccess.log.date"] as string,
      width: 120,
    },
    {
      field: "time",
      headerName: messages["clientAccountAccess.log.time"] as string,
      width: 90,
    },
  ];

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: Fonts.SEMI_BOLD, mb: 2 }}>
        <IntlMessages id="clientAccountAccess.activityLogs" />
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <OutlinedInput
          size="small"
          placeholder={messages["common.search"] as string}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
            disabled={exportDisabled || isExporting}
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
            {messages["common.export"] as string}
          </Button>
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
            <IntlMessages id="clientAccountAccess.filters" />
          </Button>
        </Box>
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
            flexWrap: "wrap",
            gap: 3,
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
              {messages["clientAccountAccess.log.actionType"] as string}
            </Typography>
            <Select
              size="small"
              value={appliedFilters.actionType}
              onChange={(e) =>
                setAppliedFilters({
                  ...appliedFilters,
                  actionType: e.target.value as ActivityLogActionTypeFilter,
                })
              }
              sx={{
                borderRadius: 2,
                height: 36,
                fontSize: 13,
                minWidth: 220,
                "& fieldset": { borderColor: "#E2E8F0" },
              }}
            >
              <MenuItem value="all">{messages["common.all"] as string}</MenuItem>
              {ACTIVITY_LOG_ACTION_TYPES.map((actionType) => (
                <MenuItem key={actionType.id} value={String(actionType.value)}>
                  {
                    messages[
                      `clientAccountAccess.actionType.${actionType.id}`
                    ] as string
                  }
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
              {messages["clientAccountAccess.log.date"] as string}
            </Typography>
            <OutlinedInput
              type="date"
              size="small"
              value={appliedFilters.date}
              onChange={(e) =>
                setAppliedFilters({
                  ...appliedFilters,
                  date: e.target.value,
                })
              }
              sx={dateInputSx}
            />
          </Box>
          <Button
            onClick={handleClearFilters}
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
            <IntlMessages id="clientAccountAccess.clearFilters" />
          </Button>
        </Box>
      </Collapse>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        paginationMode={serverPagination ? "server" : "client"}
        rowCount={serverPagination ? rowCount : undefined}
        paginationModel={serverPagination ? paginationModel : undefined}
        onPaginationModelChange={
          serverPagination ? onPaginationModelChange : undefined
        }
        initialState={
          serverPagination
            ? undefined
            : {
                pagination: { paginationModel: { pageSize: 5 } },
              }
        }
      />
    </Box>
  );
};

export default ActivityLogsTable;
