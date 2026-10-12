/** @format */

import { Box, Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { baseImageUrl } from "src/env/base-url";
import {
  formatHomeBannerMealTypeNames,
  formatHomeBannerPlanNames,
} from "src/pages/clients-module/homeBanners/homeBannerDisplayHelpers";
import { useGetHomeBannerByIdQuery } from "src/pages/clients-module/homeBanners/services/api";
import {
  formatHomeBannerPlanSummary,
  getHomeBannerDeliveryDayLabel,
  HomeBannerAudience,
  IHomeBanner,
  mapHomeBannerApiToUi,
} from "src/types/modules/clientsManagement/homeBanners";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  item: IHomeBanner;
}

const formatPrice = (amount: number, currency: string) =>
  `${currency} ${amount.toLocaleString()}`;

const audienceLabel = (
  type: HomeBannerAudience,
  messages: Record<string, string>
) => {
  const key = `homeBanners.audience.${type}`;
  return (
    messages[key] ||
    ({
      [HomeBannerAudience.All]: "All",
      [HomeBannerAudience.FirstTime]: "First time",
      [HomeBannerAudience.Active]: "Active",
      [HomeBannerAudience.Expired]: "Expired",
    }[type] ||
      type)
  );
};

const HomeBannerDetails = ({ showDetails, setShowDetails, item }: IProps) => {
  const { messages, locale } = useIntl();
  const { data, isFetching } = useGetHomeBannerByIdQuery(
    { id: item.id },
    { skip: !item.id || !showDetails }
  );

  const row = data?.data ? mapHomeBannerApiToUi(data.data) : item;
  const imageSrc = row.imageUrl
    ? row.imageUrl.startsWith("http")
      ? row.imageUrl
      : `${baseImageUrl}/${row.imageUrl}`
    : null;

  return (
    <BaseDetails
      itemName={row.titleEn}
      label='homeBanners.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isFetching}
      errorMessage={undefined}
      moreDetails={row as any}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        {imageSrc ? (
          <Grid item xs={12}>
            <Box
              component='img'
              src={imageSrc}
              alt={row.titleEn}
              sx={{
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Grid>
        ) : null}

        <AppItemView label='common.nameEn' value={row.titleEn} column={6} />
        <AppItemView label='common.nameAr' value={row.titleAr} column={6} />
        <AppItemView
          label='homeBanners.descriptionEn'
          value={row.descriptionEn}
          column={6}
        />
        <AppItemView
          label='homeBanners.descriptionAr'
          value={row.descriptionAr}
          column={6}
        />
        <AppItemView
          label='homeBanners.badgeTextEn'
          value={row.badgeTextEn}
          column={6}
        />
        <AppItemView
          label='homeBanners.badgeTextAr'
          value={row.badgeTextAr}
          column={6}
        />
        <AppItemView
          label='homeBanners.mealPlan'
          value={formatHomeBannerPlanNames(
            locale === "en-US" ? row.mealPlanNamesEn : row.mealPlanNamesAr,
            row.planIds || []
          )}
          column={6}
        />
        <AppItemView
          label='homeBanners.mealType'
          value={formatHomeBannerMealTypeNames(
            row.mealTypeSelections,
            locale
          )}
          column={6}
        />
        <AppItemView
          label='homeBanners.audience'
          value={audienceLabel(
            row.audienceType,
            messages as Record<string, string>
          )}
          column={6}
        />
        <AppItemView
          label='homeBanners.subscriptionPlan'
          value={
            (messages[
              `homeBanners.subscriptionPlan.${row.subscriptionPlanType}`
            ] as string) ||
            row.subscriptionPlanType ||
            "—"
          }
          column={6}
        />
        <AppItemView
          label='homeBanners.deliveryTime'
          value={
            (messages[
              `homeBanners.deliveryTime.${row.preferredDeliveryTime}`
            ] as string) ||
            row.preferredDeliveryTime ||
            "—"
          }
          column={6}
        />
        <AppItemView
          label='homeBanners.deliveryDays'
          value={
            (row.deliveryDays || [])
              .map((day) =>
                getHomeBannerDeliveryDayLabel(
                  day,
                  messages as Record<string, string>
                )
              )
              .join(", ") || "—"
          }
          column={12}
        />
        {row.proteinGrams != null ||
        row.carbsGrams != null ||
        row.fiberGrams != null ? (
          <>
            <AppItemView
              label='homeBanners.proteinGrams'
              value={
                row.proteinGrams != null ? `${row.proteinGrams}g` : "—"
              }
              column={4}
            />
            <AppItemView
              label='homeBanners.carbsGrams'
              value={row.carbsGrams != null ? `${row.carbsGrams}g` : "—"}
              column={4}
            />
            <AppItemView
              label='homeBanners.fiberGrams'
              value={row.fiberGrams != null ? `${row.fiberGrams}g` : "—"}
              column={4}
            />
          </>
        ) : null}
        <AppItemView
          label='homeBanners.planSummary'
          value={formatHomeBannerPlanSummary(row)}
          column={6}
        />
        <AppItemView
          label='homeBanners.mealsPerDay'
          value={row.mealsPerDay}
          column={4}
        />
        <AppItemView
          label='homeBanners.snacksPerDay'
          value={row.snacksPerDay}
          column={4}
        />
        <AppItemView
          label='homeBanners.durationDays'
          value={row.durationDays}
          column={4}
        />
        <AppItemView
          label='homeBanners.freeDelivery'
          value={row.freeDelivery}
          column={6}
          type='isExist'
        />
        <AppItemView
          label='homeBanners.originalPrice'
          value={formatPrice(row.originalPrice, row.currency)}
          column={6}
        />
        <AppItemView
          label='homeBanners.salePrice'
          value={
            <Typography component='span' sx={{ fontWeight: 700 }}>
              {formatPrice(row.salePrice, row.currency)}
            </Typography>
          }
          column={6}
        />
        <AppItemView
          label='homeBanners.sortOrder'
          value={row.sortOrder}
          column={6}
        />
        <AppItemView
          label='common.status'
          value={row.isActive}
          column={6}
          type='isActive'
        />
      </Grid>
    </BaseDetails>
  );
};

export default HomeBannerDetails;
