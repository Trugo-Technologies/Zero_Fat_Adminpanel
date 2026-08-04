/** @format */

import { Box, Button, OutlinedInput, Typography } from "@mui/material";
import { MessageFormatElement } from "react-intl";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { IClient, IClientsListDto } from "src/types/modules/clientsManagement/clients";
import {
  KitchenOrderedMealAppliedFilters,
  dateInputSx,
} from "./kitchenOrderedMealFilterHelpers";

const clearButtonSx = {
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
  height: 36,
  px: 2,
  borderRadius: 2,
} as const;

type BuildKitchenOrderedMealFilterInputsArgs = {
  filters: KitchenOrderedMealAppliedFilters;
  messages: Record<string, MessageFormatElement[]> | Record<string, string>;
  locale: string;
  showClientFilter: boolean;
  selectedClient: IClient | null;
  clientsList?: IClientsListDto;
  isFetchingClients: boolean;
  pageClients?: number;
  searchValueClients: string;
  changePageClients: (page: number) => void;
  onDateChange: (value: string) => void;
  onClientChange: (_event: unknown, value: IClient | null) => void;
  onClientSearchChange: (value: string) => void;
  onClear: () => void;
};

export const buildKitchenOrderedMealFilterInputs = ({
  filters,
  messages,
  locale,
  showClientFilter,
  selectedClient,
  clientsList,
  isFetchingClients,
  pageClients,
  searchValueClients,
  changePageClients,
  onDateChange,
  onClientChange,
  onClientSearchChange,
  onClear,
}: BuildKitchenOrderedMealFilterInputsArgs) => {
  const inputs = [
    <Box key="date">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["dailySelections.date"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={filters.date}
        onChange={(e) => onDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
  ];

  if (showClientFilter) {
    inputs.push(
      <Box key="client" sx={{ minWidth: 220 }}>
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
        >
          {messages["sidebar.clients"] as string}
        </Typography>
        <AppBaseAutoComplete
          label="sidebar.clients"
          isLoading={isFetchingClients}
          options={clientsList?.data}
          hasNextPage={clientsList?.hasNextPage}
          getOptionLabel={(option) =>
            locale === "ar-SA"
              ? (option?.fullNameAr ?? option?.mobile)
              : (option?.fullNameEn ?? option?.mobile)
          }
          filterKey={locale === "ar-SA" ? "fullNameAr" : "fullNameEn"}
          anotherFilterKey="mobile"
          pageNumber={pageClients}
          changePage={changePageClients}
          value={selectedClient}
          onChangeAutoComplete={onClientChange}
          searchText={searchValueClients}
          onChangeTextField={(event) => onClientSearchChange(event.target.value)}
        />
      </Box>
    );
  }

  inputs.push(
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button onClick={onClear} sx={clearButtonSx}>
        Clear filters
      </Button>
    </Box>
  );

  return inputs;
};
