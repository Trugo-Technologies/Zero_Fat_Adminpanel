/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetChallengeByIdQuery } from "src/pages/clients-module/challenges/services/api";
import {
  getChallengeStatusMeta,
  IChallenge,
} from "src/types/modules/clientsManagement/challenges";
import { CHALLENGE_MONTH_OPTIONS, getMonthFromDate } from "./ChallengeForm";

interface IChallengeDetailsProps {
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  challenge: IChallenge;
}

const ChallengeDetails: React.FC<IChallengeDetailsProps> = ({
  showDetails,
  setShowDetails,
  challenge,
}) => {
  const { messages } = useIntl();

  const {
    data: itemById,
    isLoading,
    error,
  } = useGetChallengeByIdQuery(
    { id: challenge?.id || "" },
    { skip: !challenge?.id }
  );

  const source = itemById?.data || challenge;
  const itemName = source.title ? `- ${source.title}` : "";

  const monthOption = CHALLENGE_MONTH_OPTIONS.find(
    (m) => m.value === (source.month || getMonthFromDate(source.startDate))
  );
  const monthLabel = monthOption
    ? (messages[monthOption.labelKey] as string) || monthOption.fallback
    : source.month || "—";

  const statusMeta = getChallengeStatusMeta(source.status);
  const statusLabel = statusMeta
    ? (messages[statusMeta.labelKey] as string) || statusMeta.fallback
    : "—";

  return (
    <BaseDetails
      itemName={itemName}
      label='challenges.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isLoading}
      errorMessage={error}
      moreDetails={source as any}
      maxWidth='md'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        <AppItemView label='challenges.title' value={source.title} column={6} />
        <AppItemView
          label='challenges.badgeLabel'
          value={source.badgeLabel}
          column={6}
        />
        <AppItemView
          label='challenges.subtitle'
          value={source.subtitle}
          column={12}
        />
        <AppItemView label='challenges.month' value={monthLabel} column={6} />
        <AppItemView
          label='common.status'
          value={statusLabel}
          column={6}
        />
        <AppItemView
          label='challenges.isFeaturedOnHome'
          value={source.isFeaturedOnHome}
          column={6}
          type='isExist'
        />
        <AppItemView
          label='common.startDate'
          value={source.startDate}
          column={6}
        />
        <AppItemView label='common.endDate' value={source.endDate} column={6} />
        {typeof source.participantCount === "number" ? (
          <AppItemView
            label='challenges.participantCount'
            value={source.participantCount}
            column={6}
          />
        ) : null}
      </Grid>
    </BaseDetails>
  );
};

export default ChallengeDetails;
