import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { LogOut } from "lucide-react";

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/auth/login" />;

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-[#f6f7f9]" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar for mobile or extra actions can go here */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800">لوحة التحكم</h2>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={18} /> تسجيل الخروج
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 font-cairo">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
