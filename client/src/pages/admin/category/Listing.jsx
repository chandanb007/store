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
import Pagination from "../../common/pagination";
import Filters from "../../common/Filters";
const Listing = ({categories,handleSaveRename,updatedCatName,setUpdatedCatName,updatedCatDes,setEditingCatId,toggleCategoryDisabled,handleStartRename,handleConfirmDelete,handleExecuteDelete,editingCatId,handleRestoreCategory,loadCategories,setPagination,filters,filterConfig,handleFilterChange,handleClearFilters,handleApplyFilters,pagination,handlePageChange}) => {

    return (
        <>
        {/* Categories Main Table/Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
           <Filters
        filters={filterConfig}
        values={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}>                    
        </Filters>
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-850 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold-500" />
              Active Catalog Layout ({categories.length})
            </h3>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-850">
            {categories?.categories?.map((cat) => {
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
            <Pagination 
            currentPage={categories?.pagination?.page}
          totalPages={categories?.pagination?.totalPages}
          onPageChange={handlePageChange}
          totalItems={categories?.pagination?.total}
          pageSize={categories?.pagination?.pageSize}     />
            {categories?.categories?.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-400">
                No active categories in state. Click 'Create Category' to begin
                structuring listings.
              </div>
            )}
          </div>
        </div>
        </>
    )
}

export default Listing;