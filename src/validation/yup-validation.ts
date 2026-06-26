import * as Yup from "yup";

const idRequired: string = "required" ?? "required";

const passwordMin: string = "password_min" ?? "";

const passwordConfirmationMatch: string =
  "password_confirm_match" ?? "password_confirm_match";

const email: string = "invalid_email" ?? "invalid_email";

const invalid: string = "invalid" ?? "invalid";

const isEndDateBeforeStart: string =
  "isEndDateBeforeStart" ?? "isEndDateBeforeStart";

const emptyArray = "not allowed to be empty";
const languageRegex = {
  ar: /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\u0020\u2000-\u206F\p{P}]+$/u,
  en: /^[^\u0600-\u06FF]+$/u,
};
const notOnlySpacesRegex = /\S/;
const emailSchema = () => Yup.string().email(email).required(idRequired);

const textSchema = (
  { ln, isRequired }: { ln?: "ar" | "en"; isRequired?: boolean } = {
    ln: undefined,
    isRequired: false,
  }
) => {
  const yupSchema = Yup.string()
    .matches(notOnlySpacesRegex, "not accepted to be just spaces")
    .concat(isRequired ? Yup.string().required(idRequired) : Yup.string());

  return yupSchema;
};
const latenAlphabet = (
  { isRequired }: { isRequired: boolean } = { isRequired: true }
) => {
  return textSchema({ isRequired: isRequired, ln: "en" }).matches(
    /^[^\u0600-\u06FF\s@]+$/,
    "laten alphabet valid"
  );
};
export const password = () => {
  return textSchema({ isRequired: true, ln: "en" })
    .matches(
      // /^[a-zA-Z\d\s~`!@#\$%\^&\*\(\)_\-\+={}\[\]\|:;"'<>,.\?\/\\]+$/i,
      /^[^\u0600-\u06FF\s]+$/,
      invalid
    )
    .min(8, passwordMin);
};
const passwordConfirmationSchema = () =>
  textSchema({ isRequired: true, ln: "en" }).oneOf(
    [Yup.ref("password")],
    passwordConfirmationMatch
  );

const numberSchema = (number = 9) =>
  Yup.number().typeError(invalid).required(idRequired).min(number, invalid);

const priceSchema = () =>
  Yup.number().typeError(invalid).required(idRequired).min(1, invalid);

const endDateSchema = (key: string) =>
  Yup.date().required(idRequired).min(Yup.ref(key), isEndDateBeforeStart);

const arraySchema = (limit: number) => Yup.array().min(limit, emptyArray);

const usernameSchema = (min: number) =>
  Yup.string()
    .required(idRequired)
    .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, invalid)
    .min(min, "too short");
const dateSchema = () => Yup.date().required(idRequired);
const languages = ["ar", "en"];
const multiLanguage = (...args: string[]) => {
  const language: { [key: string]: any } = {};
  languages.forEach((ln) => {
    language[ln] = textSchema({
      ln: ln as "en" | "ar",
      isRequired: args.includes(ln),
    });
  });

  return Yup.object({ ...language });
};
export default {
  limitedArray: arraySchema,
  multiLanguage,
  latenAlphabet,
  dateRequired: dateSchema,
  email: emailSchema,
  text: textSchema,
  password: password,
  passwordConfirmation: passwordConfirmationSchema,
  phoneNumber: numberSchema,
  price: priceSchema,
  endDate: endDateSchema,
  username: usernameSchema,
  ...Yup,
};
