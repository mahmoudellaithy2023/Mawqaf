import React from "react";
import Hero from "./Components/Hero";
import WorkFlow from "./Components/WorkFlow";
import StationsPreview from "./Components/StationsPreview";
import Features from "./Components/Features/Features";
import NearStations from "./Components/NearStitons";
import AppAdvertisement from "../../components/AppAdvertisement";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <AppAdvertisement />
      <Hero />
      <Features />
      <NearStations />
      <WorkFlow />
      <StationsPreview />
    </div>
  );
}
