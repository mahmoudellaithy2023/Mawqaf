import React from "react";

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white shadow-sm animate-pulse overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-100 rounded-full"></div>
          <div className="h-3 w-20 bg-gray-100 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-100 rounded-full"></div>
          <div className="h-3 w-12 bg-gray-100 rounded"></div>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-100 rounded-full"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-gray-50">
        <div className="space-y-1">
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
