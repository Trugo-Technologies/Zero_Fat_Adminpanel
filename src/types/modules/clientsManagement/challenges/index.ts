/** @format */

import type {
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export type ChallengeParticipantStatus = "Active" | "Left";

/**
 * GET /Challenges/{id}/participants?status=
 * ChallengeParticipantStatus: Active=0, Left=1
 * Omit `status` to list all.
 */
export enum ChallengeParticipantListStatus {
  Active = 0,
  Left = 1,
}

/** Device / health app step source */
export enum StepDataProvider {
  AppleHealth = 0,
}

export enum DeviceStepConnectionStatus {
  Active = 0,
  Disconnected = 1,
}

export type ChallengeRewardStatus =
  | "Distributed"
  | "Pending"
  | "NotEligible";

export enum ChallengeRewardTiming {
  Instant = "Instant",
  Delayed = "Delayed",
}

export enum ChallengeRewardType {
  Coupon = "Coupon",
}

/** Kept for participant submission media only (not challenge setup). */
export enum ChallengeProofType {
  Image = "Image",
  Video = "Video",
}

/**
 * GET /Challenges?status=
 * Draft=0, Published=1, Active=2, Ended=3, Cancelled=4
 * Omit `status` to list all.
 */
export enum ChallengeListStatus {
  Draft = 0,
  Published = 1,
  Active = 2,
  Ended = 3,
  Cancelled = 4,
}

/** UI-only filter value — omit status query param */
export const CHALLENGE_STATUS_ALL = "all";

export const CHALLENGE_STATUS_LABEL_KEYS: Record<
  ChallengeListStatus,
  { labelKey: string; fallback: string }
> = {
  [ChallengeListStatus.Draft]: {
    labelKey: "challenges.status.Draft",
    fallback: "Draft",
  },
  [ChallengeListStatus.Published]: {
    labelKey: "challenges.status.Published",
    fallback: "Published",
  },
  [ChallengeListStatus.Active]: {
    labelKey: "challenges.status.Active",
    fallback: "Active",
  },
  [ChallengeListStatus.Ended]: {
    labelKey: "challenges.status.Ended",
    fallback: "Ended",
  },
  [ChallengeListStatus.Cancelled]: {
    labelKey: "challenges.status.Cancelled",
    fallback: "Cancelled",
  },
};

export const getChallengeStatusMeta = (
  status?: number | string | null
): { labelKey: string; fallback: string } | null => {
  if (status == null || status === "") return null;
  if (typeof status === "string" && Number.isNaN(Number(status))) {
    const byName = Object.entries(CHALLENGE_STATUS_LABEL_KEYS).find(
      ([, meta]) =>
        meta.fallback.toLowerCase() === status.toLowerCase() ||
        meta.labelKey.toLowerCase().endsWith(`.${status.toLowerCase()}`)
    );
    return byName ? byName[1] : { labelKey: "", fallback: status };
  }
  const numeric = Number(status);
  return CHALLENGE_STATUS_LABEL_KEYS[numeric as ChallengeListStatus] || null;
};

export const getChallengeListStatusValue = (
  status?: number | string | null
): ChallengeListStatus | null => {
  if (status == null || status === "") return null;
  if (typeof status === "string" && Number.isNaN(Number(status))) {
    const byName = Object.entries(CHALLENGE_STATUS_LABEL_KEYS).find(
      ([, meta]) =>
        meta.fallback.toLowerCase() === status.toLowerCase() ||
        meta.labelKey.toLowerCase().endsWith(`.${status.toLowerCase()}`)
    );
    return byName ? (Number(byName[0]) as ChallengeListStatus) : null;
  }
  const numeric = Number(status);
  if (Number.isNaN(numeric)) return null;
  if (
    numeric === ChallengeListStatus.Draft ||
    numeric === ChallengeListStatus.Published ||
    numeric === ChallengeListStatus.Active ||
    numeric === ChallengeListStatus.Ended ||
    numeric === ChallengeListStatus.Cancelled
  ) {
    return numeric;
  }
  return null;
};

export const isChallengeActive = (status?: number | string | null) =>
  getChallengeListStatusValue(status) === ChallengeListStatus.Active;

export const canCancelChallenge = (row?: {
  status?: number | string | null;
} | null) => {
  if (!row) return false;
  const status = getChallengeListStatusValue(row.status);
  return (
    status === ChallengeListStatus.Published ||
    status === ChallengeListStatus.Active
  );
};

export interface IChallenge {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
  startDate: string;
  endDate: string;
  isFeaturedOnHome: boolean;
  /** Present when API returns list/publish status */
  status?: number | string;
  isPublished?: boolean;
  /** Optional / legacy fields still used by related screens */
  month?: string;
  participantCount?: number;
  isActive?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
  /** @deprecated Prefer `title` — kept for older UI mappings */
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  rulesEn?: string;
  rulesAr?: string;
  rewardPoints?: number;
  rewardTiming?: ChallengeRewardTiming;
  rewardType?: ChallengeRewardType;
}

export interface IChallengeFormValues {
  title: string;
  subtitle: string;
  badgeLabel: string;
  /** UI helper — derives start/end dates; not sent to API */
  month: string;
  startDate: string;
  endDate: string;
  isFeaturedOnHome: boolean;
}

export interface ICreateChallengeDto {
  title: string;
  subtitle: string;
  badgeLabel: string;
  startDate: string;
  endDate: string;
  isFeaturedOnHome: boolean;
}

export interface IUpdateChallengeDto extends ICreateChallengeDto {
  id: string;
}

export interface IChallengeParticipant {
  id: string;
  challengeId: string;
  clientName: string;
  email: string;
  phone: string;
  startedAt: string;
  submittedAt: string | null;
  completedAt: string | null;
  status: ChallengeParticipantStatus;
  pointsEarned: number;
  rewardLabel: string | null;
  rewardStatus: ChallengeRewardStatus;
  submissionNote: string;
  rejectionReason: string | null;
  /** @deprecated Prefer proofUrls; kept for single-proof fallback */
  proofUrl: string | null;
  proofUrls: string[];
  proofType: ChallengeProofType | null;
  rank: number | null;
  /** Steps synced from health apps (Apple Health / similar) */
  stepsCount: number;
  createdBy?: string;
  createdByName?: string;
  createdOn?: string;
  lastModifiedBy?: string;
  lastModifiedByName?: string;
  lastModifiedOn?: string;
  deletedOn?: string;
  deletedBy?: string;
  deletedByName?: string;
  activationChangedOn?: string;
  activationChangedByName?: string;
  activationChangedBy?: string;
}

export interface IChallengesListDto extends IBaseResponseListDto<IChallenge> {}
export interface IChallengeDetailsDto
  extends IBaseResponseDetailsDto<IChallenge> {}

/** GET /Challenges/{id}/participants — item shape may vary; map flexibly in UI */
export interface IChallengeParticipantApi {
  id?: string;
  clientId?: string;
  fullName?: string;
  clientName?: string;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  rank?: number | null;
  totalSteps?: number | null;
  stepsCount?: number | null;
  sourceProvider?: string | null;
  startedAt?: string | null;
  joinedAt?: string | null;
  createdOn?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  status?: number | string | null;
  [key: string]: unknown;
}

export interface IChallengeParticipantsListDto
  extends IBaseResponseListDto<IChallengeParticipantApi> {}

/** GET /Challenges/{id}/leaderboard */
export interface IChallengeLeaderboardEntry {
  id?: string;
  clientId?: string;
  rank?: number | null;
  totalSteps?: number | null;
  fullName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  sourceProvider?: string | null;
  hasJoined?: boolean;
  isConnected?: boolean;
  connectionStatus?: string | null;
}

export interface IChallengeLeaderboardMe extends IChallengeLeaderboardEntry {
  hasJoined: boolean;
  isConnected: boolean;
  connectionStatus: string;
}

export interface IChallengeLeaderboardData {
  challengeId: string;
  title: string;
  daysRemaining: number;
  top3: IChallengeLeaderboardEntry[];
  top: IChallengeLeaderboardEntry[];
  me: IChallengeLeaderboardMe;
}

export interface IChallengeLeaderboardDetailsDto
  extends IBaseResponseDetailsDto<IChallengeLeaderboardData> {}

export const mapChallengeParticipantApiToUi = (
  item: IChallengeParticipantApi,
  challengeId: string,
  index = 0
): IChallengeParticipant => {
  const id =
    item.id ||
    item.clientId ||
    `participant-${challengeId}-${index}`;
  const clientName =
    item.fullName || item.clientName || item.email || "—";
  const steps =
    typeof item.totalSteps === "number"
      ? item.totalSteps
      : typeof item.stepsCount === "number"
        ? item.stepsCount
        : 0;
  const startedAt =
    item.startedAt || item.joinedAt || item.createdOn || "";

  const rawStatus = item.status;
  let status: ChallengeParticipantStatus = "Active";
  if (rawStatus === ChallengeParticipantListStatus.Left || rawStatus === "Left" || rawStatus === 1) {
    status = "Left";
  } else if (
    rawStatus === ChallengeParticipantListStatus.Active ||
    rawStatus === "Active" ||
    rawStatus === 0
  ) {
    status = "Active";
  }

  return {
    id: String(id),
    challengeId,
    clientName: String(clientName),
    email: String(item.email || ""),
    phone: String(item.phone || ""),
    startedAt: String(startedAt),
    submittedAt: item.submittedAt ? String(item.submittedAt) : null,
    completedAt: item.completedAt ? String(item.completedAt) : null,
    status,
    pointsEarned: 0,
    rewardLabel: null,
    rewardStatus: "NotEligible",
    submissionNote: "",
    rejectionReason: null,
    proofUrl: null,
    proofUrls: [],
    proofType: null,
    rank: item.rank ?? index + 1,
    stepsCount: steps,
  };
};

export const mapChallengeFormToCreateDto = (
  values: IChallengeFormValues
): ICreateChallengeDto => ({
  title: values.title.trim(),
  subtitle: values.subtitle.trim(),
  badgeLabel: values.badgeLabel.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
  isFeaturedOnHome: !!values.isFeaturedOnHome,
});
