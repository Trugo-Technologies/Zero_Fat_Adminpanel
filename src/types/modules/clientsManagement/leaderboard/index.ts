/** @format */

export type LeaderboardRewardStatus =
  | "Distributed"
  | "Pending"
  | "NotEligible";

/** Health / fitness app that synced the user's steps */
export type LeaderboardSyncedApp =
  | "Apple Health"
  | "Google Fit"
  | "Health Connect"
  | "Whoop"
  | "Samsung Health"
  | string;

export interface ILeaderboardEntry {
  id: string;
  rank: number;
  previousRank: number | null;
  clientName: string;
  email: string;
  avatarUrl: string | null;
  /** Steps synced from health apps (Whoop, Apple Health, etc.) */
  stepsCount: number;
  /** App used to sync steps */
  syncedApp: LeaderboardSyncedApp;
  challengeId: string;
  rewardEligible: boolean;
  rewardLabel: string | null;
  rewardType: string | null;
  rewardStatus: LeaderboardRewardStatus;
  rewardDistributedAt: string | null;
  rewardCode: string | null;
}

export const mapLeaderboardApiEntryToUi = (
  item: {
    id?: string;
    clientId?: string;
    rank?: number | null;
    totalSteps?: number | null;
    fullName?: string | null;
    email?: string | null;
    imageUrl?: string | null;
    sourceProvider?: string | null;
  },
  challengeId: string,
  index = 0
): ILeaderboardEntry => {
  const id = item.id || item.clientId || `lb-${challengeId}-${index}`;
  return {
    id: String(id),
    rank: item.rank ?? index + 1,
    previousRank: null,
    clientName: item.fullName || item.email || "—",
    email: item.email || "",
    avatarUrl: item.imageUrl || null,
    stepsCount: item.totalSteps ?? 0,
    syncedApp: item.sourceProvider || "—",
    challengeId,
    rewardEligible: false,
    rewardLabel: null,
    rewardType: null,
    rewardStatus: "NotEligible",
    rewardDistributedAt: null,
    rewardCode: null,
  };
};
