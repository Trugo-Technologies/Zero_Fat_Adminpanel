/** @format */

import { Grid } from "@mui/material";
import ActivityLogsTable from "../components/ActivityLogsTable";
import { ActivityLogRow } from "../types";

type Props = {
  logs: ActivityLogRow[];
};

const ActivityAuditTab = ({ logs }: Props) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <ActivityLogsTable logs={logs} />
    </Grid>
  </Grid>
);

export default ActivityAuditTab;
