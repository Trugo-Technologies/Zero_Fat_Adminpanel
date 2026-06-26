/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddWorkout from "src/Components/wrokout-module/catalog/workouts/AddWorkout";
import EditWorkout from "src/Components/wrokout-module/catalog/workouts/EditWorkout";
import WorkoutDetails from "src/Components/wrokout-module/catalog/workouts/WorkoutDetails";
import WorkoutExercisesDetails from "src/Components/wrokout-module/catalog/workouts/WorkoutExercisesDetails";
import { IWorkout } from "src/types/modules/workout/workouts";
import {
  useDeleteWorkoutMutation,
  useUpdateActiveWorkoutMutation,
  useUpdateToggleTopWorkoutMutation,
  useUpdateToggleWorkoutOfTheDayMutation,
} from "./services/api";
import { WorkoutColumns } from "./WorkoutColumns";

const useWorkouts = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const [showToggleTopModal, setShowToggleTopModal] = useState<boolean>(false);
  const [showToggleWorkoutOfTheDayModal, setShowToggleWorkoutOfTheDayModal] =
    useState<boolean>(false);

  const [
    showWorkoutExercisesDetailsModal,
    setShowWorkoutExercisesDetailsModal,
  ] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<IWorkout | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteWorkout, { isLoading: deleteLoading }] =
    useDeleteWorkoutMutation();
  const [activeWorkout, { isLoading: activationLoading }] =
    useUpdateActiveWorkoutMutation();

  const [toggleTopWorkout, { isLoading: toggleTopLoading }] =
    useUpdateToggleTopWorkoutMutation();

  const [toggleWorkoutOfTheDay, { isLoading: toggleWorkoutOfTheDayLoading }] =
    useUpdateToggleWorkoutOfTheDayMutation();

  // Handlers for modals
  const handleDetails = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleToggleTop = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowToggleTopModal(true);
  }, []);

  const handleToggleWorkoutOfTheDay = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowToggleWorkoutOfTheDayModal(true);
  }, []);

  const handleWorkoutExercise = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowWorkoutExercisesDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IWorkout) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = WorkoutColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    handleToggleTop,
    handleToggleWorkoutOfTheDay,
    handleWorkoutExercise
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddWorkout
          label='workouts.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <WorkoutDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showWorkoutExercisesDetailsModal && (
        <WorkoutExercisesDetails
          selectedRow={selectedRow!}
          setShowDetails={setShowWorkoutExercisesDetailsModal}
          showDetails={showWorkoutExercisesDetailsModal}
        />
      )}

      {showEditModal && (
        <EditWorkout
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='workouts.edit'
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
              ? "workouts.deActiveTitle"
              : "workouts.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "workouts.deActiveContent"
              : "workouts.activeContent"
          }
          onConfirm={() => {
            activeWorkout(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}

      {/* {showToggleTopModal && (
        <AppConfirmModal
          dialogTitle={selectedRow?.isTop ? 'workouts.isNotTopTitle' : 'workouts.isTopTitle'}
          open={showToggleTopModal}
          setOpen={setShowToggleTopModal}
          itemName={getValueBasedOnCurrentLanguage(selectedRow?.nameAr!, selectedRow?.nameEn!)}
          loading={toggleTopLoading}
          title={selectedRow?.isTop ? 'workouts.isNotTopContent' : 'workouts.isTopContent'}
          onConfirm={() => {
            toggleTopWorkout(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowToggleTopModal(false);
              });
          }}
        />
      )} */}

      {/* {showToggleWorkoutOfTheDayModal && (
        <AppConfirmModal
          dialogTitle={selectedRow?.isWorkoutOfTheDay ? 'workouts.isNotWorkoutOfTheDayTitle' : 'workouts.isWorkoutOfTheDayTitle'}
          open={showToggleWorkoutOfTheDayModal}
          setOpen={setShowToggleWorkoutOfTheDayModal}
          itemName={getValueBasedOnCurrentLanguage(selectedRow?.nameAr!, selectedRow?.nameEn!)}
          loading={toggleWorkoutOfTheDayLoading}
          title={selectedRow?.isWorkoutOfTheDay ? 'workouts.isNotWorkoutOfTheDayContent' : 'workouts.isWorkoutOfTheDayContent'}
          onConfirm={() => {
            toggleWorkoutOfTheDay(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowToggleWorkoutOfTheDayModal(false);
              });
          }}
        />
      )} */}

      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"workouts.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"workouts.deleteContent"}
          onConfirm={() => {
            deleteWorkout(selectedRow?.id)
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
export default useWorkouts;
