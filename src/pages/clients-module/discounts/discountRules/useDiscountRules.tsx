/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddDiscountRule from "src/Components/clients-module/discounts/discountRules/AddDiscountRule";
import DiscountRuleDetails from "src/Components/clients-module/discounts/discountRules/DiscountRuleDetails";
import EditDiscountRule from "src/Components/clients-module/discounts/discountRules/EditDiscountRule";
import { IDiscountRule } from "src/types/modules/clientsManagement/discounts/discountRules";
import discountRulesColumns from "./DiscountRulesColumns";
import {
  useDeleteDiscountRuleMutation,
  usePublishDiscountRuleMutation,
  useUpdateActiveDiscountRuleMutation,
} from "./services/api";

function useDiscountRules() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDiscountRule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [activeDiscountRule, { isLoading: activationLoading }] =
    useUpdateActiveDiscountRuleMutation();

  const [deleteDiscountRule, { isLoading: deleteLoading }] =
    useDeleteDiscountRuleMutation();

  const [publishDiscountRule, { isLoading: publishLoading }] =
    usePublishDiscountRuleMutation();
  const handleDetails = useCallback((row: IDiscountRule) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IDiscountRule) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IDiscountRule) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IDiscountRule) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const handlePublish = useCallback((row: IDiscountRule) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);
  const columns = discountRulesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    handlePublish
  );
  const Modals = (
    <>
      {showDetailsModal && selectedRow && (
        <DiscountRuleDetails
          id={selectedRow.id}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddDiscountRule
          label='discountRules.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditDiscountRule
          label='discountRules.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: "",
            nameEn: "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"discountRules.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={""}
          title={"discountRules.deleteContent"}
          onConfirm={() => {
            deleteDiscountRule(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}

      {showPublishModal && (
        <AppConfirmModal
          dialogTitle={"discountRules.publishTitle"}
          open={showPublishModal}
          setOpen={setShowPublishModal}
          loading={publishLoading}
          itemName={""}
          title={"discountRules.publishContent"}
          onConfirm={() => {
            publishDiscountRule(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowPublishModal(false);
              });
          }}
        />
      )}
      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "discountRules.deActiveTitle"
              : "discountRules.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={""}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "discountRules.deActiveContent"
              : "discountRules.activeContent"
          }
          onConfirm={() => {
            activeDiscountRule(selectedRow?.id)
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

export default useDiscountRules;
