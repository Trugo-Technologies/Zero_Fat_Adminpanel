/** @format */

import saMessages from "../locales/ar_SA.json";
import arWorkout from "../locales/modules/workout/ar_SA.json";
import arNutriplan from "../locales/modules/nutriplan/ar_SA.json";
import arCoreMOdule from "../locales/modules/core-module/ar_SA.json";
import arUsersModule from "../locales/modules/users-module/ar_SA.json";
import arClientsMOdule from "../locales/modules/clients-module/ar_SA.json";

const saLang = {
  messages: {
    ...saMessages,
    ...arWorkout,
    ...arNutriplan,
    ...arCoreMOdule,
    ...arClientsMOdule,
    ...arUsersModule,
  },
  locale: "ar-SA",
};
export default saLang;
