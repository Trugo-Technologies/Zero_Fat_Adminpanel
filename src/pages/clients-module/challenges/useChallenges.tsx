/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import AddChallenge from "src/Components/clients-module/challenges/AddChallenge";
import ChallengeDetails from "src/Components/clients-module/challenges/ChallengeDetails";
import EditChallenge from "src/Components/clients-module/challenges/EditChallenge";
import { IChallenge } from "src/types/modules/clientsManagement/challenges";
import { ChallengesColumns } from "./ChallengesColumns";
import {
  useCancelChallengeMutation,
  usePublishChallengeMutation,
} from "./services/api";

const useChallenges = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IChallenge | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [publishChallenge, { isLoading: publishLoading }] =
    usePublishChallengeMutation();
  const [cancelChallenge, { isLoading: cancelLoading }] =
    useCancelChallengeMutation();

  const handleDetails = useCallback((row: IChallenge) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IChallenge) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handlePublish = useCallback((row: IChallenge) => {
    setSelectedRow(row);
    setShowPublishModal(true);
  }, []);

  const handleCancel = useCallback((row: IChallenge) => {
    setSelectedRow(row);
    setShowCancelModal(true);
  }, []);

  const handleParticipants = useCallback(
    (row: IChallenge) => {
      navigate(`/clientsManagement/challenges/${row.id}/participants`);
    },
    [navigate]
  );

  const columns = useMemo(
    () =>
      ChallengesColumns(
        handleDetails,
        handleUpdate,
        handlePublish,
        handleCancel,
        handleParticipants
      ),
    [
      handleDetails,
      handleUpdate,
      handlePublish,
      handleCancel,
      handleParticipants,
    ]
  );

  const Modals = (
    <>
      {showAddModal && (
        <AddChallenge
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && selectedRow && (
        <ChallengeDetails
          challenge={selectedRow}
          showDetails={showDetailsModal}
          setShowDetails={setShowDetailsModal}
        />
      )}
      {showEditModal && selectedRow && (
        <EditChallenge
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          challenge={selectedRow}
        />
      )}
      {showPublishModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='challenges.publishTitle'
          open={showPublishModal}
          setOpen={setShowPublishModal}
          loading={publishLoading}
          itemName={selectedRow.title}
          title='challenges.publishContent'
          onConfirm={() => {
            publishChallenge(selectedRow.id)
              .unwrap()
              .then(() => setShowPublishModal(false));
          }}
        />
      )}
      {showCancelModal && selectedRow && (
        <AppConfirmModal
          dialogTitle='challenges.cancelTitle'
          open={showCancelModal}
          setOpen={setShowCancelModal}
          loading={cancelLoading}
          itemName={selectedRow.title}
          title='challenges.cancelContent'
          onConfirm={() => {
            cancelChallenge(selectedRow.id)
              .unwrap()
              .then(() => setShowCancelModal(false));
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

export default useChallenges;
