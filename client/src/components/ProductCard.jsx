import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Heart, Star, ShoppingBag, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const hasDiscount = !!product.discountPrice;
  const isWishlisted = wishlist.includes(product.id);

  const displayPrice = product.discountPrice || product.price;

  return (
    <>
      <motion.div
        layout
        className="group relative bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 shadow-md backdrop-blur-md text-stone-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-transform duration-300 active:scale-130 ${
              isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-white bg-red-650 bg-red-800 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.isTrending && (
            <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-white bg-blue-700 rounded-full shadow-sm">
              Trending
            </span>
          )}
          {hasDiscount && (
            <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-white bg-amber-600 rounded-full shadow-sm">
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Product Image Stage */}
        <Link to={`/product/${product.id}`} className="block relative aspect-3/4 overflow-hidden bg-stone-50 dark:bg-stone-950">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Cover Overlay holding Quick Actions */}
          <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
              className="p-3 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 rounded-full shadow-lg hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-stone-900 transition-all duration-300 scale-90 group-hover:scale-100 cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, 1);
              }}
              className="p-3 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 rounded-full shadow-lg hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-stone-900 transition-all duration-300 scale-90 group-hover:scale-100 cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category */}
          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none mb-1.5 block">
            {product.category}
          </span>

          {/* Name */}
          <Link
            to={`/product/${product.id}`}
            className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1 mb-2"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {product.rating} ({product.reviews.length})
            </span>
          </div>

          {/* Price & Foot Spacer */}
          <div className="mt-auto pt-3 border-t border-stone-50 dark:border-stone-850 flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-stone-400 dark:text-stone-505 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-lg font-bold text-stone-900 dark:text-gold-100 font-sans">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
               onClick={() => addToCart(product, 1)}
              className="px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute inset-0 bg-stone-955/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 animate-pulse" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Images Container */}
                <div className="p-6 bg-stone-50 dark:bg-stone-950 flex flex-col gap-4">
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto py-1">
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`w-18 aspect-square rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
                            selectedImage === img ? 'border-gold-500' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-widest block mb-1">
                      {product.category}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-900 dark:text-stone-101 mb-3">
                      {product.name}
                    </h2>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3.5 mb-5 border-b border-stone-100 dark:border-stone-800 pb-4">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                          {product.rating}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-stone-500 ml-1">
                          ({product.reviews.length} reviews)
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                      <span className={`text-xs font-semibold ${product.inventory > 0 ? 'text-emerald-650 text-emerald-600' : 'text-rose-600'}`}>
                        {product.inventory > 0 ? `In Stock (${product.inventory} units)` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-5 flex items-baseline gap-2.5">
                      <span className="text-3xl font-bold text-stone-900 dark:text-gold-100 font-sans">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span className="text-base text-stone-400 line-through">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-stone-650 dark:text-stone-350 text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Metadata Specs */}
                    <div className="space-y-2 bg-stone-50 dark:bg-stone-950 p-4 rounded-xl mb-6">
                      {product.material && (
                        <div className="flex text-xs">
                          <span className="w-24 text-stone-400 uppercase tracking-wider font-semibold">Material:</span>
                          <span className="text-stone-700 dark:text-stone-300 font-medium">{product.material}</span>
                        </div>
                      )}
                      {product.style && (
                        <div className="flex text-xs">
                          <span className="w-24 text-stone-400 uppercase tracking-wider font-semibold">Style:</span>
                          <span className="text-stone-700 dark:text-stone-300 font-medium">{product.style}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        setIsQuickViewOpen(false);
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 duration-200"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Basket
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(product.id);
                      }}
                      className="p-3.5 border border-stone-200 dark:border-stone-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-xl text-stone-500 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
