/** @format */

import {
  NotificationChannel,
  NotificationChannelValue,
  NotificationType,
} from "src/types/modules/dashboard/notifications";

export const NOTIFICATION_TYPE_OPTIONS = [
  {
    value: "Email" as NotificationType,
    channel: NotificationChannel.Email,
    labelKey: "notificationLogs.manage.notificationType.Email",
  },
  {
    value: "PushNotification" as NotificationType,
    channel: NotificationChannel.PushNotification,
    labelKey: "notificationLogs.manage.notificationType.PushNotification",
  },
  {
    value: "InAppNotification" as NotificationType,
    channel: NotificationChannel.InAppNotification,
    labelKey: "notificationLogs.manage.notificationType.InAppNotification",
  },
] as const;

export const notificationTypeToChannel = (
  type: NotificationType
): NotificationChannelValue => {
  const match = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === type);
  return match?.channel ?? NotificationChannel.Email;
};

export const selectSx = {
  borderRadius: 2,
  height: 40,
  fontSize: 13,
  minWidth: 220,
  "& fieldset": { borderColor: "#E2E8F0" },
};

export const isMessageEmpty = (html: string) => {
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length === 0;
};
