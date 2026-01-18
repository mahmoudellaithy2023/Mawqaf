
import { Route, Banknote, MapPin, Car } from "lucide-react";

export default function LineSummary({
  line,
  totalVehicles,
  availableVehicles,
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6" dir="rtl">
      <h2 className="text-lg lg:text-2xl  font-bold mb-4 flex items-center gap-2 text-foreground">
        <Route className="h-6 w-6" />
        {line.fromStation.stationName}
        <span className="mx-2 "> -  </span>
        {line.toStation.stationName}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <Banknote className="h-4 w-4" />
            السعر
          </p>
          <p className="font-bold text-foreground text-lg">
            {line.price} ج
          </p>
        </div>

        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            المسافة
          </p>
          <p className="font-bold text-foreground">
            {line.distance} كم
          </p>
        </div>

        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <Car className="h-4 w-4" />
            عدد العربيات
          </p>
          <p className="font-bold text-foreground ">
            {totalVehicles}
          </p>
        </div>

        <div>
          <p className="text-gray-500 flex items-center gap-1  ">
            <Car className="h-4 w-4" />
            متاح الآن
          </p>
          <p className="font-bold text-foreground">
            {availableVehicles}
          </p>
        </div>
      </div>
    </div>
  );
}
