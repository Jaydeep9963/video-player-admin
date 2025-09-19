import React from 'react';
import { Modal } from '../ui/modal';
import Badge from '../ui/badge/Badge';
import { API_CONFIG, getFreshImageUrl } from '../../config/api';
import { Video } from '../../store/types';

interface VideoDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: Video | null;
}

const VideoDetailsModal: React.FC<VideoDetailsModalProps> = ({
    isOpen,
    onClose,
    video
}) => {
    if (!video) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fix: Construct the correct video URL
    const getVideoUrl = (filePath: string) => {
        // Remove any leading slash and ensure proper path construction
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        return `${API_CONFIG.BASE_VIDEO_URL}/${cleanPath}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Video Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                        {/* Image left aligned */}
                        <div className="mb-4">
                            <div className="w-48 h-32 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                                {video.thumbnailPath ? (
                                    <img
                                        src={getFreshImageUrl(video.thumbnailPath)}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center"><span class="text-gray-400 text-sm">No Image</span></div>';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div className="mb-4">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {video.title}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {video.description}
                            </p>
                        </div>

                        {/* Uploaded and Published Row */}
                        <div className="flex gap-2 mb-4">
                            <Badge
                                variant="light"
                                color={video.platform === 'youtube' ? 'error' : 'info'}
                            >
                                {video.platform === "upload" ? "Uploaded" : "Youtube"}
                            </Badge>
                            <Badge
                                variant="light"
                                color={video.isPublished ? 'success' : 'warning'}
                            >
                                {video.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                        </div>

                        {/* Duration, Category, Subcategory Row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Duration
                                </label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {video.durationFormatted}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Category
                                </label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {video.category.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Subcategory
                                </label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {video.subcategory.name}
                                </p>
                            </div>
                        </div>

                        {/* Created At and Updated At Row */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Created At
                                </label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {formatDate(video.createdAt)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Updated At
                                </label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {formatDate(video.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:block">
                        {/* Thumbnail and Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-shrink-0">
                                <div className="w-48 h-32 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                                    {video.thumbnailPath ? (
                                        <img
                                            src={getFreshImageUrl(video.thumbnailPath)}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center"><span class="text-gray-400 text-sm">No Image</span></div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {video.title}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {video.description}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Duration
                                    </label>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {video.durationFormatted}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Video Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <Badge
                                        variant="light"
                                        color={video.platform === 'youtube' ? 'error' : 'info'}
                                    >
                                        {video.platform === "upload" ? "Uploaded" : "Youtube"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Badge
                                        variant="light"
                                        color={video.isPublished ? 'success' : 'warning'}
                                    >
                                        {video.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Category
                                    </label>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {video.category.name}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Subcategory
                                    </label>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {video.subcategory.name}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Created At
                                    </label>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {formatDate(video.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Updated At
                                    </label>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {formatDate(video.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Information */}
                    {video.platform === 'upload' && video.filePath && (
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Video URL
                            </label>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <a
                                    href={getVideoUrl(video.filePath)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                    {getVideoUrl(video.filePath)}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* YouTube URL */}
                    {video.platform === 'youtube' && video.youtubeUrl && (
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                YouTube URL
                            </label>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <a
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                    {video.youtubeUrl}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    {video.youtubeUrl && (
                        <button
                            type="button"
                            onClick={() => window.open(video.youtubeUrl, "_blank", "noopener,noreferrer")}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            Watch on YouTube
                        </button>
                    )}
                    {video.filePath && (
                        <button
                            type="button"
                            onClick={() => {
                                // Fix: Use the same URL construction method
                                const videoUrl = getVideoUrl(video.filePath);
                                window.open(videoUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium bg-blue-500 text-white border border-transparent rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                            </svg>
                            Watch Video
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default VideoDetailsModal;