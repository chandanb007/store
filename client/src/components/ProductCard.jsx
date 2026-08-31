import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import {
  Heart,
  Star,
  ShoppingBag,
  Eye,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const ProductCard = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    wishlist,
  } = useApp();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

// inside your component:
const [quantity, setQuantity] = useState(1);
const MIN_QTY = 1;
const MAX_QTY = 99;

const changeQty = (delta) => {
  setQuantity((prev) => {
    const next = prev + delta;
    if (next < MIN_QTY) return MIN_QTY;
    if (next > MAX_QTY) return MAX_QTY;
    return next;
  });
};

const validateQty = (e) => {
  let val = parseInt(e.target.value, 10);
  if (isNaN(val) || val < MIN_QTY) val = MIN_QTY;
  if (val > MAX_QTY) val = MAX_QTY;
  setQuantity(val);
};
  // Product card slider
  const [cardSlide, setCardSlide] = useState(0);

  // Quick view slider
  const [quickViewSlide, setQuickViewSlide] = useState(0);

  /*
   * =========================================================
   * BASIC PRODUCT DATA
   * =========================================================
   */

  const variants = useMemo(() => {
    return (product?.variants || []).filter(
      (variant) => variant?.isEnabled !== false
    );
  }, [product?.variants]);

  const hasVariants = variants.length > 0;

  const isWishlisted = wishlist.includes(product.id);

  /*
   * =========================================================
   * SKU LIST
   *
   * Each enabled variant is displayed using its SKU.
   * If SKU is missing, variant ID is used as fallback.
   * =========================================================
   */

  const skuVariants = useMemo(() => {
    return variants.map((variant) => ({
      ...variant,
      displaySku:
        variant?.sku ||
        `VAR-${variant?.id}`,
    }));
  }, [variants]);

  /*
   * =========================================================
   * PRODUCT CARD IMAGES
   * =========================================================
   */

  const cardImages = useMemo(() => {
    const images = [];

    if (product?.image) {
      images.push(product.image);
    }

    // Product-level media
    (product?.productMedia || []).forEach((item) => {
      const url = item?.media?.url;

      if (url) {
        images.push(url);
      }
    });

    // Variant media
    variants.forEach((variant) => {
      (variant?.productMedia || []).forEach((item) => {
        const url = item?.media?.url;

        if (url) {
          images.push(url);
        }
      });
    });

    return [...new Set(images)];
  }, [
    product?.image,
    product?.productMedia,
    variants,
  ]);

  /*
   * Reset card slider when product changes
   */
  useEffect(() => {
    setCardSlide(0);
    setQuantity(1);
  }, [product?.id]);

  /*
   * =========================================================
   * PRICE HELPERS
   * =========================================================
   */

  const formatPrice = (price) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return '0';
    }

    return value.toLocaleString('en-IN');
  };

  const getVariantPrice = (variant) => {
    if (!variant) {
      return Number(
        product?.minPrice ||
          product?.price ||
          0
      );
    }

    return Number(
      variant.discountedPrice ??
        variant.price ??
        0
    );
  };

  const getVariantOriginalPrice = (variant) => {
    if (!variant) {
      return Number(product?.price || 0);
    }

    return Number(variant.price || 0);
  };

  /*
   * =========================================================
   * PRODUCT PRICE
   * =========================================================
   */

  const minPrice = Number(
    product?.minPrice ??
      (variants.length
        ? Math.min(
            ...variants.map((variant) =>
              getVariantPrice(variant)
            )
          )
        : product?.price || 0)
  );

  const maxPrice = Number(
    product?.maxPrice ??
      (variants.length
        ? Math.max(
            ...variants.map((variant) =>
              getVariantPrice(variant)
            )
          )
        : product?.price || 0)
  );

  /*
   * =========================================================
   * DISCOUNT
   * =========================================================
   */

  const minOriginalPrice = variants.length
    ? Math.min(
        ...variants.map((variant) =>
          getVariantOriginalPrice(variant)
        )
      )
    : Number(product?.price || 0);

  const hasDiscount = variants.length
    ? variants.some(
        (variant) =>
          Number(variant.discountedPrice) <
          Number(variant.price)
      )
    : Number(product?.discountPrice || 0) <
      Number(product?.price || 0);

  const discountPercentage =
    hasDiscount && minOriginalPrice > 0
      ? Math.round(
          ((minOriginalPrice - minPrice) /
            minOriginalPrice) *
            100
        )
      : 0;

  /*
   * =========================================================
   * GET VARIANT LABEL
   *
   * Example:
   * Size: XL / Color: Black
   * =========================================================
   */

  const getVariantLabel = (variant) => {
    if (!variant) {
      return '';
    }

    const values = (
      variant.variantValues || []
    )
      .map((item) => {
        const value = item?.value;

        const valueName =
          value?.name ??
          value?.value ??
          value?.label ??
          null;

        const typeName =
          value?.variantType?.name;

        if (typeName && valueName) {
          return `${typeName}: ${valueName}`;
        }

        return valueName;
      })
      .filter(Boolean);

    if (values.length > 0) {
      return values.join(' / ');
    }

    return (
      variant.sku ||
      `Variant ${variant.id}`
    );
  };

  /*
   * =========================================================
   * GET VARIANT TYPE/VALUE DETAILS
   *
   * Returns:
   *
   * [
   *   {
   *     typeId: 1,
   *     typeName: "Color",
   *     valueId: 5,
   *     valueName: "Black"
   *   }
   * ]
   * =========================================================
   */

  const getVariantDetails = (variant) => {
    if (!variant) {
      return [];
    }

    return (variant.variantValues || [])
      .map((item) => {
        const value = item?.value;
        const variantType =
          value?.variantType;

        const valueName =
          value?.name ??
          value?.value ??
          value?.label ??
          null;

        if (!valueName) {
          return null;
        }

        return {
          typeId: variantType?.id,
          typeName:
            variantType?.name || 'Option',
          valueId: item?.valueId,
          valueName,
        };
      })
      .filter(Boolean);
  };

  /*
   * =========================================================
   * GET VARIANT PRIMARY IMAGE
   * =========================================================
   */

  const getVariantImage = (variant) => {
    if (!variant) {
      return product?.image;
    }

    const primaryVariantImage =
      variant?.productMedia?.find(
        (media) =>
          media?.isPrimary &&
          media?.media?.url
      );

    const firstVariantImage =
      variant?.productMedia?.find(
        (media) => media?.media?.url
      );

    return (
      primaryVariantImage?.media?.url ||
      firstVariantImage?.media?.url ||
      product?.image
    );
  };

  /*
   * =========================================================
   * GET VARIANT IMAGE GALLERY
   * =========================================================
   */

  const getVariantImages = (variant) => {
    if (!variant) {
      return product?.image
        ? [product.image]
        : [];
    }

    const images = [];

    (variant?.productMedia || []).forEach(
      (item) => {
        const url = item?.media?.url;

        if (url) {
          images.push(url);
        }
      }
    );

    if (
      images.length === 0 &&
      product?.image
    ) {
      images.push(product.image);
    }

    return [...new Set(images)];
  };

  /*
   * =========================================================
   * QUICK VIEW GALLERY
   * =========================================================
   */

  const quickViewImages = useMemo(() => {
    const images = [];

    if (selectedVariant) {
      getVariantImages(
        selectedVariant
      ).forEach((url) => {
        if (url) {
          images.push(url);
        }
      });
    } else {
      if (product?.image) {
        images.push(product.image);
      }

      (product?.productMedia || []).forEach(
        (item) => {
          const url = item?.media?.url;

          if (url) {
            images.push(url);
          }
        }
      );
    }

    return [...new Set(images)];
  }, [
    selectedVariant,
    product?.image,
    product?.productMedia,
  ]);

  /*
   * Keep quick view slide valid
   */
  useEffect(() => {
    if (
      quickViewSlide >=
      quickViewImages.length
    ) {
      setQuickViewSlide(0);
    }
  }, [
    quickViewImages.length,
    quickViewSlide,
  ]);

  /*
   * =========================================================
   * CARD SLIDER
   * =========================================================
   */

  const nextCardSlide = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (cardImages.length <= 1) {
      return;
    }

    setCardSlide((prev) =>
      prev === cardImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousCardSlide = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (cardImages.length <= 1) {
      return;
    }

    setCardSlide((prev) =>
      prev === 0
        ? cardImages.length - 1
        : prev - 1
    );
  };

  /*
   * =========================================================
   * QUICK VIEW SLIDER
   * =========================================================
   */

  const nextQuickViewSlide = () => {
    if (quickViewImages.length <= 1) {
      return;
    }

    setQuickViewSlide((prev) =>
      prev === quickViewImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousQuickViewSlide = () => {
    if (quickViewImages.length <= 1) {
      return;
    }

    setQuickViewSlide((prev) =>
      prev === 0
        ? quickViewImages.length - 1
        : prev - 1
    );
  };

  /*
   * =========================================================
   * SELECT SKU / VARIANT
   * =========================================================
   */

  const selectVariant = (variant) => {
    if (!variant) {
      return;
    }

    setSelectedVariant(variant);

    const images =
      getVariantImages(variant);

    setQuickViewSlide(0);
    setSelectedImage(
      images[0] || null
    );
  };

  /*
   * =========================================================
   * QUICK VIEW OPEN
   * =========================================================
   */

  const openQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();

    /*
     * Select first in-stock variant.
     * If none are in stock, select first variant.
     */
    const defaultVariant =
      variants.find(
        (variant) =>
          Number(variant?.qty || 0) > 0
      ) ||
      variants[0] ||
      null;

    setSelectedVariant(
      defaultVariant
    );

    const initialImage =
      defaultVariant
        ? getVariantImage(
            defaultVariant
          )
        : product?.image;

    setSelectedImage(initialImage);
    setQuickViewSlide(0);

    setIsQuickViewOpen(true);
  };

  /*
   * =========================================================
   * CLOSE QUICK VIEW
   * =========================================================
   */

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedVariant(null);
    setSelectedImage(null);
    setQuickViewSlide(0);
  };

  /*
   * =========================================================
   * SELECT QUICK VIEW IMAGE
   * =========================================================
   */

  const selectQuickViewImage = (index) => {
    setQuickViewSlide(index);

    setSelectedImage(
      quickViewImages[index] || null
    );
  };

  /*
   * =========================================================
   * ADD TO CART
   * =========================================================
   */

  const handleAddToCart = (
    event,
    variant = selectedVariant
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (hasVariants) {
      if (!variant) {
        setIsQuickViewOpen(true);
        return;
      }

      if (Number(variant.qty || 0) <= 0) {
        return;
      }
      const cart = {
        items: [
          {
              "qty": quantity,
                "unitPrice": variant.price,
                "totalPrice": variant.price*quantity,
                "product": {
                    "id": product.id,
                    "title": product.title,
                },
                "variant": {
                    "id": variant.id,
                    "sku": variant.sku
                }
          }
        ]
      }
      
      addToCart(product, quantity, variant);
      return;
    }
  };

  /*
   * =========================================================
   * SELECTED VARIANT DATA
   * =========================================================
   */

  const currentPrice = selectedVariant
    ? getVariantPrice(selectedVariant)
    : minPrice;

  const currentOriginalPrice =
    selectedVariant
      ? getVariantOriginalPrice(
          selectedVariant
        )
      : minOriginalPrice;

  const currentStock = selectedVariant
    ? Number(
        selectedVariant.qty || 0
      )
    : Number(
        product?.totalStock || 0
      );

  const currentHasDiscount =
    currentOriginalPrice >
    currentPrice;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {/* =====================================================
          PRODUCT CARD
      ====================================================== */}

      <motion.div
        layout
        whileHover={{ y: -4 }}
        transition={{
          duration: 0.25,
        }}
        className="
          group relative
          bg-white dark:bg-stone-900
          border border-stone-200/70
          dark:border-stone-800
          rounded-2xl overflow-hidden
          shadow-sm
          hover:shadow-xl
          transition-shadow duration-300
          flex flex-col
          h-[430px]
        "
      >
        {/* ===================================================
            WISHLIST
        ==================================================== */}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            toggleWishlist(product.id);
          }}
          className="
            absolute top-3.5 right-3.5 z-30
            w-9 h-9
            rounded-full
            bg-white/90
            dark:bg-stone-900/90
            backdrop-blur-md
            shadow-md
            flex items-center justify-center
            text-stone-500
            hover:text-rose-500
            hover:scale-105
            transition-all duration-200
            cursor-pointer
          "
          aria-label="Add to wishlist"
        >
          <Heart
            className={`
              w-[18px] h-[18px]
              transition-all duration-300
              ${
                isWishlisted
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : ''
              }
            `}
          />
        </button>

        {/* ===================================================
            BADGES
        ==================================================== */}

        <div
          className="
            absolute top-3.5 left-3.5 z-30
            flex flex-col gap-1.5
            pointer-events-none
          "
        >
          {product?.isBestSeller && (
            <span
              className="
                px-2.5 py-1
                text-[9px]
                uppercase
                tracking-wider
                font-bold
                text-white
                bg-red-700
                rounded-full
                shadow-sm
              "
            >
              Best Seller
            </span>
          )}

          {product?.isTrending && (
            <span
              className="
                px-2.5 py-1
                text-[9px]
                uppercase
                tracking-wider
                font-bold
                text-white
                bg-blue-700
                rounded-full
                shadow-sm
              "
            >
              Trending
            </span>
          )}

          {hasDiscount &&
            discountPercentage > 0 && (
              <span
                className="
                  px-2.5 py-1
                  text-[9px]
                  uppercase
                  tracking-wider
                  font-bold
                  text-white
                  bg-amber-600
                  rounded-full
                  shadow-sm
                "
              >
                -{discountPercentage}%
              </span>
            )}
        </div>

        {/* ===================================================
            PRODUCT IMAGE
        ==================================================== */}

        <Link
          to={`/product/${product.slug}`}
          className="
            block relative
            h-[255px]
            overflow-hidden
            bg-stone-50
            dark:bg-stone-950
          "
        >
          {cardImages.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={cardImages[cardSlide]}
                src={cardImages[cardSlide]}
                alt={
                  product?.title ||
                  'Product'
                }
                referrerPolicy="no-referrer"
                initial={{
                  opacity: 0,
                  x: 12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -12,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                  group-hover:scale-[1.04]
                  transition-transform
                  duration-500
                  ease-out
                "
              />
            </AnimatePresence>
          ) : (
            <div
              className="
                w-full h-full
                flex items-center justify-center
                text-stone-400
                text-sm
              "
            >
              No image
            </div>
          )}

          {/* Slider arrows */}

          {cardImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={
                  previousCardSlide
                }
                className="
                  absolute left-2.5
                  top-1/2
                  -translate-y-1/2
                  z-20
                  w-8 h-8
                  rounded-full
                  bg-white/90
                  dark:bg-stone-900/90
                  backdrop-blur-sm
                  shadow-md
                  flex items-center
                  justify-center
                  text-stone-700
                  dark:text-stone-200
                  opacity-0
                  group-hover:opacity-100
                  transition-all duration-200
                  hover:bg-white
                  dark:hover:bg-stone-800
                  cursor-pointer
                "
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextCardSlide}
                className="
                  absolute right-2.5
                  top-1/2
                  -translate-y-1/2
                  z-20
                  w-8 h-8
                  rounded-full
                  bg-white/90
                  dark:bg-stone-900/90
                  backdrop-blur-sm
                  shadow-md
                  flex items-center
                  justify-center
                  text-stone-700
                  dark:text-stone-200
                  opacity-0
                  group-hover:opacity-100
                  transition-all duration-200
                  hover:bg-white
                  dark:hover:bg-stone-800
                  cursor-pointer
                "
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image counter */}

          {cardImages.length > 1 && (
            <div
              className="
                absolute bottom-3 right-3 z-20
                px-2 py-1
                rounded-full
                bg-stone-950/60
                backdrop-blur-sm
                text-white
                text-[10px]
                font-medium
              "
            >
              {cardSlide + 1} /{' '}
              {cardImages.length}
            </div>
          )}

          {/* Image dots */}

          {cardImages.length > 1 && (
            <div
              className="
                absolute bottom-3 left-1/2
                -translate-x-1/2 z-20
                flex items-center gap-1
              "
            >
              {cardImages
                .slice(0, 6)
                .map((_, index) => (
                  <span
                    key={index}
                    className={`
                      h-1.5 rounded-full
                      transition-all duration-200
                      ${
                        cardSlide === index
                          ? 'w-4 bg-white'
                          : 'w-1.5 bg-white/60'
                      }
                    `}
                  />
                ))}
            </div>
          )}

          {/* Hover overlay */}

          <div
            className="
              absolute inset-0
              bg-stone-950/20
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            "
          />

          {/* Quick actions */}

          <div
            className="
              absolute inset-0 z-20
              flex items-center justify-center
              gap-3
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            "
          >
            <button
              type="button"
              onClick={openQuickView}
              className="
                pointer-events-auto
                w-11 h-11
                rounded-full
                bg-white/95
                dark:bg-stone-900/95
                text-stone-900
                dark:text-stone-100
                shadow-lg
                flex items-center justify-center
                hover:bg-gold-500
                hover:text-white
                transition-all duration-200
                cursor-pointer
              "
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(event) =>
                handleAddToCart(event)
              }
              className="
                pointer-events-auto
                w-11 h-11
                rounded-full
                bg-white/95
                dark:bg-stone-900/95
                text-stone-900
                dark:text-stone-100
                shadow-lg
                flex items-center justify-center
                hover:bg-gold-500
                hover:text-white
                transition-all duration-200
                cursor-pointer
              "
              title={
                hasVariants
                  ? 'Select SKU'
                  : 'Add to Cart'
              }
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </Link>

        {/* ===================================================
            CARD BODY
        ==================================================== */}

        <div
          className="
            px-4.5 py-4
            flex flex-col flex-grow
          "
        >
          <span
            className="
              text-[10px]
              font-bold
              text-stone-400
              dark:text-stone-500
              uppercase
              tracking-[0.15em]
              mb-1
            "
          >
            {product?.category?.name}
          </span>

          <Link
            to={`/product/${product.slug}`}
            className="
              font-serif
              text-[17px]
              font-semibold
              text-stone-800
              dark:text-stone-100
              group-hover:text-gold-600
              dark:group-hover:text-gold-400
              transition-colors
              line-clamp-1
              mb-1.5
            "
          >
            {product?.title}
          </Link>

          {/* Rating */}

          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  className={`
                    w-3 h-3
                    ${
                      index <
                      Math.floor(
                        Number(
                          product?.rating || 0
                        )
                      )
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 dark:text-stone-700'
                    }
                  `}
                />
              ))}
            </div>

            {product?.rating != null && (
              <span
                className="
                  text-[11px]
                  font-semibold
                  text-stone-500
                  dark:text-stone-400
                "
              >
                {product.rating}
              </span>
            )}
          </div>

          {/* =================================================
              SKU SUMMARY
          ================================================== */}

          {hasVariants && (
            <div className="mb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className="
                    text-[10px]
                    text-stone-400
                    dark:text-stone-500
                    font-semibold
                  "
                >
                  SKUs:
                </span>

                <div className="flex flex-wrap gap-1">
                  {skuVariants
                    .slice(0, 3)
                    .map((variant) => (
                      <span
                        key={variant.id}
                        className="
                          px-1.5 py-0.5
                          rounded
                          bg-stone-100
                          dark:bg-stone-800
                          text-stone-600
                          dark:text-stone-300
                          text-[9px]
                        "
                      >
                        {variant.displaySku}
                      </span>
                    ))}

                  {skuVariants.length > 3 && (
                    <span
                      className="
                        text-[9px]
                        text-stone-400
                      "
                    >
                      +{skuVariants.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              PRICE
          ================================================== */}

          <div
            className="
              mt-auto
              pt-3
              border-t
              border-stone-100
              dark:border-stone-800
              flex items-center
              justify-between
              gap-3
            "
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="
                    text-lg
                    font-bold
                    text-stone-900
                    dark:text-gold-100
                  "
                >
                  ₹{formatPrice(minPrice)}
                </span>

                {minPrice !== maxPrice && (
                  <span
                    className="
                      text-xs
                      text-stone-400
                    "
                  >
                    - ₹
                    {formatPrice(maxPrice)}
                  </span>
                )}
              </div>

              {hasVariants && (
                <span
                  className={`
                    text-[9px]
                    font-medium
                    ${
                      product?.totalStock > 0
                        ? 'text-emerald-600'
                        : 'text-rose-500'
                    }
                  `}
                >
                  {product?.totalStock > 0
                    ? `${product.totalStock} available`
                    : 'Out of stock'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(event) =>
                handleAddToCart(event)
              }
              disabled={
                hasVariants &&
                Number(
                  product?.totalStock || 0
                ) <= 0
              }
              className="
                px-3.5 py-2
                rounded-lg
                bg-gold-500
                hover:bg-gold-600
                disabled:bg-stone-300
                disabled:cursor-not-allowed
                text-stone-950
                font-bold
                text-[11px]
                flex items-center
                gap-1.5
                transition-all
                cursor-pointer
                active:scale-95
                flex-shrink-0
              "
            >
              <ShoppingBag className="w-3.5 h-3.5" />

              {hasVariants
                ? 'Select SKU'
                : 'Add'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* =======================================================
          QUICK VIEW MODAL
      ======================================================== */}

      <AnimatePresence>
        {isQuickViewOpen && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center
              justify-center
              p-4
            "
          >
            {/* Backdrop */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeQuickView}
              className="
                absolute inset-0
                bg-stone-950/60
                backdrop-blur-sm
              "
            />

            {/* Modal */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                relative
                w-full
                max-w-6xl
                bg-white
                dark:bg-stone-900
                rounded-2xl
                overflow-hidden
                shadow-2xl
                z-10
                max-h-[92vh]
                overflow-y-auto
              "
            >
              {/* Close */}

              <button
                type="button"
                onClick={closeQuickView}
                className="
                  absolute top-4 right-4
                  z-40
                  w-9 h-9
                  rounded-full
                  bg-white/90
                  dark:bg-stone-800/90
                  shadow-md
                  flex items-center justify-center
                  text-stone-700
                  dark:text-stone-300
                  hover:bg-stone-100
                  dark:hover:bg-stone-700
                  transition-colors
                  cursor-pointer
                "
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="
                  grid
                  md:grid-cols-[0.9fr_1.1fr]
                "
              >
                {/* =================================================
                    IMAGE SECTION
                ================================================== */}

                <div
                  className="
                    p-5 md:p-6
                    bg-stone-50
                    dark:bg-stone-950
                  "
                >
                  <div
                    className="
                      relative
                      h-[350px]
                      md:h-[420px]
                      rounded-xl
                      overflow-hidden
                      bg-white
                      dark:bg-stone-900
                      border
                      border-stone-100
                      dark:border-stone-800
                      flex items-center
                      justify-center
                    "
                  >
                    {quickViewImages.length >
                    0 ? (
                      <AnimatePresence
                        mode="wait"
                      >
                        <motion.img
                          key={
                            quickViewImages[
                              quickViewSlide
                            ]
                          }
                          src={
                            quickViewImages[
                              quickViewSlide
                            ]
                          }
                          alt={
                            product?.title ||
                            'Product'
                          }
                          referrerPolicy="no-referrer"
                          initial={{
                            opacity: 0,
                            x: 20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          exit={{
                            opacity: 0,
                            x: -20,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="
                            w-full h-full
                            object-contain
                            p-8
                          "
                        />
                      </AnimatePresence>
                    ) : (
                      <span
                        className="
                          text-sm
                          text-stone-400
                        "
                      >
                        No image
                      </span>
                    )}

                    {/* Previous */}

                    {quickViewImages.length >
                      1 && (
                      <>
                        <button
                          type="button"
                          onClick={
                            previousQuickViewSlide
                          }
                          className="
                            absolute left-3
                            top-1/2
                            -translate-y-1/2
                            z-20
                            w-9 h-9
                            rounded-full
                            bg-white/90
                            dark:bg-stone-800/90
                            shadow-md
                            flex items-center justify-center
                            text-stone-700
                            dark:text-stone-200
                            hover:bg-white
                            dark:hover:bg-stone-700
                            cursor-pointer
                          "
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={
                            nextQuickViewSlide
                          }
                          className="
                            absolute right-3
                            top-1/2
                            -translate-y-1/2
                            z-20
                            w-9 h-9
                            rounded-full
                            bg-white/90
                            dark:bg-stone-800/90
                            shadow-md
                            flex items-center justify-center
                            text-stone-700
                            dark:text-stone-200
                            hover:bg-white
                            dark:hover:bg-stone-700
                            cursor-pointer
                          "
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div
                          className="
                            absolute bottom-3 right-3
                            z-20
                            px-2.5 py-1
                            rounded-full
                            bg-stone-950/65
                            text-white
                            text-[10px]
                            font-medium
                          "
                        >
                          {quickViewSlide + 1} /{' '}
                          {quickViewImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}

                  {quickViewImages.length >
                    1 && (
                    <div
                      className="
                        mt-4
                        flex gap-2
                        overflow-x-auto
                        pb-1
                      "
                    >
                      {quickViewImages.map(
                        (
                          imageUrl,
                          index
                        ) => (
                          <button
                            type="button"
                            key={`${imageUrl}-${index}`}
                            onClick={() =>
                              selectQuickViewImage(
                                index
                              )
                            }
                            className={`
                              relative
                              w-16 h-16
                              md:w-[68px]
                              md:h-[68px]
                              rounded-lg
                              overflow-hidden
                              flex-shrink-0
                              border-2
                              transition-all
                              cursor-pointer
                              ${
                                quickViewSlide ===
                                index
                                  ? 'border-gold-500 opacity-100'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }
                            `}
                          >
                            <img
                              src={imageUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="
                                w-full h-full
                                object-contain
                                p-1
                                bg-white
                                dark:bg-stone-900
                              "
                            />

                            {quickViewSlide ===
                              index && (
                              <span
                                className="
                                  absolute
                                  inset-x-0
                                  bottom-0
                                  h-0.5
                                  bg-gold-500
                                "
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    PRODUCT INFORMATION
                ================================================== */}

                <div
                  className="
                    p-6 md:p-8
                    flex flex-col
                    justify-between
                  "
                >
                  <div>
                    {/* Category */}

                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-gold-600
                        dark:text-gold-400
                        uppercase
                        tracking-[0.15em]
                        block mb-1.5
                      "
                    >
                      {product?.category?.name}
                    </span>

                    {/* Title */}

                    <h2
                      className="
                        font-serif
                        text-2xl
                        md:text-3xl
                        font-semibold
                        text-stone-900
                        dark:text-stone-100
                        mb-3
                      "
                    >
                      {product?.title}
                    </h2>

                    {/* Rating + Stock */}

                    <div
                      className="
                        flex items-center
                        gap-3
                        mb-5
                        border-b
                        border-stone-100
                        dark:border-stone-800
                        pb-4
                      "
                    >
                      {product?.rating > 0 ?
                             <div
                        className="
                          flex items-center
                          text-amber-400
                        "
                      >
                        <Star
                          className="
                            w-4 h-4
                            fill-amber-400
                            text-amber-400
                            mr-1
                          "
                        />

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-stone-800
                            dark:text-stone-100
                          "
                        >
                          {product?.rating || 0}
                        </span>
                      </div>
                       : ""}
                     

                      <div
                        className="
                          w-1 h-1
                          rounded-full
                          bg-stone-300
                          dark:bg-stone-700
                        "
                      />

                      <span
                        className={`
                          text-xs
                          font-semibold
                          ${
                            currentStock > 0
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }
                        `}
                      >
                        {currentStock > 0
                          ? `In Stock (${currentStock})`
                          : 'Out of Stock'}
                      </span>
                    </div>

                    {/* =================================================
                        PRICE
                    ================================================== */}

                   <div
                    className="
                      mb-5
                      flex items-center
                      justify-between
                      gap-4
                    "
                  >
                    {/* Price block */}
                    <div className="flex items-baseline gap-4">
                      <span
                        className="
                          text-3xl
                          font-bold
                          text-stone-900
                          dark:text-gold-100
                        "
                      >
                        ₹{formatPrice(currentPrice)}
                      </span>

                      {currentHasDiscount && (
                        <span
                          className="
                            text-base
                            text-stone-400
                            line-through
                          "
                        >
                          ₹{formatPrice(currentOriginalPrice)}
                        </span>
                      )}

                      {currentHasDiscount && (
                        <span
                          className="
                            px-2 py-0.5
                            rounded
                            bg-emerald-50
                            dark:bg-emerald-500/10
                            text-emerald-600
                            dark:text-emerald-400
                            text-[10px]
                            font-bold
                          "
                        >
                          SAVE{' '}
                          {Math.round(
                            ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    {/* Quantity selector */}
                    <div className="flex flex-col items-end">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>

                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-max">
                        <button
                          type="button"
                          onClick={() => changeQty(-1)}
                          disabled={quantity <= MIN_QTY}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>

                        <input
                          type="number"
                          value={quantity}
                          min={MIN_QTY}
                          max={MAX_QTY}
                          onChange={validateQty}
                          className="w-12 h-10 text-center border-x border-gray-300 text-gray-900 font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <button
                          type="button"
                          onClick={() => changeQty(1)}
                          disabled={quantity >= MAX_QTY}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                     
                     {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <p
                      className="
                        text-stone-600
                        dark:text-stone-400
                        text-sm
                        leading-relaxed
                        mb-5
                        line-clamp-4
                      "
                    >
                      {selectedVariant?.description ||
                        product?.description}
                    </p>
                    {/* =================================================
                        SKU SELECTOR
                    ================================================== */}
                   
                    {hasVariants && (
                      <div className="mb-6">
                        <div
                          className="
                            flex items-center
                            justify-between
                            mb-3
                          "
                        >
                          <div>
                            <h3
                              className="
                                text-sm
                                font-bold
                                text-stone-900
                                dark:text-stone-100
                              "
                            >
                              Select SKU
                            </h3>

                            <p
                              className="
                                text-[11px]
                                text-stone-400
                                mt-0.5
                              "
                            >
                              Select the SKU to view
                              its exact variant details.
                            </p>
                          </div>

                          {selectedVariant && (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                px-2.5 py-1
                                rounded-full
                                bg-emerald-50
                                dark:bg-emerald-500/10
                                text-emerald-600
                                dark:text-emerald-400
                                text-[10px]
                                font-bold
                              "
                            >
                              <Check className="w-3 h-3" />
                              Selected
                            </span>
                          )}
                        </div>

                        {/* =================================================
                            SKU LIST
                        ================================================== */}

                        <div
                          className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-2
                            max-h-[220px]
                            overflow-y-auto
                            pr-1
                          "
                        >
                          {skuVariants.map(
                            (variant) => {
                              const isSelected =
                                selectedVariant?.id ===
                                variant.id;

                              const isInStock =
                                Number(
                                  variant.qty || 0
                                ) > 0;

                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() =>
                                    selectVariant(
                                      variant
                                    )
                                  }
                                  className={`
                                    relative
                                    p-3
                                    rounded-xl
                                    border
                                    text-left
                                    transition-all
                                    duration-200
                                    cursor-pointer

                                    ${
                                      isSelected
                                        ? `
                                          border-gold-500
                                          bg-gold-50
                                          dark:bg-gold-500/10
                                          ring-1
                                          ring-gold-500/20
                                        `
                                        : `
                                          border-stone-200
                                          dark:border-stone-700
                                          bg-white
                                          dark:bg-stone-900
                                          hover:border-gold-400
                                          hover:bg-gold-50/40
                                          dark:hover:bg-gold-500/5
                                        `
                                    }
                                  `}
                                >
                                  <div
                                    className="
                                      flex
                                      items-start
                                      justify-between
                                      gap-2
                                    "
                                  >
                                    <div className="min-w-0">
                                      <div
                                        className={`
                                          text-xs
                                          font-bold
                                          truncate
                                          ${
                                            isSelected
                                              ? 'text-gold-700 dark:text-gold-400'
                                              : 'text-stone-800 dark:text-stone-100'
                                          }
                                        `}
                                      >
                                        {variant.displaySku}
                                      </div>

                                      <div
                                        className="
                                          text-[9px]
                                          text-stone-400
                                          mt-1
                                          line-clamp-2
                                        "
                                      >
                                        {getVariantLabel(
                                          variant
                                        )}
                                      </div>
                                    </div>

                                    {isSelected && (
                                      <span
                                        className="
                                          flex-shrink-0
                                          w-5 h-5
                                          rounded-full
                                          bg-gold-500
                                          text-white
                                          flex items-center
                                          justify-center
                                        "
                                      >
                                        <Check
                                          className="
                                            w-3 h-3
                                            stroke-[3]
                                          "
                                        />
                                      </span>
                                    )}
                                  </div>

                                  <div
                                    className="
                                      flex
                                      items-center
                                      justify-between
                                      mt-2
                                    "
                                  >
                                    <span
                                      className="
                                        text-[10px]
                                        font-bold
                                        text-stone-800
                                        dark:text-stone-200
                                      "
                                    >
                                      ₹
                                      {formatPrice(
                                        getVariantPrice(
                                          variant
                                        )
                                      )}
                                    </span>

                                    <span
                                      className={`
                                        text-[9px]
                                        font-semibold
                                        ${
                                          isInStock
                                            ? 'text-emerald-600'
                                            : 'text-rose-500'
                                        }
                                      `}
                                    >
                                      {isInStock
                                        ? `${variant.qty} available`
                                        : 'Out of stock'}
                                    </span>
                                  </div>
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        SELECTED SKU DETAILS
                    ================================================== */}

                    {selectedVariant && (
                      <div
                        className="
                          mb-5
                          rounded-xl
                          border
                          border-stone-200
                          dark:border-stone-800
                          overflow-hidden
                        "
                      >
                        {/* Header */}

                        <div
                          className="
                            px-4 py-3
                            bg-stone-50
                            dark:bg-stone-950
                            border-b
                            border-stone-200
                            dark:border-stone-800
                            flex items-center
                            justify-between
                            gap-3
                          "
                        >
                          <div>
                            <div
                              className="
                                text-[9px]
                                uppercase
                                tracking-[0.15em]
                                font-bold
                                text-stone-400
                              "
                            >
                              Selected SKU
                            </div>

                            <div
                              className="
                                text-sm
                                font-bold
                                text-stone-900
                                dark:text-stone-100
                                mt-0.5
                              "
                            >
                              {selectedVariant.sku ||
                                `VAR-${selectedVariant.id}`}
                            </div>
                          </div>

                          <div
                            className={`
                              px-2.5 py-1
                              rounded-full
                              text-[9px]
                              font-bold
                              ${
                                Number(
                                  selectedVariant.qty ||
                                    0
                                ) > 0
                                  ? `
                                    bg-emerald-50
                                    dark:bg-emerald-500/10
                                    text-emerald-600
                                    dark:text-emerald-400
                                  `
                                  : `
                                    bg-rose-50
                                    dark:bg-rose-500/10
                                    text-rose-600
                                    dark:text-rose-400
                                  `
                              }
                            `}
                          >
                            {Number(
                              selectedVariant.qty ||
                                0
                            ) > 0
                              ? 'IN STOCK'
                              : 'OUT OF STOCK'}
                          </div>
                        </div>

                        {/* Variant details */}

                        <div className="p-4">
                          <div
                            className="
                              text-[9px]
                              uppercase
                              tracking-[0.15em]
                              font-bold
                              text-stone-400
                              mb-3
                            "
                          >
                            Variant Details
                          </div>

                          {getVariantDetails(
                            selectedVariant
                          ).length > 0 ? (
                            <div
                              className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-2
                              "
                            >
                              {getVariantDetails(
                                selectedVariant
                              ).map(
                                (
                                  detail,
                                  index
                                ) => (
                                  <div
                                    key={`${detail.typeId}-${detail.valueId}-${index}`}
                                    className="
                                      flex
                                      items-center
                                      justify-between
                                      gap-3
                                      px-3 py-2.5
                                      rounded-lg
                                      bg-stone-50
                                      dark:bg-stone-950
                                      border
                                      border-stone-100
                                      dark:border-stone-800
                                    "
                                  >
                                    <span
                                      className="
                                        text-[10px]
                                        font-semibold
                                        text-stone-400
                                      "
                                    >
                                      {detail.typeName}
                                    </span>

                                    <span
                                      className="
                                        text-[11px]
                                        font-bold
                                        text-stone-800
                                        dark:text-stone-200
                                      "
                                    >
                                      {detail.valueName}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div
                              className="
                                text-xs
                                text-stone-400
                              "
                            >
                              No variant attributes
                              available.
                            </div>
                          )}

                          {/* Variant material/style */}

                          {(selectedVariant?.material ||
                            selectedVariant?.style) && (
                            <div
                              className="
                                mt-3
                                pt-3
                                border-t
                                border-stone-100
                                dark:border-stone-800
                                space-y-2
                              "
                            >
                              {selectedVariant?.material && (
                                <div className="flex text-xs">
                                  <span
                                    className="
                                      w-24
                                      flex-shrink-0
                                      text-stone-400
                                      uppercase
                                      tracking-wider
                                      font-semibold
                                    "
                                  >
                                    Material:
                                  </span>

                                  <span
                                    className="
                                      text-stone-700
                                      dark:text-stone-300
                                      font-medium
                                    "
                                  >
                                    {
                                      selectedVariant.material
                                    }
                                  </span>
                                </div>
                              )}

                              {selectedVariant?.style && (
                                <div className="flex text-xs">
                                  <span
                                    className="
                                      w-24
                                      flex-shrink-0
                                      text-stone-400
                                      uppercase
                                      tracking-wider
                                      font-semibold
                                    "
                                  >
                                    Style:
                                  </span>

                                  <span
                                    className="
                                      text-stone-700
                                      dark:text-stone-300
                                      font-medium
                                    "
                                  >
                                    {
                                      selectedVariant.style
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                   

                    {/* =================================================
                        PRODUCT METADATA
                    ================================================== */}

                    {!selectedVariant && (
                      <div
                        className="
                          space-y-2
                          bg-stone-50
                          dark:bg-stone-950
                          p-4
                          rounded-xl
                          mb-5
                        "
                      >
                        {(product?.material ||
                          product?.style) && (
                          <>
                            {product?.material && (
                              <div className="flex text-xs">
                                <span
                                  className="
                                    w-24
                                    flex-shrink-0
                                    text-stone-400
                                    uppercase
                                    tracking-wider
                                    font-semibold
                                  "
                                >
                                  Material:
                                </span>

                                <span
                                  className="
                                    text-stone-700
                                    dark:text-stone-300
                                    font-medium
                                  "
                                >
                                  {product.material}
                                </span>
                              </div>
                            )}

                            {product?.style && (
                              <div className="flex text-xs">
                                <span
                                  className="
                                    w-24
                                    flex-shrink-0
                                    text-stone-400
                                    uppercase
                                    tracking-wider
                                    font-semibold
                                  "
                                >
                                  Style:
                                </span>

                                <span
                                  className="
                                    text-stone-700
                                    dark:text-stone-300
                                    font-medium
                                  "
                                >
                                  {product.style}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* =================================================
                        NO SKU SELECTED
                    ================================================== */}

                    {hasVariants &&
                      !selectedVariant && (
                        <div
                          className="
                            mb-5
                            flex items-center
                            gap-2
                            px-3 py-2.5
                            rounded-lg
                            bg-amber-50
                            dark:bg-amber-500/10
                            border
                            border-amber-100
                            dark:border-amber-500/20
                            text-[10px]
                            text-amber-700
                            dark:text-amber-400
                          "
                        >
                          <span
                            className="
                              w-1.5 h-1.5
                              rounded-full
                              bg-amber-500
                              flex-shrink-0
                            "
                          />

                          Select a SKU to view
                          the exact variant
                          details.
                        </div>
                      )}
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div
                    className="
                      flex gap-3
                      pt-2
                    "
                  >
                    {/* Add */}

                    <button
                      type="button"
                      disabled={
                        hasVariants &&
                        (!selectedVariant ||
                          currentStock <= 0)
                      }
                      onClick={(event) => {
                        handleAddToCart(
                          event,
                          selectedVariant
                        );

                        if (
                          !hasVariants ||
                          selectedVariant
                        ) {
                          closeQuickView();
                        }
                      }}
                      className="
                        flex-1
                        py-3.5
                        rounded-xl
                        bg-gold-500
                        hover:bg-gold-600
                        disabled:bg-stone-300
                        disabled:text-stone-500
                        disabled:cursor-not-allowed
                        text-stone-950
                        font-bold
                        text-sm
                        flex items-center
                        justify-center
                        gap-2
                        transition-all
                        cursor-pointer
                        shadow-md
                        hover:shadow-lg
                        active:scale-[0.98]
                      "
                    >
                      <ShoppingBag className="w-5 h-5" />

                      {hasVariants &&
                      !selectedVariant
                        ? 'Select SKU'
                        : currentStock <= 0
                        ? 'Out of Stock'
                        : 'Add to Basket'}
                    </button>

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlist(
                          product.id
                        )
                      }
                      className="
                        w-12
                        flex-shrink-0
                        border
                        border-stone-200
                        dark:border-stone-700
                        hover:border-rose-500
                        rounded-xl
                        text-stone-500
                        hover:text-rose-500
                        transition-colors
                        flex items-center
                        justify-center
                        cursor-pointer
                      "
                    >
                      <Heart
                        className={`
                          w-5 h-5
                          ${
                            isWishlisted
                              ? 'fill-rose-500 text-rose-500'
                              : ''
                          }
                        `}
                      />
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