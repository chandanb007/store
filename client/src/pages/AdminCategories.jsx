import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
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
import { getCategoryById } from "../services/categoryService.js";

export const AdminCategories = () => {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
    toggleCategoryDisabled,
  } = useApp();

  // Local component states
  const [newCatName, setNewCatName] = useState("");
  const [newCatDes, setNewCatDes] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [updatedCatName, setUpdatedCatName] = useState("");
  const [updatedCatDes, setUpdatedCatDes] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);

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

  return (
    <div className="space-y-8 max-w-5xl">
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
        <div className="lg:col-span-4 bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3">
            <Plus className="w-5 h-5 text-gold-500" />
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              Create Category
            </h3>
          </div>

          <form
            onSubmit={handleCreate}
            className="space-y-4 text-xs font-semibold"
          >
            <div className="space-y-1.5">
              <label className="text-stone-500 dark:text-stone-400">Name</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Modern Ceramics"
                className="w-full text-xs px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-405 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-stone-500 dark:text-stone-400">
                Description
              </label>
              <textarea
                row="5"
                type="text"
                value={newCatDes}
                required
                onChange={(e) => setNewCatDes(e.target.value)}
                placeholder="Category description"
                className="w-full text-xs px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-405 focus:outline-none focus:ring-1 focus:ring-gold-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-xs active:scale-97"
            >
              Add Category
            </button>
          </form>

          <div className="text-[10px] text-stone-400 leading-relaxed bg-stone-50 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200/40 dark:border-stone-850/40">
            <span className="font-bold text-stone-500 dark:text-stone-300 block mb-1">
              💡 Administration Note:
            </span>
            New categories will not immediately populate the customer e-commerce
            filters, storefront menus, and inventory logs seamlessly.
          </div>
        </div>

        {/* Categories Main Table/Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-850 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold-500" />
              Active Catalog Layout ({categories.length})
            </h3>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-850">
            {categories.map((cat) => {
              const count = cat.productCount;
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  {isEditing ? (
                    <form
                      onSubmit={handleSaveRename}
                      className="flex-grow flex items-center gap-2"
                    >
                      <input
                        type="text"
                        required
                        value={updatedCatName}
                        onChange={(e) => setUpdatedCatName(e.target.value)}
                        className="flex-grow text-xs px-3 py-1.5 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-950 dark:text-stone-100 focus:outline-none"
                      />
                      <textarea
                        row="5"
                        type="text"
                        defaultValue={updatedCatDes}
                        required
                        onChange={(e) => setUpdatedCatDes(e.target.value)}
                        className="flex-grow text-xs px-3 py-1.5 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-950 dark:text-stone-100 focus:outline-none"
                      ></textarea>
                      <button
                        type="submit"
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-650"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-500 rounded-lg"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-50 dark:bg-stone-950 text-stone-400 rounded-lg">
                          <Tag className="w-4 h-4 text-gold-550" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block capitalize">
                              {cat.name}
                            </span>
                            {cat.status == false ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/40 dark:border-amber-800/30">
                                Disabled / Hidden
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-[#10b981]/40 dark:border-emerald-800/20">
                                Active / Visible
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-[12px] text-stone-400 capitalize">
                              {cat.description}
                              <br />
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {count} associated {count === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleCategoryDisabled(cat.id, !cat.status)
                          }
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            cat.status == false
                              ? "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-stone-400 hover:text-emerald-500"
                              : "hover:bg-amber-50 dark:hover:bg-amber-950/20 text-stone-400 hover:text-amber-500"
                          }`}
                          title={
                            cat.status == false
                              ? "Enable Category"
                              : "Disable Category"
                          }
                        >
                          {cat.status == false ? (
                            <Eye className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStartRename(cat.id, cat.name, cat.description)
                          }
                          className="p-2 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-460 hover:text-gold-550 rounded-lg transition-colors"
                          title="Rename Section"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {cat.deletedAt == null ? (
                          <button
                            type="button"
                            onClick={async () =>
                              await handleConfirmDelete(cat.id)
                            }
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-stone-460 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () =>
                              await handleRestoreCategory(cat.id)
                            }
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-stone-460 hover:text-red-500 rounded-lg transition-colors"
                            title="Undo Delete"
                          >
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-400">
                No active categories in state. Click 'Create Category' to begin
                structuring listings.
              </div>
            )}
          </div>
        </div>
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
