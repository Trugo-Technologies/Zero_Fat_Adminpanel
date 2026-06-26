/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { ClientLoyaltyPointsColumns } from "./ClientLoyaltyPointsColumns";

function useClientLoyaltyPoints() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const columns = ClientLoyaltyPointsColumns();

  return {
    selectionModel,
    setSelectionModel,
    columns,
  };
}

export default useClientLoyaltyPoints;
