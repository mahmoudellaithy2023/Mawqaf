import React from "react";
import SharedIndicator from "./SharedIndector";
import { Bus, MapPin, Route, Ticket } from "lucide-react";
import SectionsHeader from './../../../components/SectionsHeader/SectionsHeader';

export default function WorkFlow() {
  const data = [
    {
      count: 1,
      title: "أدخل موقعك",
      description:
        "أخبرنا أين أنت وأين تريد الذهاب. استخدم GPS أو اكتب عنوانك.",
      icon: MapPin,
    },
    {
      count: 2,
      title: "اختر مسارك",
      description:
        "اعرض جميع المسارات المتاحة مع توفر المركبات ومدة الرحلة في الوقت الفعلي.",
      icon: Route,
    },
    {
      count: 3,
      title: "احجز مقعدك",
      description: "احجز مقعدًا لمدة 5 دقائق لضمان ركوبك في أقرب رحلة متاحة.",
      icon: Ticket,
    },
    {
      count: 4,
      title: "الصعود والسفر",
      description: "توجه إلى المحطة، اعرض حجزك، واستمتع برحلة بدون عناء.",
      icon: Bus,
    },
  ];

  return (
    <div className="max-w-screen min-h-screen flex flex-col justify-center items-center bg-[#f8f7f7] overflow-x-hidden py-20 text-center">
      <SectionsHeader
        title={"كيف تعمل الخدمة"}
        desc={"        رحلتك في 4 خطوات بسيطة"}
        article={
          "        الوصول إلى وجهتك أصبح أسهل من أي وقت مضى. اتبع هذه الخطوات البسيطة."
        }
      />
      <div className="relative w-full flex justify-center">
        <div
          className="hidden lg:flex absolute left-0 right-0 top-[26%] h-0.5 
     bg-linear-to-r from-transparent via-teal-700 to-transparent 
     mx-40 z-10"
        ></div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {data.map((item, index) => (
            <SharedIndicator
              key={index}
              index={index}
              count={item.count}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
