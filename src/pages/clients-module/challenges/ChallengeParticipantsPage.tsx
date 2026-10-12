/** @format */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import {
  IChallengeParticipant,
  IChallengeParticipantsListDto,
  mapChallengeParticipantApiToUi,
} from "src/types/modules/clientsManagement/challenges";
import {
  ALL_PARTICIPANT_STATUSES,
  PARTICIPANT_STATUS_OPTIONS,
  ParticipantAppliedFilters,
  buildParticipantFilterQueryParams,
  createDefaultParticipantFilters,
  selectSx,
} from "./challengeFilterHelpers";
import { ParticipantsColumns } from "./ParticipantsColumns";
import {
  useGetChallengeByIdQuery,
  useGetChallengeParticipantsQuery,
} from "./services/api";

const ChallengeParticipantsPage = () => {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ParticipantAppliedFilters>(createDefaultParticipantFilters);

  const { data: challengeResponse } = useGetChallengeByIdQuery(
    { id: challengeId || "" },
    { skip: !challengeId }
  );

  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    setParameter,
    totalRecords,
    refetch,
  } = usePaginateData<IChallengeParticipantsListDto>(
    useGetChallengeParticipantsQuery,
    { skip: !challengeId },
    {
      id: challengeId,
      pageNumber: 1,
      pageSize: 10,
      status: ALL_PARTICIPANT_STATUSES,
    }
  );

  useEffect(() => {
    if (!challengeId) return;
    setParameter((prev) => ({
      ...prev,
      id: challengeId,
    }));
  }, [challengeId, setParameter]);

  const syncFiltersToQuery = useCallback(
    (filters: ParticipantAppliedFilters) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        ...buildParticipantFilterQueryParams(filters),
      }));
    },
    [setParameter]
  );

  const updateFilter = <K extends keyof ParticipantAppliedFilters>(
    key: K,
    value: ParticipantAppliedFilters[K]
  ) => {
    const next = { ...appliedFilters, [key]: value };
    setAppliedFilters(next);
    syncFiltersToQuery(next);
  };

  const handleClearFilters = () => {
    const cleared = createDefaultParticipantFilters();
    setAppliedFilters(cleared);
    setParameter((prev) => {
      const { status, ...rest } = prev;
      return {
        ...rest,
        pageNumber: 1,
        status: ALL_PARTICIPANT_STATUSES,
      };
    });
  };

  const challenge = challengeResponse?.data;
  const challengeName = challenge?.title || challengeId;

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((item, index) =>
      mapChallengeParticipantApiToUi(item, challengeId || "", index)
    );
  }, [data?.data, challengeId]);

  const handleDetails = (row: IChallengeParticipant) => {
    navigate(
      `/clientsManagement/challenges/${challengeId}/participants/${row.id}`,
      { state: { participant: row } }
    );
  };

  const columns = ParticipantsColumns(handleDetails);

  const advanceFiltersInputs = [
    <Box key='status'>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}>
        {messages["common.status"] as string}
      </Typography>
      <Select
        size='small'
        value={appliedFilters.status}
        onChange={(e) => updateFilter("status", e.target.value)}
        sx={{ ...selectSx, minWidth: 160 }}>
        {PARTICIPANT_STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={String(option.value)}
            value={String(option.value)}
            sx={{ fontSize: 13 }}>
            {(messages[option.labelKey] as string) || option.fallback}
          </MenuItem>
        ))}
      </Select>
    </Box>,
    <Box key='clear' sx={{ ml: "auto" }}>
      <Button
        onClick={handleClearFilters}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}>
        {(messages["challenges.filter.clear"] as string) || "Clear Filters"}
      </Button>
    </Box>,
  ];

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
        currentPathName='challenges.participants'
      />

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent='space-between'
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}>
              <Stack direction='row' spacing={2} alignItems='center' minWidth={0}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    flexShrink: 0,
                  }}>
                  <GroupsOutlinedIcon />
                </Box>
                <Box minWidth={0}>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.3,
                    }}>
                    {(messages["challenges.participants"] as string) ||
                      "Challenge Participants"}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ color: "text.secondary", mt: 0.5 }}>
                    {challengeName}
                  </Typography>
                </Box>
              </Stack>

              <Button
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                color='primary'
                onClick={() => navigate("/clientsManagement/challenges")}
                sx={{ textTransform: "none", fontWeight: 600 }}>
                {messages["challenges.backToList"] as string}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid item xs={12}>
              <AppFilters
                showAddButton={false}
                onChangeKeywordValue={(
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  setSearchValue(event.target.value);
                  changePage(1);
                }}
                successUrl=''
                selectionModel={[]}
                setSelectionModel={() => {}}
                refetch={refetch}
                showMultipleActivation={false}
                showMultipleDeactivation={false}
                showMultipleDeletion={false}
                showAdvanceFiltersButton
                isOpenAdvanceFilters={isOpenAdvanceFilters}
                setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                advanceFiltersInputs={advanceFiltersInputs}
              />
            </Grid>

            <Grid item xs={12} mt={6}>
              <AppDataGrid
                rowCount={totalRecords ?? 0}
                pageNumber={page ?? 1}
                tableName='challengeParticipants'
                getRowId={(row) => row.id}
                onPageSizeChange={(size: number) => {
                  changeLimit(`${size}`);
                }}
                onPageChange={(pageNumber: number) => {
                  changePage(pageNumber + 1);
                }}
                pageSize={limit ?? 10}
                columns={columns}
                rows={rows}
                loading={isFetching}
                initialState={initialDataGridState}
                checkboxSelection={false}
                selectionModel={[]}
                onSelectionModelChange={() => {}}
                onSortModelChange={() => {}}
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChallengeParticipantsPage;
