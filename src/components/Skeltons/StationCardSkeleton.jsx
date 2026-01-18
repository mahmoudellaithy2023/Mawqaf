// StationCardSkeleton.jsx
export default function StationCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white animate-pulse">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4" dir="rtl">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="h-11 w-11 rounded-xl bg-gray-200" />

            <div className="space-y-2">
              {/* Station name */}
              <div className="h-4 w-32 rounded bg-gray-200" />

              {/* Nearest badge */}
              <div className="h-3 w-20 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Arrow */}
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>

        {/* Info */}
        <div className="flex items-center justify-between" dir="rtl">
          <div className="flex items-center gap-4">
            {/* Lines */}
            <div className="h-3 w-16 rounded bg-gray-200" />

            {/* Distance */}
            <div className="h-3 w-10 rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="space-y-1 text-left">
            <div className="h-3 w-12 rounded bg-gray-200 ml-auto" />
            <div className="h-5 w-14 rounded bg-gray-200 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
