/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage, removeHTMLTags } from "src/Helpers";
import { useGetFaqDetailsQuery } from "src/pages/core-module/faq/services";
import { IFaq } from "src/types/modules/core/faq";

interface IFaqDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const FaqDetails = (props: IFaqDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: faqItem, isLoading: detailsLoading } = useGetFaqDetailsQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={faqItem?.data?.question!}
        label='faqs.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={faqItem?.data as IFaq}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='faqs.question'
            value={faqItem?.data?.question}
            column={6}
          />
          <AppItemView
            label='faqs.answer'
            value={removeHTMLTags(faqItem?.data?.answer! ?? "")}
            column={6}
          />

          <AppItemView
            label='faqCategories.name'
            value={getValueBasedOnCurrentLanguage(
              faqItem?.data?.faqCategory?.nameAr!,
              faqItem?.data?.faqCategory?.nameEn!
            )}
            column={6}
          />

          <AppItemView
            label='ingredients.tags'
            value={faqItem?.data?.tags?.map((item: string) => item).join(", ")}
            column={6}
          />

          <AppItemView
            label='common.status'
            value={faqItem?.data?.isActive}
            column={12}
            type='isActive'
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default FaqDetails;
