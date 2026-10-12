/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddPromoCode from "src/Components/clients-module/discounts/promoCodes/AddPromoCode";
import EditPromoCode from "src/Components/clients-module/discounts/promoCodes/EditPromoCode";
import PromoCodeDetails from "src/Components/clients-module/discounts/promoCodes/PromoCodeDetails";
import {
  ICreatePromoCodeDto,
  IPromoCode,
  IUpdatePromoCodeDto,
  PromoDuration,
  PromoEligibilityType,
} from "src/types/modules/clientsManagement/discounts/promoCodes";
import promoCodesColumns from "./PromoCodesColumns";
import {
  MOCK_PROMO_CODES,
  removeMockPromoCode,
  upsertMockPromoCode,
} from "./mockData";

const mapFormToEntity = (
  data: ICreatePromoCodeDto | IUpdatePromoCodeDto,
  existing?: IPromoCode
): Omit<
  IPromoCode,
  | "id"
  | "createdOn"
  | "lastModifiedOn"
  | "createdByName"
  | "lastModifiedByName"
  | "stripeId"
  | "isPublished"
  | "redemptionsUsed"
> => ({
  code: data.code,
  percentOff: data.percentOff || 0,
  amountOff: data.amountOff || 0,
  duration: (data.duration as PromoDuration) || PromoDuration.Once,
  durationInMonths: data.durationInMonths || 0,
  startDate: data.startDate,
  expirationDate: data.expirationDate,
  maxRedemptions: data.maxRedemptions,
  maxRedemptionsPerClient: data.maxRedemptionsPerClient,
  firstTimeClientsOnly:
    data.eligibilityType === PromoEligibilityType.FirstTime,
  isActive: data.isActive,
  descriptionEn: data.descriptionEn,
  descriptionAr: data.descriptionAr,
  applyMode: data.applyMode,
  eligibilityType: data.eligibilityType,
  rewardType: data.rewardType,
  bankIds: data.bankIds || [],
  planIds: data.planIds || [],
  subscriptionTypes: data.subscriptionTypes || [],
  minOrderCredits: data.minOrderCredits,
  buyQuantity: data.buyQuantity,
  getQuantity: data.getQuantity,
  createdBy: existing?.createdBy || "",
  lastModifiedBy: existing?.lastModifiedBy || "",
  deletedOn: existing?.deletedOn || "",
  deletedBy: existing?.deletedBy || "",
  deletedByName: existing?.deletedByName || "",
  activationChangedOn: existing?.activationChangedOn || "",
  activationChangedBy: existing?.activationChangedBy || "",
  activationChangedByName: existing?.activationChangedByName || "",
});

function usePromoCodes(onDataChange: () => void) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IPromoCode | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const handleDetails = useCallback((row: IPromoCode) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IPromoCode) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IPromoCode) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IPromoCode) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const handlePublish = useCallback((row: IPromoCode) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);

  const columns = promoCodesColumns(
    handleDetails,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    handlePublish
  );

  const handleCreate = (data: ICreatePromoCodeDto) => {
    const now = new Date().toISOString();
    upsertMockPromoCode({
      id: `promo-${Date.now()}`,
      ...mapFormToEntity(data),
      stripeId: null,
      redemptionsUsed: 0,
      isPublished: false,
      createdOn: now,
      lastModifiedOn: now,
      createdByName: "Admin",
      lastModifiedByName: "Admin",
    } as IPromoCode);
    onDataChange();
  };

  const handleEditSubmit = (data: IUpdatePromoCodeDto) => {
    const existing = MOCK_PROMO_CODES.find((row) => row.id === data.id);
    if (!existing) return;
    upsertMockPromoCode({
      ...existing,
      ...mapFormToEntity(data, existing),
      lastModifiedOn: new Date().toISOString(),
      lastModifiedByName: "Admin",
    });
    onDataChange();
  };

  const Modals = (
    <>
      {showDetailsModal && selectedRow && (
        <PromoCodeDetails
          item={selectedRow}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showAddModal && (
        <AddPromoCode
          label='promoCodes.add'
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
          onSubmit={handleCreate}
        />
      )}
      {showEditModal && selectedRow && (
        <EditPromoCode
          label='promoCodes.edit'
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          selectedRow={selectedRow}
          onSubmit={handleEditSubmit}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle='promoCodes.deleteTitle'
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={false}
          itemName={selectedRow?.code || ""}
          title='promoCodes.deleteContent'
          onConfirm={() => {
            if (selectedRow?.id) {
              removeMockPromoCode(selectedRow.id);
              onDataChange();
            }
            setShowDeleteModal(false);
          }}
        />
      )}
      {showPublishModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='promoCodes.publishTitle'
          open={showPublishModal}
          setOpen={setShowPublishModal}
          loading={false}
          itemName={selectedRow.code}
          title='promoCodes.publishContent'
          onConfirm={() => {
            upsertMockPromoCode({
              ...selectedRow,
              isPublished: true,
              stripeId: `stripe_mock_${selectedRow.id}`,
              lastModifiedOn: new Date().toISOString(),
            });
            onDataChange();
            setShowPublishModal(false);
          }}
        />
      )}
      {showActivationModal && selectedRow && (
        <AppConfirmModal
          dialogTitle={
            selectedRow.isActive
              ? "promoCodes.deActiveTitle"
              : "promoCodes.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow.code}
          loading={false}
          title={
            selectedRow.isActive
              ? "promoCodes.deActiveContent"
              : "promoCodes.activeContent"
          }
          onConfirm={() => {
            upsertMockPromoCode({
              ...selectedRow,
              isActive: !selectedRow.isActive,
              lastModifiedOn: new Date().toISOString(),
            });
            onDataChange();
            setShowActivationModal(false);
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

export default usePromoCodes;
