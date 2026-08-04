/** @format */

import { IBaseResponseListDto } from "src/types/baseEntity";

export type NotificationType =
  | "Email"
  | "PushNotification"
  | "InAppNotification";

/** API channel enum for ManageNotifications/send */
export const NotificationChannel = {
  Email: 0,
  PushNotification: 1,
  InAppNotification: 2,
} as const;

export type NotificationChannelValue =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export interface ISendNotificationPayload {
  channel: NotificationChannelValue;
  clientIds: string[];
  title: string;
  message: string;
}

export interface IManageNotificationClientsArgs {
  search?: string;
  isActive?: boolean;
  gender?: string;
  subscriptionStatus?: string;
  dietitianGoal?: string;
  period?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string[];
}

/** API status enum for ManageNotifications/logs */
export const NotificationLogStatus = {
  Pending: 0,
  Sent: 1,
  Failed: 2,
  Partial: 3,
} as const;

export type NotificationLogStatusValue =
  (typeof NotificationLogStatus)[keyof typeof NotificationLogStatus];

export interface INotificationLog {
  id: string;
  channel: NotificationChannelValue;
  title: string;
  message: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  status: NotificationLogStatusValue;
  sentByLabel: string;
  sentOn: string;
  createdOn: string;
}

export interface INotificationLogsListDto
  extends IBaseResponseListDto<INotificationLog> {}

export interface IManageNotificationLogsArgs {
  search?: string;
  channel?: NotificationChannelValue;
  status?: NotificationLogStatusValue;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

/** Per-client notification delivery record */
export interface IClientNotification {
  id: string;
  notificationId: string;
  channel: NotificationChannelValue;
  type: string;
  dataJson: string | null;
  title: string;
  message: string;
  status: NotificationLogStatusValue;
  isRead: boolean;
  errorMessage: string | null;
  sentOn: string | null;
  readOn: string | null;
  createdOn: string;
  sentByLabel: string | null;
}

export interface IClientNotificationsListDto
  extends IBaseResponseListDto<IClientNotification> {}

export interface IClientNotificationsArgs {
  clientId: string;
  search?: string;
  channel?: NotificationChannelValue;
  status?: NotificationLogStatusValue;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}
