import {
  GoogleMap,
  useJsApiLoader,
  GoogleMapProps,
} from "@react-google-maps/api";
import React from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};
type propsType = {
  children: React.ReactNode;
  center: {
    latitude?: number;
    longitude?: number;
  };
} & GoogleMapProps;

function GoogleMapComponent({ children, center, ...props }: propsType) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });
  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={19}
          {...props}
        >
          {children}
        </GoogleMap>
      )}
    </>
  );
}

export default GoogleMapComponent;
