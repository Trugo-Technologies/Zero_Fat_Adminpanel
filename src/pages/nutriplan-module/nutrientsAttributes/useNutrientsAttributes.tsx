/** @format */

import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useCallback } from "react";
import AppConfirmModal from "src/Components/baseComponents/modals/AppConfirmModal";
import { IMeasurmentUnits } from "src/types/modules/nutriplan/measurementUnits";
import { NutrientsAttributesColumns } from "./NutrientsAttributesColumns";
import { useDeleteNutrientsAttributeMutation } from "./services/api";
import AddNutrientsAttribute from "src/Components/nutriplan-module/setting/nutrientsAttributes/AddNutrientsAttribute";
import NutrientsAttributeDetails from "src/Components/nutriplan-module/setting/nutrientsAttributes/NutrientsAttributeDetails";

const useNutrientsAttributes = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMeasurmentUnits | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [deleteNutrientsAttribute, { isLoading: deleteLoading }] =
    useDeleteNutrientsAttributeMutation();
  // Handlers for modals
  const handleDetails = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  }, []);

  const handleDelete = useCallback((row: IMeasurmentUnits) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  }, []);

  const columns = NutrientsAttributesColumns(handleDetails, handleDelete);

  const Modals = (
    <>
      {showAddModal && (
        <AddNutrientsAttribute
          label='nutrientsAttributes.add'
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <NutrientsAttributeDetails
          id={selectedRow?.id!}
          setShowDetails={setShowDetailsModal}
          showDetails={showDetailsModal}
        />
      )}
      {showDeleteModal && (
        <AppConfirmModal
          dialogTitle={"nutrientsAttributes.deleteTitle"}
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          loading={deleteLoading}
          itemName={selectedRow?.nameEn}
          title={"nutrientsAttributes.deleteContent"}
          onConfirm={() => {
            deleteNutrientsAttribute(selectedRow?.id)
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
export default useNutrientsAttributes;
