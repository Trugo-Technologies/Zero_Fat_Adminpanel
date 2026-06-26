/** @format */

import moment from "moment";

export const dateFormatInBackendPayload = (date: string) =>
  moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
