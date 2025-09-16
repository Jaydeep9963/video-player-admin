import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useGetOverviewQuery } from "../../store/slices/api";
import { getImageUrl } from "../../config/api";
import { formatDuration } from "../../utils/formatUtils";

// Define the TypeScript interface for recent items
interface RecentItem {
  _id: string;
  title: string;
  description: string;
  duration: number;
  category?: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
  };
  platform: string;
  thumbnailPath: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function RecentOrders() {
  const { data: overviewData, isLoading, error } = useGetOverviewQuery();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading recent videos</div>
        </div>
      </div>
    );
  }

  const recentItems: RecentItem[] = overviewData?.recentItems || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recently Added Videos
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Video
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Duration
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Subcategory
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Platform
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No recent videos found
                </TableCell>
              </TableRow>
            ) : (
              recentItems.map((item) => (
                <TableRow key={item._id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <img
                          src={getImageUrl(item.thumbnailPath)}
                          className="h-[50px] w-[50px] object-cover"
                          alt={item.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                          {item.title}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDuration(item.duration)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.category?.name || '-'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.subcategory?.name || '-'}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      variant="light"
                      color={item.platform === 'youtube' ? 'error' : 'info'}
                    >
                      {item.platform === 'youtube' ? 'YouTube' : 'Uploaded'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      variant="light"
                      color={item.type === 'video' ? 'primary' : 'warning'}
                    >
                      {item.type === 'video' ? 'Video' : 'Short'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
