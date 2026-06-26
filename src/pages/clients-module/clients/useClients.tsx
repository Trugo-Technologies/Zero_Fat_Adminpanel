/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import ClientDetails from "src/Components/clients-module/clients/ClientDetails";
import { IClient } from "src/types/modules/clientsManagement/clients";
import { ClientsColumns } from "./ClientsColumns";
import { useUpdateActiveClientsMutation } from "./services/api";

function useClients() {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IClient | null>(null);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [activeClient, { isLoading: activationLoading }] =
    useUpdateActiveClientsMutation();

  const handleDetails = useCallback((row: IClient) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IClient) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = ClientsColumns(handleDetails, handleToggleActive);
  const Modals = (
    <>
      {showDetailsModal && (
        <ClientDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}

      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "clients.deActiveTitle"
              : "clients.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.fullName}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "clients.deActiveContent"
              : "clients.activeContent"
          }
          onConfirm={() => {
            activeClient(selectedRow?.id)
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
    columns,
    Modals,
  };
}

export default useClients;
