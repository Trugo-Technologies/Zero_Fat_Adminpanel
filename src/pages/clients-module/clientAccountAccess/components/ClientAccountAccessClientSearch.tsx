/** @format */

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllClientsQuery } from "src/pages/clients-module/clients/services/api";
import { IClient, IClientsListDto } from "src/types/modules/clientsManagement/clients";

type Props = {
  selectedClientId?: string | null;
  onSearch: (client: IClient) => void;
};

const ClientAccountAccessClientSearch = ({
  selectedClientId,
  onSearch,
}: Props) => {
  const { messages } = useIntl();
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  const {
    changePage: changePageClients,
    data: clientsList,
    isFetching: isFetchingClients,
    page: pageClients,
    setSearchValue: setSearchValueClients,
    searchValue: searchValueClients,
  } = usePaginateData<IClientsListDto>(useGetAllClientsQuery);

  useEffect(() => {
    if (!selectedClientId) {
      setSelectedClient(null);
    }
  }, [selectedClientId]);

  const handleSearch = () => {
    if (!selectedClient) return;
    onSearch(selectedClient);
  };

  return (
    <Card sx={{ mb: 3, border: "1px solid #E2E8F0", boxShadow: "none" }}>
      <CardContent sx={{ p: { xs: 2, md: 3 }, "&:last-child": { pb: { xs: 2, md: 3 } } }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
          <IntlMessages id="clientAccountAccess.selectClient" />
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
          <IntlMessages id="clientAccountAccess.selectClientHint" />
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-end" }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
              getOptionLabel={(option) => option?.fullName || option?.mobile || ""}
              filterKey="fullName"
              anotherFilterKey="mobile"
              pageNumber={pageClients}
              changePage={changePageClients}
              value={selectedClient}
              onChangeAutoComplete={(_event, value) => setSelectedClient(value)}
              searchText={searchValueClients}
              onChangeTextField={(event) => {
                setSearchValueClients(event.target.value);
                changePageClients(1);
              }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!selectedClient}
            sx={{
              minWidth: 140,
              height: 40,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            <IntlMessages id="clientAccountAccess.searchClient" />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ClientAccountAccessClientSearch;
