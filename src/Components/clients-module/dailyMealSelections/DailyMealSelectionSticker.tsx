/** @format */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";
import IntlMessages from "src/@crema/helpers/IntlMessages";
import AppButton from "src/Components/baseComponents/buttons/AppButton";
import { DailyMealSelectionPrint } from "src/pages/clients-module/dailyMealSelections/useDailyMealSelections";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  selectedSticker: DailyMealSelectionPrint;
}

const DailyMealSelectionSticker = (props: IProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { showModal, setShowModal, selectedSticker } = props;
  const [loading, setLoading] = useState(false);
  const {
    clientName,
    meal,
    totalCalories,
    totalCarbohydrates,
    totalFats,
    totalProteins,
    mealSelectionType,
    customeMealName,
  } = selectedSticker;

  const handleDownload = useCallback(async () => {
    if (!componentRef.current) return;
    try {
      setLoading(true);
      const dataUrl = await toPng(componentRef.current);
      const link = document.createElement("a");
      link.download = `for-${clientName}`;
      link.href = dataUrl;
      link.click();
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setLoading(false);
    }
  }, [clientName]);

  const cellStyle: React.CSSProperties = {
    borderLeft: "2px solid #000",
    borderRight: "2px solid #000",
    borderTop: "2px solid #000",
    borderBottom: "2px solid #000",
    width: "20%",
  };
  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={showModal}
      onClose={() => setShowModal(false)}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={"for"} />{" "}
          <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {clientName}
          </span>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <div
          ref={componentRef}
          style={{
            width: "100%",
            paddingTop: "8px",
            paddingInline: "16px",
            paddingBottom: "25px",
            background: "#fff",
            borderRadius: "8px",
            color: "#000",
          }}>
          <div
            style={{
              width: "100%",
              textTransform: "capitalize",
              marginBottom: "8px",
            }}>
            <h2>For {clientName}</h2>
          </div>
          <p
            style={{
              textTransform: "capitalize",
            }}>
            {mealSelectionType === "Custom" ? customeMealName : meal?.nameEn}
          </p>
          <p
            style={{
              marginTop: "2px",
              fontSize: "11px",
            }}>
            {mealSelectionType === "Custom"
              ? "Custom-ized For You!"
              : meal?.cuisine === "Other"
                ? "The best healthy meal food"
                : `The best healthy ${meal?.cuisine} food`}
          </p>
          <div
            style={{
              width: "100%",
              marginTop: "16px",
            }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "80%",
                borderStyle: "hidden",
              }}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...cellStyle,
                      textAlign: "left",
                    }}>
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>
                      {totalCalories}
                    </p>
                    <p style={{ fontSize: "13px" }}>Calories</p>
                  </th>
                  <th style={cellStyle}>
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>
                      {totalProteins}g
                    </p>
                    <p style={{ fontSize: "13px" }}>Protein</p>
                  </th>
                  <th style={cellStyle}>
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>
                      {totalCarbohydrates}g
                    </p>
                    <p style={{ fontSize: "13px" }}>Carbs</p>
                  </th>
                  <th style={cellStyle}>
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>
                      {totalFats}g
                    </p>
                    <p style={{ fontSize: "13px" }}>Fat</p>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <AppButton
          onClick={() => setShowModal(false)}
          color='secondary'
          label='common.cancel'
        />

        <AppButton
          loading={loading}
          onClick={handleDownload}
          label='common.downloadSticker'
        />
      </DialogActions>
    </Dialog>
  );
};

export default DailyMealSelectionSticker;
