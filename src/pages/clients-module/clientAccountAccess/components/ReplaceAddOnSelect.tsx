/** @format */

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { DeliveryCalendarAddOnCategory } from "src/types/modules/clientsManagement/clientAccountAccess";
import { useGetDeliveryCalendarAddOnOptionsQuery } from "../services/api";

const ADD_ON_CATEGORIES: DeliveryCalendarAddOnCategory[] = [
  "Meals",
  "Snacks",
  "Drinks",
  "Supplements",
];

type Props = {
  clientId: string;
  value: string;
  onChange: (mealId: string, mealName: string) => void;
  disabled?: boolean;
};

const ReplaceAddOnSelect = ({
  clientId,
  value,
  onChange,
  disabled = false,
}: Props) => {
  const { messages, locale } = useIntl();
  const [tab, setTab] = useState(0);
  const category = ADD_ON_CATEGORIES[tab];

  const { data: addOnOptionsResponse, isFetching: isOptionsLoading } =
    useGetDeliveryCalendarAddOnOptionsQuery(
      { clientId, category },
      { skip: !clientId }
    );

  const addOnOptions = addOnOptionsResponse?.data ?? [];

  const getItemLabel = (nameEn: string, nameAr: string) =>
    locale === "ar-SA" ? nameAr || nameEn : nameEn || nameAr;

  return (
    <Stack spacing={1.5}>
      <Tabs
        value={tab}
        onChange={(_, nextTab) => {
          setTab(nextTab);
          onChange("", "");
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 40 }}
      >
        {ADD_ON_CATEGORIES.map((cat) => (
          <Tab
            key={cat}
            label={
              messages[
                `clientAccountAccess.category.${cat.toLowerCase()}` as keyof typeof messages
              ] as string
            }
            disabled={disabled}
            sx={{ minHeight: 40, py: 0, fontSize: 13, fontWeight: 600 }}
          />
        ))}
      </Tabs>

      <FormControl fullWidth size="small" disabled={disabled || isOptionsLoading}>
        <InputLabel>{messages["clientAccountAccess.selectItem"] as string}</InputLabel>
        <Select
          value={value}
          label={messages["clientAccountAccess.selectItem"] as string}
          onChange={(e) => {
            const mealId = e.target.value;
            const item = addOnOptions.find((option) => option.id === mealId);
            onChange(
              mealId,
              item ? getItemLabel(item.nameEn, item.nameAr) : ""
            );
          }}
        >
          {addOnOptions.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {getItemLabel(item.nameEn, item.nameAr)} — AED {item.unitPrice.toFixed(2)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!isOptionsLoading && addOnOptions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No add-on items available in this category.
        </Typography>
      ) : null}
    </Stack>
  );
};

export default ReplaceAddOnSelect;

export const isAddOnMealSelection = (mealSelectionType: string) =>
  mealSelectionType === "AddOn";
