/** @format */

import {
  CHALLENGE_STATUS_ALL,
  ChallengeListStatus,
  ChallengeParticipantListStatus,
} from "src/types/modules/clientsManagement/challenges";

export const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const CHALLENGE_STATUS_OPTIONS = [
  {
    value: CHALLENGE_STATUS_ALL,
    labelKey: "challenges.status.All",
    fallback: "All",
  },
  {
    value: ChallengeListStatus.Draft,
    labelKey: "challenges.status.Draft",
    fallback: "Draft",
  },
  {
    value: ChallengeListStatus.Published,
    labelKey: "challenges.status.Published",
    fallback: "Published",
  },
  {
    value: ChallengeListStatus.Active,
    labelKey: "challenges.status.Active",
    fallback: "Active",
  },
  {
    value: ChallengeListStatus.Ended,
    labelKey: "challenges.status.Ended",
    fallback: "Ended",
  },
  {
    value: ChallengeListStatus.Cancelled,
    labelKey: "challenges.status.Cancelled",
    fallback: "Cancelled",
  },
] as const;

export type ChallengeAppliedFilters = {
  status: string;
};

export const createDefaultChallengeFilters = (): ChallengeAppliedFilters => ({
  status: CHALLENGE_STATUS_ALL,
});

export type ParticipantAppliedFilters = {
  status: string;
};

export const ALL_PARTICIPANT_STATUSES = "all";

export const PARTICIPANT_STATUS_OPTIONS = [
  {
    value: ALL_PARTICIPANT_STATUSES,
    labelKey: "challenges.status.All",
    fallback: "All",
  },
  {
    value: ChallengeParticipantListStatus.Active,
    labelKey: "challenges.participant.status.Active",
    fallback: "Active",
  },
  {
    value: ChallengeParticipantListStatus.Left,
    labelKey: "challenges.participant.status.Left",
    fallback: "Left",
  },
] as const;

export const createDefaultParticipantFilters =
  (): ParticipantAppliedFilters => ({
    status: ALL_PARTICIPANT_STATUSES,
  });

export const buildParticipantFilterQueryParams = (
  filters: ParticipantAppliedFilters
) => ({
  status:
    filters.status === ALL_PARTICIPANT_STATUSES
      ? ALL_PARTICIPANT_STATUSES
      : Number(filters.status),
});
