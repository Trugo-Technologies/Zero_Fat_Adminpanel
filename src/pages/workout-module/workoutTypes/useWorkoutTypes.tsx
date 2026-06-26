/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IWorkoutType } from "src/types/modules/workout/workoutTypes";
import { WorkoutTypeColumns } from "./WorkoutTypeColumns";
import {
  useDeleteWorkoutTypesMutation,
  useUpdateActiveWorkoutTypesMutation,
} from "./services/api";
import AddWorkoutType from "src/Components/wrokout-module/catalog/workoutTypes/AddWorkoutType";
import EditWorkoutType from "src/Components/wrokout-module/catalog/workoutTypes/EditWorkoutType";
import WorkoutTypeDetails from "src/Components/wrokout-module/catalog/workoutTypes/WorkoutTypeDetails";

const useWorkoutTypes = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IWorkoutType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteWorkoutType, { isLoading: deleteLoading }] =
    useDeleteWorkoutTypesMutation();
  const [activeWorkoutType, { isLoading: activationLoading }] =
    useUpdateActiveWorkoutTypesMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IWorkoutType) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IWorkoutType) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IWorkoutType) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IWorkoutType) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = WorkoutTypeColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddWorkoutType
          label='workoutTypes.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <WorkoutTypeDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditWorkoutType
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='workoutTypes.edit'
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
              ? "workoutTypes.deActiveTitle"
              : "workoutTypes.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "workoutTypes.deActiveContent"
              : "workoutTypes.activeContent"
          }
          onConfirm={() => {
            activeWorkoutType(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"workoutTypes.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"workoutTypes.deleteContent"}
          onConfirm={() => {
            deleteWorkoutType(selectedRow?.id)
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
export default useWorkoutTypes;
