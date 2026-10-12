/** @format */

import { Box, Chip, Grid, Stack } from "@mui/material";
import BaseDetails from "src/Components/baseComponents/details/BaseDetails";
import AppItemView from "src/Components/baseComponents/other/AppItemView";
import { useGetBankByIdQuery } from "src/pages/clients-module/discounts/banks/services/api";
import { IPromoBank } from "src/types/modules/clientsManagement/discounts/banks";

interface IProps {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  item: IPromoBank;
}

const BankDetails = ({ showDetails, setShowDetails, item }: IProps) => {
  const { data, isFetching } = useGetBankByIdQuery(
    { id: item.id },
    { skip: !item.id || !showDetails }
  );

  const bank = data?.data || item;
  const prefixes =
    bank.cardBinPrefixes?.length
      ? bank.cardBinPrefixes
      : bank.code
        ? [bank.code]
        : [];

  return (
    <BaseDetails
      itemName={bank.nameEn}
      label='promoBanks.details'
      open={showDetails}
      onClose={() => setShowDetails(false)}
      loading={isFetching}
      errorMessage={undefined}
      moreDetails={bank as any}
      maxWidth='sm'
      columns={12}>
      <Grid container spacing={5} item xs={12}>
        {bank.logoUrl ? (
          <Grid item xs={12}>
            <Box
              component='img'
              src={bank.logoUrl}
              alt={bank.nameEn}
              sx={{
                maxHeight: 120,
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Grid>
        ) : null}
        <AppItemView label='common.nameEn' value={bank.nameEn} column={6} />
        <AppItemView label='common.nameAr' value={bank.nameAr} column={6} />
        <AppItemView
          label='promoBanks.cardBinPrefixes'
          value={
            prefixes.length ? (
              <Stack direction='row' flexWrap='wrap' gap={1}>
                {prefixes.map((prefix) => (
                  <Chip key={prefix} label={prefix} size='small' />
                ))}
              </Stack>
            ) : (
              "—"
            )
          }
          column={12}
        />
        <AppItemView
          label='common.status'
          value={bank.isActive}
          column={6}
          type='isActive'
        />
      </Grid>
    </BaseDetails>
  );
};

export default BankDetails;
