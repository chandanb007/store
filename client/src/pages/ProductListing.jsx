import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Tag,
} from "lucide-react";

import { useApp } from "../contexts/AppContext.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import Pagination from "../../src/pages/common/Pagination.jsx";

export const ProductListing = () => {
  const { products = [], disabledCategories = [] } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [viewMode, setViewMode] = useState("grid");

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const [priceRange, setPriceRange] = useState(
    Number(searchParams.get("maxPrice")) || 30000
  );

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "popularity"
  );

  const [currentPage, setCurrentPage] = useState(
    Math.max(Number(searchParams.get("page")) || 1, 1)
  );

  const itemsPerPage = 6;

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getCategoryName = (product) => {
    if (!product?.category) {
      return "";
    }

    if (typeof product.category.name === "string") {
      return product.category.name;
    }

    return product.category?.name || "";
  };

  const getProductName = (product) => {
    return product?.name || product?.title || "";
  };

  const getProductPrice = (product) => {
    return Number(
      product?.discountPrice ??
        product?.discountedPrice ??
        product?.price ??
        0
    );
  };

  const getOriginalPrice = (product) => {
    return Number(product?.price || 0);
  };

  const getRating = (product) => {
    return Number(product?.rating || 0);
  };

  const getReviewCount = (product) => {
    if (Array.isArray(product?.reviews)) {
      return product.reviews.length;
    }

    return Number(product?.reviewCount || 0);
  };

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  const categories = useMemo(() => {
    const categoryNames = products?.products?.map(getCategoryName)
      .filter(Boolean);
    const uniqueCategories = [...new Set(categoryNames)];

    const enabledCategories = uniqueCategories.filter(
      (category) => !disabledCategories.includes(category)
    );

    return ["All", ...enabledCategories];
  }, [products, disabledCategories]);

  // --------------------------------------------------
  // Sync URL -> State
  // --------------------------------------------------

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const search = searchParams.get("search") || "";
    const maxPrice = Number(searchParams.get("maxPrice")) || 30000;
    const sort = searchParams.get("sort") || "popularity";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    setSelectedCategory(category);
    setSearchQuery(search);
    setPriceRange(maxPrice);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  // --------------------------------------------------
  // Filtering + Sorting
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    let result = [...(products?.products ?? [])];

    // Remove products from disabled categories
    if (disabledCategories.length > 0) {
      result = result.filter((product) => {
        const category = getCategoryName(product);

        return !disabledCategories.includes(category);
      });
    }

    // Category filter
    if (selectedCategory !== "All") {
      const selected = selectedCategory.toLowerCase();

      result = result.filter((product) => {
        return getCategoryName(product).toLowerCase() === selected;
      });
    }

    // Search filter
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((product) => {
        const name = getProductName(product).toLowerCase();
        const description = String(product?.description || "").toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query)
        );
      });
    }

    // Price filter
    result = result.filter((product) => {
      return getProductPrice(product) <= priceRange;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => getProductPrice(a) - getProductPrice(b)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => getProductPrice(b) - getProductPrice(a)
        );
        break;

      case "newest":
        result.sort(
          (a, b) => Number(b?.id || 0) - Number(a?.id || 0)
        );
        break;

      case "popularity":
      default:
        result.sort((a, b) => {
          const ratingDifference =
            getRating(b) - getRating(a);

          if (ratingDifference !== 0) {
            return ratingDifference;
          }

          return getReviewCount(b) - getReviewCount(a);
        });

        break;
    }

    return result;
  }, [
    products,
    disabledCategories,
    selectedCategory,
    searchQuery,
    priceRange,
    sortBy,
  ]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages =
    Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Make sure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredProducts, currentPage]);

  // --------------------------------------------------
  // URL helper
  // --------------------------------------------------

  const updateSearchParams = (updates = {}) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "All"
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  // --------------------------------------------------
  // Category
  // --------------------------------------------------

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateSearchParams({
      category,
      page: 1,
    });
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);

    updateSearchParams({
      search: value.trim(),
      page: 1,
    });
  };

  // --------------------------------------------------
  // Price
  // --------------------------------------------------

  const handlePriceChange = (value) => {
    const price = Number(value);

    setPriceRange(price);
    setCurrentPage(1);

    updateSearchParams({
      maxPrice:
        price < 30000 ? price : null,
      page: 1,
    });
  };

  // --------------------------------------------------
  // Sort
  // --------------------------------------------------

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);

    updateSearchParams({
      sort: value !== "popularity" ? value : null,
      page: 1,
    });
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    const validPage = Math.min(
      Math.max(Number(page) || 1, 1),
      totalPages
    );

    setCurrentPage(validPage);

    updateSearchParams({
      page: validPage > 1 ? validPage : null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange(30000);
    setSortBy("popularity");
    setCurrentPage(1);

    setSearchParams({});
  };

  // --------------------------------------------------
  // Image helper
  // --------------------------------------------------

  const getProductImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images[0];
    }

    if (
      Array.isArray(product?.productMedia) &&
      product.productMedia.length > 0
    ) {
      const primaryMedia = product.productMedia.find(
        (media) => media?.isPrimary === true
      );

      return (
        primaryMedia?.media?.url ||
        product.productMedia[0]?.media?.url ||
        null
      );
    }

    return null;
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center space-y-3 mb-10 border-b border-stone-100 dark:border-stone-900 pb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-100">
          The Artisanal Bazaar
        </h1>

        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Explore Jaipur Kundan relics, Varanasi silks, and Kashmir needle
          shawls with certified origin trust.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8 bg-white dark:bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 h-fit shadow-xs">

          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">

            <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              Filtration
            </h2>

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              Reset
            </button>

          </div>

          {/* Search */}
          <div className="space-y-2.5">

            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
              Search antiquities
            </label>

            <div className="relative">

              <input
                type="text"
                placeholder="Product title keywords..."
                value={searchQuery}
                onChange={(e) =>
                  handleSearchChange(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              />

              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />

            </div>

          </div>

          {/* Categories */}
          <div className="space-y-3">

            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
              Heritage category
            </label>

            <div className="flex flex-col gap-1.5">

              {categories.map((category) => {

                const count =
                  category === "All"
                    ? products?.products?.length
                    : products.products.filter(
                        (product) =>
                          getCategoryName(product) === category
                      ).length;

                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() =>
                      handleCategorySelect(category)
                    }
                    className={`px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "bg-gold-500 text-stone-950 font-bold"
                        : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-950"
                    }`}
                  >

                    <span className="flex items-center gap-2">
                      <Tag className="w-3 h-3 opacity-60 text-gold-600" />
                      {category}
                    </span>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === category
                          ? "bg-stone-950/15"
                          : "bg-stone-100 dark:bg-stone-800"
                      }`}
                    >
                      {count}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>

          {/* Price */}
          <div className="space-y-3">

            <div className="flex items-center justify-between">

              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Max Price
              </label>

              <span className="text-xs font-bold text-gold-600 dark:text-gold-200">
                ₹{priceRange.toLocaleString("en-IN")}
              </span>

            </div>

            <input
              type="range"
              min={1500}
              max={30000}
              step={500}
              value={priceRange}
              onChange={(e) =>
                handlePriceChange(e.target.value)
              }
              className="w-full accent-gold-500 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹1,500</span>
              <span>₹30,000</span>
            </div>

          </div>

        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 px-5 py-3.5 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl shadow-xs text-sm">

            <span className="text-stone-500 dark:text-stone-400 font-medium text-xs">
              Beholding{" "}
              <strong className="text-stone-900 dark:text-white">
                {filteredProducts.length}
              </strong>{" "}
              unique antiquities
            </span>

            <div className="flex items-center gap-4 w-full sm:w-auto">

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">

                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    handleSortChange(e.target.value)
                  }
                  className="bg-stone-50/60 dark:bg-stone-950 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
                >
                  <option value="popularity">
                    Popularity (Best Reviews)
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="newest">
                    New Arrivals
                  </option>
                </select>

              </div>

              <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />

              <div className="hidden sm:flex items-center p-1 bg-stone-50/60 dark:bg-stone-950 border border-stone-200 rounded-lg">

                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-gold-500 text-stone-950"
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === "list"
                      ? "bg-gold-500 text-stone-950"
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

          {/* Active Filters */}
          {(selectedCategory !== "All" ||
            searchQuery ||
            priceRange < 30000) && (

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                Active:
              </span>

              {selectedCategory !== "All" && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-stone-800 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">

                  Category: {selectedCategory}

                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500"
                    onClick={() =>
                      handleCategorySelect("All")
                    }
                  />

                </span>
              )}

              {searchQuery && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-stone-800 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">

                  Query: {searchQuery}

                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500"
                    onClick={() =>
                      handleSearchChange("")
                    }
                  />

                </span>
              )}

              {priceRange < 30000 && (
                <span className="px-3 py-1 bg-gold-100 dark:bg-stone-800 text-gold-700 dark:text-gold-200 text-xs font-semibold rounded-full flex items-center gap-1">

                  Max: ₹{priceRange.toLocaleString("en-IN")}

                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500"
                    onClick={() =>
                      handlePriceChange(30000)
                    }
                  />

                </span>
              )}

            </div>
          )}

          {/* Products */}
          {filteredProducts.length === 0 ? (

            <div className="text-center py-20 bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl shadow-xs">

              <p className="text-stone-400 text-sm mb-4">
                No treasures match your current filter settings.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2 rounded-xl bg-gold-500 text-stone-950 font-bold text-xs cursor-pointer"
              >
                Clear Filters
              </button>

            </div>

          ) : viewMode === "grid" ? (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          ) : (

            <div className="space-y-4">

              {paginatedProducts.map((product) => {

                const image = getProductImage(product);
                const productName = getProductName(product);
                const category = getCategoryName(product);

                const price = getProductPrice(product);
                const originalPrice = getOriginalPrice(product);

                const hasDiscount =
                  originalPrice > price;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/30 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                  >

                    {/* Image */}
                    <div className="w-full sm:w-48 aspect-square relative flex-shrink-0 bg-stone-50 dark:bg-stone-950">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={productName || "Product"}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                          No image
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-grow">

                      <div>

                        <span className="text-[10px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest block mb-1">
                          {category}
                        </span>

                        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                          {productName}
                        </h3>

                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4 line-clamp-2">
                          {product?.description || ""}
                        </p>

                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/30 pt-3 mt-4">

                        <div className="flex items-baseline gap-2">

                          <span className="text-base font-bold text-stone-900 dark:text-gold-200">
                            ₹{product.minPrice.toLocaleString("en-IN")} - ₹{product.maxPrice.toLocaleString("en-IN")}
                          </span>

                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}

                        </div>

                        <button
                          type="button"
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

          {/* Pagination */}
          {/* {paginatedProducts > 1 && ( */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredProducts.length}
              pageSize={itemsPerPage}
            />
          {/* )} */}

        </div>
      </div>
    </div>
  );
};
