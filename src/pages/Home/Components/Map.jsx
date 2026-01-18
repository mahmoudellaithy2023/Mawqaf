import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "motion/react";
import { Icon, MapPin } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

export default function MyMap() {
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (!location) {
    return (
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: -10 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="w-full h-full  flex border border-mainColor bg-[#3A8590] backdrop-blur-sm border-border/20 rounded-3xl justify-center items-center box-border"
      >
        <div className="text-center p-6 max-w-sm">
          <p className="text-primary-foreground/70  text-3xl mb-4">
            اضغط لتحديد مكانك الحالي
          </p>
          <motion.button
            onClick={() => {
              getLocation();
            }}
            className="w-full h-16 bg-transparent  flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border text-primary-foreground text-sm font-medium hover:bg-mainColor/80 transition hover:cursor-pointer"
          >
            <MapPin />
            <p className="text-2xl"> Use GPS</p>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: -10 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="w-full h-full flex justify-start items-start border-8   rounded-2xl 
   border-white/30 
  bg-white/10 
  backdrop-blur-md
  shadow-lg 
"
    >
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={100}
        className="w-full h-full rounded-lg shadow-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>أنت هنا!</Popup>
        </Marker>
      </MapContainer>
    </motion.div>
  );
}
