import React, { useState } from 'react';
import { useApp } from '../../../contexts/AppContext.jsx';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Layers,
  Check,
  Eye,
  EyeOff,
  ArchiveRestore,
} from "lucide-react";
import { getCategoryById } from "../../../services/categoryService.js";
import Add from './Add.jsx';
import Listing from './Listing.jsx';
import Filters from '../../common/Filters.jsx';

export const AdminCategories = () => {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
    toggleCategoryDisabled,
    loadCategories
  } = useApp();

  // Local component states
  const [newCatName, setNewCatName] = useState("");
  const [newCatDes, setNewCatDes] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [updatedCatName, setUpdatedCatName] = useState("");
  const [updatedCatDes, setUpdatedCatDes] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
   const [pagination,setPagination] = useState([]);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await createCategory(newCatName.trim(), newCatDes.trim());
    if (res) {
      setNewCatName("");
      setNewCatDes("");
    }
  };

  const handleStartRename = (catId, name, description) => {
    setEditingCatId(catId);
    setUpdatedCatDes(description);
    setUpdatedCatName(name);
  };

  const handleSaveRename = (e) => {
    e.preventDefault();
    if (!updatedCatName.trim() || !updatedCatDes.trim() || !editingCatId)
      return;
    updateCategory(editingCatId, updatedCatName.trim(), updatedCatDes.trim());
    setEditingCatId(null);
  };
  const handleConfirmDelete = async (catId) => {
    const response = await getCategoryById(catId);
    if (response.status == 200) {
      const count = response.data.data.productCount;
      const name = response.data.data.name;
      if (count > 0) {
        setDeleteCandidate({ name: name, count, catId });
      } else {
        deleteCategory(catId);
      }
    }
  };
  const handleExecuteDelete = () => {
    if (deleteCandidate) {
      deleteCategory(deleteCandidate.catId);
      setDeleteCandidate(null);
    }
  };
  const handleRestoreCategory = (catId) => {
    if (catId > 0) {
      restoreCategory(catId);
    }
  };
   const filterConfig = [
    {
        name: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
        width: "sm",
    },

    {
        name: "search",
        label: "Name/Description",
        type: "text",
        placeholder: "Search Category...",
        width: "lg",
    },
  ];
    const [filters, setFilters] = useState({
      status: "",
      search: "",
    });
    const handlePageChange = async (page) => {
    setPagination((prev) => ({
        ...prev,
        page,
    }));
    loadCategories({
        ...filters,
        page,
        pageSize: pagination.pageSize,
    });
      
  };
    const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
        ...prev,
        [name]: value,
    }));
  };
  
  const handleApplyFilters = () => {
     loadCategories(filters);
  };
  const handleClearFilters = () => {
    setFilters({
      status: "",
    search: "",
    })
    loadCategories();
  }
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/50 dark:border-stone-850 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Category Management
          </h1>
          <p className="text-xs text-stone-400">
            Organize household and lifestyle listings by dynamic sections.
            Modifying re-associates matching items instantly.
          </p>
        </div>
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Creator Control Form */}
          <Add
        handleCreate={handleCreate}
        setNewCatName={setNewCatName}
        setNewCatDes={setNewCatDes}
        newCatName={newCatName}
        newCatDes={newCatDes}
        />
       
        <Listing
          setPagination={setPagination}
          loadCategories={loadCategories}
          categories={categories}
          handleSaveRename={handleSaveRename}
          updatedCatName={updatedCatName}
          setUpdatedCatName={setUpdatedCatName}
          updatedCatDes={updatedCatDes}
          setEditingCatId={setEditingCatId}
          toggleCategoryDisabled={toggleCategoryDisabled}
          handleStartRename={handleStartRename}
          handleConfirmDelete={handleConfirmDelete}
          handleExecuteDelete={handleExecuteDelete} 
          editingCatId={editingCatId}        
          handleRestoreCategory={handleRestoreCategory}
          filters={filters}
          filterConfig={filterConfig}
          handleFilterChange={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Delete Confirmation Alert Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-550 border-b border-stone-100 dark:border-stone-850 pb-3">
              <AlertTriangle className="w-6 h-6 text-red-550" />
              <h4 className="font-serif text-base font-bold text-stone-950 dark:text-white">
                Cascading Category Deletion?
              </h4>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              The category{" "}
              <strong className="text-stone-900 dark:text-white">
                "{deleteCandidate.name}"
              </strong>{" "}
              has{" "}
              <strong className="text-red-500 font-extrabold">
                {deleteCandidate.count} products
              </strong>{" "}
              attached to it. Deleting the section will orphan these products.
              Do you want to proceed?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-950"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all"
              >
                Delete Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;
