import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Bus,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d1f2e] text-gray-300 py-12 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#146F7B] p-3 rounded-xl">
              <Bus className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-white"> موقف</h2>
          </div>

          <p className="text-gray-400">
            نجعل النقل العام أكثر ذكاءً وأمانًا وتنظيمًا للجميع.
          </p>

          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Mail className="text-[#146F7B]" size={20} />
              <p>mawqaf.official@gmail.com</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-[#146F7B]" size={20} />
              <p>01222341270</p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-[#146F7B]" size={20} />
              <p>123 القاهرة، وسط المدينة</p>
            </div>
          </div>
        </div>

        {/* Platform */}
        <div className="lg:ms-25">
          <h3 className="text-white font-semibold mb-4">المنصة</h3>
          <ul className="grid gap-3">
            <li>
              <Link to="/stations" className="hover:text-[#146F7B]">
                البحث عن المحطات
              </Link>
            </li>

            <li>
              <Link to="/reservations" className="hover:text-[#146F7B]">
                حجوزاتي
              </Link>
            </li>
            <li>
              <Link to="/stay-tuned" className="hover:text-[#146F7B]">
                تحميل التطبيق
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="lg:ms-10">
          <h3 className="text-white font-semibold mb-4">الشركة</h3>
          <ul className="grid gap-3">
            <li>
              <Link to="/about" className="hover:text-[#146F7B]">
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#146F7B]">
                تواصل معنا
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-[#146F7B]">
                الوظائف
              </Link>
            </li>
            <li>
              <Link to="/press" className="hover:text-[#146F7B]">
                الأخبار
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="lg:me-15">
          <h3 className="text-white font-semibold mb-4">القانونية</h3>
          <ul className="grid gap-3">
            <li>
              <Link to="/terms" className="hover:text-[#146F7B]">
                شروط الخدمة
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#146F7B]">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-[#146F7B]">
                سياسة الكوكيز
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-4">
        {/* الحقوق */}
        <p className="text-gray-400 text-sm text-center md:text-right">
          © 2025 موقف. جميع الحقوق محفوظة.
        </p>

        {/* السوشيال */}
        <div className="flex gap-4 justify-center md:justify-end">
          <Link
            to="https://facebook.com"
            target="_blank"
            aria-label="Facebook"
            className="bg-[#1c2b38] p-3 rounded-2xl text-white hover:bg-[#233646] hover:scale-105 transition"
          >
            <Facebook size={20} />
          </Link>

          <Link
            to="https://twitter.com"
            target="_blank"
            aria-label="Twitter"
            className="bg-[#1c2b38] p-3 rounded-2xl text-white hover:bg-[#233646] hover:scale-105 transition"
          >
            <Twitter size={20} />
          </Link>

          <Link
            to="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
            className="bg-[#1c2b38] p-3 rounded-2xl text-white hover:bg-[#233646] hover:scale-105 transition"
          >
            <Instagram size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
