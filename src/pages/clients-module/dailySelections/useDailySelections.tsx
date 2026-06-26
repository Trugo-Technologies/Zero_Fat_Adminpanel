/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { DailySelectionsColumns } from "./DailySelectionsColumns";
import { IDailySelections } from "src/types/modules/clientsManagement/dailySelections";
import DailySelectionsDetails from "src/Components/clients-module/dailySelections/DailySelectionsDetails";
import DailySelectionsLocation from "src/Components/clients-module/dailySelections/DailySelectionsLocation";

function useDailySelections() {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<IDailySelections | null>(null);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const handleDetails = useCallback((row: IDailySelections) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleLocation = useCallback((row: IDailySelections) => {
    setSelectedRow(row);
    setShowLocationModal(true);
  }, []);

  const Modals = (
    <>
      {showDetailsModal && (
        <DailySelectionsDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}

      {showLocationModal && selectedRow && (
        <DailySelectionsLocation
          clientLocation={selectedRow.clientLocation}
          name={selectedRow?.client?.fullName || ""}
          setShowModal={setShowLocationModal}
          showModal={showLocationModal}
        />
      )}
    </>
  );

  const columns = DailySelectionsColumns(handleDetails, handleLocation);

  return {
    selectionModel,
    setSelectionModel,
    columns,
    Modals,
  };
}

export default useDailySelections;
