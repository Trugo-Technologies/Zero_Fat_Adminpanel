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
import useIntl from "react-intl/lib/src/components/useIntl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { endPoints } from "src/shared/end-points";
import { INutrientsAttributesListDto } from "src/types/modules/nutriplan/nutrientsAttributes";
import { useGetAllNutrientsAttributesQuery } from "./services/api";
import useNutrientsAttributes from "./useNutrientsAttributes";

const ALL_UNITS = "All Units";

const NUTRIENT_UNITS = [
  { value: "g", label: "G" },
  { value: "mg", label: "MG" },
  { value: "μg", label: "μg" },
] as const;

const selectSx = {
  borderRadius: 2,
  height: 36,
  fontSize: 13,
  minWidth: 150,
  "& fieldset": { borderColor: "#E2E8F0" },
};

const NutrientsAttributesPage = () => {
  const { messages } = useIntl();
  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useNutrientsAttributes();
  const {
    changePage,
    data,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    refetch,
    setParameter,
  } = usePaginateData<INutrientsAttributesListDto>(
    useGetAllNutrientsAttributesQuery
  );

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [appliedUnit, setAppliedUnit] = useState(ALL_UNITS);

  const syncUnitToQuery = useCallback(
    (value: string) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        unit: value === ALL_UNITS ? undefined : value,
      }));
    },
    [setParameter]
  );

  const handleUnitChange = (value: string) => {
    setAppliedUnit(value);
    syncUnitToQuery(value);
  };

  const handleClear = () => {
    setAppliedUnit(ALL_UNITS);
    setParameter((prev) => {
      const { unit: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="unit">
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["nutrientsAttributes.unit"] as string}
      </Typography>
      <Select
        size="small"
        value={appliedUnit}
        onChange={(e) => handleUnitChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value={ALL_UNITS} sx={{ fontSize: 13 }}>
          {messages["common.all"] as string}
        </MenuItem>
        {NUTRIENT_UNITS.map(({ value, label }) => (
          <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
            {label}
          </MenuItem>
        ))}
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
          paths={[
            { name: messages["sidebar.nutriplanManagement.title"] },
            { name: messages["sidebar.setting.title"] },
          ]}
          currentPathName={"sidebar.nutrientsAttributes"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="nutrientsAttributes.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.nutrientsAttributes().pathname}/search`}
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
                  tableName="NutrientsAttribute"
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
                  checkboxSelection={true}
                  initialState={initialDataGridState}
                  selectionModel={selectionModel}
                  onSortModelChange={() => {}}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {Modals}
    </>
  );
};

export default NutrientsAttributesPage;
