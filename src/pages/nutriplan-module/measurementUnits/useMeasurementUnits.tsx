/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IMeasurmentUnits } from "src/types/modules/nutriplan/measurementUnits";
import {
  useDeleteMeasurementUnitMutation,
  useUpdateActiveMeasurementUnitMutation,
} from "./services/api";
import { MeasurementUnitsColumns } from "./MeasurementUnitsColumns";
import AddMeasurementUnit from "src/Components/nutriplan-module/setting/measurementUnits/AddMeasurementUnit";
import MeasurementUnitDetails from "src/Components/nutriplan-module/setting/measurementUnits/MeasurementUnitDetails";

const useWorkoutBodyParts = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMeasurmentUnits | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteWorkoutBodyPart, { isLoading: deleteLoading }] =
    useDeleteMeasurementUnitMutation();
  const [activeWorkoutBodyPart, { isLoading: activationLoading }] =
    useUpdateActiveMeasurementUnitMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleUpdate = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const handleToggleActive = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowActivationModal(true);
  }, []);

  const columns = MeasurementUnitsColumns(handleDetails, handleDelete);

  const Modals = (
    <>
      {showAddModal && (
        <AddMeasurementUnit
          label='measurementUnits.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <MeasurementUnitDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"measurementUnits.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"measurementUnits.deleteContent"}
          onConfirm={() => {
            deleteWorkoutBodyPart(selectedRow?.id)
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
export default useWorkoutBodyParts;
