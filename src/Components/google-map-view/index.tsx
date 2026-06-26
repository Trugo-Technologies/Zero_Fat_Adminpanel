import { Button } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "src/hooks/use-translation";
import SimpleDialog from "../dialog";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";
import GoogleMapComponent from "../google-map";

type propsType = {
  location: {
    latitude?: number;
    longitude?: number;
  };
  children?: React.ReactNode;
  title?: string;
};

function GoogleMapView({ location, title = "show" }: propsType) {
  const { t } = useTranslation("translation");

  const [open, setOpen] = useState(false);

  if (!location) return <>{t("not added")}</>;

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t(title)}</Button>
      <SimpleDialog
        open={open}
        setOpen={setOpen}
        title=""
        fullWidth={true}
        maxWidth={"lg"}
      >
        <div style={{ height: "70vh", minWidth: "500px" }}>
          <GoogleMapComponent
            center={{
              lat: location.latitude as number,
              lng: location.longitude as number,
            }}
          >
            <MarkerF
              position={{
                lat: location.latitude as number,
                lng: location.longitude as number,
              }}
            />
          </GoogleMapComponent>
        </div>
      </SimpleDialog>
    </>
  );
}

export default GoogleMapView;
