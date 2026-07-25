import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Sparkles,
  Tag,
  Check,
  CirclePlus,
} from "lucide-react";
const ProductListing = ({ products }) => {
  return (
    <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden text-xs">
      <div className="overflow-x-auto text-gold-600">
        <table className="w-full text-left font-sans text-[#2D2926] dark:text-stone-105">
          <thead>
            <tr className="border-b border-stone-150 dark:border-stone-850 text-stone-400 uppercase tracking-widest text-[9px] font-bold bg-[#FDFCF8] dark:bg-stone-955/20">
              <th className="py-3 px-4">Item Detail</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Sovereign Price</th>
              <th className="py-3 px-4">Stock level</th>
              <th className="py-3 px-4">Properties</th>
              <th className="py-3 px-4 text-center">Admin Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-105 dark:divide-stone-850/40 text-stone-700 dark:text-stone-300 font-medium whitespace-nowrap">
            {products.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-[#FDFCF8] dark:hover:bg-stone-950/10 transition-colors"
              >
                {/* Title and image block */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-white border border-stone-150 dark:border-[#D4AF37]/15 flex-shrink-0 animate-fade-in animate-dur-300">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="max-w-64 truncate">
                    <p className="font-serif font-bold text-[#2D2926] dark:text-stone-100 truncate">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">
                      {p.description}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-955/20 text-[10px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-200 flex items-center gap-1 w-fit border border-[#D4AF37]/20">
                    <Tag className="w-3 h-3 text-gold-600" />
                    {p.category.name}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-bold text-[#2D2926] dark:text-gold-200 font-sans">
                  {/* ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                  {p.discountPrice && (
                    <span className="text-[10px] text-stone-400 line-through block font-medium font-sans">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  )} */}
                </td>

                {/* Inventory stock */}
                <td className="py-3 px-4">
                  <span
                    className={`font-bold font-mono text-xs flex items-center gap-1.5 ${
                      p.inventory <= 5
                        ? "text-amber-600 animate-pulse font-sans"
                        : "text-stone-850 dark:text-white font-sans"
                    }`}
                  >
                    {p.inventory <= 5 && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    {p.inventory} Sku
                  </span>
                </td>

                {/* Tags */}
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {p.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[9px] text-gold-700 dark:text-gold-300 font-bold">
                        Featured
                      </span>
                    )}
                    {p.isTrending && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-955/30 text-[9px] text-sky-700 dark:text-sky-305 font-bold">
                        Trending
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-955/35 text-[9px] text-amber-705 dark:text-amber-305 font-bold">
                        BestSell
                      </span>
                    )}
                  </div>
                </td>

                {/* edit or delete click actions */}
                <td className="py-3 px-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-gold-500 hover:border-gold-300 dark:hover:border-gold-700 hover:scale-105 transition-all cursor-pointer"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-850 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-955/10 text-stone-400 hover:text-rose-555 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Dismantle Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductListing;
