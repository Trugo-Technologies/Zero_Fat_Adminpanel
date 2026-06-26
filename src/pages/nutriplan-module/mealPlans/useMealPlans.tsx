/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddMealPlan from "src/Components/nutriplan-module/setting/mealPlans/AddMealPlan";
import EditMealPlan from "src/Components/nutriplan-module/setting/mealPlans/EditMealPlan";
import MealPlanDetails from "src/Components/nutriplan-module/setting/mealPlans/MealPlanDetails";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { MealPlansColumns } from "./MealPlansColumns";
import {
  useDeleteMealPlanMutation,
  useUpdateActiveMealPlansMutation,
} from "./services/api";

const useMealPlans = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMealPlans | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteMealPlan, { isLoading: deleteLoading }] =
    useDeleteMealPlanMutation();
  const [activeMealPlan, { isLoading: activationLoading }] =
    useUpdateActiveMealPlansMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = MealPlansColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddMealPlan
          label='mealPlans.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <MealPlanDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditMealPlan
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='mealPlans.edit'
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
              ? "mealPlans.deActiveTitle"
              : "mealPlans.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "mealPlans.deActiveContent"
              : "mealPlans.activeContent"
          }
          onConfirm={() => {
            activeMealPlan(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"mealPlans.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"mealPlans.deleteContent"}
          onConfirm={() => {
            deleteMealPlan(selectedRow?.id)
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
export default useMealPlans;
