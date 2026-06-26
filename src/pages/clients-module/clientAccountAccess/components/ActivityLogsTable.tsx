/** @format */

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Fonts } from "src/@crema/constants/AppEnums";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import { ActivityLogRow } from "../types";

type Props = {
  logs: ActivityLogRow[];
};

const ActivityLogsTable = ({ logs }: Props) => {
  const { messages } = useIntl();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const actions = useMemo(
    () => [...new Set(logs.map((l) => l.action))],
    [logs]
  );

  const filteredRows = useMemo(() => {
    return logs.filter((row) => {
      const matchesSearch =
        !search ||
        row.action.toLowerCase().includes(search.toLowerCase()) ||
        row.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        row.previousValue.toLowerCase().includes(search.toLowerCase()) ||
        row.newValue.toLowerCase().includes(search.toLowerCase());
      const matchesAction =
        actionFilter === "all" || row.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, search, actionFilter]);

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
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder={messages["common.search"] as string}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{messages["common.filter"] as string}</InputLabel>
          <Select
            value={actionFilter}
            label={messages["common.filter"] as string}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <MenuItem value="all">{messages["common.all"] as string}</MenuItem>
            {actions.map((action) => (
              <MenuItem key={action} value={action}>
                {action}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{ ml: { xs: 0, md: "auto" } }}
        >
          {messages["common.export"] as string}
        </Button>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
      />
    </Box>
  );
};

export default ActivityLogsTable;
