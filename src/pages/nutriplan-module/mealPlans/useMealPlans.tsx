/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddCustomizeMealPlan from "src/Components/nutriplan-module/setting/mealPlans/AddCustomizeMealPlan";
import AddMealPlan from "src/Components/nutriplan-module/setting/mealPlans/AddMealPlan";
import EditCustomizeMealPlan from "src/Components/nutriplan-module/setting/mealPlans/EditCustomizeMealPlan";
import EditMealPlan from "src/Components/nutriplan-module/setting/mealPlans/EditMealPlan";
import MealPlanDetails from "src/Components/nutriplan-module/setting/mealPlans/MealPlanDetails";
import {
  IMealPlans,
  isCustomizeMealPlanRow,
} from "src/types/modules/nutriplan/mealPlans";
import { MealPlansColumns } from "./MealPlansColumns";
import {
  useDeleteMealPlanMutation,
  useUpdateActiveMealPlansMutation,
} from "./services/api";

const useMealPlans = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddCustomizeModal, setShowAddCustomizeModal] = useState(false);
  const [showEditCustomizeModal, setShowEditCustomizeModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IMealPlans | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteMealPlan, { isLoading: deleteLoading }] =
    useDeleteMealPlanMutation();
  const [activeMealPlan, { isLoading: activationLoading }] =
    useUpdateActiveMealPlansMutation();

  /** True when list currently holds a customize plan (caller can pass from page). */
  const openCustomizeModal = useCallback((existing?: IMealPlans | null) => {
    if (existing && isCustomizeMealPlanRow(existing)) {
      setSelectedRow(existing);
      setShowEditCustomizeModal(true);
      return;
    }
    setShowAddCustomizeModal(true);
  }, []);

  /** AppFilters second button expects a setState-like handler */
  const setShowCustomizeModal = useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === "function" ? value(false) : value;
      if (next) {
        // Prefer editing existing customize row if already selected; else add
        if (selectedRow && isCustomizeMealPlanRow(selectedRow)) {
          setShowEditCustomizeModal(true);
        } else {
          setShowAddCustomizeModal(true);
        }
      } else {
        setShowAddCustomizeModal(false);
        setShowEditCustomizeModal(false);
      }
    },
    [selectedRow]
  );

  const handleDetails = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IMealPlans) => {
    setSelectedRow(row);
    if (isCustomizeMealPlanRow(row)) {
      setShowEditCustomizeModal(true);
      return;
    }
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
      {showAddCustomizeModal && (
        <AddCustomizeMealPlan
          showAddModal={showAddCustomizeModal}
          setShowAddModal={setShowAddCustomizeModal}
        />
      )}
      {showEditCustomizeModal && selectedRow && isCustomizeMealPlanRow(selectedRow) && (
        <EditCustomizeMealPlan
          showEditModal={showEditCustomizeModal}
          setShowEditModal={setShowEditCustomizeModal}
          plan={selectedRow}
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
    setShowCustomizeModal,
    openCustomizeModal,
    columns,
    Modals,
  };
};

export default useMealPlans;
