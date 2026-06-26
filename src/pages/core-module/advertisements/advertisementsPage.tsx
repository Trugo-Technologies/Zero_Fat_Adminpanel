/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { useGetAllAdvertisementsQuery } from "./services";
import useAdvertisements from "./useAdvertisements";

const ALL_STATUS = "All Status";

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

function AdvertisementsPage() {
  const { messages } = useIntl();
  const {
    changeLimit,
    changePage,
    data,
    isFetching,
    limit,
    page,
    totalRecords,
    sortBy,
    setSearchValue,
    refetch,
    setParameter,
  } = usePaginateData(useGetAllAdvertisementsQuery);
  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useAdvertisements();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(ALL_STATUS);

  const syncStatusToQuery = useCallback(
    (value: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        isActive:
          value === "Active"
            ? true
            : value === "Inactive"
              ? false
              : undefined,
      }));
    },
    [setParameter]
  );

  const handleStatusChange = (value: string) => {
    setAppliedStatus(value);
    syncStatusToQuery(value);
  };

  const handleClear = () => {
    setAppliedStatus(ALL_STATUS);
    setParameter((prev) => {
      const { isActive: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="status">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["common.status"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_STATUS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        <MenuItem value="Active" sx={{ fontSize: 13 }}>
          {messages["columns.active"] as string}
        </MenuItem>
        <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
          {messages["columns.inactive"] as string}
        </MenuItem>
      </Select>
    </Box>,
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
  ];

  return (
    <>
      <Grid container spacing={3}>
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.coreManagement.title"] }]}
          currentPathName={"sidebar.advertisements"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="advertisements.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(event) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.advertisementsEndpoint().pathname}/search`}
                  selectionModel={selectionModel as string[]}
                  setSelectionModel={setSelectionModel}
                  refetch={refetch}
                  showAdvanceFiltersButton
                  isOpenAdvanceFilters={isOpenAdvanceFilters}
                  setIsOpenAdvanceFilters={setIsOpenAdvanceFilters}
                  advanceFiltersInputs={advanceFiltersInputs}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <AppDataGrid
                  rowCount={totalRecords ?? 0}
                  pageNumber={page ?? 0}
                  tableName="advertisements"
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
                  initialState={initialDataGridState}
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
      {Modals}
    </>
  );
}

export default AdvertisementsPage;
