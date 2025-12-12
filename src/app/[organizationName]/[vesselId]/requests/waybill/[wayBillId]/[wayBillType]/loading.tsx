export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      <div className="flex gap-4 justify-between pr-36 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <div className="h-24 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
        <div className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}
