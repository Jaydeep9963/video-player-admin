import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useCreateContentMutation, useUpdateContentMutation } from "../../store/slices/api";
import { useContentData } from "../../hooks/useContentData";

export default function AboutUs() {
  const [aboutText, setAboutText] = useState<string>('');
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  // Use Redux-based content management
  const { contentData, isLoading, error, refetch } = useContentData('about-us');
  const [createContent, { isLoading: isCreatingContent }] = useCreateContentMutation();
  const [updateContent, { isLoading: isUpdatingContent }] = useUpdateContentMutation();

  // Force refetch on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSave = async () => {
    try {
      if (aboutText.trim() && aboutText !== '<p></p>' && aboutText !== '<p><br></p>') {
        if (contentData?._id) {
          // Update existing content
          await updateContent({
            id: contentData._id,
            data: {
              type: 'about-us',
              content: aboutText
            }
          }).unwrap();
          console.log("Content updated successfully");
        } else {
          // Create new content
          await createContent({
            type: 'about-us',
            content: aboutText
          }).unwrap();
          console.log("Content created successfully");
          setIsCreating(false);
          refetch(); // Refetch to get the created content with ID
        }
        // You can add toast notification here
        // toast.success('Content saved successfully');
      } else {
        console.log("No content to save");
        // toast.error('Please enter some content before saving');
      }
    } catch (error) {
      console.log('Error saving content:', error);
      // toast.error('Failed to save content');
    }
  };

  const handleClear = () => {
    setAboutText('');
    if (editorRef.current) {
      editorRef.current.setData('');
    }
  };

  useEffect(() => {
    // Load existing content when component mounts or data changes
    console.log('AboutUs - useEffect triggered:', { contentData, isLoading, editorLoaded });
    
    if (contentData?.content) {
      // Content is already decoded in the Redux store
      console.log('AboutUs - Setting content:', contentData.content);
      setAboutText(contentData.content);
      setIsCreating(false);
      
      // Update editor content if editor is ready
      if (editorRef.current && editorLoaded) {
        console.log('AboutUs - Setting editor data immediately');
        editorRef.current.setData(contentData.content);
      }
    } else if (!isLoading && !contentData) {
      // No content exists, prepare for creation
      console.log('AboutUs - No content found, setting creation mode');
      setAboutText('');
      setIsCreating(true);
      
      // Clear editor content if editor is ready
      if (editorRef.current && editorLoaded) {
        editorRef.current.setData('');
      }
    }
  }, [contentData, isLoading, editorLoaded]);

  // Separate effect to handle editor content when editor becomes ready
  useEffect(() => {
    if (editorRef.current && editorLoaded && aboutText) {
      console.log('AboutUs - Editor ready, setting content:', aboutText);
      setTimeout(() => {
        editorRef.current.setData(aboutText);
      }, 200);
    }
  }, [editorLoaded, aboutText]);

  // Initialize editor after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setEditorLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while fetching content
  if (isLoading) {
    return (
      <div>
        <PageMeta
          title="About Us | TailAdmin - Next.js Admin Dashboard Template"
          description="This is About Us page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <PageBreadcrumb pageTitle="About Us" />
        
        <div className="min-h-screen flex justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center h-80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <PageMeta
          title="About Us | TailAdmin - Next.js Admin Dashboard Template"
          description="This is About Us page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <PageBreadcrumb pageTitle="About Us" />
        
        <div className="min-h-screen flex justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">Error loading content. Please try again.</p>
                <button 
                  onClick={() => refetch()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSaving = isCreatingContent || isUpdatingContent;

  return (
    <div>
      <PageMeta
        title="About Us | TailAdmin - Next.js Admin Dashboard Template"
        description="This is About Us page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="About Us" />
      
      {/* Container with max width and responsive padding */}
      <div className="min-h-screen flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Paper-like container with shadow and padding */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Status indicator */}
            {isCreating && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  No existing content found. Create new About Us content below.
                </p>
              </div>
            )}
            
            {/* Editor Container */}
            <div className="mb-6">
              <div className="border border-gray-300 dark:border-gray-500 overflow-hidden bg-white dark:bg-gray-700">
                {editorLoaded ? (
                  <div className="ck-editor-container">
                    <style>{`
                      .ck-editor-container .ck-editor__editable {
                        min-height: 300px;
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
                        console.log('AboutUs - Editor is ready to use!', editor);
                        editorRef.current = editor;
                        
                        // Set initial content if available
                        if (aboutText) {
                          console.log('AboutUs - Setting initial content in onReady:', aboutText);
                          setTimeout(() => {
                            editor.setData(aboutText);
                          }, 100);
                        }
                        
                        // Set word wrapping styles on the editable element
                        const editable = editor.ui.view.editable.element;
                        if (editable) {
                          editable.style.wordWrap = 'break-word';
                          editable.style.overflowWrap = 'break-word';
                          editable.style.wordBreak = 'break-word';
                          editable.style.whiteSpace = 'pre-wrap';
                          editable.style.maxWidth = '100%';
                        }
                      }}
                      onChange={(_event: any, editor: any) => {
                        const data = editor.getData();
                        setAboutText(data);
                        console.log('Editor content changed:', data);
                      }}
                      onError={(error: any, { willEditorRestart }: any) => {
                        console.error('CKEditor error:', error);
                        if (willEditorRestart) {
                          // The editor will be restarted, so we can try again.
                        }
                      }}
                      config={{
                        licenseKey: 'GPL',
                        placeholder: 'Enter about us content...',
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
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleSave}
                disabled={!aboutText.trim() || aboutText === '<p></p>' || aboutText === '<p><br></p>' || isSaving}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    {isCreating ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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