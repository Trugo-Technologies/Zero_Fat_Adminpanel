import { SubscriptionOptions } from "@reduxjs/toolkit/dist/query/core/apiState";
import { UseQueryStateOptions } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useEffect, useState } from "react";
import { ArgsType, queryType } from "src/types";

export function usePaginateData<T extends { totalCount?: number | undefined }>(
  hook: queryType<T>,
  options?: SubscriptionOptions & { skip?: boolean },
  parameterOverride?: Partial<ArgsType>
) {
  const [totalRecords, setTotalRecords] = useState<number | undefined>(
    undefined
  );

  const [parameter, setParameter] = useState<ArgsType>({
    // searchValue: "",
    //I edit this currentPage from 0 to 1
    pageNumber: 1,
    pageSize: 10,
    // needPagination: true,
    ...parameterOverride,
  });

  const { isError, isLoading, isSuccess, refetch, data, isFetching } = hook(
    { ...parameter },
    options
  );

  useEffect(() => {
    if (data?.totalCount !== undefined) setTotalRecords(data?.totalCount);
  }, [data?.totalCount]);

  const changePage = (pageNumber: number) => {
    setParameter((prev) => ({
      ...prev,
      pageNumber: pageNumber,
    }));
  };

  const handleDelete = () => {
    setTotalRecords((prev) => (prev ?? 1) - 1);
    if (
      ((totalRecords ?? 1) - 1) / (parameter?.pageSize ?? 0) <=
      (parameter.pageNumber as number)
    ) {
      if (parameter.pageNumber != 0) {
        setParameter((prev) => ({
          ...prev,
          page: (prev.pageNumber as number) - 1,
        }));
      } else {
        refetch();
      }
    } else refetch();
  };

  const changeLimit = (limit: string) => {
    setParameter((prev) => ({ ...prev, pageSize: +limit, page: 0 }));
  };

  const setSearchValue = (searchValue: string) => {
    setParameter((prev) => ({
      ...prev,
      keyword: searchValue,
      page: 0,
    }));
  };

  const sortBy = (args: string[]) => {
    setParameter((prev) => ({
      ...prev,
      orderBy: args,
    }));
  };

  const filterDate = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    setParameter((prev) => ({
      ...prev,
      page: 0,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const addExtraParams = (args: Partial<ArgsType>) => {
    setParameter((prev) => ({ ...prev, ...args }));
  };

  return {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    totalRecords,
    page: parameter.pageNumber,
    changePage,
    handleDelete,
    changeLimit,
    limit: parameter.pageSize,
    setSearchValue,
    searchValue: parameter.searchValue,
    refetch,
    sortBy,
    addExtraParams,
    filterDate,
    parameter,
    setParameter,
  };
}
