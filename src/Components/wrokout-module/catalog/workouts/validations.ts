/** @format */

import { MessageFormatElement } from "react-intl";
import { workoutFormat } from "src/types/enums";
import * as yup from "yup";

const createValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    caloriesBurned: yup
      .number()
      .nullable()
      .required(String(messages["validation.required"])),
    durationInMins: yup
      .string()
      .required(String(messages["validation.required"])),
    level: yup.string().required(String(messages["validation.required"])),
    // environment: yup.string().required(String(messages["validation.required"])),
    avatarImage: yup.string().required(String(messages["validation.required"])),
  });

  const validationSchemaStep2 = yup.object({
    // equipmentCategoryId: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    caloriesBurned: yup
      .number()
      .nullable()
      .required(String(messages["validation.required"])),

    trainerId: yup.string().required(String(messages["validation.required"])),
    workoutTypeId: yup
      .string()
      .required(String(messages["validation.required"])),

    bodyPartsIds: yup.array().min(1, String(messages["validation.required"])),

    equipmentIds: yup.array().min(1, String(messages["validation.required"])),
  });
  const validationSchemaStep3 = yup.object({
    format: yup.string().required(String(messages["validation.required"])),
    // profileMedia: yup.string().when("format", {
    //   is: (val: string) => val === workoutFormat.FollowAlong,
    //   then: () => yup.array().min(1, String(messages["validation.required"])),
    //   otherwise: () => yup.string().notRequired(),
    // }),
    sets: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .number()
            .required(String(messages["validation.required"]))
            .positive(String(messages["validation.positive"])),
        otherwise: () =>
          yup
            .number()
            .positive(String(messages["validation.positive"]))
            .nullable()
            .notRequired(),
      }),

    setNamesAr: yup
      .array()
      .nullable()
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .array()
            .required(String(messages["validation.required"]))
            .test(
              "length",
              String(messages["workouts.validation.setnames.length"]),
              function (value) {
                const { sets } = this.parent; // Accessing the parent context
                return sets ? value && value.length === sets : true; // Check if sets is defined and matches length
              }
            ),
        otherwise: () => yup.array().nullable().notRequired(),
      }),

    setNamesEn: yup
      .array()
      .nullable()
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .array()
            .required(String(messages["validation.required"]))
            .test(
              "length",
              String(messages["workouts.validation.setnames.length"]),
              function (value) {
                const { sets } = this.parent; // Accessing the parent context
                return sets ? value && value.length === sets : true; // Check if sets is defined and matches length
              }
            ),
        otherwise: () => yup.array().nullable().notRequired(),
      }),

    exerciseSets: yup.array().of(
      yup.object().shape({
        exerciseId: yup
          .string()
          .nullable()
          .when("$format", {
            is: (val: string) => val === workoutFormat.SetReps,
            then: () =>
              yup.string().required(String(messages["validation.required"])),
            otherwise: () => yup.string().nullable().notRequired(),
          }),

        sets: yup
          .string()
          .nullable()
          .when("$format", {
            is: (val: string) => val === workoutFormat.SetReps,
            then: () =>
              yup.string().required(String(messages["validation.required"])),
            otherwise: () => yup.string().nullable().notRequired(),
          }),
      })
    ),
  });

  return [validationSchemaStep1, validationSchemaStep2, validationSchemaStep3];
};

const updateValidationSchemas = (
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages["validation.required"])),
    nameAr: yup.string().required(String(messages["validation.required"])),
    caloriesBurned: yup
      .number()
      .nullable()
      .required(String(messages["validation.required"])),
    durationInMins: yup
      .string()
      .required(String(messages["validation.required"])),
    level: yup.string().required(String(messages["validation.required"])),
    // environment: yup.string().required(String(messages["validation.required"])),
    avatarImage: yup.string().required(String(messages["validation.required"])),
    // profileMedia: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
  });

  const validationSchemaStep2 = yup.object({
    // equipmentCategoryId: yup
    //   .string()
    //   .required(String(messages["validation.required"])),
    trainerId: yup.string().required(String(messages["validation.required"])),
    workoutTypeId: yup
      .string()
      .required(String(messages["validation.required"])),

    bodyPartsIds: yup.array().min(1, String(messages["validation.required"])),

    equipmentIds: yup.array().min(1, String(messages["validation.required"])),
  });

  const validationSchemaStep3 = yup.object({
    format: yup.string().required(String(messages["validation.required"])),
    // profileMedia: yup.string().when("format", {
    //   is: (val: string) => val === workoutFormat.FollowAlong,
    //   then: () => yup.array().min(1, String(messages["validation.required"])),
    //   otherwise: () => yup.string().notRequired(),
    // }),
    sets: yup
      .number()
      .nullable()
      .positive(String(messages["validation.positive"]))
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .number()
            .required(String(messages["validation.required"]))
            .positive(String(messages["validation.positive"])),
        otherwise: () =>
          yup
            .number()
            .positive(String(messages["validation.positive"]))
            .nullable()
            .notRequired(),
      }),

    setNamesAr: yup
      .array()
      .nullable()
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .array()
            .required(String(messages["validation.required"]))
            .test(
              "length",
              String(messages["workouts.validation.setnames.length"]),
              function (value) {
                const { sets } = this.parent; // Accessing the parent context
                return sets ? value && value.length === sets : true; // Check if sets is defined and matches length
              }
            ),
        otherwise: () => yup.array().nullable().notRequired(),
      }),

    setNamesEn: yup
      .array()
      .nullable()
      .when("format", {
        is: (val: string) => {
          return val === workoutFormat.SetReps;
        },
        then: () =>
          yup
            .array()
            .required(String(messages["validation.required"]))
            .test(
              "length",
              String(messages["workouts.validation.setnames.length"]),
              function (value) {
                const { sets } = this.parent; // Accessing the parent context
                return sets ? value && value.length === sets : true; // Check if sets is defined and matches length
              }
            ),
        otherwise: () => yup.array().nullable().notRequired(),
      }),
  });

  return [validationSchemaStep1, validationSchemaStep2, validationSchemaStep3];
};

export { createValidationSchemas, updateValidationSchemas };
