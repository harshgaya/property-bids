"use client";

import { useState, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import {
  RiMapPin2Line,
  RiCrosshairLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";

const MAP_STYLE = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  overflow: "hidden",
};
const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 }; // Hyderabad

export default function GPSPicker({ value, onChange }) {
  // value = { lat, lng, address } | null
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [mapCenter, setMapCenter] = useState(
    value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER,
  );
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: ["places"],
  });

  // Reverse geocode lat/lng to address string
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`,
      );
      const data = await res.json();
      return (
        data.results?.[0]?.formatted_address ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      );
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  // User clicks map — drop pin there
  const onMapClick = useCallback(
    async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const address = await reverseGeocode(lat, lng);
      onChange({ lat, lng, address });
    },
    [onChange],
  );

  // Use device GPS
  function useMyLocation() {
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await reverseGeocode(lat, lng);
        onChange({ lat, lng, address });
        setMapCenter({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
        setLocating(false);
      },
      (err) => {
        setLocateError(
          "Could not get your location. Please drop a pin manually.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  // Marker dragged to new position
  const onMarkerDragEnd = useCallback(
    async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const address = await reverseGeocode(lat, lng);
      onChange({ lat, lng, address });
    },
    [onChange],
  );

  if (!isLoaded) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Use my location button */}
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 disabled:opacity-60 transition-colors"
      >
        <RiCrosshairLine className={locating ? "animate-spin" : ""} />
        {locating ? "Getting your location..." : "Use My Current Location"}
      </button>

      {locateError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <RiErrorWarningLine />
          {locateError}
        </p>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={MAP_STYLE}
          center={mapCenter}
          zoom={value ? 16 : 13}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControlOptions: { position: 7 },
          }}
        >
          {value && (
            <Marker
              position={{ lat: value.lat, lng: value.lng }}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
              animation={2} // DROP animation
            />
          )}
        </GoogleMap>
      </div>

      <p className="text-xs text-gray-400">
        Click anywhere on the map to drop a pin, or drag the pin to adjust. This
        location will be GPS-validated.
      </p>

      {/* Selected location display */}
      {value ? (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <RiCheckLine className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-green-700">
              Location pinned
            </p>
            <p className="text-xs text-green-600 mt-0.5 break-words">
              {value.address}
            </p>
            <p className="text-xs text-green-500 mt-0.5">
              {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <RiMapPin2Line className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            No location selected. Click the map or use your current location.
          </p>
        </div>
      )}
    </div>
  );
}
