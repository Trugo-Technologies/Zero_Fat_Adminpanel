/** @format */

import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddBank from "src/Components/clients-module/discounts/banks/AddBank";
import BankDetails from "src/Components/clients-module/discounts/banks/BankDetails";
import EditBank from "src/Components/clients-module/discounts/banks/EditBank";
import {
  buildBankFormData,
  IPromoBank,
} from "src/types/modules/clientsManagement/discounts/banks";
import banksColumns from "./BanksColumns";
import {
  useDeleteBankMutation,
  useUpdateBankMutation,
} from "./services/api";

function useBanks() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IPromoBank | null>(null);

  const [deleteBank, { isLoading: deleteLoading }] = useDeleteBankMutation();
  const [updateBank, { isLoading: updateLoading }] = useUpdateBankMutation();

  const handleDetails = useCallback((row: IPromoBank) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IPromoBank) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IPromoBank) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IPromoBank) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = banksColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive
  );

  const Modals = (
    <>
      {showDetailsModal && selectedRow && (
        <BankDetails
          item={selectedRow}
          showDetails={showDetailsModal}
          setShowDetails={setShowDetailsModal}
        />
      )}
      {showAddModal && (
        <AddBank
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditBank
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedRow={selectedRow}
        />
      )}
      {showDeleteModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='promoBanks.deleteTitle'
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow.nameEn}
          title='promoBanks.deleteContent'
          onConfirm={() => {
            deleteBank(selectedRow.id)
              .unwrap()
              .then(() => setShowDeleteModal(false));
          }}
        />
      )}
      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow.isActive
              ? "promoBanks.deActiveTitle"
              : "promoBanks.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow.nameEn}
          loading={updateLoading}
          title={
            selectedRow.isActive
              ? "promoBanks.deActiveContent"
              : "promoBanks.activeContent"
          }
          onConfirm={() => {
            const formValues = {
              nameEn: selectedRow.nameEn,
              nameAr: selectedRow.nameAr,
              cardBinPrefixes:
                selectedRow.cardBinPrefixes?.length
                  ? selectedRow.cardBinPrefixes
                  : selectedRow.code
                    ? [selectedRow.code]
                    : [],
              logo: null,
              logoUrl: selectedRow.logoUrl || "",
              isActive: !selectedRow.isActive,
            };
            updateBank({
              id: selectedRow.id,
              data: buildBankFormData(formValues, { id: selectedRow.id }),
            })
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

export default useBanks;
