/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import EditRecipeImage from "src/Components/nutriplan-module/mealPlanning/recipes/EditRecipeImage";
import RecipeDetails from "src/Components/nutriplan-module/mealPlanning/recipes/RecipeDetails";
import { IRecipes } from "src/types/modules/nutriplan/mealPlanning/recipes";
import { RecipesColumns } from "./RecipesColumns";
import { useDeleteRecipesMutation } from "./services/api";

const useRecipes = () => {
  const [selectedRow, setSelectedRow] = useState<IRecipes | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateImageModal, setShowUpdateImageModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const [deleteRecipes, { isLoading: deleteLoading }] =
    useDeleteRecipesMutation();
  // Handlers for modals
  // const handleDetails = useCallback((row: IIngredients) => {
  //   navigate(`/nutriplan/catalog/ingredients/details/${row.id}`)
  // }, []);

  const handleDetails = useCallback((row: IRecipes) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleDelete = useCallback((row: IRecipes) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleUpdateImage = useCallback((row: IRecipes) => {
    setSelectedRow(row);
    setShowUpdateImageModal(true);
  }, []);

  const columns = RecipesColumns(
    handleDetails,
    handleDelete,
    handleUpdateImage
  );

  const Modals = (
    <>
      {/**IngredientDetails */}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"recipes.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"recipes.deleteContent"}
          onConfirm={() => {
            deleteRecipes(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}

      {showDetailsModal && (
        <RecipeDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}

      {/* imageUpdate */}
      {showUpdateImageModal && selectedRow && (
        <EditRecipeImage
          selectedRow={selectedRow}
          setShowEditModal={setShowUpdateImageModal}
          showEditModal={showUpdateImageModal}
          label='recipes.editImage'
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
export default useRecipes;
