/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddEquipment from "src/Components/wrokout-module/catalog/equipments/AddEquipment";
import EditEquipment from "src/Components/wrokout-module/catalog/equipments/EditEquipment";
import EquipmentDetails from "src/Components/wrokout-module/catalog/equipments/EquipmentDetails";
import { IEquipment } from "src/types/modules/workout/equipments";
import { EquipmentsColumns } from "./EquipmentsColumns";
import {
  useActiveEquipmentMutation,
  useDeleteEquipmentMutation,
} from "./services/api";

const useEquipments = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IEquipment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteEquipment, { isLoading: deleteLoading }] =
    useDeleteEquipmentMutation();
  const [activeEquipment, { isLoading: activationLoading }] =
    useActiveEquipmentMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IEquipment) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IEquipment) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IEquipment) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IEquipment) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = EquipmentsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddEquipment
          label='equipments.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <EquipmentDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditEquipment
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='equipments.edit'
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
              ? "equipments.deActiveTitle"
              : "equipments.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "equipments.deActiveContent"
              : "equipments.activeContent"
          }
          onConfirm={() => {
            activeEquipment(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"equipments.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"equipments.deleteContent"}
          onConfirm={() => {
            deleteEquipment(selectedRow?.id)
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
export default useEquipments;
