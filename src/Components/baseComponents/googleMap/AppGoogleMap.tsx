import {
  GoogleMap,
  Marker,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React from "react";
import mapOptions from "./map-options.json";
import { IAddressDto } from "src/types/modules/clientsManagement/clientLocations";

interface IGoogleMapProps {
  currentLocation?: IAddressDto;
  setCurrentLocation?: React.Dispatch<
    React.SetStateAction<IAddressDto | undefined>
  >;
  defaultLocation?: IAddressDto;
  draggable?: boolean;
  iconMarker?: string;
}

const AppGoogleMap: React.FC<IGoogleMapProps> = (props) => {
  const {
    defaultLocation = { latitude: 33.5022498, longitude: 36.2561701 },
    currentLocation,
    setCurrentLocation = () => {},
    draggable = false,
    iconMarker,
  } = props;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD7DByF-gGolTVM-SlhtK1xcM6zcZXvO2o",
  });
  const handleClick = (e: google.maps.MapMouseEvent) => {
    setCurrentLocation({
      latitude: e.latLng?.lat()!,
      longitude: e.latLng?.lng()!,
    });
  };

  return (
    <>
      {/* <LoadScript
          // id="script-loader"
          googleMapsApiKey={"AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"}
          libraries={["drawing"]}
          // language="en"
          // region="us"
        > */}
      {isLoaded && (
        <GoogleMap
          onClick={(e) =>
            setCurrentLocation({
              latitude: e.latLng?.lat() ?? defaultLocation?.latitude,
              longitude: e.latLng?.lng() ?? defaultLocation?.latitude,
            })
          }
          // onLoad={(map) => {
          //   const bounds = new window.google.maps.LatLngBounds();
          //   map.fitBounds(bounds);
          // }}

          mapContainerStyle={{ height: "100%" }}
          center={{
            lat: currentLocation?.latitude ?? defaultLocation?.latitude,
            lng: currentLocation?.longitude ?? defaultLocation?.longitude,
          }}
          zoom={13}
          options={mapOptions}

          // mapMinHeight="100vh"
          // onGoogleApiLoaded={onGoogleApiLoaded}
          // onChange={(map) => console.log("Map moved", map)}
        >
          <MarkerF
            // key="AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
            position={{
              lat: currentLocation?.latitude ?? defaultLocation?.latitude,
              lng: currentLocation?.longitude ?? defaultLocation?.longitude,
            }}
            icon={iconMarker}
            draggable={draggable}
            visible
            zIndex={999}
            opacity={1}
            options={{
              position: {
                lat: currentLocation?.latitude ?? defaultLocation?.latitude,
                lng: currentLocation?.longitude ?? defaultLocation?.longitude,
              },
            }}
            onDragEnd={handleClick}
          />
        </GoogleMap>
      )}

      {/* </LoadScript> */}
    </>
  );
};

export default AppGoogleMap;
