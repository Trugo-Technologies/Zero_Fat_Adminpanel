/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddCustomizationOptions from "src/Components/nutriplan-module/mealPlanning/customizationOptions/AddCustomizationOptions";
import CustomizationOptionsDetails from "src/Components/nutriplan-module/mealPlanning/customizationOptions/CustomizationOptionsDetails";
import EditCustomizationOptions from "src/Components/nutriplan-module/mealPlanning/customizationOptions/EditCustomizationOptions";
import { ICustomizationOption } from "src/types/modules/nutriplan/mealPlanning/customizationOptions";
import { CustomizationGroupsColumns } from "./CustomizationOptionsColumns";
import { useDeleteCustomizationOptionMutation } from "./services/api";

const useCustomizationOptions = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ICustomizationOption | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteCustomizationGroup, { isLoading: deleteLoading }] =
    useDeleteCustomizationOptionMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: ICustomizationOption) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: ICustomizationOption) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: ICustomizationOption) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = CustomizationGroupsColumns(
    handleDetails,
    handleUpdate,
    handleDelete
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddCustomizationOptions
          label='customizationOptions.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && selectedRow && (
        <CustomizationOptionsDetails
          id={selectedRow.id}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditCustomizationOptions
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='customizationOptions.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={"customizationOptions.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow.nameEn}
          title={"customizationOptions.deleteContent"}
          onConfirm={() => {
            deleteCustomizationGroup(selectedRow.id)
              .unwrap()
              .then(() => setShowDeleteModal(false));
          }}
        />
      )}
    </>
  );

  return {
    selectionModel,
    setSelectionModel,
    setShowAddModal,
    columns,

    Modals,
  };
};
export default useCustomizationOptions;
