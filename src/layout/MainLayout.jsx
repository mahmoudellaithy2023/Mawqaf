import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";
import { AnimatePresence } from "framer-motion";
import AIButton from "../components/aiAssistant/AIButton";
import AIChatBox from "../components/aiAssistant/AIChatBox";

export default function MainLayout() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Outlet />
      {!isChatPage && <AIButton onClick={() => setOpen(true)} />}

      <AnimatePresence>
        {open && <AIChatBox close={() => setOpen(false)} />}
      </AnimatePresence>
      <Footer />
    </>
  );
}
