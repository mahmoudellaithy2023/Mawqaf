export default function LineCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white animate-pulse">
      {/* Header */}
      <div
        className="bg-gradient-to-l from-gray-100 to-gray-200 p-4"
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="h-10 w-10 rounded-xl bg-gray-300" />

          <div className="flex-1 space-y-2">
            {/* From -> To */}
            <div className="h-4 w-3/4 rounded bg-gray-300" />
            {/* Distance */}
            <div className="h-3 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 rounded bg-gray-300" />
          <div className="h-5 w-16 rounded-full bg-gray-200" />
        </div>

        <div className="h-6 w-12 rounded bg-gray-300" />
      </div>

      <div className="h-1 w-full bg-gray-200" />
    </div>
  );
}
