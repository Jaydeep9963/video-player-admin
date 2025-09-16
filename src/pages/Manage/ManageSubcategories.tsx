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
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useGetSubcategoriesQuery, useDeleteSubcategoryMutation } from "../../store/slices/api";
import { getFreshImageUrl } from "../../config/api";
import { Subcategory } from "../../store/types";
import AddSubcategoryModal from "../../components/modals/AddSubcategoryModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

function SubcategoriesTable({ searchTerm, onEditSubcategory }: { searchTerm: string; onEditSubcategory: (subcategory: Subcategory) => void }) {
  const { data: subcategories = [], isLoading, error } = useGetSubcategoriesQuery({ search: searchTerm });
  const [deleteSubcategory] = useDeleteSubcategoryMutation();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    subcategory: any;
    isDeleting: boolean;
  }>({
    isOpen: false,
    subcategory: null,
    isDeleting: false,
  });

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (subcategory: Subcategory) => {
    onEditSubcategory(subcategory);
  };

  const handleDeleteClick = (subcategory: any) => {
    setDeleteModal({
      isOpen: true,
      subcategory,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.subcategory) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteSubcategory(deleteModal.subcategory._id).unwrap();
      setDeleteModal({
        isOpen: false,
        subcategory: null,
        isDeleting: false,
      });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        subcategory: null,
        isDeleting: false,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
          Loading subcategories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-8 text-center text-red-500 dark:text-red-400">
          Error loading subcategories. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
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
                  Image
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Subcategory Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Parent Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Videos Count
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
              {filteredSubcategories.map((subcategory, index) => (
                <TableRow key={subcategory._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="w-12 h-12 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                      {subcategory.image ? (
                        <img
                          src={getFreshImageUrl(subcategory.image)}
                          alt={subcategory.name}
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
                      {subcategory.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subcategory.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subcategory.category && typeof subcategory.category !== "string"
                      ? subcategory.category.name
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subcategory.videoCount || 0}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditClick(subcategory)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(subcategory)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredSubcategories.length === 0 && !isLoading && (
          <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No subcategories found matching your search.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Subcategory"
        message="Are you sure you want to delete this subcategory"
        itemName={deleteModal.subcategory?.name}
        isDeleting={deleteModal.isDeleting}
      />
    </>
  );
}

export default function ManageSubcategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState<Subcategory | null>(null);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditSubcategory(subcategory);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditSubcategory(null);
  };

  return (
    <>
      <PageMeta
        title="Subcategories | TailAdmin - Video Player Admin Dashboard"
        description="Manage video subcategories page for TailAdmin - Video Player Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Subcategories" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Card Header with Search and Add Button */}
          <div className="px-6 py-5">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Manage Subcategories
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
                    placeholder="Search subcategories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
                {/* Add Subcategory Button */}
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Subcategory
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-4">
              {/* Header and Button Row */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Manage Subcategories
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Subcategory
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
                  placeholder="Search subcategories..."
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
              <SubcategoriesTable searchTerm={searchTerm} onEditSubcategory={handleEditSubcategory} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      <AddSubcategoryModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />

      {/* Edit Subcategory Modal */}
      <AddSubcategoryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editSubcategory={editSubcategory}
      />
    </>
  );
}
