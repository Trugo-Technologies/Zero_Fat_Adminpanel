/** @format */

import { FormikHelpers } from "formik";
import {
  BaseQueryFn,
  MutationDefinition,
  QueryDefinition,
} from "@reduxjs/toolkit/dist/query";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  CheckboxProps,
  OutlinedInputProps,
  RadioGroupProps,
  SelectProps,
} from "@mui/material";
import {
  DatePickerProps,
  DateTimePickerProps,
  TimePickerProps,
} from "@mui/x-date-pickers";
import { Moment } from "moment";
import { InputFieldProps } from "src/Components/formik-input/file-input";
import { OutlinedTextInputProps } from "src/Components/formik-input/outlined-text-input";
export type FormikOnSubmitType<T> = (
  values: T,
  formikHelpers: FormikHelpers<T>
) => void;

export type languagesObject = {
  en: string;
  ar: string;
};

export type ArgsType = {
  currentPage?: number;
  pageNumber?: number;
  searchValue?: string;
  pageSize?: number;
  needPagination?: boolean;
  isPayed?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: string;
  id?: string;
  workoutId?: string;
  planId?: string;
  key?: string;
  forgetPassword?: boolean;
  statusId?: string;
  from?: string;
  to?: string;
  outOfStock?: boolean;
  type?: string;
  level?: number;
  isActive?: boolean;
  keyword?: string;
  clientId?: string | null;
  trainerId?: string | null;

  section?: string;
  category?: string;
  company?: string;
  subcategory?: string;
  categoryType?: string;
  unit?: string;
  defaultDietitianGoal?: string;
  categoryId?: string | null;
  dietaryPreference?: string;
  basicUnit?: string;
  status?: string;
  difficulty?: string;
  cuisine?: string;
  dietaryCategory?: string;
  groupId?: string | null;
  faqCategoryId?: string | null;
  gender?: string;
  dietitianGoal?: string;
  subscriptionType?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  deliveryTime?: string;
  dailySelectionStatus?: string;
  duration?: string;
  date?: string | null;
  mealTypeId?: string;
  mealPlanId?: string;
  menuId?: string;
  mealId?: string | null;
  userType?: string;
};
export type ArgsSpecial = {
  from: string;
  to: string;
};

export type mutationType<V> = UseMutation<
  MutationDefinition<
    ArgsType,
    BaseQueryFn<
      {
        url: string;
        method?: string | undefined;
        data?: any;
        params?: any;
      },
      unknown,
      unknown
    >,
    never,
    V,
    string
  >
>;
export type queryType<T> = UseQuery<
  QueryDefinition<
    ArgsType,
    BaseQueryFn<
      {
        url: string;
        method?: "POST" | "PATCH" | "GET" | "DELETE" | "PUT";

        data?: any;
        params?: any;
      },
      unknown,
      unknown
    >,
    never,
    T,
    string
  >
>;

export enum inputType {
  text = "text",
  password = "password",
  checkBox = "checkBox",
  date = "date",
  dateTime = "dateTime",
  radio = "radio",
  select = "select",
  time = "time",
  multiSelect = "multiSelect",
  custom = "custom",
  image = "image",
  imageEditor = "imageEditor",
  switch = "switch",
}
type dynamicPropsType = {
  inputType: inputType;
  name: string;
  label: string;
  isFullPage?: boolean;
  placeholder?: String;
  accept?: string;
  disabled?: boolean;
  options?: { value: string; key: string }[];
  isRow?: boolean;
  type?: string;
  renderComponent?: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export type dynamicFormType = dynamicPropsType &
  (
    | CheckboxProps
    | DatePickerProps<Moment>
    | DateTimePickerProps<Moment>
    | RadioGroupProps
    | SelectProps<string[]>
    | OutlinedInputProps
    | SelectProps<string>
    | TimePickerProps<Moment>
    | InputFieldProps
    | OutlinedTextInputProps
  );

export type DynamicFormTypeFields = dynamicFormType[];
