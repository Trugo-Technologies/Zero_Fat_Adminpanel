/** @format */



import dayjs, { Dayjs } from "dayjs";

import utc from "dayjs/plugin/utc";

import { IClientPortalSettings } from "src/types/modules/clientsManagement/clientPortalSettings";



dayjs.extend(utc);



export type DeliveryCutoffSettings = {

  enableCutoffRestriction?: boolean;

  /** Day-detail / legacy field */

  offsetSubscriptionDays?: number;

  /** ClientPortalSettings field */

  offsetSubscriptionInDays?: number | null;

  /** Day-detail field */

  cutoffTimeUtc?: string;

  /** ClientPortalSettings field */

  cutoffTime?: string | null;

  cutoffValue?: number;

  cutoffUnit?: string;

};



const getOffsetDays = (settings: DeliveryCutoffSettings) => {

  if (typeof settings.offsetSubscriptionDays === "number") {

    return settings.offsetSubscriptionDays;

  }

  if (typeof settings.offsetSubscriptionInDays === "number") {

    return settings.offsetSubscriptionInDays;

  }

  return null;

};



const getCutoffTime = (settings: DeliveryCutoffSettings) =>

  settings.cutoffTimeUtc || settings.cutoffTime || null;



const parseClockTime = (cutoffTime: string) => {

  const [hours = 0, minutes = 0, seconds = 0] = cutoffTime

    .split(":")

    .map((part) => Number(part));



  return {

    hours: Number.isFinite(hours) ? hours : 0,

    minutes: Number.isFinite(minutes) ? minutes : 0,

    seconds: Number.isFinite(seconds) ? seconds : 0,

  };

};



export const formatCutoffTimeDisplay = (cutoffTime?: string | null): string => {

  if (!cutoffTime) return "—";

  const { hours, minutes } = parseClockTime(cutoffTime);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

};



export const mapClientPortalSettingsToCutoff = (

  settings?: IClientPortalSettings | null

): DeliveryCutoffSettings | null => {

  if (!settings) return null;



  const offsetDays = settings.offsetSubscriptionInDays;

  const cutoffTime = settings.cutoffTime;



  if (offsetDays == null && !cutoffTime) return null;



  return {

    enableCutoffRestriction: true,

    offsetSubscriptionInDays: offsetDays,

    cutoffTime: cutoffTime ?? null,

  };

};



/** Deadline after which delivery actions are locked. */

export const getDeliveryCutoffDeadline = (

  deliveryDate: string | Dayjs,

  settings?: DeliveryCutoffSettings | null

): Dayjs | null => {

  if (!settings || settings.enableCutoffRestriction === false) {

    return null;

  }



  const delivery = dayjs.utc(deliveryDate).startOf("day");

  if (!delivery.isValid()) return null;



  const offsetDays = getOffsetDays(settings);

  const cutoffTime = getCutoffTime(settings);



  if (offsetDays != null && cutoffTime) {

    const { hours, minutes, seconds } = parseClockTime(cutoffTime);

    return delivery

      .subtract(offsetDays, "day")

      .hour(hours)

      .minute(minutes)

      .second(seconds)

      .millisecond(0);

  }



  if (settings.cutoffValue && settings.cutoffUnit) {

    const unit = settings.cutoffUnit.toLowerCase().startsWith("day")

      ? "day"

      : "hour";

    return delivery.subtract(settings.cutoffValue, unit);

  }



  return null;

};



/** Actions are allowed only before the cutoff deadline. */

export const isDeliveryPastCutoff = (

  deliveryDate?: string | Dayjs | null,

  settings?: DeliveryCutoffSettings | null,

  now: Dayjs = dayjs.utc()

): boolean => {

  if (!deliveryDate) return false;



  const deadline = getDeliveryCutoffDeadline(deliveryDate, settings);

  if (!deadline) return false;



  return !now.isBefore(deadline);

};



export const formatDeliveryCutoffLabel = (

  settings?: DeliveryCutoffSettings | null

): string => {

  if (!settings) return "—";



  if (settings.enableCutoffRestriction === false) {

    return "No restriction";

  }



  const offsetDays = getOffsetDays(settings);

  const cutoffTime = getCutoffTime(settings);



  if (offsetDays != null && cutoffTime) {

    return `${offsetDays} day${offsetDays === 1 ? "" : "s"} before at ${formatCutoffTimeDisplay(

      cutoffTime

    )}`;

  }



  if (settings.cutoffValue && settings.cutoffUnit) {

    return `${settings.cutoffValue} ${settings.cutoffUnit} before delivery`;

  }



  return "—";

};

