import React, { useEffect } from "react";
import getAllStudents, { RoutesData } from "../components/allRoutes/RoutesData";
import RoutesCard from "./../components/allRoutes/RoutesCard";
import PageHeader from "../sharedComponents/PageHeader";

export default function AllRoutes() {
  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getAllStudents();
  //     console.log("Students Dataaaa:", data);
  //   }
  //   fetchData();
  // }, []);

  return (
    <div className="w-full pt-10 pb-20 ">
      <div className="w-[60%] mx-auto pt-20">
        <PageHeader
          title={"جميع الخطوط"}
          desc={"تصفح جميع الطرق المتاحة وابحث عن أفضل طريق إلى وجهتك."}
        />

        <div className="flex flex-col gap-6">
          {RoutesData.map((route) => (
            <RoutesCard
              key={route.routeName}
              {...route}
              vehicles={route.vehicles}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
