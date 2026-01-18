import React from "react";
import FeaturesCard from "./FeaturesCard";
import { FeaturesData } from "./FeaturesData";
import { motion } from "motion/react";
import SectionsHeader from './../../../../components/SectionsHeader/SectionsHeader';

export default function Features() {
  return (
    <div className=" bg-[#f8f7f7] py-20">
      <SectionsHeader
        title={"المميزات"}
        desc={"كل ما تحتاجه لرحلة أكثر ذكاءً"}
        article={
          "منصّتنا بتوفر لك جميع الأدوات اللي هتخلي تنقّلك اليومي أسهل وأسرع وأكثر تنظيمًا."
        }
      />

      <div className="cards flex justify-between items-center flex-wrap container w-[90%] mx-auto  ">
        {FeaturesData.map((feature) => (
          <FeaturesCard
            key={feature.id}
            icon={<feature.icon />}
            color={`${feature.color}`}
            bgColor={`${feature.bg}`}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>
    </div>
  );
}
