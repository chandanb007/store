import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { Plus, Edit2, Trash2, X, AlertTriangle, Sparkles, Tag, Check } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, addNotification } = useApp();

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form input model
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: 'Jewelry',
    price: 0,
    discountPrice: 0,
    image1: '',
    image2: '',
    inventory: 10,
    material: '',
    style: '',
    isFeatured: false,
    isTrending: false,
    isBestSeller: false
  });

  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      category: 'Jewelry',
      price: 1000,
      discountPrice: 0,
      image1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
      image2: '',
      inventory: 15,
      material: 'Genuine Brass alloy',
      style: 'Royal Heritage',
      isFeatured: false,
      isTrending: false,
      isBestSeller: false
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormState({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      image1: p.images[0] || '',
      image2: p.images[1] || '',
      inventory: p.inventory,
      material: p.material || '',
      style: p.style || '',
      isFeatured: !!p.isFeatured,
      isTrending: !!p.isTrending,
      isBestSeller: !!p.isBestSeller
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.price <= 0 || formState.inventory < 0) {
      addNotification('error', 'Price and inventory numbers must be non-negative.');
      return;
    }

    const imagesList = [formState.image1];
    if (formState.image2.trim()) {
      imagesList.push(formState.image2.trim());
    }

    if (editingProduct) {
      // Modify
      const updatedItem: Product = {
        ...editingProduct,
        name: formState.name,
        description: formState.description,
        category: formState.category,
        price: Number(formState.price),
        discountPrice: formState.discountPrice ? Number(formState.discountPrice) : undefined,
        images: imagesList,
        inventory: Number(formState.inventory),
        material: formState.material,
        style: formState.style,
        isFeatured: formState.isFeatured,
        isTrending: formState.isTrending,
        isBestSeller: formState.isBestSeller
      };
      updateProduct(updatedItem);
      setEditingProduct(null);
    } else {
      // Add
      addProduct({
        name: formState.name,
        description: formState.description,
        category: formState.category,
        price: Number(formState.price),
        discountPrice: formState.discountPrice ? Number(formState.discountPrice) : undefined,
        images: imagesList,
        inventory: Number(formState.inventory),
        material: formState.material,
        style: formState.style,
        isFeatured: formState.isFeatured,
        isTrending: formState.isTrending,
        isBestSeller: formState.isBestSeller
      });
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-5 h-fit">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4B0011] dark:text-stone-105">
            Antiquity Inventory Catalog
          </h1>
          <p className="text-xs text-stone-500">
            Regulate active product entries, Sku stock limits, and promo ratings weights.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-xl bg-[#4B0011] hover:bg-[#D4AF37] text-white hover:text-[#4B0011] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 border border-[#D4AF37]/15"
        >
          <Plus className="w-5 h-5 hover:scale-110 transition-transform" />
          Acquire New Antiquity
        </button>
      </div>

      {/* Main product listings table */}
      <div className="bg-white dark:bg-stone-900 border border-[#D4AF37]/20 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/20 text-stone-400 uppercase tracking-widest text-[9px] font-bold bg-[#FDFCF8] dark:bg-stone-950/20">
                <th className="py-3 px-4 text-[#4B0011]">Item Detail</th>
                <th className="py-3 px-4 text-[#4B0011]">Category</th>
                <th className="py-3 px-4 text-[#4B0011]">Sovereign Price</th>
                <th className="py-3 px-4 text-[#4B0011]">Stock level</th>
                <th className="py-3 px-4 text-[#4B0011]">Properties</th>
                <th className="py-3 px-4 text-center text-[#4B0011]">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10 text-stone-700 dark:text-stone-300 font-medium whitespace-nowrap">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFCF8] dark:hover:bg-stone-950/10 transition-colors">
                  
                  {/* Title and image block */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-white border border-[#D4AF37]/15 flex-shrink-0 animate-fade-in">
                      <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="max-w-64 truncate">
                      <p className="font-serif font-bold text-[#2D2926] dark:text-stone-100 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{p.material}</p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[10px] font-bold uppercase tracking-wider text-[#4B0011] flex items-center gap-1 w-fit border border-[#D4AF37]/20">
                      <Tag className="w-3 h-3 text-[#D4AF37]" />
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-[#2D2926] dark:text-gold-200">
                    ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                    {p.discountPrice && (
                      <span className="text-[10px] text-[#4B0011]/50 line-through block font-medium">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  {/* Inventory stock */}
                  <td className="py-3 px-4">
                    <span className={`font-bold font-mono text-xs flex items-center gap-1.5 ${
                      p.inventory <= 5 ? 'text-amber-600 animate-pulse' : 'text-stone-850 dark:text-white'
                    }`}>
                      {p.inventory <= 5 && <AlertTriangle className="w-3.5 h-3.5" />}
                      {p.inventory} Sku
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {p.isFeatured && <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[9px] text-[#4B0011] font-bold">Featured</span>}
                      {p.isTrending && <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-[9px] text-sky-700 font-bold">Trending</span>}
                      {p.isBestSeller && <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-955/40 text-[9px] text-amber-700 font-bold">BestSell</span>}
                    </div>
                  </td>

                  {/* edit or delete click actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-[#D4AF37]/20 hover:border-[#4B0011] hover:bg-[#4B0011]/5 text-[#4B0011] dark:text-stone-400 hover:text-[#4B0011] hover:scale-105 transition-all cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-850 hover:border-rose-350 hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
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

      {/* dialog forms drawer (Add / Edit item) */}
      {(isAddOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => { setIsAddOpen(false); setEditingProduct(null); }} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto font-sans border border-[#D4AF37]/35">
            <button
              onClick={() => { setIsAddOpen(false); setEditingProduct(null); }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-[#D4AF37]/20 bg-[#4B0011] text-white">
              <h2 className="font-serif text-lg font-bold flex items-center gap-2 text-[#F5F5DC]">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                {editingProduct ? 'Update Antiquity Ledger' : 'Acquire New Antiquity'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5 text-xs font-semibold text-stone-405 dark:text-stone-400">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label>Antiquity Legal Title *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Royal Kundan Pearl Jhumkas Set"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <label>Department Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100 focus:outline-none"
                  >
                    <option value="Jewelry">Jewelry (Kundan, Ornaments)</option>
                    <option value="Textiles">Textiles (Sarees, Silks)</option>
                    <option value="Handicrafts">Handicrafts (Brass Idols)</option>
                    <option value="Lifestyle">Lifestyle (Sandalwoods, Oils)</option>
                  </select>
                </div>

                {/* Sku Stock quantity */}
                <div className="space-y-1">
                  <label>Inventory Units (SKUs) *</label>
                  <input
                    type="number"
                    required
                    value={formState.inventory}
                    onChange={(e) => setFormState({ ...formState, inventory: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Original prices */}
                <div className="space-y-1">
                  <label>Registry Cost (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* promo discount prices */}
                <div className="space-y-1">
                  <label>Loyalty Ticket Promotional Cost (INR, Optional)</label>
                  <input
                    type="number"
                    value={formState.discountPrice}
                    onChange={(e) => setFormState({ ...formState, discountPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Description lines */}
                <div className="sm:col-span-2 space-y-1">
                  <label>Ledger Chronicle Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Details about raw weavers provenance, enameled back linings, certified copper patents..."
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Composition materials and styling aesthetics */}
                <div className="space-y-1">
                  <label>Proportions Composition Material *</label>
                  <input
                    type="text"
                    required
                    value={formState.material}
                    onChange={(e) => setFormState({ ...formState, material: e.target.value })}
                    placeholder="e.g. 22K Gold plating brass, emeralds"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                <div className="space-y-1">
                  <label>Aesthetical Line Style *</label>
                  <input
                    type="text"
                    required
                    value={formState.style}
                    onChange={(e) => setFormState({ ...formState, style: e.target.value })}
                    placeholder="e.g. Bridal Heritage Classical"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Primary Image link */}
                <div className="space-y-1 sm:col-span-2">
                  <label>Primary Showcase Image link *</label>
                  <input
                    type="text"
                    required
                    value={formState.image1}
                    onChange={(e) => setFormState({ ...formState, image1: e.target.value })}
                    placeholder="Unsplash URL, absolute secure image path..."
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* Secondary Image link */}
                <div className="space-y-1 sm:col-span-2">
                  <label>Secondary Detail Image link (Optional)</label>
                  <input
                    type="text"
                    value={formState.image2}
                    onChange={(e) => setFormState({ ...formState, image2: e.target.value })}
                    placeholder="Alternate side view image link..."
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                  />
                </div>

                {/* checkbox triggers */}
                <div className="sm:col-span-2 mt-2 border-t border-stone-100 dark:border-stone-800 pt-3">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider mb-2.5">Portal Highlights Triggers</span>
                  <div className="grid grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, isFeatured: !formState.isFeatured })}
                      className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        formState.isFeatured
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/20'
                          : 'border-stone-200 text-stone-400'
                      }`}
                    >
                      <Check className={`w-4 h-4 mr-0.5 ${formState.isFeatured ? 'opacity-100' : 'opacity-0'}`} />
                      Featured Sinks
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, isTrending: !formState.isTrending })}
                      className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        formState.isTrending
                          ? 'bg-sky-50 border-sky-500 text-sky-800 dark:bg-sky-950/20'
                          : 'border-stone-200 text-stone-400'
                      }`}
                    >
                      <Check className={`w-4 h-4 mr-0.5 ${formState.isTrending ? 'opacity-100' : 'opacity-0'}`} />
                      Trending Sinks
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, isBestSeller: !formState.isBestSeller })}
                      className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        formState.isBestSeller
                          ? 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950/20'
                          : 'border-stone-200 text-stone-400'
                      }`}
                    >
                      <Check className={`w-4 h-4 mr-0.5 ${formState.isBestSeller ? 'opacity-100' : 'opacity-0'}`} />
                      Best Seller
                    </button>

                  </div>
                </div>

              </div>

              {/* submitting */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 font-bold text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2.5 border border-[#D4AF37]/25 rounded-lg hover:bg-stone-50 text-stone-701 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4B0011] hover:bg-[#D4AF37] text-white hover:text-[#4B0011] font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-[#D4AF37]/20"
                >
                  Save Entry Chronicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
