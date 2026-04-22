import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";

const LocationCard = ({ latitude, longitude, capturedAt }) => {
  if (latitude === null || longitude === null || capturedAt === null)
    return null;

  const formattedTime = new Date(capturedAt).toLocaleString();

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      {/* Map */}
      <div className="h-48 w-full">
        <MapContainer
          key={`${latitude}-${longitude}`}
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[latitude, longitude]} icon={customIcon} />
        </MapContainer>
      </div>

      {/* Info */}
      <div className="p-3 text-sm">
        <p>
          <strong>Latitude:</strong> {latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {longitude}
        </p>
        <p>
          <strong>Captured:</strong> {formattedTime}
        </p>

        {/* Open in Google Maps */}
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme mt-2 inline-block"
        >
          Open in Maps →
        </a>
      </div>
    </div>
  );
};

export default LocationCard;
