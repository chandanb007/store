import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Star, ShoppingBag, Heart, Shield, RefreshCw, Send } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addReview, currentUser, addNotification } = useApp();

  // Selected Product State
  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [products, id]);

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('Standard');

  // Interactive review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
    }
    // reset selectors when product id shifts
    setQuantity(1);
    setSelectedVariant('Standard');
    setReviewComment('');
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold dark:text-white">Treasure Not Found</h2>
        <p className="text-stone-404 text-sm">We are unable to locate the antiquity specified in our royal ledger.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-gold-500 rounded-xl font-bold text-xs">
          Return to Bazaar
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const hasDiscount = !!product.discountPrice;
  const displayPrice = product.discountPrice || product.price;

  // Fetch related products in same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      addNotification('info', 'You must login to submit verification reviews.');
      navigate('/account');
      return;
    }
    if (!reviewComment.trim()) return;

    addReview(product.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewRating(5);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Product Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-11 items-start bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-10 rounded-2xl shadow-sm">
        
        {/* Visual Showcase (Thumbnails + Main) */}
        <div className="space-y-4">
          <div className="relative group aspect-3/4 rounded-2xl overflow-hidden bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-855">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
            />
            {product.inventory === 0 && (
              <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center">
                <span className="px-4 py-2 bg-rose-600 text-white rounded-full font-bold text-xs uppercase uppercase-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-gold-500 scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase details */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div>
            {/* Category / Material Tag */}
            <span className="text-[11px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest block mb-1">
              {product.category}
            </span>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-3 tracking-wide leading-tight">
              {product.name}
            </h1>

            {/* Ratings & reviews sum */}
            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center text-amber-400">
                <Star className="w-4.5 h-4.5 fill-current mr-1 text-amber-400" />
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{product.rating}</span>
              </div>
              <div className="w-1.5 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
              <button
                onClick={() => document.getElementById('review-desk')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-semibold text-stone-550 dark:text-stone-400 hover:text-gold-500 hover:underline"
              >
                Read All {product.reviews.length} Reviews
              </button>
              <div className="w-1.5 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
              <span className={`text-xs font-semibold ${product.inventory > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.inventory > 0 ? `${product.inventory} remains in stock` : 'Awaiting collection restock'}
              </span>
            </div>

            {/* Price section */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-stone-900 dark:text-gold-100">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-lg text-stone-400 font-semibold line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description Statement */}
            <p className="text-stone-600 dark:text-stone-350 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Interactive variants specs */}
            <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-100 dark:border-stone-855 mb-6">
              {product.material && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Composition</span>
                  <p className="text-xs text-stone-850 dark:text-stone-250 font-semibold mt-0.5">{product.material}</p>
                </div>
              )}
              {product.style && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Aesthetic Line</span>
                  <p className="text-xs text-stone-850 dark:text-stone-250 font-semibold mt-0.5">{product.style}</p>
                </div>
              )}
            </div>

            {/* Select Options / Quantity fields */}
            {product.inventory > 0 && (
              <div className="space-y-4 pb-6 mb-6 border-b border-stone-100 dark:border-stone-800">
                
                {/* Variant choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Select Aesthetic Variant
                  </label>
                  <div className="flex gap-2">
                    {['Standard', 'Premium Polish', 'Royale Gold Trim'].map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedVariant === variant
                            ? 'border-gold-500 bg-gold-100 dark:bg-gold-950/40 text-gold-800 dark:text-gold-200'
                            : 'border-stone-200 dark:border-stone-800 hover:border-gold-300 dark:hover:border-gold-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Quantity</span>
                    <div className="flex items-center bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden h-9">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2.5 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-stone-800 dark:text-stone-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.inventory, q + 1))}
                        className="px-2.5 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons (Add, Buy Now, Wish) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product, quantity, selectedVariant)}
              disabled={product.inventory === 0}
              className="flex-1 py-3.5 bg-white border border-gold-500 hover:bg-gold-50 text-gold-700 dark:bg-stone-900 dark:hover:bg-gold-950/30 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-gold-500 text-stone-950"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Basket
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={product.inventory === 0}
              className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:scale-[1.01] active:scale-95 duration-200"
            >
              Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 transition-colors cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Trust Guarantees indicators */}
          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-4 text-xs text-stone-550 dark:text-stone-400">
            <div className="flex gap-2 items-center">
              <Shield className="w-4.5 h-4.5 text-gold-600" />
              <span>Artisans GUILD Certificate Included</span>
            </div>
            <div className="flex gap-2 items-center">
              <RefreshCw className="w-4.5 h-4.5 text-gold-600" />
              <span>7-Day Secure Return Charter</span>
            </div>
          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <section id="review-desk" className="grid grid-cols-1 lg:grid-cols-3 gap-11 items-start">
        
        {/* Reviews Summary Column (1/3) */}
        <div className="lg:col-span-1 border border-stone-150/45 dark:border-stone-850 p-6 rounded-2xl bg-white dark:bg-stone-900 space-y-6">
          <h2 className="font-serif text-xl font-bold dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3">
            Ratings Summary
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold text-stone-900 dark:text-gold-200">{product.rating}</span>
            <div className="space-y-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-amber-400' : 'text-stone-300'}`} />
                ))}
              </div>
              <p className="text-xs text-stone-450 dark:text-stone-400 font-medium">Based on {product.reviews.length} verifies</p>
            </div>
          </div>

          {/* Interactive Form for Review dispatch */}
          <div className="pt-4 border-t border-stone-105 dark:border-stone-800 space-y-4">
            <h3 className="font-serif font-bold text-stone-850 dark:text-stone-200 text-sm">
              Submit Patron Feedback
            </h3>

            {currentUser ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Score Selector */}
                <div className="space-y-2">
                  <span className="font-semibold text-stone-400 block uppercase tracking-wider">Select Merit Score</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="cursor-pointer transition-transform duration-200 hover:scale-120"
                      >
                        <Star className={`w-5 h-5 ${num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Box */}
                <div className="space-y-2">
                  <span className="font-semibold text-stone-400 block uppercase tracking-wider">Patron Comment</span>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    required
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe craftsmanship quality, packaging weight, authenticity certification..."
                    className="w-full border border-stone-200 dark:border-stone-800 p-3 rounded-lg bg-stone-50 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-gold-500/50 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-950 dark:bg-gold-500 dark:text-stone-950 text-white hover:bg-stone-850 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Review
                </button>
              </form>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-205 rounded-lg">
                <p className="text-xs leading-relaxed mb-3 text-amber-800 dark:text-amber-200">Only registered e-commerce collectors can upload product reviews.</p>
                <Link to="/account" className="text-xs font-bold underline text-amber-900 dark:text-amber-100 hover:text-gold-500">
                  Authenticate Account →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Feed Column (2/3) */}
        <div className="lg:col-span-2 border border-stone-150/45 dark:border-stone-850 p-6 rounded-2xl bg-white dark:bg-stone-900">
          <h2 className="font-serif text-xl font-bold dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3 mb-6">
            Collector Feeds
          </h2>

          {product.reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-stone-400 text-sm">This relic has no reviews deposited yet. Be the first to publish a review!</p>
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-stone-100 dark:divide-stone-800 text-amber-400">
              {product.reviews.map((r, index) => (
                <div key={r.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                  <div className="flex justify-between items-start mb-2.5">
                    <div>
                      <h4 className="font-bold text-stone-950 dark:text-stone-100 text-sm">{r.userName}</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 font-medium">{r.date}</p>
                    </div>
                    {/* Stars */}
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current text-amber-400' : 'text-stone-200 dark:text-stone-800'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-650 dark:text-stone-350 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Related Products Slider Deck */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-gold-600 uppercase">
              Similar Craft Lines
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Complete Your Adornment
            </h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
