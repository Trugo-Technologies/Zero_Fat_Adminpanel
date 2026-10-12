/** @format */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useIntl from "react-intl/lib/src/components/useIntl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppMoreDetails from "src/Components/baseComponents/details/AppMoreDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { IChallengeParticipant } from "src/types/modules/clientsManagement/challenges";
import { useGetChallengeByIdQuery } from "./services/api";

const ChallengeParticipantDetailsPage = () => {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const { challengeId, participantId } = useParams<{
    challengeId: string;
    participantId: string;
  }>();
  const [tab, setTab] = useState("1");

  const { data: challengeResponse } = useGetChallengeByIdQuery(
    { id: challengeId || "" },
    { skip: !challengeId }
  );

  const participant = useMemo(() => {
    const fromState = (location.state as { participant?: IChallengeParticipant })
      ?.participant;
    if (fromState && fromState.id === participantId) return fromState;
    return undefined;
  }, [location.state, participantId]);

  const challenge = challengeResponse?.data;
  const challengeName = challenge?.title || challengeId;

  const backToParticipants = () => {
    navigate(`/clientsManagement/challenges/${challengeId}/participants`);
  };

  if (!participant) {
    return (
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            {
              name: messages["sidebar.challenges"],
              path: "/clientsManagement/challenges",
            },
          ]}
          currentPathName='challenges.participant.details'
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography mb={2}>
                {messages["challenges.participant.notFound"] as string}
              </Typography>
              <Button
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                onClick={backToParticipants}>
                {messages["challenges.backToParticipants"] as string}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  const systemInfo = {
    createdBy: participant.createdBy || "",
    createdByName: participant.createdByName || "System",
    createdOn: participant.createdOn || participant.startedAt,
    lastModifiedBy: participant.lastModifiedBy || "",
    lastModifiedByName: participant.lastModifiedByName || "System",
    lastModifiedOn: participant.lastModifiedOn || participant.startedAt,
    deletedOn: participant.deletedOn || "",
    deletedBy: participant.deletedBy || "",
    deletedByName: participant.deletedByName || "",
    activationChangedOn: participant.activationChangedOn || "",
    activationChangedByName: participant.activationChangedByName || "",
    activationChangedBy: participant.activationChangedBy || "",
  };

  return (
    <Grid container spacing={3}>
      <AppBreadcrumb
        paths={[
          { name: messages["sidebar.clientsManagement.title"] },
          {
            name: messages["sidebar.challenges"],
            path: "/clientsManagement/challenges",
          },
          {
            name: messages["challenges.participants"],
            path: `/clientsManagement/challenges/${challengeId}/participants`,
          },
        ]}
        currentPathName='challenges.participant.details'
      />
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent='space-between'
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              mb={2}>
              <Stack spacing={0.5}>
                <Typography variant='h5' fontWeight={700}>
                  {participant.clientName}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {challengeName}
                </Typography>
              </Stack>
              <Button
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                onClick={backToParticipants}>
                {messages["challenges.backToParticipants"] as string}
              </Button>
            </Stack>

            <TabContext value={tab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <TabList
                  onChange={(_, value) => setTab(value)}
                  aria-label='participant details tabs'>
                  <Tab
                    label={<IntlMessages id='details' />}
                    value='1'
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  />
                  <Tab
                    label={<IntlMessages id='additionalInfo' />}
                    value='2'
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  />
                </TabList>
              </Box>

              <TabPanel value='1' sx={{ px: 0 }}>
                <Grid container spacing={5}>
                  <AppItemView
                    label='challenges.participant.clientName'
                    value={participant.clientName}
                    column={6}
                  />
                  <AppItemView
                    label='common.email'
                    value={participant.email}
                    column={6}
                  />
                  <AppItemView
                    label='leaderboard.rank'
                    value={
                      participant.rank != null ? `#${participant.rank}` : "-"
                    }
                    column={6}
                  />
                  <AppItemView
                    label='leaderboard.steps'
                    value={Number(participant.stepsCount || 0).toLocaleString()}
                    column={6}
                  />
                  <AppItemView
                    label='challenges.participant.startedAt'
                    value={moment(participant.startedAt).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                    column={6}
                  />
                </Grid>
              </TabPanel>

              <TabPanel value='2' sx={{ px: 0 }}>
                <AppMoreDetails moreDetails={systemInfo} column={6} />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChallengeParticipantDetailsPage;
