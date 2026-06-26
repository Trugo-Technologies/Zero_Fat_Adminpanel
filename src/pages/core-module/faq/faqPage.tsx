/** @format */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import AppBreadcrumb from "src/Components/baseComponents/breadcrumb/AppBreadcrumb";
import AppDataGrid from "src/Components/baseComponents/dataGrid/AppDataGrid";
import AppFilters from "src/Components/baseComponents/filters/AppFilters";
import AppBaseAutoComplete from "src/Components/baseComponents/inputs/autoComplete/AppBaseAutoComplete";
import { initialDataGridState } from "src/Helpers";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { useGetAllFaqCategoriesQuery } from "src/pages/core-module/faqCategories/services";
import { endPoints } from "src/shared/end-points";
import {
  IFaqCategories,
  IFaqCategoriesListDto,
} from "src/types/modules/core/faqCategories";
import { useGetAllFaqQuery } from "./services";
import useFaq from "./useFaq";

function FaqPage() {
  const { messages } = useIntl();
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
  } = usePaginateData(useGetAllFaqQuery);

  const {
    changePage: changeCategoryPage,
    data: categoriesData,
    isFetching: isFetchingCategories,
    page: categoryPage,
    setSearchValue: setCategorySearchValue,
    refetch: refetchCategories,
  } = usePaginateData<IFaqCategoriesListDto>(useGetAllFaqCategoriesQuery);

  const {
    Modals,
    columns,
    selectionModel,
    setSelectionModel,
    setShowAddModal,
  } = useFaq();

  const [isOpenAdvanceFilters, setIsOpenAdvanceFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IFaqCategories | null>(null);

  useEffect(() => {
    if (categoryPage && categoryPage > 1) refetchCategories();
  }, [categoryPage, refetchCategories]);

  const syncCategoryToQuery = useCallback(
    (faqCategoryId?: string | null) => {
      setParameter((prev) => ({
        ...prev,
        pageNumber: 1,
        faqCategoryId: faqCategoryId || undefined,
      }));
    },
    [setParameter]
  );

  const handleCategoryChange = (
    _event: unknown,
    value: IFaqCategories | null
  ) => {
    setSelectedCategory(value);
    syncCategoryToQuery(value?.id ?? null);
  };

  const handleClear = () => {
    setSelectedCategory(null);
    setCategorySearchValue("");
    setParameter((prev) => {
      const { faqCategoryId: _, ...rest } = prev;
      return { ...rest, pageNumber: 1 };
    });
  };

  const advanceFiltersInputs = [
    <Box key="faqCategory" sx={{ minWidth: 220 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1 }}
      >
        {messages["faqCategories.name"] as string}
      </Typography>
      <AppBaseAutoComplete
        label="faqCategories.name"
        isLoading={isFetchingCategories}
        options={categoriesData?.data}
        hasNextPage={categoriesData?.hasNextPage}
        pageNumber={categoryPage}
        changePage={changeCategoryPage}
        value={selectedCategory}
        onChangeAutoComplete={handleCategoryChange}
        onChangeTextField={(event) =>
          setCategorySearchValue(event.target.value)
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
        <AppBreadcrumb
          paths={[{ name: messages["sidebar.coreManagement.title"] }]}
          currentPathName={"sidebar.faqs"}
        />
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <AppFilters
                  addTitle="faqs.add"
                  setShowAddModal={setShowAddModal}
                  onChangeKeywordValue={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSearchValue(event.target.value);
                  }}
                  successUrl={`${endPoints.faqEndpoint().pathname}/search`}
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
                  tableName="faqs"
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

export default FaqPage;
