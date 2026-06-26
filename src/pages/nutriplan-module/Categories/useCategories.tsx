/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { ICategories } from "src/types/modules/nutriplan/categories";
import { useDeleteCategoryMutation } from "./services/api";
import { CategoriesColumns } from "./CategoriesColumns";
import AddCategory from "src/Components/nutriplan-module/setting/Categories/AddCategories";
import CategoryDetails from "src/Components/nutriplan-module/setting/Categories/CategoriesDetails";
import EditCategory from "src/Components/nutriplan-module/setting/Categories/EditCategories";

const useCategories = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ICategories | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: ICategories) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: ICategories) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: ICategories) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = CategoriesColumns(handleDetails, handleUpdate, handleDelete);

  const Modals = (
    <>
      {showAddModal && (
        <AddCategory
          label='categories.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <CategoryDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditCategory
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='categories.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"categories.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"categories.deleteContent"}
          onConfirm={() => {
            deleteCategory(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}
    </>
  );

  return {
    selectionModel,
    setSelectionModel,
    setShowAddModal,
    columns,

    Modals,
  };
};
export default useCategories;
