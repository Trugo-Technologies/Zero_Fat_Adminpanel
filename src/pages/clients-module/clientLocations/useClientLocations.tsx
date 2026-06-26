/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { ClientLocationsColumns } from "./ClientLocationsColumns";
import { useDeleteClientLocationMutation } from "./services/api";
import { IClientLocations } from "src/types/modules/clientsManagement/clientLocations";
import AddClientLocation from "src/Components/clients-module/clientLocations/AddClientLocation";
import ClientLocationDetails from "src/Components/clients-module/clientLocations/ClientLocationDetails";
import EditClientLocation from "src/Components/clients-module/clientLocations/EditClientLocation";
import { IClient } from "src/types/modules/clientsManagement/clients";
import { useParams } from "react-router-dom";

const useClientLocations = ({}: { clientItem: IClient }) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IClientLocations | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const { clientIdParams } = useParams();

  const [deleteClientLocation, { isLoading: deleteLoading }] =
    useDeleteClientLocationMutation();

  // Handlers for modals
  const handleDetails = useCallback((row: IClientLocations) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IClientLocations) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IClientLocations) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = ClientLocationsColumns(
    handleDetails,
    handleUpdate,
    handleDelete
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddClientLocation
          label='clientLocations.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          clientId={clientIdParams!}
        />
      )}
      {showDetailsModal && (
        <ClientLocationDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditClientLocation
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='clientLocations.edit'
          clientId={clientIdParams!}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: "",
            nameEn: "",
          }}
        />
      )}

      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"clientLocations.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={""}
          title={"clientLocations.deleteContent"}
          onConfirm={() => {
            deleteClientLocation(selectedRow?.id)
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
export default useClientLocations;
