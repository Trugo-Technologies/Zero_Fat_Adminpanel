/** @format */

import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import PaymentStatusBadge from "src/Components/baseComponents/badge/PaymentStatusBadge";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { getValueBasedOnCurrentLanguage } from "src/Helpers";
import { useGetPaymentQuery } from "src/pages/clients-module/payments/services/api";
import { IPayments } from "src/types/modules/clientsManagement/payments";

interface IPaymentDetailsProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  id: string;
}

const PaymentDetails = (props: IPaymentDetailsProps) => {
  const { showDetails, setShowDetails, id } = props;
  const { locale } = useIntl();

  const { data: paymentItem, isLoading: detailsLoading } = useGetPaymentQuery(
    { id: id || "" },
    {
      skip: !id,
    }
  );
  return (
    <>
      <BaseDetails
        itemName={
          locale == "en-US" && paymentItem?.data?.client?.fullName!
            ? `- ${paymentItem?.data?.client?.fullName!}`
            : `- ${paymentItem?.data?.client?.fullName!}`
        }
        label='payments.details'
        open={showDetails}
        onClose={() => setShowDetails(false)}
        loading={detailsLoading}
        errorMessage={""}
        moreDetails={paymentItem?.data as IPayments}
        maxWidth='md'
        columns={12}>
        <Grid container spacing={5} item xs={12}>
          <AppItemView
            label='clients.name'
            value={getValueBasedOnCurrentLanguage(
              paymentItem?.data?.client?.fullName!,
              paymentItem?.data?.client?.fullName!
            )}
            column={3}
          />
          <AppItemView
            label='payments.amount'
            value={paymentItem?.data?.amount}
            column={3}
          />
          <AppItemView
            label='payments.currency'
            value={paymentItem?.data?.currency}
            column={3}
          />
          <AppItemView
            label='payments.invoiceNumber'
            value={paymentItem?.data?.invoiceNumber}
            column={3}
          />
          <AppItemView
            label='payments.paymentGateway'
            value={paymentItem?.data?.paymentGateway}
            column={3}
          />
          <AppItemView
            label='payments.paymentMethod'
            value={paymentItem?.data?.paymentMethod}
            column={3}
          />
          <AppItemView
            label='payments.transactionId'
            value={paymentItem?.data?.transactionId}
            column={3}
          />
          <AppItemView
            label='payments.paymentDate'
            value={paymentItem?.data?.paymentDate}
            column={3}
            type='date'
          />
          <AppItemView
            label='payments.paymentStatus'
            value={
              <PaymentStatusBadge label={paymentItem?.data?.paymentStatus!} />
            }
            column={12}
          />
          <AppItemView
            label='payments.reason'
            value={paymentItem?.data?.reason}
            column={6}
          />

          <AppItemView
            label='common.notes'
            value={paymentItem?.data?.notes}
            column={6}
          />
        </Grid>
      </BaseDetails>
    </>
  );
};

export default PaymentDetails;
