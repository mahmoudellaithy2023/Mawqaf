import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Bus,
  GitCommit,
  UserPlus,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const role = user?.role;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive(path)
        ? "bg-[#b8d4d7] text-[#0e6b73] shadow-sm"
        : "text-gray-600 hover:bg-white hover:text-black hover:shadow-sm"
    }`;

  return (
    <div
      className="bg-[#f6f7f9] w-72 min-h-screen flex flex-col border-l border-gray-200 font-cairo"
      dir="rtl"
    >
      <div className="p-6 flex items-center justify-center border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0e6b73] flex items-center justify-center text-white shadow-md">
            <Bus className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#0e6b73]">موقف</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="flex flex-col gap-2">
          {/* MANAGER LINKS */}
          {role === "MANAGER" && (
            <>
              <li className="px-4 text-xs font-bold uppercase text-gray-400 mb-2">
                المدير
              </li>
              <li>
                <Link
                  to="/manager/dashboard"
                  className={linkClass("/manager/dashboard")}
                >
                  <LayoutDashboard size={20} />
                  لوحة التحكم
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/stations"
                  className={linkClass("/manager/stations")}
                >
                  <MapPin size={20} />
                  الـمـحطات
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/community"
                  className={linkClass("/manager/community")}
                >
                  <Users size={20} />
                  المجتمع
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/create-account"
                  className={linkClass("/manager/create-account")}
                >
                  <UserPlus size={20} />
                  إنشاء حساب
                </Link>
              </li>
            </>
          )}

          {/* ADMIN LINKS */}
          {role === "ADMIN" && (
            <>
              <li className="px-4 text-xs font-bold uppercase text-gray-400 mb-2">
                المشرف
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className={linkClass("/admin/dashboard")}
                >
                  <LayoutDashboard size={20} />
                  نظرة عامة
                </Link>
              </li>
              <li>
                <Link to="/admin/lines" className={linkClass("/admin/lines")}>
                  <GitCommit size={20} />
                  الخطوط
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/vehicles"
                  className={linkClass("/admin/vehicles")}
                >
                  <Bus size={20} />
                  المركبات
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="avatar placeholder">
            <div className="bg-mainColor text-white rounded-xl w-10 flex items-center justify-center"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-bold text-gray-800 truncate"
              style={{ direction: "ltr" }}
            >
              {user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate font-medium">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
