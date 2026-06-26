/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { ClientSubscriptionsColumns } from "./ClientSubscriptionsColumns";
import { IClientSubscriptions } from "src/types/modules/clientsManagement/clientSubscriptions";
import ClientSubscriptionDetails from "src/Components/clients-module/clientSubscriptions/ClientSubscriptionDetails";

function useClientSubscriptions() {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IClientSubscriptions | null>(
    null
  );

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const handleDetails = useCallback((row: IClientSubscriptions) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const columns = ClientSubscriptionsColumns(handleDetails);
  const Modals = (
    <>
      {showDetailsModal && (
        <ClientSubscriptionDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
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

export default useClientSubscriptions;
