/** @format */

import { enUS } from "@mui/material/locale";
import enMessages from "../locales/en_US.json";
import enWorkout from "../locales/modules/workout/en_US.json";
import enNutriplan from "../locales/modules/nutriplan/en_US.json";
import enCoreMOdule from "../locales/modules/core-module/en_US.json";
import enUsersModule from "../locales/modules/users-module/en_SA.json";
import enClientsMOdule from "../locales/modules/clients-module/en_US.json";

const EnLang = {
  messages: {
    ...enUsersModule,
    ...enMessages,
    ...enWorkout,
    ...enNutriplan,
    ...enCoreMOdule,
    ...enClientsMOdule,
  },
  muiLocale: enUS,
  locale: "en-US",
};
export default EnLang;
