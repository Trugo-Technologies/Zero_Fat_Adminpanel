/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddFaq from "src/Components/core-module/faqs/AddFaq";
import EditFaq from "src/Components/core-module/faqs/EditFaq";
import FaqDetails from "src/Components/core-module/faqs/FaqDetails";
import { IFaq } from "src/types/modules/core/faq";
import faqColumns from "./faqColumns";
import { useDeleteFaqMutation, useUpdateActiveFaqMutation } from "./services";

function useFaq() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IFaq | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [deleteFaq, { isLoading: deleteLoading }] = useDeleteFaqMutation();

  const [activeFaq, { isLoading: activationLoading }] =
    useUpdateActiveFaqMutation();

  const handleDetails = useCallback((row: IFaq) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IFaq) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IFaq) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IFaq) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = faqColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );
  const Modals = (
    <>
      {showDetailsModal && (
        <FaqDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddFaq
          label='faqs.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
        />
      )}
      {showEditModal && (
        <EditFaq
          label='faqs.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.question!,
            nameEn: selectedRow?.question!,
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"faqs.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.question}
          title={"faqs.deleteContent"}
          onConfirm={() => {
            deleteFaq(selectedRow?.id)
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
            selectedRow?.isActive ? "faqs.deActiveTitle" : "faqs.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.question}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "faqs.deActiveContent"
              : "faqs.activeContent"
          }
          onConfirm={() => {
            activeFaq(selectedRow?.id)
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

export default useFaq;
