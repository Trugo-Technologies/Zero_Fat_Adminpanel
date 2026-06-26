/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { KitchenOrderedMealColumns } from "./KitchenOrderedMealColumns";

function useKitchenOrderedMeal() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const columns = KitchenOrderedMealColumns();

  return {
    selectionModel,
    setSelectionModel,
    columns,
  };
}

export default useKitchenOrderedMeal;
