/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IIngredients } from "src/types/modules/nutriplan/Ingredients";
import { IngredientsColumns } from "./IngredientsColumns";
import { useDeleteIngredientsMutation } from "./services/api";
import { useNavigate } from "react-router-dom";
import IngredientDetails from "src/Components/nutriplan-module/mealPlanning/ingredients/IngredientDetails";

const useIngredients = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<IIngredients | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const [deleteIngredients, { isLoading: deleteLoading }] =
    useDeleteIngredientsMutation();
  // Handlers for modals
  // const handleDetails = useCallback((row: IIngredients) => {
  //   navigate(`/nutriplan/catalog/ingredients/details/${row.id}`)
  // }, []);

  const handleUpdate = useCallback((row: IIngredients) => {
    navigate(`/nutriplan/catalog/ingredients/${row.id}`);
  }, []);

  const handleDetails = useCallback((row: IIngredients) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleDelete = useCallback((row: IIngredients) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = IngredientsColumns(handleDetails, handleUpdate, handleDelete);

  const Modals = (
    <>
      {/**IngredientDetails */}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"ingredients.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"ingredients.deleteContent"}
          onConfirm={() => {
            deleteIngredients(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}

      {showDetailsModal && (
        <IngredientDetails
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
};
export default useIngredients;
