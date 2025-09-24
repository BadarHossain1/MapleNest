export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-24 mb-2" />
        
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        
        {/* Address */}
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        
        {/* Details */}
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-8" />
          <div className="h-4 bg-gray-200 rounded w-8" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}