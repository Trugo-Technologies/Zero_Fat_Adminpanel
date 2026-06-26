/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddBanner from "src/Components/core-module/banners/AddBanner";
import BannerDetails from "src/Components/core-module/banners/BannerDetails";
import EditBanner from "src/Components/core-module/banners/EditBanner";
import { IBanner } from "src/types/modules/core/banners";
import BannersColumns from "./BannersColumns";
import {
  useDeleteBannerMutation,
  useUpdateActiveBannerMutation,
} from "./services";

function useBanners() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IBanner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [activeBanner, { isLoading: activationLoading }] =
    useUpdateActiveBannerMutation();

  const [deleteBanner, { isLoading: deleteLoading }] =
    useDeleteBannerMutation();
  const handleDetails = useCallback((row: IBanner) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IBanner) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IBanner) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IBanner) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = BannersColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );
  const Modals = (
    <>
      {showDetailsModal && (
        <BannerDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddBanner
          label='banners.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
        />
      )}
      {showEditModal && (
        <EditBanner
          label='banners.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={{
            id: selectedRow?.id || "",
            nameAr: selectedRow?.titleAr || "",
            nameEn: selectedRow?.titleEn || "",
          }}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"banners.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.titleEn}
          title={"banners.deleteContent"}
          onConfirm={() => {
            deleteBanner(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowDeleteModal(false);
              });
          }}
        />
      )}
      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "banners.deActiveTitle"
              : "banners.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.titleEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "banners.deActiveContent"
              : "banners.activeContent"
          }
          onConfirm={() => {
            activeBanner(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowActivationModal(false);
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
}

export default useBanners;
