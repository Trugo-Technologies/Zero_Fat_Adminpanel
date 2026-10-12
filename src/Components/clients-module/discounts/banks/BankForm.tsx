/** @format */

import {
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Form, useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import AppImageField from "src/@crema/components/AppFormComponents/AppImageField";
import AppTextField from "src/@crema/components/AppFormComponents/AppTextField";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppCustomizedSwitch from "src/Components/baseComponents/inputs/AppCustomizedSwitch";
import { IPromoBankFormValues } from "src/types/modules/clientsManagement/discounts/banks";

const normalizeBin = (raw: string) => raw.replace(/\D/g, "").trim();

const BankForm: React.FC = () => {
  const { messages } = useIntl();
  const { values, setFieldValue, errors, touched } =
    useFormikContext<IPromoBankFormValues>();

  const t = (key: string, fallback: string) =>
    (messages[key] as string) || fallback;

  const prefixes = values.cardBinPrefixes || [];

  const prefixError =
    touched.cardBinPrefixes && errors.cardBinPrefixes
      ? String(errors.cardBinPrefixes)
      : "";

  const commitBins = (next: string[]) => {
    const cleaned = Array.from(
      new Set(
        next
          .flatMap((item) => item.split(/[\s,;]+/))
          .map(normalizeBin)
          .filter(Boolean)
      )
    );
    setFieldValue("cardBinPrefixes", cleaned);
  };

  return (
    <Form>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.nameEn' />}
            name='nameEn'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            label={<IntlMessages id='common.nameAr' />}
            name='nameAr'
            variant='outlined'
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={prefixes}
            onChange={(_, next) => commitBins(next as string[])}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    size='small'
                    label={option}
                    {...tagProps}
                    sx={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontWeight: 600,
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                label={t("promoBanks.cardBinPrefixes", "Card BIN Prefixes")}
                placeholder={
                  prefixes.length
                    ? ""
                    : t(
                        "promoBanks.cardBinPrefixesPlaceholder",
                        "Type BIN and press Enter"
                      )
                }
                error={!!prefixError}
                helperText={
                  prefixError ||
                  t(
                    "promoBanks.cardBinPrefixesHint",
                    "Press Enter after each BIN"
                  )
                }
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6} display='flex' alignItems='center'>
          <AppCustomizedSwitch
            defaultChecked={values?.isActive}
            keyName='isActive'
            onChange={setFieldValue}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
            {t("promoBanks.logo", "Logo")}
          </Typography>
          <Box
            sx={{
              "& > .MuiBox-root": { top: "0 !important" },
              "& > .MuiBox-root > .MuiBox-root": {
                minHeight: "160px !important",
                height: "160px !important",
                py: 2,
              },
              "& img": {
                width: "70% !important",
                maxHeight: "120px !important",
              },
            }}>
            <AppImageField
              name='logo'
              label='promoBanks.logo'
              placeholder='promoBanks.logoHint'
              accept='image/*'
              height={160}
            />
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
};

export default BankForm;
