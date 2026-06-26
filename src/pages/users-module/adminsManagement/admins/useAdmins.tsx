/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IAdmin } from "src/types/modules/users-module/adminsManagement/admins";
import { AdminsColumns } from "./AdminsColumns";
import { useActiveAdminMutation, useDeleteAdminMutation } from "./services/api";
import AddAdmin from "src/Components/users-module/adminsManagement/admins/AddAdmin";
import AdminDetails from "src/Components/users-module/adminsManagement/admins/AdminDetails";
import EditAdmin from "src/Components/users-module/adminsManagement/admins/EditAdmin";
import ResetAdminPassword from "src/Components/users-module/adminsManagement/admins/ResetAdminPassword";

const useAdmins = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IAdmin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] =
    useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteAdmin, { isLoading: deleteLoading }] = useDeleteAdminMutation();
  const [activeAdmin, { isLoading: activationLoading }] =
    useActiveAdminMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IAdmin) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IAdmin) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IAdmin) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IAdmin) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const handleResetPassword = useCallback((row: IAdmin) => {
    setSelectedRow(row);
    setShowResetPasswordModal(true);
  }, []);

  const columns = AdminsColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    handleResetPassword
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddAdmin
          label='admin.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={"admin.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow.fullName}
          title={"admin.deleteContent"}
          onConfirm={() => {
            deleteAdmin(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}

      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive ? "admin.deActiveTitle" : "admin.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow.fullName}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "admin.deActiveContent"
              : "admin.activeContent"
          }
          onConfirm={() => {
            activeAdmin(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
              });
          }}
        />
      )}

      {showDetailsModal && selectedRow && (
        <AdminDetails
          setShowDetails={setShowDetailsModal}
          id={selectedRow.id}
          fullName={selectedRow.fullName}
        />
      )}
      {showEditModal && selectedRow && (
        <EditAdmin
          setShowEditModal={setShowEditModal}
          label='admin.edit'
          fullName={selectedRow.fullName}
          id={selectedRow.id}
        />
      )}

      {showResetPasswordModal && selectedRow && (
        <ResetAdminPassword
          setShowResetPasswordModal={setShowResetPasswordModal}
          fullName={selectedRow.fullName}
          id={selectedRow.publicId}
          label='common.resetPassword'
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
export default useAdmins;
