/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddBodyPart from "src/Components/wrokout-module/catalog/bodyparts/AddBodyPart";
import BodyPartDetails from "src/Components/wrokout-module/catalog/bodyparts/BodyPartDetails";
import EditBodyPart from "src/Components/wrokout-module/catalog/bodyparts/EditBodyPart";
import { IWorkoutBodyPart } from "src/types/modules/workout/workoutBodyParts";
import {
  useDeleteBodyPartsMutation,
  useUpdateActiveBodyPartsMutation,
} from "./services/api";
import { WorkoutBodyPartsColumns } from "./WorkoutBodyPartsColumns";

const useWorkoutBodyParts = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IWorkoutBodyPart | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteWorkoutBodyPart, { isLoading: deleteLoading }] =
    useDeleteBodyPartsMutation();
  const [activeWorkoutBodyPart, { isLoading: activationLoading }] =
    useUpdateActiveBodyPartsMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IWorkoutBodyPart) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IWorkoutBodyPart) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IWorkoutBodyPart) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IWorkoutBodyPart) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = WorkoutBodyPartsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddBodyPart
          label='workoutBodyParts.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <BodyPartDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditBodyPart
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='workoutBodyParts.edit'
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
              ? "workoutBodyParts.deActiveTitle"
              : "workoutBodyParts.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "workoutBodyParts.deActiveContent"
              : "workoutBodyParts.activeContent"
          }
          onConfirm={() => {
            activeWorkoutBodyPart(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"workoutBodyParts.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"workoutBodyParts.deleteContent"}
          onConfirm={() => {
            deleteWorkoutBodyPart(selectedRow?.id)
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
