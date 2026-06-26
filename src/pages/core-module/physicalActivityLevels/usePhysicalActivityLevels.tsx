/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddPhysicalActivityLevel from "src/Components/core-module/physicalActivityLevels/AddPhysicalActivityLevel";
import EditPhysicalActivityLevel from "src/Components/core-module/physicalActivityLevels/EditPhysicalActivityLevel";
import PhysicalActivityLevelDetails from "src/Components/core-module/physicalActivityLevels/PhysicalActivityLevelDetails";
import { IPhysicalActivityLevels } from "src/types/modules/core/physicalActivityLevels";
import physicalActivityLevelsColumns from "./physicalActivityLevelsColumns";
import {
  useDeletePhysicalActivityLevelsMutation,
  useUpdateActivePhysicalActivityLevelMutation,
} from "./services";

function usePhysicalActivityLevels() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] =
    useState<IPhysicalActivityLevels | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deletePhysicalActivityLevels, { isLoading: deleteLoading }] =
    useDeletePhysicalActivityLevelsMutation();
  const [activePhysicalActivityLevel, { isLoading: activationLoading }] =
    useUpdateActivePhysicalActivityLevelMutation();

  const handleDetails = useCallback((row: IPhysicalActivityLevels) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IPhysicalActivityLevels) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IPhysicalActivityLevels) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IPhysicalActivityLevels) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = physicalActivityLevelsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );
  const Modals = (
    <>
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"physicalActivityLevels.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.exampleEn}
          title={"physicalActivityLevels.deleteContent"}
          onConfirm={() => {
            deletePhysicalActivityLevels(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}
      {showDetailsModal && (
        <PhysicalActivityLevelDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddPhysicalActivityLevel
          label='physicalActivityLevels.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
        />
      )}

      {showEditModal && (
        <EditPhysicalActivityLevel
          label='physicalActivityLevels.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.exampleAr || "",
            nameEn: selectedRow?.exampleEn || "",
          }}
        />
      )}
      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "physicalActivityLevels.deActiveTitle"
              : "physicalActivityLevels.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.exampleEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "physicalActivityLevels.deActiveContent"
              : "physicalActivityLevels.activeContent"
          }
          onConfirm={() => {
            activePhysicalActivityLevel(selectedRow?.id)
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

export default usePhysicalActivityLevels;
