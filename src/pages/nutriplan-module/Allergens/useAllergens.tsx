/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IAllergens } from "src/types/modules/nutriplan/allergens";
import { AllergensColumns } from "./AllergensColumns";
import AddAllergen from "src/Components/nutriplan-module/setting/Allergens/AddAllergen";
import AllergenDetails from "src/Components/nutriplan-module/setting/Allergens/AllergenDetails";
import EditAllergen from "src/Components/nutriplan-module/setting/Allergens/EditAllergent";
import {
  useDeleteAllergensMutation,
  useUpdateActiveAllergensMutation,
} from "./services/api";

const useAllergens = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IAllergens | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteAllergens, { isLoading: deleteLoading }] =
    useDeleteAllergensMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IAllergens) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IAllergens) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IAllergens) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = AllergensColumns(handleDetails, handleUpdate, handleDelete);

  const Modals = (
    <>
      {showAddModal && (
        <AddAllergen
          label='allergens.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <AllergenDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditAllergen
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='allergens.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"allergens.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"allergens.deleteContent"}
          onConfirm={() => {
            deleteAllergens(selectedRow?.id)
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
export default useAllergens;
