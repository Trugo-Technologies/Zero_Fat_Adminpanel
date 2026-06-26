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
import { IKitchenMealCount } from "src/types/modules/clientsManagement/kitchen/mealCount";
import { FiTriangle } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  selectedSticker: IKitchenMealCount;
}

const MealCountSticker = (props: IProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { showModal, setShowModal, selectedSticker } = props;
  const [loading, setLoading] = useState(false);
  const { meal, date } = selectedSticker;

  const handleDownload = useCallback(async () => {
    if (!componentRef.current) return;
    try {
      setLoading(true);
      const dataUrl = await toPng(componentRef.current);
      const link = document.createElement("a");
      link.download = `${meal?.nameEn}-${date}`;
      link.href = dataUrl;
      link.click();
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setLoading(false);
    }
  }, [meal?.nameEn, date]);

  return (
    <Dialog
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "500px", // Your custom width
          maxWidth: "none", // Override maxWidth if needed
        },
      }}
      open={showModal}
      onClose={() => setShowModal(false)}>
      <DialogTitle>
        <Typography color='primary' variant='h3'>
          <IntlMessages id={"for"} />{" "}
          <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {meal?.nameEn}
          </span>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <div
          ref={componentRef}
          style={{
            width: "100%",
            paddingTop: "8px",
            paddingInlineStart: "12px",
            paddingInlineEnd: "24px",
            paddingBottom: "25px",
            background: "#fff",
            borderRadius: "8px",
            color: "#000",
          }}>
          <h4
            style={{
              fontSize: "18px",
              marginBottom: "2px",
              fontWeight: 700,
            }}>
            {meal?.nameEn}
          </h4>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}>
            <FiTriangle size={14} color='#000' />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>
              Beef, Dairy, Gluten, Say, Other, Eggs
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
            }}>
            <div
              style={{
                width: "60%",
                borderInlineEnd: "1px solid #000",
                paddingTop: "12px",
              }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                }}>
                PD: {date}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                }}>
                Use: 2025-5-05
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "13px",
                  marginBottom: "10px",
                }}>
                Serving size:{" "}
                <span style={{ marginInlineStart: "20px" }}>S</span>
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "13px",
                }}>
                Keep Refrigerated.
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "13px",
                  marginBottom: "10px",
                }}>
                Once heated. don't re-heat
              </p>
            </div>

            <div
              style={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <QRCodeCanvas value={selectedSticker.id} size={120} />
            </div>
          </div>
          <div
            style={{
              width: "100%",
            }}>
            <p
              style={{
                fontWeight: 500,
                fontSize: "13px",
                marginBottom: "-3px",
              }}>
              Remove the lid and
            </p>
            <p
              style={{
                fontWeight: 500,
                fontSize: "13px",
              }}>
              microwave for 45-60 seconds.
            </p>
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

export default MealCountSticker;
