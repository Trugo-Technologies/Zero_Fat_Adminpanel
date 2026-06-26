import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import PaymentDetails from "src/Components/clients-module/payments/PaymentDetails";
import { IPayments } from "src/types/modules/clientsManagement/payments";
import { PaymentsColumns } from "./PaymentsColumns";

function usePayments() {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IPayments | null>(null);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const handleDetails = useCallback((row: IPayments) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const columns = PaymentsColumns(handleDetails);
  const Modals = (
    <>
      {showDetailsModal && (
        <PaymentDetails
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

export default usePayments;
