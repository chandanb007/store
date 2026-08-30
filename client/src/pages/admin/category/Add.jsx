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
const Add = ({handleCreate,setNewCatName,setNewCatDes,newCatName,newCatDes }) => {
    return (
        <>
       
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

        </>
    )
}

export default Add;