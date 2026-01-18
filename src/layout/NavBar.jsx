import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bus, MapPin, User, Sun } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetAuthState } from "../store/slices/authSlice";
import { fetchNearStations } from "../store/slices/Transportation/getNearStations";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isLoggedIn = isAuthenticated && user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(resetAuthState());

    navigate("/auth", { replace: true });
    setMenuOpen(false);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        dispatch(fetchNearStations({ lat, lng }));

        setTimeout(() => {
          window.location.href = "/home#near-stations";
        }, 100);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please enable location access to find near stations.");
      }
    );
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <div>
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
        }}
        className="w-full transition-colors duration-300 fixed z-50"
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-0">
          {/* Logo + Name */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-mainColor flex items-center justify-center text-white shadow">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-lg sm:ms-5 text-mainColor font-semibold">
              موقف
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded-xl bg-[#b8d4d7] text-[#0e6b73]"
                  : "px-3 py-2 rounded-xl hover:bg-white hover:text-black transition"
              }
            >
              الرئيسية
            </NavLink>
            <NavLink
              to="/stations"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded-xl bg-[#b8d4d7] text-[#0e6b73]"
                  : "px-3 py-2 rounded-xl hover:bg-white hover:text-black transition"
              }
            >
              المحطات
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded-xl bg-[#b8d4d7] text-[#0e6b73]"
                  : "px-3 py-2 rounded-xl hover:bg-white hover:text-black transition"
              }
            >
              المجتمع
            </NavLink>

            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded-xl bg-[#b8d4d7] text-mainColor"
                  : "px-3 py-2 rounded-xl hover:bg-white hover:text-black transition"
              }
            >
              المتجر
            </NavLink>

            <NavLink
              to={`/profile/${userId}`}
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded-xl bg-[#b8d4d7] text-mainColor"
                  : "px-3 py-2 rounded-xl hover:bg-white hover:text-black transition"
              }
            >
              الملف الشخصي
            </NavLink>
          </nav>

          {/* Icons + Mobile button */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handleLocationClick}
              className="p-2 md:p-3 rounded-2xl cursor-pointer hover:bg-gray-300 transition"
            >
              <MapPin color="black" className="w-5 h-5" />
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 md:px-5 py-2 bg-red-500 text-white hidden lg:block rounded-xl shadow-md hover:shadow-lg hover:bg-red-600 transition text-sm md:text-base"
              >
                تسجيل الخروج
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="px-4 md:px-5 py-2 bg-[#0e6b73] text-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#1D757F] transition text-sm md:text-base"
              >
                <User className="w-4 h-4 inline me-2" />
                تسجيل الدخول
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              className="flex flex-col justify-between me-5 w-6 h-6 p-1 cursor-pointer md:flex lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="block h-0.5 w-full rounded bg-gray-600"></span>
              <span className="block h-0.5 w-full rounded bg-gray-600"></span>
              <span className="block h-0.5 w-full rounded bg-gray-600"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="bg-[#d5e5e8] px-4 py-4 flex flex-col gap-2 lg:hidden">
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-xl text-black hover:bg-white hover:text-black transition"
            >
              الرئيسية
            </NavLink>
            <NavLink
              to="/stations"
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-xl text-black hover:bg-white hover:text-black transition"
            >
              المحطات
            </NavLink>
            <NavLink
              to="/community"
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-xl text-black hover:bg-white hover:text-black transition"
            >
              المجتمع
            </NavLink>
            <NavLink
              to="/marketplace"
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-xl text-black hover:bg-white hover:text-black transition"
            >
              المتجر
            </NavLink>
            <NavLink
              to={`/profile/${userId}`}
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-xl text-black hover:bg-white hover:text-black transition"
            >
              الملف الشخصي
            </NavLink>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-xl shadow-md hover:shadow-lg hover:bg-red-600 transition"
              >
                تسجيل الخروج
              </button>
            ) : (
              <NavLink
                to="/auth"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-5 py-2 bg-[#0e6b73] text-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#1D757F] transition"
              >
                <User className="w-4 h-4" />
                تسجيل الدخول
              </NavLink>
            )}
          </nav>
        )}
      </header>
    </div>
  );
}
