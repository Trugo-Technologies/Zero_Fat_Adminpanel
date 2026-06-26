/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddFaqCategory from "src/Components/core-module/faqCategories/AddFaqCategory";
import EditFaqCategory from "src/Components/core-module/faqCategories/EditFaqCategory";
import FaqCategoryDetails from "src/Components/core-module/faqCategories/FaqCategoryDetails";
import { IFaqCategories } from "src/types/modules/core/faqCategories";
import faqCategoriesColumns from "./faqCategoriesColumns";
import {
  useDeleteFaqCategoryMutation,
  useUpdateActiveFaqCategoriesMutation,
} from "./services";

function useFaqCategories() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IFaqCategories | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [deleteFaqCategories, { isLoading: deleteLoading }] =
    useDeleteFaqCategoryMutation();

  const [activeFaqCategories, { isLoading: activationLoading }] =
    useUpdateActiveFaqCategoriesMutation();

  const handleDetails = useCallback((row: IFaqCategories) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IFaqCategories) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IFaqCategories) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IFaqCategories) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = faqCategoriesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );
  const Modals = (
    <>
      {showAddModal && (
        <>
          <AddFaqCategory
            label='faqCategories.add'
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
          />
        </>
      )}
      {showEditModal && (
        <>
          <EditFaqCategory
            label='faqCategories.edit'
            setShowEditModal={setShowEditModal}
            showEditModal={showEditModal}
            selectedRow={{
              id: selectedRow?.id || "",
              nameAr: selectedRow?.nameAr || "",
              nameEn: selectedRow?.nameEn || "",
            }}
          />
        </>
      )}

      {showDetailsModal && (
        <FaqCategoryDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"faqCategories.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"faqCategories.deleteContent"}
          onConfirm={() => {
            deleteFaqCategories(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}
      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "faqCategories.deActiveTitle"
              : "faqCategories.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "faqCategories.deActiveContent"
              : "faqCategories.activeContent"
          }
          onConfirm={() => {
            activeFaqCategories(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
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
}

export default useFaqCategories;
