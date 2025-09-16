import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useGetVideosQuery, useDeleteVideoMutation } from "../../store/slices/api";
import { getFreshImageUrl } from "../../config/api";
import { Video } from "../../store/types";
import AddVideoModal from "../../components/modals/AddVideoModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import VideoDetailsModal from "../../components/modals/VideoDeatailsModal";

function VideosTable({ searchTerm, onEditVideo, onViewVideo }: { searchTerm: string; onEditVideo: (video: Video) => void; onViewVideo: (video: Video) => void }) {
  const { data: videos = [], isLoading, error } = useGetVideosQuery({ search: searchTerm });
  const [deleteVideo] = useDeleteVideoMutation();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    video: any;
    isDeleting: boolean;
  }>({
    isOpen: false,
    video: null,
    isDeleting: false,
  });

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (video: Video) => {
    onEditVideo(video);
  };

  const handleDeleteClick = (video: any) => {
    setDeleteModal({
      isOpen: true,
      video,
      isDeleting: false,
    });
  };

  // Add this function to handle view click
  const handleViewClick = (video: Video) => {
    onViewVideo(video);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.video) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteVideo(deleteModal.video._id).unwrap();
      setDeleteModal({
        isOpen: false,
        video: null,
        isDeleting: false,
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        video: null,
        isDeleting: false,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
          Loading videos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-8 text-center text-red-500 dark:text-red-400">
          Error loading videos. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                #
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Thumbnail
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Title
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Duration
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Views
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Platform
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredVideos.map((video, index) => (
              <TableRow key={video._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="w-20 h-12 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    {video.thumbnailPath ? (
                      <img 
                        src={getFreshImageUrl(video.thumbnailPath)} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {video.title}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {video.description.length > 50 ? `${video.description.substring(0, 50)}...` : video.description}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {video.durationFormatted}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {video.views.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    variant="light"
                    color={video.platform === 'youtube' ? 'error' : 'info'}
                  >
                    {video.platform === "upload" ? "Uploaded" : "YouTube"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    variant="light"
                    color={video.isPublished ? 'success' : 'warning'}
                  >
                    {video.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(video)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit Video"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(video)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Video"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewClick(video)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="View Video Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredVideos.length === 0 && !isLoading && (
        <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
          No videos found matching your search.
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Video"
        message={`Are you sure you want to delete the video`}
        itemName={deleteModal.video?.title}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
}

export default function ManageVideos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  // Add these new state variables for the details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditVideo = (video: Video) => {
    setEditVideo(video);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditVideo(null);
  };

  // Add these new handler functions for the details modal
  const handleViewVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <PageMeta
        title="Videos | TailAdmin - Video Player Admin Dashboard"
        description="Manage videos page for TailAdmin - Video Player Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Videos" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Card Header with Search and Add Button */}
          <div className="px-6 py-5">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Manage Videos
              </h3>
              <div className="flex items-center gap-4">
                {/* Search Box */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
                {/* Add Video Button */}
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Video
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-4">
              {/* Header and Button Row */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Manage Videos
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Video
                </button>
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
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">
              <VideosTable searchTerm={searchTerm} onEditVideo={handleEditVideo} onViewVideo={handleViewVideo} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />

      {/* Edit Video Modal */}
      <AddVideoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editVideo={editVideo}
      />

      {/* Video Details Modal */}
      <VideoDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        video={selectedVideo}
      />
    </>
  );
}