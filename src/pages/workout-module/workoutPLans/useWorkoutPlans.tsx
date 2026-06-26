/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { IWorkoutPlans } from "src/types/modules/workout/workoutPlans";
import { useDeletePlanMutation, useUpdatePlanMutation } from "./services/api";
import WorkoutPlansColumns from "./workoutPlansColumns";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddPlan from "src/Components/wrokout-module/catalog/pLans/AddPlan";
import EditPlan from "src/Components/wrokout-module/catalog/pLans/EditPlan";
import PlanDetails from "src/Components/wrokout-module/catalog/pLans/PlanDetails";
import PlanSchedulesDetails from "src/Components/wrokout-module/catalog/pLans/PlanSchedulesDetails";

function useWorkoutPlans() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IWorkoutPlans | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [showPlanSchedulesDetailsModal, setShowPlanSchedulesDetailsModal] =
    useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [deletePlan, { isLoading: deleteLoading }] = useDeletePlanMutation();
  const [editPlan, { isLoading: activationLoading }] = useUpdatePlanMutation();

  const handleDetails = useCallback((row: IWorkoutPlans) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IWorkoutPlans) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IWorkoutPlans) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IWorkoutPlans) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const handlePlanSchedules = useCallback((row: IWorkoutPlans) => {
    setSelectedRow(row);
    setShowPlanSchedulesDetailsModal(true);
  }, []);
  const columns = WorkoutPlansColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    handlePlanSchedules
  );
  const Modals = (
    <>
      {showDetailsModal && (
        <PlanDetails
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
          id={selectedRow?.id as string}
        />
      )}
      {showAddModal && (
        <AddPlan
          label='workoutPlan.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}

      {showPlanSchedulesDetailsModal && (
        <PlanSchedulesDetails
          selectedRow={selectedRow!}
          setShowDetails={setShowPlanSchedulesDetailsModal}
          showDetails={showPlanSchedulesDetailsModal}
        />
      )}

      {showEditModal && (
        <EditPlan
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"workoutPlan.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"workoutPlan.deleteContent"}
          onConfirm={() => {
            deletePlan(selectedRow?.id)
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
              ? "workoutPlan.deActiveTitle"
              : "workoutPlan.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "workoutPlan.deActiveContent"
              : "workoutPlan.activeContent"
          }
          onConfirm={() => {
            editPlan({ id: selectedRow?.id, isActive: true })
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

export default useWorkoutPlans;
