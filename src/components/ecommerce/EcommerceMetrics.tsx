import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  BoxIconLine,
  FolderIcon,
  VideoIcon,
  ShootingStarIcon,
  ChatIcon,
} from "../../icons";
import { useGetOverviewQuery } from "../../store/slices/api";
import { useNavigate } from 'react-router';
// import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const navigate = useNavigate();
  const { data: overview, isLoading, error } = useGetOverviewQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="mt-5">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="text-red-600 dark:text-red-400 text-center">
          Error loading overview data. Please try again.
        </div>
      </div>
    );
  }

  const counts = overview?.counts || {
    categories: 0,
    subcategories: 0,
    videos: 0,
    shorts: 0,
    feedback: 0
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {/* <!-- Total Categories Card --> */}
      <div 
        onClick={() => handleCardClick('/manage/categories')}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-800/20">
          <FolderIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div className="min-w-0 flex-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
              Total Categories
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {counts.categories.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Total Categories Card End --> */}

      {/* <!-- Total Subcategories Card --> */}
      <div 
        onClick={() => handleCardClick('/manage/subcategories')}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-800/20">
          <BoxIconLine className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="min-w-0 flex-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
              Total Subcategories
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {counts.subcategories.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Total Subcategories Card End --> */}

      {/* <!-- Total Videos Card --> */}
      <div 
        onClick={() => handleCardClick('/manage/videos')}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-800/20">
          <VideoIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="min-w-0 flex-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
              Total Videos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {counts.videos.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Total Videos Card End --> */}

      {/* <!-- Total Shorts Card --> */}
      <div 
        onClick={() => handleCardClick('/manage/shorts')}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-800/20">
          <ShootingStarIcon className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="min-w-0 flex-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
              Total Shorts
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {counts.shorts.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Total Shorts Card End --> */}

      {/* <!-- Total User Reviews Card --> */}
      <div 
        onClick={() => handleCardClick('/manage/reviews')}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl dark:bg-pink-800/20">
          <ChatIcon className="text-pink-600 size-6 dark:text-pink-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="min-w-0 flex-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">
              User Reviews
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {counts.feedback.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Total User Reviews Card End --> */}
    </div>
  );
}
