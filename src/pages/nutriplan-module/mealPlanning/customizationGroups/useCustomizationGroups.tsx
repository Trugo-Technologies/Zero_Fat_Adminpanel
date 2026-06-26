/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { useDeleteCustomizationGroupMutation } from "./services/api";
import { CustomizationGroupsColumns } from "./CustomizationGroupsColumns";
import { ICustomizationGroup } from "src/types/modules/nutriplan/mealPlanning/customizationGroups";
import CustomizationGroupsDetails from "src/Components/nutriplan-module/mealPlanning/customizationGroups/CustomizationGroupsDetails";
import AddCustomizationGroup from "src/Components/nutriplan-module/mealPlanning/customizationGroups/AddCustomizationGroup";
import EditCustomizationGroup from "src/Components/nutriplan-module/mealPlanning/customizationGroups/EditCustomizationGroup";

const useCustomizationGroups = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ICustomizationGroup | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteCustomizationGroup, { isLoading: deleteLoading }] =
    useDeleteCustomizationGroupMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: ICustomizationGroup) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: ICustomizationGroup) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: ICustomizationGroup) => {
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
        <AddCustomizationGroup
          label='customizationGroups.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && selectedRow && (
        <CustomizationGroupsDetails
          id={selectedRow.id}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditCustomizationGroup
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          label='customizationGroups.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={"customizationGroups.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow.nameEn}
          title={"customizationGroups.deleteContent"}
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
export default useCustomizationGroups;
