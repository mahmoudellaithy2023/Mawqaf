import React from "react";

export default function PhotoAuth() {
  return (
    <>
      <div
className="hidden justify-center items-center lg:flex w-full lg:w-1/2 min-h-screen photoAuthBg text-white relative overflow-hidden">
        <div className="absolute -left-24 -bottom-24 w-52 opacity-20 h-52 bg-[#c1d5d7] rounded-full " />
        <div className="absolute -right-10 -top-10  w-36 opacity-20 h-36 bg-[#93d2d2] rounded-full " />
        {/* <div className="absolute -right-24 -bottom-24  w-96  h-96 bg-[#93d2d2] rounded-full blur-3xl " /> */}

        <div className="relative z-10 flex flex-col justify-center items-center space-y-10">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-4xl">🚌</span>
            </div>
            <span className="text-5xl font-semibold tracking-tight">
              موقــــف
            </span>
          </div>

          <div className="space-y-4 max-w-md text-center">
            <h1 className="text-3xl md:text-4xl font-semibold">
              رحلتك بتبدأ من هنا
            </h1>
            <p className="text-sm md:text-base text-emerald-50/90 leading-relaxed">
              اكتشف المسارات، واحجز المقاعد، وتنقّل في وسائل النقل العام بسهولة.
              خطّط لمشاويرك اليومية أو رحلات عطلة نهاية الأسبوع في بضع نقرات
              فقط.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm md:text-base">
            <div>
              <div className="text-2xl font-semibold">50+</div>
              <div className="text-emerald-50/80 text-xs md:text-sm">
                المحطات
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">200+</div>
              <div className="text-emerald-50/80 text-xs md:text-sm">
                المسارات
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">10K+</div>
              <div className="text-emerald-50/80 text-xs md:text-sm">
                المستخدمين
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
