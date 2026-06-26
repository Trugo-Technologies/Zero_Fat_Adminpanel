/** @format */

import { usePaginateData } from "src/hooks/use-paginate-data";
import { privilegeFeature } from "src/shared/privileges";
import {
  plansType,
  useGetAllPlansQuery,
  useDeletePlanMutation,
  useUpdateActiveMutation,
} from "../services/api";
import MainTable from "src/Components/main-table";
import LevelChip from "../components/level-chip";
import AuthorizedCheckWrapper, {
  ComponentPropsType,
} from "src/Components/authorized-check-wrapper";
import ImagePreviewDialog from "src/Components/dialog/image-preview-dialog";

function AllPlans({ canEdit, canDelete }: ComponentPropsType) {
  const {
    changePage,
    data,
    isError,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    handleDelete,
    refetch,
  } = usePaginateData(useGetAllPlansQuery);
  const [deletePlan, { isLoading: deleteLoading }] = useDeletePlanMutation();
  const [updateActive, { isLoading: updateActiveLoading }] =
    useUpdateActiveMutation();
  const loading = isFetching || deleteLoading || updateActiveLoading;
  const headers = [
    { key: "nameEn", value: "NameEn" },
    { key: "avatarImageUrl", value: "Avatar image url" },
    { key: "profileMediaUrl", value: "Profile media url" },
    { key: "level", value: "Level" },
    { key: "daysPerWeek", value: "Days per week" },
    { key: "weeklyRepetition", value: "weeklyRepetition" },
    { key: "trainerName", value: "Trainer nameEn" },
    { key: "planGoal", value: "Plan goals name" },
  ];

  const createData = (data: plansType) => {
    return {
      ...data,
      avatarImageUrl: <ImagePreviewDialog url={data.avatarImageUrl} />,
      profileMediaUrl: <ImagePreviewDialog url={data.profileMediaUrl} />,
      level: <LevelChip title={data.level} />,
      trainerName: data.trainer.nameEn,
      planGoal: data.planGoal.nameEn,
    };
  };

  const onDelete = (id: string) => {
    deletePlan(id)
      .unwrap()
      .then(() => {
        handleDelete();
      });
  };
  const onSearch = (key: string) => setSearchValue(key);
  return (
    <MainTable
      feature={privilegeFeature.all}
      onAdd='/plans/add'
      refetch={refetch}
      handleSearch={onSearch}
      title='plans'
      isError={isError}
      header={headers}
      rows={data?.data.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={(page as number) - 1}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
      action={{
        delete: canDelete ? onDelete : undefined,
        update: canEdit ? "/plans" : undefined,
        activation: {
          key: "isActive",
          handler: (id) => {
            updateActive(id);
          },
        },
      }}
    />
  );
}
export default AuthorizedCheckWrapper({
  feature: privilegeFeature.all,
  type: "view",
})(AllPlans);
