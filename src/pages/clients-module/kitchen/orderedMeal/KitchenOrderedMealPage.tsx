/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { IClient, IClientsListDto } from "src/types/modules/clientsManagement/clients";
import { useGetAllClientsQuery } from "../../clients/services/api";
import { useGetAllKitchenOrderedMealQuery } from "./services/api";
import useKitchenOrderedMeal from "./useKitchenOrderedMeal";

const dateInputSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

function KitchenOrderedMealPage() {
  const { messages, locale } = useIntl();
  const { clientIdParams } = useParams();
  const currentDate = moment().format("YYYY-MM-DD");

  const {
    changeLimit,
    changePage,
    data,
    isFetching,
    limit,
    page,
    setSearchValue,
    refetch,
    sortBy,
    totalRecords,
    setParameter,
  } = usePaginateData(
    useGetAllKitchenOrderedMealQuery,
    {},
    {
      clientId: clientIdParams,
      date: currentDate,
    }
  );
  const { columns, selectionModel, setSelectionModel } =
    useKitchenOrderedMeal();

  const {
    changePage: changePageClients,
    data: clientsList,
    isFetching: isFetchingClients,
    page: pageClients,
    setSearchValue: setSearchValueClients,
    searchValue: searchValueClients,
    refetch: refetchClients,
  } = usePaginateData<IClientsListDto>(useGetAllClientsQuery, {
    skip: Boolean(clientIdParams),
  });

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedDate, setAppliedDate] = useState(currentDate);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  useEffect(() => {
    if (pageClients && pageClients > 1) refetchClients();
  }, [pageClients, refetchClients]);

  const syncFiltersToQuery = useCallback(
    (date: string, clientId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        date: date || currentDate,
        clientId: clientIdParams ?? clientId ?? null,
      }));
    },
    [setParameter, clientIdParams, currentDate]
  );

  const handleDateChange = (value: string) => {
    setAppliedDate(value);
    syncFiltersToQuery(value, selectedClient?.id ?? null);
  };

  const handleClientChange = (_event: unknown, value: IClient | null) => {
    setSelectedClient(value);
    syncFiltersToQuery(appliedDate, value?.id ?? null);
  };

  const handleClear = () => {
    setAppliedDate(currentDate);
    if (!clientIdParams) {
      setSelectedClient(null);
      setSearchValueClients("");
    }
    setParameter((prev) => ({
      ...prev,
      pageNumber: 1,
      date: currentDate,
      clientId: clientIdParams ?? null,
    }));
  };

  const advanceFiltersInputs = [
    <Box key="date">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["dailySelections.date"] as string}
      </Typography>
      <OutlinedInput
        type="date"
        size="small"
        value={appliedDate}
        onChange={(e) => handleDateChange(e.target.value)}
        sx={dateInputSx}
      />
    </Box>,
    !clientIdParams ? (
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
          onChangeAutoComplete={handleClientChange}
          searchText={searchValueClients}
          onChangeTextField={(event) => {
            setSearchValueClients(event.target.value);
            changePageClients(1);
          }}
        />
      </Box>
    ) : null,
    <Box key="clear" sx={{ ml: "auto" }}>
      <Button
        onClick={handleClear}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
          height: 36,
          px: 2,
          borderRadius: 2,
        }}
      >
        Clear filters
      </Button>
    </Box>,
  ].filter(Boolean);

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[
            { name: messages["sidebar.clientsManagement.title"] },
            { name: messages["sidebar.kitchen"] },
          ]}
          currentPathName={"sidebar.kitchen.orderedMeal"}
          isShow={!clientIdParams}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  showAddButton={false}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.kitchenOrderedMeal().pathname}`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={4}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="mealCount"
                  onPageSizeChange={(pageSize: number) => {
                    changeLimit(`${pageSize}`);
                  }}
                  onPageChange={(pageNumber: number) => {
                    changePage(pageNumber + 1);
                  }}
                  pageSize={limit ?? 10}
                  columns={columns}
                  rows={data?.data ?? []}
                  loading={isFetching}
                  onSelectionModelChange={setSelectionModel}
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        "client.fullNameEn": clientIdParams ? false : true,
                        "client.fullNameAr": clientIdParams ? false : true,
                        "clientLocation.type": false,
                        "clientLocation.area": false,
                        "clientLocation.street": false,
                        "clientLocation.building": false,
                        "clientLocation.postalCode": false,
                        "clientLocation.office": false,
                        "clientLocation.fullAddressEn": false,
                        notes: false,
                        specialInstructions: false,
                        totalCalories: false,
                        totalFats: false,
                        totalCarbohydrates: false,
                        totalProteins: false,
                      },
                    },
                  }}
                  checkboxSelection={true}
                  selectionModel={selectionModel}
                  onSortModelChange={(result: string[] | null) => {
                    sortBy(result as string[]);
                  }}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default KitchenOrderedMealPage;
