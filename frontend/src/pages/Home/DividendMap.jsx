import React, { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Standard Map Icon configuration
const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Red Leaflet Icon for current searched active pin
const ActiveIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Master Map Data Object Matrix
const STATE_PROPERTIES = {
  "11": { name: "Delhi NCR Region", coords: [28.6139, 77.2090] },
  "12": { name: "Haryana Border Zone", coords: [29.0588, 76.0856] },
  "14": { name: "Punjab Region", coords: [31.1471, 75.3412] },
  "17": { name: "Himachal Area", coords: [31.1048, 77.1734] },
  "18": { name: "Jammu & Kashmir Valley", coords: [34.0837, 74.7973] },
  "20": { name: "Uttar Pradesh Zone", coords: [26.8467, 80.9462] },
  "24": { name: "Uttarakhand Hills", coords: [30.0668, 79.0193] },
  "30": { name: "Rajasthan Desert Sector", coords: [27.0238, 74.2179] },
  "36": { name: "Gujarat Coastline Grid", coords: [22.2587, 71.1924] },
  "40": { name: "Maharashtra Core Hub", coords: [19.7515, 75.7139] },
  "45": { name: "Goa Beach Sector", coords: [15.2993, 74.1240] },
  "46": { name: "Madhya Pradesh Central", coords: [22.9734, 78.6569] },
  "49": { name: "Chhattisgarh Woods", coords: [21.2787, 81.8661] },
  "50": { name: "Telangana Deccan Plateau", coords: [18.1124, 79.0193] },
  "51": { name: "Andhra Coastal Range", coords: [15.9129, 79.7400] },
  "56": { name: "Karnataka Sector", coords: [15.3173, 75.7139] },
  "60": { name: "Tamil Nadu Plains", coords: [11.1271, 78.6569] },
  "67": { name: "Kerala Belt", coords: [10.8505, 76.2711] },
  "70": { name: "West Bengal Delta", coords: [22.9868, 87.8550] },
  "75": { name: "Odisha Mahanadi Sector", coords: [20.9517, 85.0985] },
  "78": { name: "Assam Valley", coords: [26.2006, 92.9376] },
  "80": { name: "Bihar Plains", coords: [25.0961, 85.3131] },
  "83": { name: "Jharkhand Chota Nagpur", coords: [23.6102, 85.2799] },
};

// Math logic to calculate shifting dynamic offsets based on remaining 4 digits of pincode
const calculateDynamicCoords = (pincode) => {
  const pinStr = String(pincode).trim();
  if (pinStr.length < 2) return null;

  const prefix = pinStr.substring(0, 2);
  const baseData = STATE_PROPERTIES[prefix];

  if (!baseData) return null;

  // Remaining numeric digits mathematically manipulated to form precision shifts
  const remainingDigits = parseInt(pinStr.substring(2)) || 5555;
  const latOffset = ((remainingDigits % 100) - 50) / 120; 
  const lngOffset = (((remainingDigits / 100) % 100) - 50) / 120;

  return {
    coords: [baseData.coords[0] + latOffset, baseData.coords[1] + lngOffset],
    locationName: `${baseData.name} (Sub-Sector ${pinStr.substring(2, 6) || "00"})`
  };
};

// 🎯 Controlled flying component without triggering local state hooks loop
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

const DividendMap = ({ rawDividendsData, onStateSelect, selectedState, currentPincodeInput }) => {
  const defaultCenter = [22.5937, 78.9629];
  const markerRef = useRef(null);

  // 🧠 No useEffect state writes! Calculate everything dynamically on execution pass
  const currentTargetPin = useMemo(() => {
    if (currentPincodeInput && String(currentPincodeInput).length >= 4) {
      return calculateDynamicCoords(currentPincodeInput);
    }
    return null;
  }, [currentPincodeInput]);

  const mapCenter = currentTargetPin ? currentTargetPin.coords : defaultCenter;
  const mapZoom = currentTargetPin ? 11 : 5;
  const activeLocationText = currentTargetPin ? currentTargetPin.locationName : "";

  // Auto open popup when target pin renders on enter press
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [currentTargetPin]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center relative w-full h-[520px]">
      
      {/* Header Info Panel */}
      <div className="w-full mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Real-World Geographic Tracker</h3>
          <p className="text-[11px] text-indigo-600 font-semibold transition-all">
            {activeLocationText 
              ? `🎯 Positioned At: ${activeLocationText} [Pincode: ${currentPincodeInput}]` 
              : "Scanning active network nodes across India"}
          </p>
        </div>
        {(selectedState || currentPincodeInput) && (
          <button
            onClick={() => onStateSelect(null)}
            className="text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-2 py-1 rounded-md transition"
          >
            Reset Focus
          </button>
        )}
      </div>

      {/* Map Viewport Container */}
      <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 z-10 shadow-inner">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* RED ACTIVE TARGET MARKER */}
          {currentTargetPin && (
            <Marker 
              position={currentTargetPin.coords} 
              icon={ActiveIcon}
              ref={markerRef}
            >
              <Popup>
                <div className="text-xs font-sans p-1 min-w-[150px]">
                  <p className="font-bold text-rose-600 flex items-center gap-1">🎯 Active Target Area</p>
                  <p className="text-slate-800 font-bold mt-1 text-[13px]">{currentTargetPin.locationName}</p>
                  <p className="text-slate-400 font-medium text-[10px] mt-0.5">Pincode Data: {currentPincodeInput}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* General dataset bulk markers plotting */}
          {rawDividendsData && Array.isArray(rawDividendsData) && (
            rawDividendsData.map((record, index) => {
              const pCode = String(record["Pincode"] || "");
              if (pCode.length < 2 || pCode === currentPincodeInput) return null;

              const mathData = calculateDynamicCoords(pCode);
              if (!mathData) return null;

              return (
                <Marker key={index} position={mathData.coords}>
                  <Popup>
                    <div className="text-xs font-sans">
                      <p className="font-bold text-slate-800">{record["Company"] || "Unknown Enterprise"}</p>
                      <p className="text-emerald-600 font-semibold mt-0.5">Unclaimed: ₹{Number(record["Amount"] || 0).toLocaleString("en-IN")}</p>
                      <p className="text-slate-400 mt-1 text-[10px]">Location: {mathData.locationName}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DividendMap;