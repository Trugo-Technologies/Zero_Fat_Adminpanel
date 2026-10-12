/** @format */

import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddHomeBanner from "src/Components/clients-module/homeBanners/AddHomeBanner";
import EditHomeBanner from "src/Components/clients-module/homeBanners/EditHomeBanner";
import HomeBannerDetails from "src/Components/clients-module/homeBanners/HomeBannerDetails";
import { IHomeBanner } from "src/types/modules/clientsManagement/homeBanners";
import homeBannersColumns from "./HomeBannersColumns";
import {
  useDeleteHomeBannerMutation,
  useToggleHomeBannerActiveMutation,
} from "./services/api";

function useHomeBanners() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IHomeBanner | null>(null);

  const [deleteHomeBanner, { isLoading: deleteLoading }] =
    useDeleteHomeBannerMutation();
  const [toggleHomeBannerActive, { isLoading: toggleLoading }] =
    useToggleHomeBannerActiveMutation();

  const handleDetails = useCallback((row: IHomeBanner) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IHomeBanner) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IHomeBanner) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IHomeBanner) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = homeBannersColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showDetailsModal && selectedRow && (
        <HomeBannerDetails
          item={selectedRow}
          showDetails={showDetailsModal}
          setShowDetails={setShowDetailsModal}
        />
      )}
      {showAddModal && (
        <AddHomeBanner
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditHomeBanner
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedRow={selectedRow}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='homeBanners.deleteTitle'
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow.titleEn}
          title='homeBanners.deleteContent'
          onConfirm={() => {
            deleteHomeBanner(selectedRow.id)
              .unwrap()
              .then(() => setShowDeleteModal(false));
          }}
        />
      )}
      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow.isActive
              ? "homeBanners.deActiveTitle"
              : "homeBanners.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow.titleEn}
          loading={toggleLoading}
          title={
            selectedRow.isActive
              ? "homeBanners.deActiveContent"
              : "homeBanners.activeContent"
          }
          onConfirm={() => {
            toggleHomeBannerActive(selectedRow.id)
              .unwrap()
              .then(() => setShowActivationModal(false));
          }}
        />
      )}
    </>
  );

  return {
    columns,
    Modals,
    setShowAddModal,
  };
}

export default useHomeBanners;
