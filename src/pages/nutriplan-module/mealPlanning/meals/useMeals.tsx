/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import {
  useDeleteMealMutation,
  useUpdateActiveMealMutation,
} from "./services/api";
import { MealsColumns } from "./MealsColumns";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";
import AddMeal from "src/Components/nutriplan-module/mealPlanning/meals/AddMeal";
import EditMeal from "src/Components/nutriplan-module/mealPlanning/meals/EditMeal";
import MealDetails from "src/Components/nutriplan-module/mealPlanning/meals/MealDetails";

const useMeals = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMeals | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteMeal, { isLoading: deleteLoading }] = useDeleteMealMutation();
  const [activeMeal, { isLoading: activationLoading }] =
    useUpdateActiveMealMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMeals) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IMeals) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IMeals) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IMeals) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = MealsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddMeal
          label='meals.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <MealDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditMeal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='meals.edit'
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
            selectedRow?.isActive ? "meals.deActiveTitle" : "meals.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "meals.deActiveContent"
              : "meals.activeContent"
          }
          onConfirm={() => {
            activeMeal(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"meals.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"meals.deleteContent"}
          onConfirm={() => {
            deleteMeal(selectedRow?.id)
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
export default useMeals;
