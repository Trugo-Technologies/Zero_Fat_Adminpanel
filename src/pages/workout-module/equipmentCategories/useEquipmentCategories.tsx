/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddEquipmentCategory from "src/Components/wrokout-module/catalog/equipmentCategories/AddEquipmentCategory";
import EditEquipmentCategory from "src/Components/wrokout-module/catalog/equipmentCategories/EditEquipmentCategory";
import EquipmentCategoryDetails from "src/Components/wrokout-module/catalog/equipmentCategories/EquipmentCategoryDetails";
import { IEquipmentCategory } from "src/types/modules/workout/equipmentCategories";
import { EquipmentCategoriesColumns } from "./EquipmentCategoriesColumns";
import {
  useActiveEquipmentCategoryMutation,
  useDeleteEquipmentCategoryMutation,
} from "./services/api";

const useEquipmentCategories = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IEquipmentCategory | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteEquipmentCategory, { isLoading: deleteLoading }] =
    useDeleteEquipmentCategoryMutation();
  const [activeEquipmentCategory, { isLoading: activationLoading }] =
    useActiveEquipmentCategoryMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IEquipmentCategory) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IEquipmentCategory) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IEquipmentCategory) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IEquipmentCategory) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = EquipmentCategoriesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddEquipmentCategory
          label='equipmentCategories.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <EquipmentCategoryDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditEquipmentCategory
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='equipmentCategories.edit'
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
              ? "equipmentCategories.deActiveTitle"
              : "equipmentCategories.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "equipmentCategories.deActiveContent"
              : "equipmentCategories.activeContent"
          }
          onConfirm={() => {
            activeEquipmentCategory(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"equipmentCategories.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"equipmentCategories.deleteContent"}
          onConfirm={() => {
            deleteEquipmentCategory(selectedRow?.id)
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
export default useEquipmentCategories;
