import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import NotificationApiService from '../../services/notification-api.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast notification function
const toastMessage = {
    success: (message: string) => {
        toast.success('Success: ' + message);
    },
    error: (message: string) => {
        toast.error('Error: ' + message);
    },
    warn: (message: string) => {
        toast.warn('Warning: ' + message);
    }
};

export default function SendNotification() {
    const [aboutText, setAboutText] = useState<string>('');
    const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [tokensLoading, setTokensLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const editorRef = useRef<any>(null);

    // Helper function to strip HTML tags and decode HTML entities
    const stripHtmlTags = (html: string): string => {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const text = temp.textContent || temp.innerText || '';
        return text.replace(/\s+/g, ' ').trim();
    };

    // Helper function to generate timestamp
    const generateTimestamp = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Fetch token count
    const fetchTokens = async () => {
        try {
            setTokensLoading(true);
            const response = await NotificationApiService.getAllNotificationTokens();
            if (response && response.results) {
                setTokenCount(response.results.length);
            } else if (response && response.total !== undefined) {
                setTokenCount(response.total);
            } else {
                setTokenCount(0);
            }
        } catch (error: any) {
            setTokenCount(0);
            toastMessage.error(`Failed to fetch notification tokens: ${error.message}`);
        } finally {
            setTokensLoading(false);
        }
    };

    useEffect(() => {
        fetchTokens();
        const interval = setInterval(() => {
            fetchTokens();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEditorLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = async () => {
        const plainTextContent = stripHtmlTags(aboutText);
        if (!plainTextContent.trim()) {
            toastMessage.error('Please fill in the content');
            return;
        }
        await fetchTokens();
        try {
            setLoading(true);
            if (tokenCount === 0) {
                toastMessage.warn('No notification tokens found, but attempting to send...');
            }
            const response = await NotificationApiService.sendNotificationToAll({
                data: {
                    title: 'Music Player',
                    msg: plainTextContent,
                    notification_at: generateTimestamp(),
                }
            });
            if (response.data) {
                toastMessage.success(
                    `${response.message || 'Notification sent successfully!'} 
                     Sent: ${response.data.totalSent}, 
                     Success: ${response.data.totalSuccess}, 
                     Failed: ${response.data.totalFailure}`
                );
            } else {
                toastMessage.success(response.message || 'Notification sent successfully!');
            }
            setAboutText('');
            if (editorRef.current) {
                editorRef.current.setData('');
            }
            setTimeout(() => {
                fetchTokens();
            }, 1000);
        } catch (error: any) {
            toastMessage.error(error.message || 'Failed to send notification');
            setTimeout(() => {
                fetchTokens();
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setAboutText('');
        if (editorRef.current) {
            editorRef.current.setData('');
        }
    };

    const handleRefreshTokens = () => {
        fetchTokens();
    };

    return (
        <div>
            {/* Add ToastContainer here! */}
            <ToastContainer autoClose={4000} position="bottom-right"/>
            <PageMeta
                title="Send Notification | TailAdmin - Next.js Admin Dashboard Template"
                description="This is Send Notification page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Send Notification" />
            <div className="min-h-screen flex justify-center px-4 py-8">
                <div className="w-full max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {tokensLoading
                                        ? 'Loading token count...'
                                        : tokenCount > 0
                                            ? `Notification will be sent to ${tokenCount} device${tokenCount > 1 ? 's' : ''}`
                                            : 'No notification tokens available to send notifications'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={handleRefreshTokens}
                                disabled={tokensLoading}
                                className="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {tokensLoading ? 'Loading...' : 'Refresh Tokens'}
                            </button>
                        </div>
                        {/* Editor Container */}
                        <div className="mb-6">
                            <div className="border border-gray-300 dark:border-gray-500 overflow-hidden bg-white dark:bg-gray-700">
                                {editorLoaded ? (
                                    <div className="ck-editor-container">
                                        <style>{`
                      .ck-editor-container .ck-editor__editable {
                        min-height: 80px;
                        padding: 20px;
                        font-size: 14px;
                        line-height: 1.6;
                        border: none;
                        outline: none;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        word-break: break-word;
                        white-space: pre-wrap;
                        max-width: 100%;
                        box-sizing: border-box;
                      }
                      
                      .ck-editor-container .ck-toolbar {
                        border: none;
                        border-bottom: 1px solid #d1d5db;
                        background: #f9fafb;
                        padding: 12px 16px;
                        border-radius: 0;
                      }
                      
                      .ck-editor-container .ck-editor {
                        border: none;
                      }
                      
                      .ck-editor-container .ck-content {
                        border: none;
                        outline: none;
                      }
                      
                      .ck-editor-container .ck-content p,
                      .ck-editor-container .ck-content div,
                      .ck-editor-container .ck-content span {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        word-break: break-word !important;
                        max-width: 100% !important;
                      }
                      
                      .ck-editor-container .ck-powered-by {
                        display: none;
                      }
                      
                      /* Enhanced Dark mode styles */
                      .dark .ck-editor-container .ck-toolbar {
                        background: #374151 !important;
                        border-bottom-color: #4b5563 !important;
                        color: #f3f4f6 !important;
                      }
                      
                      .dark .ck-editor-container .ck-editor__editable {
                        background: #1f2937 !important;
                        color: #f3f4f6 !important;
                      }
                      
                      /* Dark mode toolbar buttons */
                      .dark .ck-editor-container .ck-button {
                        background: transparent !important;
                        color: #d1d5db !important;
                        border: none !important;
                      }
                      
                      .dark .ck-editor-container .ck-button:hover {
                        background: #4b5563 !important;
                        color: #f3f4f6 !important;
                      }
                      
                      .dark .ck-editor-container .ck-button.ck-on {
                        background: #3b82f6 !important;
                        color: #ffffff !important;
                      }
                      
                      .dark .ck-editor-container .ck-button.ck-on:hover {
                        background: #2563eb !important;
                      }
                      
                      /* Dark mode icons */
                      .dark .ck-editor-container .ck-icon {
                        color: #d1d5db !important;
                        fill: #d1d5db !important;
                      }
                      
                      .dark .ck-editor-container .ck-button:hover .ck-icon {
                        color: #f3f4f6 !important;
                        fill: #f3f4f6 !important;
                      }
                      
                      .dark .ck-editor-container .ck-button.ck-on .ck-icon {
                        color: #ffffff !important;
                        fill: #ffffff !important;
                      }
                      
                      /* Dark mode dropdown */
                      .dark .ck-editor-container .ck-dropdown__panel {
                        background: #374151 !important;
                        border: 1px solid #4b5563 !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
                      }
                      
                      .dark .ck-editor-container .ck-list__item {
                        color: #d1d5db !important;
                      }
                      
                      .dark .ck-editor-container .ck-list__item:hover {
                        background: #4b5563 !important;
                        color: #f3f4f6 !important;
                      }
                      
                      .dark .ck-editor-container .ck-list__item.ck-on {
                        background: #3b82f6 !important;
                        color: #ffffff !important;
                      }
                      
                      /* Dark mode separator */
                      .dark .ck-editor-container .ck-toolbar__separator {
                        background: #4b5563 !important;
                      }
                      
                      /* Dark mode tooltip */
                      .dark .ck-editor-container .ck-tooltip {
                        background: #1f2937 !important;
                        color: #f3f4f6 !important;
                        border: 1px solid #4b5563 !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
                      }
                      
                      .dark .ck-editor-container .ck-tooltip__text {
                        color: #f3f4f6 !important;
                      }
                      
                      /* Dark mode heading dropdown styles */
                      .dark .ck-editor-container .ck-heading-dropdown .ck-button__label {
                        color: #d1d5db !important;
                      }
                      
                      .dark .ck-editor-container .ck-dropdown__button:hover .ck-button__label {
                        color: #f3f4f6 !important;
                      }
                      
                      /* Dark mode link balloon */
                      .dark .ck-editor-container .ck-balloon-panel {
                        background: #374151 !important;
                        border: 1px solid #4b5563 !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
                      }
                      
                      .dark .ck-editor-container .ck-input {
                        background: #1f2937 !important;
                        color: #f3f4f6 !important;
                        border: 1px solid #4b5563 !important;
                      }
                      
                      .dark .ck-editor-container .ck-input:focus {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
                      }
                      
                      /* Dark mode blockquote styling */
                      .dark .ck-editor-container .ck-content blockquote {
                        border-left: 4px solid #4b5563 !important;
                        background: #374151 !important;
                        color: #d1d5db !important;
                      }
                      
                      /* Dark mode list styling */
                      .dark .ck-editor-container .ck-content ul,
                      .dark .ck-editor-container .ck-content ol {
                        color: #f3f4f6 !important;
                      }
                      
                      /* Dark mode heading styling */
                      .dark .ck-editor-container .ck-content h1,
                      .dark .ck-editor-container .ck-content h2,
                      .dark .ck-editor-container .ck-content h3,
                      .dark .ck-editor-container .ck-content h4,
                      .dark .ck-editor-container .ck-content h5,
                      .dark .ck-editor-container .ck-content h6 {
                        color: #f9fafb !important;
                      }
                      
                      /* Dark mode link styling */
                      .dark .ck-editor-container .ck-content a {
                        color: #60a5fa !important;
                      }
                      
                      .dark .ck-editor-container .ck-content a:hover {
                        color: #93c5fd !important;
                      }
                    `}</style>
                                        <CKEditor
                                            editor={ClassicEditor as any}
                                            data=""
                                            onReady={(editor: any) => {
                                                editorRef.current = editor;
                                                if (aboutText) {
                                                    setTimeout(() => {
                                                        editor.setData(aboutText);
                                                    }, 100);
                                                }
                                            }}
                                            onChange={(_event: any, editor: any) => {
                                                const data = editor.getData();
                                                setAboutText(data);
                                            }}
                                            config={{
                                                licenseKey: 'GPL',
                                                placeholder: 'Enter notification content... (HTML formatting will be removed when sending)',
                                                toolbar: {
                                                    items: [
                                                        'undo', 'redo', '|',
                                                        'heading', '|',
                                                        'bold', 'italic', 'link', '|',
                                                        'bulletedList', 'numberedList', '|',
                                                        'blockQuote', '|',
                                                        'outdent', 'indent'
                                                    ],
                                                    shouldNotGroupWhenFull: true
                                                },
                                                heading: {
                                                    options: [
                                                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                                                    ]
                                                }
                                            } as any}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-80 bg-gray-50 dark:bg-gray-900">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                            <p className="text-gray-600 dark:text-gray-400">Loading editor...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Preview */}
                        {aboutText && (
                            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Preview (Plain text that will be sent):
                                </h4>
                                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                                    {stripHtmlTags(aboutText) || 'Empty message'}
                                </p>
                            </div>
                        )}
                        {/* Warning for no tokens */}
                        {tokenCount === 0 && !tokensLoading && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    ⚠️ Warning: No notification tokens found. The notification may not be delivered to any devices.
                                </p>
                            </div>
                        )}
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4">
                            <button
                                onClick={handleSend}
                                disabled={!stripHtmlTags(aboutText).trim() || loading || tokensLoading}
                                className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Notification'}
                            </button>
                            <button
                                onClick={handleClear}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
