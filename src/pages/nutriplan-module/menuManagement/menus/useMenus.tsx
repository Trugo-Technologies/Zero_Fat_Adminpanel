/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddMenu from "src/Components/nutriplan-module/menuManagement/menus/AddMenu";
import CopyMenu from "src/Components/nutriplan-module/menuManagement/menus/CopyMenu";
import EditMenu from "src/Components/nutriplan-module/menuManagement/menus/EditMenu";
import MenuDetails from "src/Components/nutriplan-module/menuManagement/menus/MenuDetails";
import { IMenus } from "src/types/modules/nutriplan/menuManagement/menus";
import { MenusColumns } from "./MenusColumns";
import {
  useDeleteMenuMutation,
  useUpdatePublishMenuMutation,
} from "./services/api";

const useMenus = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMenus | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [publishMenu, { isLoading: publishLoading }] =
    useUpdatePublishMenuMutation();

  const [deleteMenu, { isLoading: deleteLoading }] = useDeleteMenuMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMenus) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdatePublish = useCallback((row: IMenus) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);

  const handleDelete = useCallback((row: IMenus) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleCopy = useCallback((row: IMenus) => {
    setSelectedRow(row);
    setShowCopyModal(true);
  }, []);

  const columns = MenusColumns(
    handleDetails,
    handleUpdatePublish,
    handleDelete,
    handleCopy
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddMenu
          label='menus.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showCopyModal && selectedRow && (
        <CopyMenu
          label='menus.copy'
          showModal={showCopyModal}
          setShowModal={setShowCopyModal}
          menu={{
            id: selectedRow.id,
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}
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
          label='menus.edit'
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.nameAr || "",
            nameEn: selectedRow?.nameEn || "",
          }}
        />
      )}

      {showPublishModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isPublished
              ? "mealPlans.unPublishTitle"
              : "mealPlans.publishTitle"
          }
          open={showPublishModal}
          setOpen={setShowPublishModal}
          itemName={selectedRow?.nameEn}
          loading={publishLoading}
          title={
            selectedRow?.isPublished
              ? "mealPlans.unPublishContent"
              : "mealPlans.publishContent"
          }
          onConfirm={() => {
            publishMenu(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowPublishModal(false);
              });
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"menus.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"menus.deleteContent"}
          onConfirm={() => {
            deleteMenu(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
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
export default useMenus;
