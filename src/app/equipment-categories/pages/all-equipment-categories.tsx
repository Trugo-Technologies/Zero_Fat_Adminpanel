/** @format */

import { useState } from "react";
import ActivateButton from "src/Components/acivate-button";
import AuthorizedCheckWrapper, {
  ComponentPropsType,
} from "src/Components/authorized-check-wrapper";
import ImagePreviewDialog from "src/Components/dialog/image-preview-dialog";
import MainTable from "src/Components/main-table";
import { usePaginateData } from "src/hooks/use-paginate-data";
import { privilegeFeature } from "src/shared/privileges";
import {
  equipmentCategoriesType,
  useDeleteEquipmentCategoriesMutation,
  useEditEquipmentCategoriesMutation,
  useGetAllEquipmentCategoriesQuery,
} from "../services/api";

function AllEquipmentCategories({ canEdit, canDelete }: ComponentPropsType) {
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
  } = usePaginateData(useGetAllEquipmentCategoriesQuery);
  const [deleteEquipmentCategory, { isLoading: deleteLoading }] =
    useDeleteEquipmentCategoriesMutation();
  const [editEquipmentCategory, { isLoading: updateLoading }] =
    useEditEquipmentCategoriesMutation();
  const [openFOrmPopup, setOpenFOrmPopup] = useState<
    equipmentCategoriesType | undefined | "add"
  >();
  const loading = isFetching || deleteLoading || updateLoading;
  const headers = [
    { key: "nameAr", value: "NameEn" },
    { key: "iconUrl", value: "Icon url" },
    { key: "Active", value: "Is active" },
  ];

  const createData = (data: equipmentCategoriesType) => {
    return {
      ...data,
      Active: (
        <ActivateButton checked={data.isActive} loading onClick={() => {}} />
      ),
      iconUrl: <ImagePreviewDialog url={data.iconUrl} />,
    };
  };

  const onDelete = (id: string) => {
    deleteEquipmentCategory(id)
      .unwrap()
      .then(() => {
        handleDelete();
      });
  };
  const onSearch = (key: string) => setSearchValue(key);
  return (
    <>
      <MainTable
        feature={privilegeFeature.all}
        onAdd={() => {
          setOpenFOrmPopup("add");
        }}
        refetch={refetch}
        handleSearch={onSearch}
        title='Equipment category'
        isError={isError}
        header={headers}
        rows={data?.data.map((d) => createData(d)) ?? []}
        totalRecords={totalRecords ?? 0}
        limit={limit}
        page={page}
        onPageChange={changePage}
        onLimitChange={changeLimit}
        loading={loading}
        action={{
          delete: canDelete ? onDelete : undefined,
          update: canEdit
            ? (id: string) => {
                setOpenFOrmPopup(data?.data.find((d) => d.id === id));
              }
            : undefined,
          activation: {
            key: "isActive",
            handler: (id) => {
              editEquipmentCategory({ id, data: undefined, isActive: true });
            },
          },
        }}
      />
      {/* <AppAddModal
        open={Boolean(openFOrmPopup)}
        onClose={() => setOpenFOrmPopup(undefined)}
        label="add equipment category"
        maxWidth="sm"
      >
        <EquipmentCategoriesForm
          formValues={openFOrmPopup}
          setOpenFOrmPopup={setOpenFOrmPopup}
        />
      </AppAddModal> */}
    </>
  );
}
export default AuthorizedCheckWrapper({
  feature: privilegeFeature.all,
  type: "view",
})(AllEquipmentCategories);
