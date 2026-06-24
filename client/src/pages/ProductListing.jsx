import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Search, Grid, List, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';

export const ProductListing = () => {
  const { products, disabledCategories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Layout View State
  const [viewMode, setViewMode] = useState('grid');

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(30000); // 30,000 maximum cap
  const [sortBy, setSortBy] = useState('popularity');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Track categories available in current product catalog
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    const filtered = Array.from(list).filter(c => !(disabledCategories || []).includes(c));
    return ['All', ...filtered];
  }, [products, disabledCategories]);

  // Sync state with URL params on mount or param updates
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('All');
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
    
    // Reset to page 1 on filter trigger
    setCurrentPage(1);
  }, [searchParams, products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter out products of disabled categories
    if (disabledCategories && disabledCategories.length > 0) {
      result = result.filter((p) => !disabledCategories.includes(p.category));
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Filter by price
    result = result.filter((p) => (p.discountPrice || p.price) <= priceRange);

    // Apply Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        // Sort by newer item id
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popularity':
      default:
        // Sort by higher score and more review comments
        result.sort((a, b) => b.rating - a.rating || b.reviews.length - a.reviews.length);
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, disabledCategories]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategorySelect = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setPriceRange(30000);
    setSortBy('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Banner / Title Header */}
      <div className="text-center space-y-3 mb-10 border-b border-stone-100 dark:border-stone-900 pb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-100">
          The Artisanal Bazaar
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Explore Jaipur Kundan relics, Varanasi silks, and Kashmir needle shawls with certified origin trust.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8 bg-white dark:bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 h-fit shadow-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-830/30 pb-3">
            <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-gold-600" />
              Filtration
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              Reset
            </button>
          </div>

          {/* Text Search inside sidebar */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
              Search antiquities
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product title keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-150/80 dark:border-stone-800/40 bg-stone-50/60 dark:bg-stone-950/60 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-404" />
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
              Heritage category
            </label>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => {
                const count = cat === 'All'
                  ? products.length
                  : products.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-gold-505 bg-gold-500 text-stone-950 font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-950'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3 h-3 opacity-60 text-gold-600" />
                      {cat}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat ? 'bg-stone-950/15' : 'bg-stone-100 dark:bg-stone-800'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Max Price Slider
              </label>
              <span className="text-xs font-bold text-gold-600 dark:text-gold-200">
                ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={30000}
              step={500}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-gold-500 h-1.5 bg-stone-200 dark:bg-stone-850 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹1,500</span>
              <span>₹30,000</span>
            </div>
          </div>

        </div>

        {/* Results Stream Grid / List (Column 2-4) */}
        <div className="lg:col-span-3 space-y-6">

          {/* Filters Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 px-5 py-3.5 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl shadow-xs text-sm">
            <span className="text-stone-550 dark:text-stone-400 font-medium text-xs">
              Beholding <strong className="text-stone-900 dark:text-white">{filteredProducts.length}</strong> unique antiquities
            </span>

            {/* Sorter and Layout controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-404 whitespace-nowrap" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stone-50/60 dark:bg-stone-950 border border-stone-150/80 dark:border-stone-800/40 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
                >
                  <option value="popularity">Popularity (Best Reviews)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>

              {/* Grid or List Toggle buttons */}
              <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
              
              <div className="hidden sm:flex items-center p-1 bg-stone-50/60 dark:bg-stone-950 border border-stone-150/60 dark:border-stone-800/40 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-gold-505 bg-gold-500 text-stone-950 font-bold'
                      : 'text-stone-404 hover:text-stone-600 dark:hover:text-stone-200'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-gold-505 bg-gold-500 text-stone-950 font-bold'
                      : 'text-stone-404 hover:text-stone-600 dark:hover:text-stone-200'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Tagbox */}
          {(selectedCategory !== 'All' || searchQuery !== '' || priceRange < 30000) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-gold-955/40 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  Category: {selectedCategory}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500 text-gold-708" onClick={() => handleCategorySelect('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-gold-955/40 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  Query: {searchQuery}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500 text-gold-708" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {priceRange < 30000 && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-gold-955/40 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  Max: ₹{priceRange.toLocaleString('en-IN')}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500 text-gold-708" onClick={() => setPriceRange(30000)} />
                </span>
              )}
            </div>
          )}

          {/* Product Items Display Container */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl shadow-xs">
              <p className="text-stone-400 text-sm mb-4">No treasures match your current filter settings.</p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2 rounded-xl bg-gold-500 text-stone-950 font-bold text-xs cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW mode */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            /* LIST VIEW mode */
            <div className="space-y-4">
              {paginatedProducts.map((p) => {
                const hasDiscount = !!p.discountPrice;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                  >
                    {/* Image Column */}
                    <div className="w-full sm:w-48 aspect-square relative flex-shrink-0 bg-stone-50 dark:bg-stone-950">
                      <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>

                    {/* Content Column */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[10px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest block mb-1">
                          {p.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                          {p.name}
                        </h3>
                        <p className="text-xs text-stone-550 dark:text-stone-450 leading-relaxed mb-4 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      {/* Pricing Footer */}
                      <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/30 pt-3 mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-stone-900 dark:text-gold-200">
                            ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleClearFilters() /* redirect or quick checkout */}
                          className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2.5 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 rounded-xl text-stone-600 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-bold"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9.5 h-9.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-gold-500 text-stone-950'
                      : 'border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-950'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2.5 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 rounded-xl text-stone-600 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-bold"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
