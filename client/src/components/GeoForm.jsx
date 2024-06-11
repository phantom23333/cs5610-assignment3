import React, { useEffect } from "react";

export default function GeoForm({ setLatLng }) {
  // Set the latitude and longitude for Vancouver
  const vancouverLatLng = { lat: 49.2827, lng: -123.1207 };

  useEffect(() => {
    // Automatically set Vancouver's latitude and longitude on component mount
    setLatLng(vancouverLatLng);
  }, [setLatLng]);

  return (
    <div>
      <h3>Today's weather ☁️</h3>
    </div>
  );
}
