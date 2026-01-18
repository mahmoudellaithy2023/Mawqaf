import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StationCard from "../../Stations/Components/StationCard";
import { fetchNearStations } from "../../../store/slices/Transportation/getNearStations";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import StationCardSkeleton from "../../../components/Skeltons/StationCardSkeleton";

export default function NearStations() {
  const dispatch = useDispatch();
  const { stations, loading, error } = useSelector(
    (state) => state.nearStations
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation غير مدعوم");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("إرسال للإستعلام عن المحطات القريبة:", { lat, lng });

        dispatch(
          fetchNearStations({
            lat,
            lng,
          })
        );
      },
      (err) => {
        console.error("خطأ في تحديد الموقع:", err);
      }
    );
  }, [dispatch]);

  if (!navigator.geolocation) {
    return (
      <p className="text-center text-red-500">
        الموقع غير مدعوم على هذا المتصفح
      </p>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div id="near-stations" className=" bg-[#F9FAFB] pt-20">
      <div className="  w-[90%] mx-auto ">
        <div className="header">
          <motion.span
            whileInView={{
              opacity: [0, 0.3, 0.7, 1],
            }}
            transition={{ duration: 3 }}
            className="sectionTitle"
          >
            القريبة
          </motion.span>

          <div className="flex justify-between items-center">
            <motion.h2
              whileInView={{
                opacity: [0, 0.3, 0.7, 1],
                x: [100, 0],
              }}
              transition={{ duration: 1 }}
              className="sectionDesc"
            >
              محطات بالقرب منك
            </motion.h2>

            <motion.button
              whileInView={{
                opacity: [0, 0.3, 0.7, 1],
                x: [-100, 0],
              }}
              transition={{ duration: 1 }}
              onClick={() => {}}
              className=" text-black hover:text-white hover:bg-[#f59f0a]  px-4 py-1 border border-gray-300 rounded-3xl hover:border-0 transition-all duration-200 group"
            >
              <Link
                to="/stations"
                className=" flex justify-between items-center gap-2 cursor-pointer "
              >
                {" "}
                عرض كل المحطات{" "}
                <span className=" group-hover:-translate-x-1.5 group-hover:text-white transition-all duration-300">
                  <ArrowLeft size={14} />
                </span>
              </Link>
            </motion.button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 p-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StationCardSkeleton key={i} />
            ))
          ) : stations.length > 0 ? (
            stations.map((station, index) => (
              <StationCard
                key={station._id || index}
                station={station}
                isNearest={index === 0}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-500 text-lg mb-4 font-medium">
                عذراً، لا توجد محطات قريبة من موقعك الحالي.
              </p>
              <Link
                to="/stations"
                className="btn bg-[#0e6b73] text-white hover:bg-[#094f56] px-6 rounded-xl flex items-center gap-2"
              >
                عرض جميع المحطات
                <ArrowLeft size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
