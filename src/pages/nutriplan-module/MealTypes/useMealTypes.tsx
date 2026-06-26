/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import {
  useDeleteMealTypeMutation,
  useUpdateActiveMealTypeMutation,
} from "./services/api";
import { MealTypesColumns } from "./MealTypesColumns";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import AddMealType from "src/Components/nutriplan-module/setting/MealTypes/AddMealType";
import MealTypeDetails from "src/Components/nutriplan-module/setting/MealTypes/MealTypeDetails";
import EditMealType from "src/Components/nutriplan-module/setting/MealTypes/EditMealType";

const useWorkoutBodyParts = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMealTypes | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteMealType, { isLoading: deleteLoading }] =
    useDeleteMealTypeMutation();
  const [activeMealType, { isLoading: activationLoading }] =
    useUpdateActiveMealTypeMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMealTypes) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IMealTypes) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IMealTypes) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IMealTypes) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = MealTypesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddMealType
          label='mealTypes.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <MealTypeDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditMealType
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='mealTypes.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "mealTypes.deActiveTitle"
              : "mealTypes.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "mealTypes.deActiveContent"
              : "mealTypes.activeContent"
          }
          onConfirm={() => {
            activeMealType(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"mealTypes.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"mealTypes.deleteContent"}
          onConfirm={() => {
            deleteMealType(selectedRow?.id)
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
export default useWorkoutBodyParts;
