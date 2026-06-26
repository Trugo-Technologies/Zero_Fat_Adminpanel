/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddExercise from "src/Components/wrokout-module/training/exercises/AddExercise";
import EditExercise from "src/Components/wrokout-module/training/exercises/EditExercise";
import ExerciseDetails from "src/Components/wrokout-module/training/exercises/ExerciseDetails";
import { IExercise } from "src/types/modules/training/exercises";
import { ExercisesColumns } from "./ExercisesColumns";
import {
  useActiveExerciseMutation,
  useDeleteExerciseMutation,
} from "./services/api";

const useExercises = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IExercise | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteExerciseType, { isLoading: deleteLoading }] =
    useDeleteExerciseMutation();
  const [activeExerciseType, { isLoading: activationLoading }] =
    useActiveExerciseMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IExercise) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IExercise) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IExercise) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IExercise) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = ExercisesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddExercise
          label='exercises.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <ExerciseDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditExercise
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='exercises.edit'
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
              ? "exercises.deActiveTitle"
              : "exercises.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "exercises.deActiveContent"
              : "exercises.activeContent"
          }
          onConfirm={() => {
            activeExerciseType(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"exercises.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"exercises.deleteContent"}
          onConfirm={() => {
            deleteExerciseType(selectedRow?.id)
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
export default useExercises;
