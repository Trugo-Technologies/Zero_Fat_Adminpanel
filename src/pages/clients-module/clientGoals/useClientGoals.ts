/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { ClientGoalsColumns } from "./ClientGoalsColumns";

function useClientGoals() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const columns = ClientGoalsColumns();

  return {
    selectionModel,
    setSelectionModel,
    columns,
  };
}

export default useClientGoals;
