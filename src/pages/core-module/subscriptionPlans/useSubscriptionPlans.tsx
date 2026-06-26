/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";

import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import SubscriptionPlanDetails from "src/Components/core-module/subscriptionPlans/SubscriptionPlanDetails";
import { ISubscriptionPlan } from "src/types/modules/core/subscriptionPlans";
import {
  usePublishSubscriptionPlanMutation,
  useUpdateActiveSubscriptionPlanMutation,
} from "./services/api";
import { SubscriptionPlansColumns } from "./SubscriptionPlansColumns";

function useSubscriptionPlans() {
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ISubscriptionPlan | null>(
    null
  );
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [activeSubscriptionPlan, { isLoading: activationLoading }] =
    useUpdateActiveSubscriptionPlanMutation();

  const [publishSubscriptionPlan, { isLoading: publishLoading }] =
    usePublishSubscriptionPlanMutation();

  const handleDetails = useCallback((row: ISubscriptionPlan) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdatePublish = useCallback((row: ISubscriptionPlan) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);

  const handleToggleActive = useCallback((row: ISubscriptionPlan) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);
  const columns = SubscriptionPlansColumns(
    handleDetails,
    handleUpdatePublish,
    handleToggleActive
  );
  const Modals = (
    <>
      {showDetailsModal && (
        <SubscriptionPlanDetails
          id={selectedRow?.id || ""}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}

      {showPublishModal && (
        <AppConfirmModal
          dialogTitle={"subscriptionPlans.publishSubscriptionPlanTitle"}
          open={showPublishModal}
          setOpen={setShowPublishModal}
          loading={publishLoading}
          itemName={selectedRow?.titleEn}
          title={"subscriptionPlans.publishSubscriptionPlanContent"}
          onConfirm={() => {
            publishSubscriptionPlan(selectedRow?.id)
              .unwrap()
              .then(() => {
                setShowPublishModal(false);
              });
          }}
        />
      )}

      {showActivationModal && (
        <AppConfirmModal
          dialogTitle={
            selectedRow?.isActive
              ? "subscriptionPlans.deActiveTitle"
              : "subscriptionPlans.activeTitle"
          }
          open={showActivationModal}
          setOpen={setShowActivationModal}
          itemName={selectedRow?.titleEn}
          loading={activationLoading}
          title={
            selectedRow?.isActive
              ? "subscriptionPlans.deActiveContent"
              : "subscriptionPlans.activeContent"
          }
          onConfirm={() => {
            activeSubscriptionPlan(selectedRow?.id)
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
    columns,
    Modals,
  };
}

export default useSubscriptionPlans;
