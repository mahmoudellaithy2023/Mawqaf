import { useState, useEffect } from "react";
import { Bus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState("curtain"); // "curtain" | "bus" | "exit"

  useEffect(() => {
    const stages = [
      { name: "curtain", duration: 800 },
      { name: "bus", duration: 1400 },
      { name: "exit", duration: 600 },
    ];

    let totalTime = 0;
    const timers = [];

    stages.forEach((s) => {
      totalTime += s.duration;
      const timer = setTimeout(() => {
        if (s.name === "exit") {
          if (onComplete) onComplete();
        } else {
          setStage(s.name);
        }
      }, totalTime);
      timers.push(timer);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        stage === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Left Curtain */}
      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-mainColor transform transition-transform duration-700 ease-in-out origin-left ${
          stage === "curtain"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-70"
        }`}
      >
        <div className="absolute right-0 top-0 h-full w-8 bg-primary-foreground/10" />
        <div className="absolute right-2 top-0 h-full w-1 bg-primary-foreground/20" />
      </div>

      {/* Right Curtain */}
      <div
        className={`absolute top-0 right-0 h-full w-1/2 bg-mainColor transform transition-transform duration-700 ease-in-out origin-right ${
          stage === "curtain"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-70"
        }`}
      >
        <div className="absolute left-0 top-0 h-full w-8 bg-primary-foreground/10" />
        <div className="absolute left-2 top-0 h-full w-1 bg-primary-foreground/20" />
      </div>

      {/* Bus Animation */}
      <div
        className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-1000 ease-out ${
          stage === "curtain"
            ? "translate-x-[100vw] opacity-0"
            : stage === "bus"
            ? "translate-x-0 opacity-100"
            : "-translate-x-[100vw] opacity-0"
        }`}
      >
        <div className="relative">
          {/* Bus glow effect */}
          <div className="absolute inset-0 blur-xl bg-primary/40 rounded-full scale-150" />

          {/* Bus icon */}
          <div className="relative bg-primary rounded-2xl p-6 shadow-2xl">
            <Bus className="w-16 h-16 md:w-24 md:h-24 text-primary-foreground" />
            {/* Wheels */}
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-foreground rounded-full animate-spin" />
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-foreground rounded-full animate-spin" />
          </div>

          {/* Motion lines */}
          <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 space-y-2">
            <div className="w-6 h-0.5 bg-primary/60 rounded animate-pulse" />
            <div className="w-4 h-0.5 bg-primary/40 rounded animate-pulse delay-75" />
            <div className="w-8 h-0.5 bg-primary/50 rounded animate-pulse delay-150" />
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            موقف
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            رحلتك بتبدأ من هنا
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </div>
  );
}
