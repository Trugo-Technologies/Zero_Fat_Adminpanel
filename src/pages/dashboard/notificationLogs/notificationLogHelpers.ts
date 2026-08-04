/** @format */

import {
  NotificationChannel,
  NotificationChannelValue,
  NotificationLogStatus,
  NotificationLogStatusValue,
  IManageNotificationLogsArgs,
  IClientNotificationsArgs,
} from "src/types/modules/dashboard/notifications";

export const ALL_CHANNELS = "All Channels";
export const ALL_LOG_STATUSES = "All Status";

export type NotificationLogFilters = {
  channel: string;
  status: string;
  fromDate: string;
  toDate: string;
};

export const createDefaultNotificationLogFilters =
  (): NotificationLogFilters => ({
    channel: ALL_CHANNELS,
    status: ALL_LOG_STATUSES,
    fromDate: "",
    toDate: "",
  });

export const CHANNEL_FILTER_OPTIONS = [
  { value: ALL_CHANNELS, labelKey: "notificationLogs.filters.channel.all" },
  {
    value: String(NotificationChannel.Email),
    labelKey: "notificationLogs.manage.notificationType.Email",
  },
  {
    value: String(NotificationChannel.PushNotification),
    labelKey: "notificationLogs.manage.notificationType.PushNotification",
  },
  {
    value: String(NotificationChannel.InAppNotification),
    labelKey: "notificationLogs.manage.notificationType.InAppNotification",
  },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: ALL_LOG_STATUSES, labelKey: "notificationLogs.filters.status.all" },
  {
    value: String(NotificationLogStatus.Pending),
    labelKey: "notificationLogs.status.pending",
  },
  {
    value: String(NotificationLogStatus.Sent),
    labelKey: "notificationLogs.status.sent",
  },
  {
    value: String(NotificationLogStatus.Failed),
    labelKey: "notificationLogs.status.failed",
  },
  {
    value: String(NotificationLogStatus.Partial),
    labelKey: "notificationLogs.status.partial",
  },
] as const;

export const channelToLabelKey = (
  channel: NotificationChannelValue
): string => {
  switch (channel) {
    case NotificationChannel.PushNotification:
      return "notificationLogs.manage.notificationType.PushNotification";
    case NotificationChannel.InAppNotification:
      return "notificationLogs.manage.notificationType.InAppNotification";
    case NotificationChannel.Email:
    default:
      return "notificationLogs.manage.notificationType.Email";
  }
};

export const statusToLabelKey = (status: NotificationLogStatusValue): string => {
  switch (status) {
    case NotificationLogStatus.Pending:
      return "notificationLogs.status.pending";
    case NotificationLogStatus.Failed:
      return "notificationLogs.status.failed";
    case NotificationLogStatus.Partial:
      return "notificationLogs.status.partial";
    case NotificationLogStatus.Sent:
    default:
      return "notificationLogs.status.sent";
  }
};

export const stripHtml = (html: string) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Builds GET query params for `/ManageNotifications/logs`. */
export const buildManageNotificationLogsRequest = (
  params: Record<string, unknown>
): IManageNotificationLogsArgs => {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : typeof params.keyword === "string"
        ? params.keyword.trim()
        : "";

  const request: IManageNotificationLogsArgs = {
    pageNumber:
      typeof params.pageNumber === "number" && params.pageNumber > 0
        ? params.pageNumber
        : 1,
    pageSize:
      typeof params.pageSize === "number" && params.pageSize > 0
        ? params.pageSize
        : 10,
  };

  if (search) {
    request.search = search;
  }

  if (typeof params.channel === "number") {
    request.channel = params.channel as NotificationChannelValue;
  }

  if (typeof params.status === "number") {
    request.status = params.status as NotificationLogStatusValue;
  }

  if (typeof params.fromDate === "string" && params.fromDate) {
    request.fromDate = params.fromDate;
  }

  if (typeof params.toDate === "string" && params.toDate) {
    request.toDate = params.toDate;
  }

  return request;
};

/** Builds GET query params for `/ManageNotifications/clients/{clientId}/notifications`. */
export const buildClientNotificationsRequest = (
  params: Record<string, unknown>
): Omit<IClientNotificationsArgs, "clientId"> & { clientId?: string } => {
  const request = buildManageNotificationLogsRequest(params);

  const clientId =
    typeof params.clientId === "string" ? params.clientId.trim() : "";

  return {
    ...request,
    ...(clientId ? { clientId } : {}),
  };
};
