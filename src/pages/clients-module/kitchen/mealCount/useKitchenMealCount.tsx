/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { KitchenMealCountColumns } from "./KitchenMealCountColumns";
import { IKitchenMealCount } from "src/types/modules/clientsManagement/kitchen/mealCount";
import MealCountSticker from "src/Components/clients-module/mealCount/MealCountSticker";

function useKitchenMealCount() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [showPrintSticker, setShowPrintSticker] = useState(false);
  const [selectedSticker, setSelectedSticker] =
    useState<IKitchenMealCount | null>(null);

  const handlePrintSticker = useCallback(
    (stickerForPrint: IKitchenMealCount) => {
      setSelectedSticker(stickerForPrint);
      setShowPrintSticker(true);
    },
    []
  );
  const columns = KitchenMealCountColumns(handlePrintSticker);

  const Modals = (
    <>
      {showPrintSticker && selectedSticker && (
        <MealCountSticker
          setShowModal={setShowPrintSticker}
          showModal={showPrintSticker}
          selectedSticker={selectedSticker}
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

export default useKitchenMealCount;
