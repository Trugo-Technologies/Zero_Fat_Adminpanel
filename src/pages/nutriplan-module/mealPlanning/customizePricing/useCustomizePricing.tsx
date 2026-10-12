/** @format */

import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddCustomizePricing from "src/Components/nutriplan-module/mealPlanning/customizePricing/AddCustomizePricing";
import CustomizePricingDetails from "src/Components/nutriplan-module/mealPlanning/customizePricing/CustomizePricingDetails";
import EditCustomizePricing from "src/Components/nutriplan-module/mealPlanning/customizePricing/EditCustomizePricing";
import { ICustomizePricingTier } from "src/types/modules/nutriplan/customizePricing";
import customizePricingColumns from "./CustomizePricingColumns";
import {
  useDeleteCustomizePricingMutation,
  useUpdateCustomizePricingMutation,
} from "./services/api";

function useCustomizePricing() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ICustomizePricingTier | null>(null);

  const [deleteCustomizePricing, { isLoading: deleteLoading }] =
    useDeleteCustomizePricingMutation();
  const [updateCustomizePricing, { isLoading: updateLoading }] =
    useUpdateCustomizePricingMutation();

  const handleDetails = useCallback((row: ICustomizePricingTier) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: ICustomizePricingTier) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: ICustomizePricingTier) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: ICustomizePricingTier) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = customizePricingColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const itemLabel = selectedRow
    ? `${selectedRow.macroType} ${selectedRow.fromGrams}-${selectedRow.toGrams}g`
    : "";

  const Modals = (
    <>
      {showDetailsModal && selectedRow && (
        <CustomizePricingDetails
          item={selectedRow}
          showDetails={showDetailsModal}
          setShowDetails={setShowDetailsModal}
        />
      )}
      {showAddModal && (
        <AddCustomizePricing
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditCustomizePricing
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedRow={selectedRow}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='customizePricing.deleteTitle'
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={itemLabel}
          title='customizePricing.deleteContent'
          onConfirm={() => {
            deleteCustomizePricing(selectedRow.id)
              .unwrap()
              .then(() => setShowDeleteModal(false));
          }}
        />
      )}
      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow.isActive
              ? "customizePricing.deActiveTitle"
              : "customizePricing.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={itemLabel}
          loading={updateLoading}
          title={
            selectedRow.isActive
              ? "customizePricing.deActiveContent"
              : "customizePricing.activeContent"
          }
          onConfirm={() => {
            updateCustomizePricing({
              id: selectedRow.id,
              data: {
                id: selectedRow.id,
                macro: selectedRow.macro,
                fromGrams: selectedRow.fromGrams,
                toGrams: selectedRow.toGrams,
                price: selectedRow.price,
                mealPlanId: selectedRow.mealPlanId,
                mealTypeId: selectedRow.mealTypeId,
                isActive: !selectedRow.isActive,
              },
            })
              .unwrap()
              .then(() => setShowActivationModal(false));
          }}
        />
      )}
    </>
  );

  return {
    columns,
    Modals,
    setShowAddModal,
  };
}

export default useCustomizePricing;
