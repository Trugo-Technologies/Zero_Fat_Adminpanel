/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import useIntl from "react-intl/lib/src/components/useIntl";
import { useParams } from "react-router-dom";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllCustomizationGroupsQuery } from "src/pages/nutriplan-module/mealPlanning/customizationGroups/services/api";
import { endPoints } from "src/shared/end-points";
import {
  ICustomizationGroup,
  ICustomizationGroupsListDto,
} from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import { ICustomizationOptionsListDto } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
import { useGetAllCustomizationOptionsQuery } from "./services/api";
import useCustomizationOptions from "./useCustomizationOptions";

const CustomizationOptionsPage = () => {
  const { messages } = useIntl();
  const { mealIdParams } = useParams();

  const {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
    setShowAddModal,
  } = useCustomizationOptions();
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
  } = usePaginateData<ICustomizationOptionsListDto>(
    useGetAllCustomizationOptionsQuery,
    {},
    mealIdParams ? { mealId: mealIdParams || "" } : {}
  );

  const {
    changePage: changeGroupPage,
    data: groupsData,
    isFetching: isFetchingGroups,
    page: groupPage,
    setSearchValue: setGroupSearchValue,
    refetch: refetchGroups,
  } = usePaginateData<ICustomizationGroupsListDto>(
    useGetAllCustomizationGroupsQuery
  );

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);

  const allGroupsOption = useMemo(
    () =>
      ({
        id: "",
        nameEn: messages["common.all"] as string,
        nameAr: messages["common.all"] as string,
      }) as ICustomizationGroup,
    [messages]
  );

  const [selectedGroup, setSelectedGroup] =
    useState<ICustomizationGroup | null>(null);

  useEffect(() => {
    if (groupPage && groupPage > 1) refetchGroups();
  }, [groupPage, refetchGroups]);

  const groupOptions =
    groupPage && groupPage > 1
      ? groupsData?.data
      : [allGroupsOption, ...(groupsData?.data ?? [])];

  const syncGroupToQuery = useCallback(
    (groupId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        groupId: groupId || undefined,
      }));
    },
    [setParameter]
  );

  const handleGroupChange = (
    _event: unknown,
    value: ICustomizationGroup | null
  ) => {
    setSelectedGroup(value && value.id ? value : allGroupsOption);
    syncGroupToQuery(value?.id ?? null);
  };

  const handleClear = () => {
    setSelectedGroup(allGroupsOption);
    setGroupSearchValue("");
    setParameter((prev) => {
      const { groupId: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="group" sx={{ minWidth: 220 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["customizationGroups.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        isLoading={isFetchingGroups}
        options={groupOptions}
        hasNextPage={groupsData?.hasNextPage}
        pageNumber={groupPage}
        changePage={changeGroupPage}
        value={selectedGroup ?? allGroupsOption}
        onChangeAutoComplete={handleGroupChange}
        onChangeTextField={(event) =>
          setGroupSearchValue(event.target.value)
        }
      />
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
        {!mealIdParams && (
          <AppBreadcrumb
            paths={[
              { name: messages["sidebar.nutriplanManagement.title"] },
              { name: messages["sidebar.mealPlanning.title"] },
            ]}
            currentPathName={"sidebar.customizationOptions"}
          />
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="customizationOptions.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.customizationOptions().pathname}/filter`}
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
                  tableName="customizationOptions"
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
                  selectionModel={selectionModel}
                  initialState={{
                    ...initialDataGridState,
                    columns: {
                      columnVisibilityModel: {
                        ...initialDataGridState.columns.columnVisibilityModel,
                        priceAdjustment: false,
                        caloriesAdjustment: false,
                        fatAdjustment: false,
                        carbsAdjustment: false,
                        proteinAdjustment: false,
                      },
                    },
                  }}
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

export default CustomizationOptionsPage;
