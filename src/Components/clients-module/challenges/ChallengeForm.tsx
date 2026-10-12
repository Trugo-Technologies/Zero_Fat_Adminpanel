/** @format */

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Form, useFormikContext } from "formik";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppDatePicker from "src/Components/baseComponents/inputs/dateTimePickers/AppDatePicker";
import { IChallengeFormValues } from "src/types/modules/clientsManagement/challenges";

export const CHALLENGE_MONTH_OPTIONS = [
  { value: "01", labelKey: "common.months.january", fallback: "January", ar: "يناير" },
  { value: "02", labelKey: "common.months.february", fallback: "February", ar: "فبراير" },
  { value: "03", labelKey: "common.months.march", fallback: "March", ar: "مارس" },
  { value: "04", labelKey: "common.months.april", fallback: "April", ar: "أبريل" },
  { value: "05", labelKey: "common.months.may", fallback: "May", ar: "مايو" },
  { value: "06", labelKey: "common.months.june", fallback: "June", ar: "يونيو" },
  { value: "07", labelKey: "common.months.july", fallback: "July", ar: "يوليو" },
  { value: "08", labelKey: "common.months.august", fallback: "August", ar: "أغسطس" },
  { value: "09", labelKey: "common.months.september", fallback: "September", ar: "سبتمبر" },
  { value: "10", labelKey: "common.months.october", fallback: "October", ar: "أكتوبر" },
  { value: "11", labelKey: "common.months.november", fallback: "November", ar: "نوفمبر" },
  { value: "12", labelKey: "common.months.december", fallback: "December", ar: "ديسمبر" },
] as const;

export const getMonthFromDate = (date?: string) => {
  if (!date) return "";
  const parsed = moment(
    date,
    ["YYYY-MM-DD", "DD/MM/YYYY", moment.ISO_8601],
    true
  );
  return parsed.isValid() ? parsed.format("MM") : "";
};

const ChallengeForm: React.FC<{ disableDates?: boolean }> = ({
  disableDates = false,
}) => {
  const { messages } = useIntl();
  const { values, setFieldValue, errors, touched } =
    useFormikContext<IChallengeFormValues>();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  const handleMonthChange = (month: string) => {
    if (disableDates) return;
    setFieldValue("month", month);
    if (!month) {
      setFieldValue("startDate", "");
      setFieldValue("endDate", "");
      return;
    }

    const year = moment().year();
    const start = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month");
    const end = start.clone().endOf("month");

    setFieldValue("startDate", start.format("DD/MM/YYYY"));
    setFieldValue("endDate", end.format("DD/MM/YYYY"));
  };

  const monthBounds = React.useMemo(() => {
    const month = values.month || getMonthFromDate(values.startDate);
    if (!month) return { minDate: undefined, maxDate: undefined };

    const yearFromStart = moment(
      values.startDate,
      ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
      true
    );
    const year = yearFromStart.isValid()
      ? yearFromStart.year()
      : moment().year();
    const start = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month");
    const end = start.clone().endOf("month");

    return {
      minDate: start.toDate(),
      maxDate: end.toDate(),
    };
  }, [values.month, values.startDate]);

  const startDateMax = React.useMemo(() => {
    const endParsed = moment(
      values.endDate,
      ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
      true
    );
    if (endParsed.isValid() && monthBounds.maxDate) {
      return moment.min(endParsed, moment(monthBounds.maxDate)).toDate();
    }
    return monthBounds.maxDate;
  }, [values.endDate, monthBounds.maxDate]);

  const endDateMin = React.useMemo(() => {
    const startParsed = moment(
      values.startDate,
      ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
      true
    );
    if (startParsed.isValid() && monthBounds.minDate) {
      return moment.max(startParsed, moment(monthBounds.minDate)).toDate();
    }
    return monthBounds.minDate;
  }, [values.startDate, monthBounds.minDate]);

  return (
    <Form>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            size='small'
            error={!!(errors.month && touched.month)}
            disabled={disableDates}>
            <InputLabel id='challenge-month-label'>
              {t("challenges.month", "Month")}
            </InputLabel>
            <Select
              labelId='challenge-month-label'
              label={t("challenges.month", "Month")}
              value={values.month || ""}
              disabled={disableDates}
              onChange={(e) => handleMonthChange(e.target.value)}>
              {CHALLENGE_MONTH_OPTIONS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {t(month.labelKey, month.fallback)}
                </MenuItem>
              ))}
            </Select>
            {errors.month && touched.month ? (
              <FormHelperText>{errors.month}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} display='flex' alignItems='center'>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!values.isFeaturedOnHome}
                onChange={(e) =>
                  setFieldValue("isFeaturedOnHome", e.target.checked)
                }
                size='small'
              />
            }
            label={t("challenges.isFeaturedOnHome", "Featured on Home")}
            sx={{ m: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='challenges.title' />}
            name='title'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='challenges.badgeLabel' />}
            name='badgeLabel'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <AppTextField
            label={<IntlMessages id='challenges.subtitle' />}
            name='subtitle'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppDatePicker
            label='common.startDate'
            name='startDate'
            onChange={setFieldValue}
            value={values?.startDate}
            disabled={disableDates}
            minDate={monthBounds.minDate}
            maxDate={startDateMax}
            errorText={
              errors?.startDate && touched?.startDate ? errors?.startDate : ""
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppDatePicker
            label='common.endDate'
            name='endDate'
            onChange={setFieldValue}
            value={values?.endDate}
            disabled={disableDates}
            minDate={endDateMin}
            maxDate={monthBounds.maxDate}
            errorText={
              errors?.endDate && touched?.endDate ? errors?.endDate : ""
            }
          />
        </Grid>
      </Grid>
    </Form>
  );
};

export default ChallengeForm;
