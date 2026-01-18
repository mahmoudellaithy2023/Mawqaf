import React, { useState } from "react";
import { Timer } from "lucide-react";
import CardOfReservations from "../components/CardOfReservations";
import PageHeader from "../sharedComponents/PageHeader";

export default function MyReservations() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      route: "المسار A1",
      status: "نشطة",
      statusColor: "green",
      from: "المحطة المركزية",
      to: "محطة الجامعة",
      vehicle: "ABC-1234",
      fare: 2.5,
      timeRemaining: "2:59",
      reservedAt: null,
      canCancel: true,
    },
    {
      id: 2,
      route: "المسار B2",
      status: "منتهية",
      statusColor: "orange",
      from: "المحطة المركزية",
      to: "مركز المنطقة الصناعية",
      vehicle: "JKL-3456",
      fare: 3.0,
      timeRemaining: null,
      reservedAt: "01:12 ص",
      canCancel: false,
    },
    {
      id: 3,
      route: "المسار C3",
      status: "مكتملة",
      statusColor: "teal",
      from: "المحطة المركزية",
      to: "المحطة الشمالية",
      vehicle: "STU-2468",
      fare: 2.0,
      timeRemaining: null,
      reservedAt: "12:22 ص",
      canCancel: false,
    },
  ]);

  function handleCancelReservation(id) {
    const newData = reservations.filter((item) => item.id !== id);
    setReservations(newData);
  }
  let activedDataCount = reservations.filter((item) => item.status === "نشطة");

  return (
    <section className="bg-[#F9FAFB] min-w-full py-30 ">
      <section className="lg:w-[50%] mx-auto md:w-[70%] w-[95%]">
        <PageHeader title={"حجوزاتي"} desc={"عرض وإدارة حجوزات مقاعدك."} />
        {activedDataCount.length > 0 ? (
          <>
            {" "}
            <div className="flex mb-12 flex-row gap-4 w-full rounded-2xl border-green-600 py-4 border p-4 bg-[#E3F2EC]">
              <div className="p-3 rounded-xl bg-[#BCE4D2] flex justify-center items-center">
                <Timer color="#008a17" size={25} />
              </div>
              <div>
                <p className="font-bold text-black">لديك حجز واحد نشط.</p>
                <p className="text-muted-foreground">
                  اتجه إلى المحطة قبل أن ينتهي موعد حجزك!"
                </p>
              </div>
            </div>
          </>
        ) : (
          <p></p>
        )}
        {reservations.map((item) => (
          <CardOfReservations data={item} handleDel={handleCancelReservation} />
        ))}
      </section>
    </section>
  );
}
