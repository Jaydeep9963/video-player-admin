import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useState } from "react";
import { useGetFeedbackQuery } from "../../store/slices/api";

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Helper function to get random color for avatar
const getAvatarColor = (name: string): string => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
  const index = name.length % colors.length;
  return colors[index];
};

export default function ViewUserReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: feedback = [], isLoading, error } = useGetFeedbackQuery({ search: searchTerm });

  const filteredFeedback = feedback.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mobile.includes(searchTerm)
  );

  return (
    <div>
      <PageMeta
        title="View Feedbacks | TailAdmin - Video Player Admin Dashboard"
        description="View user feedbacks page for TailAdmin - Video Player Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Feedbacks" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Card Header with Search */}
          <div className="px-6 py-5">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                View Feedbacks
              </h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-4">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Feedbacks
                </h3>
              </div>
              
              {/* Search Box - Full Width on Mobile */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="mx-auto w-full max-w-[1400px]">
              {isLoading && (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">Loading feedback...</div>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="text-red-500 dark:text-red-400">Error loading feedback. Please try again.</div>
                </div>
              )}

              {!isLoading && !error && (
                <>
                  {filteredFeedback.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No feedback found matching your search.' : 'No feedback available.'}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredFeedback.map((item) => (
                        <div key={item._id} className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
                          {/* Header with user info and feedback badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`h-10 w-10 rounded-full ${getAvatarColor(item.name)} flex items-center justify-center text-white font-medium text-sm`}>
                                {getInitials(item.name)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(item.createdAt)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Mobile: {item.mobile}</p>
                              </div>
                            </div>
                            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Feedback
                            </span>
                          </div>

                          {/* Description */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Footer with received date and action buttons */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <span>📝</span>
                                <span>User Feedback</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>📅</span>
                                <span>Received on {new Date(item.createdAt).toLocaleDateString()}</span>
                              </span>
                            </div>
                            {/* <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-700 dark:text-green-400 text-xs font-medium">
                                Mark as Read
                              </button>
                              <button className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                                Flag
                              </button>
                              <button className="text-red-600 hover:text-red-700 dark:text-red-400 text-xs font-medium">
                                Delete
                              </button>
                            </div> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
