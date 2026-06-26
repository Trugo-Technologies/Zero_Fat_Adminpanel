/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import {
  useDeletePlanGoalMutation,
  useUpdateActivePlanGoalMutation,
} from "./services/api";
import { IPlanGoal } from "src/types/modules/workout/planGoals";
import { PlanGoalsColumns } from "./PlanGoalsColumns";
import AddPlanGoal from "src/Components/wrokout-module/catalog/planGoals/AddPlanGoal";
import PlanGoalDetails from "src/Components/wrokout-module/catalog/planGoals/PlanGoalDetails";
import EditPlanGoal from "src/Components/wrokout-module/catalog/planGoals/EditPlanGoal";

const usePlanGoals = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IPlanGoal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deletePlanGoal, { isLoading: deleteLoading }] =
    useDeletePlanGoalMutation();
  const [activePlanGoal, { isLoading: activationLoading }] =
    useUpdateActivePlanGoalMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IPlanGoal) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IPlanGoal) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IPlanGoal) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IPlanGoal) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = PlanGoalsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddPlanGoal
          label='planGoals.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <PlanGoalDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditPlanGoal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='planGoals.edit'
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
              ? "planGoals.deActiveTitle"
              : "planGoals.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "planGoals.deActiveContent"
              : "planGoals.activeContent"
          }
          onConfirm={() => {
            activePlanGoal(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"planGoals.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"planGoals.deleteContent"}
          onConfirm={() => {
            deletePlanGoal(selectedRow?.id)
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
export default usePlanGoals;
