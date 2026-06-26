/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import {
  useActiveTrainerMutation,
  useDeleteTrainerMutation,
} from "./services/api";
import { ITrainer } from "src/types/modules/training/trainers";
import { TrainerColumns } from "./TrainerColumns";
import AddTrainer from "src/Components/wrokout-module/training/trainer/AddTrainer";
import EditTrainer from "src/Components/wrokout-module/training/trainer/EditTrainer";
import TrainerDetails from "src/Components/wrokout-module/training/trainer/TrainerDetails";

const useTrainers = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ITrainer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteTrainerType, { isLoading: deleteLoading }] =
    useDeleteTrainerMutation();
  const [activeTrainerType, { isLoading: activationLoading }] =
    useActiveTrainerMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: ITrainer) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: ITrainer) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: ITrainer) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: ITrainer) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = TrainerColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddTrainer
          label='trains.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <TrainerDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditTrainer
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='trains.edit'
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
              ? "trains.deActiveTitle"
              : "trains.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.nameEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "trains.deActiveContent"
              : "trains.activeContent"
          }
          onConfirm={() => {
            activeTrainerType(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"trains.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"trains.deleteContent"}
          onConfirm={() => {
            deleteTrainerType(selectedRow?.id)
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
export default useTrainers;
