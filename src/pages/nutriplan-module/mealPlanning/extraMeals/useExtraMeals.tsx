/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddExtraMeal from "src/Components/nutriplan-module/mealPlanning/extraMeals/AddExtraMeal";
import EditExtraMeal from "src/Components/nutriplan-module/mealPlanning/extraMeals/EditExtraMeal";
import ExtraMealDetails from "src/Components/nutriplan-module/mealPlanning/extraMeals/ExtraMealDetails";
import { IExtraMeal } from "src/types/modules/nutriplan/extras";
import { ExtraMealsColumns } from "./ExtraMealsColumns";
import { useDeleteExtraMealMutation } from "./services/api";

const useExtraMeals = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IExtraMeal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteExtraMeal, { isLoading: deleteLoading }] =
    useDeleteExtraMealMutation();

  // Handlers for modals
  const handleDetails = useCallback((row: IExtraMeal) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IExtraMeal) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IExtraMeal) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = ExtraMealsColumns(handleDetails, handleUpdate, handleDelete);

  const Modals = (
    <>
      {showAddModal && (
        <AddExtraMeal
          label='extraMeal.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <ExtraMealDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditExtraMeal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='extraMeal.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}

      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"extras.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"extras.deleteContent"}
          onConfirm={() => {
            deleteExtraMeal(selectedRow?.id)
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
export default useExtraMeals;
