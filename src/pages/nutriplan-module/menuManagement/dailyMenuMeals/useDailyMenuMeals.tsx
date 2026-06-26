/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { DailyMenuMealsColumns } from "./DailyMenuMealsColumns";

import AddDailyMenuMeal from "src/Components/nutriplan-module/menuManagement/dailyMenuMeals/AddDailyMenuMeal";
import { IMealPlans } from "src/types/modules/nutriplan/mealPlans";
import { IMealTypes } from "src/types/modules/nutriplan/mealTypes";
import { IDailyMenuMeals } from "src/types/modules/nutriplan/menuManagement/dailyMenuMeals";
import {
  useDeleteDailyMenuMealsMutation,
  useUpdateDefaultDailyMenuMealsMutation,
} from "./services/api";
import AddDailyMenuMeals from "src/Components/nutriplan-module/menuManagement/dailyMenuMeals/AddDailyMenuMeals";
import ExportDailyMenuMeals from "src/Components/nutriplan-module/menuManagement/dailyMenuMeals/ExportDailyMenuMeals";

const useDailyMenuMeals = ({
  date,
  mealTypeId,
  mealPlanId,
  mealPlan,
  mealType,
  dates,
}: {
  date?: string;
  dates: string[];
  mealTypeId?: string;
  mealPlanId?: string;
  mealPlan?: IMealPlans;
  mealType?: IMealTypes;
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddMealsModal, setShowAddMealsModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDailyMenuMeals | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showExportMealsModal, setShowExportMealsModal] =
    useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const clearSelectionModel = useCallback(() => setSelectionModel([]), []);

  const [defaultDailyMenuMeals, { isLoading: publishLoading }] =
    useUpdateDefaultDailyMenuMealsMutation();

  const [deleteDailyMenuMeals, { isLoading: deleteLoading }] =
    useDeleteDailyMenuMealsMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IDailyMenuMeals) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const onClickMultipleExport = useCallback(() => {
    setShowExportMealsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IDailyMenuMeals) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleUpdateDefault = useCallback((row: IDailyMenuMeals) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);

  const handleDelete = useCallback((row: IDailyMenuMeals) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = DailyMenuMealsColumns(
    handleDetails,
    handleUpdate,
    handleUpdateDefault,
    handleDelete
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddDailyMenuMeal
          label='dailyMenuMeals.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          date={date!}
          mealPlanId={mealPlanId!}
          mealTypeId={mealTypeId!}
          mealPlan={mealPlan}
          mealType={mealType}
        />
      )}

      {showAddMealsModal && date && mealType && mealPlan && (
        <AddDailyMenuMeals
          label='dailyMenuMealsMulti.add'
          showAddModal={showAddMealsModal}
          setShowAddModal={setShowAddMealsModal}
          date={date}
          mealPlan={mealPlan}
          mealType={mealType}
        />
      )}
      {/*
      {showDetailsModal && (
        <MenuDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && (
        <EditMenu
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label="dailyMenuMeals.edit"
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )} */}
      {showPublishModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isDefault
              ? "dailyMenuMeals.unDefaultTitle"
              : "dailyMenuMeals.defaultTitle"
          }
          open={showPublishModal}
          setOpen={setShowPublishModal}
          itemName={selectedRow?.nameEn}
          loading={publishLoading}
          title={
            selectedRow?.isDefault
              ? "dailyMenuMeals.unDefaultContent"
              : "dailyMenuMeals.defaultContent"
          }
          onConfirm={() => {
            defaultDailyMenuMeals(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowPublishModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"dailyMenuMeals.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"dailyMenuMeals.deleteContent"}
          onConfirm={() => {
            deleteDailyMenuMeals(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}

      {showExportMealsModal &&
        selectionModel.length > 0 &&
        dates.length > 0 && (
          <ExportDailyMenuMeals
            dates={dates}
            mealIds={selectionModel as string[]}
            setShowModal={setShowExportMealsModal}
            showModal={showExportMealsModal}
            onSuccess={clearSelectionModel}
          />
        )}
    </>
  );

  return {
    selectionModel,
    setSelectionModel,
    setShowAddModal,
    columns,
    setShowAddMealsModal,
    Modals,
    onClickMultipleExport,
  };
};
export default useDailyMenuMeals;
