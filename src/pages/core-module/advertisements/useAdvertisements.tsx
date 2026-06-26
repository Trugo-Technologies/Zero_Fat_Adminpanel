/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddAdvertisement from "src/Components/core-module/advertisements/AddAdvertisement";
import AdvertisementDetails from "src/Components/core-module/advertisements/AdvertisementDetails";
import EditAdvertisement from "src/Components/core-module/advertisements/EditAdvertisement";
import { IAdvertisements } from "src/types/modules/core/advertisements";
import advertisementsColumns from "./advertisementsColumns";
import {
  useDeleteAdvertisementsMutation,
  useUpdateActiveAdvertisementsMutation,
} from "./services";

function useAdvertisements() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IAdvertisements | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [activeAdvertisement, { isLoading: activationLoading }] =
    useUpdateActiveAdvertisementsMutation();

  const [deleteAdvertisement, { isLoading: deleteLoading }] =
    useDeleteAdvertisementsMutation();
  const handleDetails = useCallback((row: IAdvertisements) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IAdvertisements) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IAdvertisements) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IAdvertisements) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = advertisementsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );
  const Modals = (
    <>
      {showDetailsModal && (
        <AdvertisementDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddAdvertisement
          label='advertisements.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
        />
      )}
      {showEditModal && (
        <EditAdvertisement
          label='advertisements.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.titleAr || "",
            nameEn: selectedRow?.titleEn || "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"advertisements.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.titleEn}
          title={"advertisements.deleteContent"}
          onConfirm={() => {
            deleteAdvertisement(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}
      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "advertisements.deActiveTitle"
              : "advertisements.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.titleEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "advertisements.deActiveContent"
              : "advertisements.activeContent"
          }
          onConfirm={() => {
            activeAdvertisement(selectedRow?.id)
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

export default useAdvertisements;
