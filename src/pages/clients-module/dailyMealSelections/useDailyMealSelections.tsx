/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import DailyMealSelectionDetails from "src/Components/clients-module/dailyMealSelections/DailyMealSelectionDetails";
import DailyMealSelectionSticker from "src/Components/clients-module/dailyMealSelections/DailyMealSelectionSticker";
import { IMeals } from "src/types/modules/nutriplan/mealPlanning/meals";
import { DailyMealSelectionsColumns } from "./DailyMealSelectionsColumns";

export type DailyMealSelectionPrint = {
  clientName: string;
  totalCalories: string;
  totalCarbohydrates: string;
  totalFats: string;
  totalProteins: string;
  meal: IMeals;
  mealSelectionType: string;
  customeMealName: string | null;
};
function useDailyMealSelections() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [showPrintSticker, setShowPrintSticker] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [selectedSticker, setSelectedSticker] =
    useState<DailyMealSelectionPrint | null>(null);

  const handlePrintSticker = useCallback(
    (stickerForPrint: DailyMealSelectionPrint) => {
      setSelectedSticker(stickerForPrint);
      setShowPrintSticker(true);
    },
    []
  );

  const handleDetails = useCallback((row: IMeals) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const columns = DailyMealSelectionsColumns(handlePrintSticker, handleDetails);
  const Modals = (
    <>
      {showPrintSticker && selectedSticker && (
        <DailyMealSelectionSticker
          setShowModal={setShowPrintSticker}
          showModal={showPrintSticker}
          selectedSticker={selectedSticker}
        />
      )}
      {showDetailsModal && (
        <DailyMealSelectionDetails
          id={selectedRow?.id!}
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

export default useDailyMealSelections;
