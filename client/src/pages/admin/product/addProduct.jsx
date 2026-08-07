import React, { useState, useEffect } from "react";
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

import ImageUploader from "../product/imageUploader";
const AddProductTemp = ({
  editingProduct,
  handleFormSubmit,
  formState,
  categories,
  addVariantRow,
  setFormState,
  primaryImage,
  setPrimaryImage,
  variantImages,
  setVariantImages,
  setIsAddOpen,
  setEditingProduct,
  setDeletedMediaIds,
  setNewPrimaryImages,
  setDeletedVariantIds,
}) => {
  const updateVariant = (variantIndex, field, value) => {
    setFormState((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        [field]: value,
      };

      return {
        ...prev,
        variants,
      };
    });
  };
  const updateVariantAttribute = (
    variantIndex,
    attributeIndex,
    field,
    value,
  ) => {
    setFormState((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex].attributes[attributeIndex] = {
        ...variants[variantIndex].attributes[attributeIndex],
        [field]: value,
      };
      return {
        ...prev,
        variants,
      };
    });
  };
  const addAttributeToVariant = (variantIndex) => {
    setFormState((prev) => ({
      ...prev, // 1. Copy top-level form state
      variants: prev.variants.map((variant, index) => {
        if (index === variantIndex) {
          return {
            ...variant, // 3. Copy target variant properties
            attributes: [
              ...variant.attributes, // 4. Copy existing attributes
              {
                variantType: "",
                variantValue: "",
              }, // 5. Append new attribute object
            ],
          };
        }
        return variant; // Leave other variants untouched
      }),
    }));
  };
  const removeAttribute = (variantIndex, attributeIndex) => {
    setFormState((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        attributes: variants[variantIndex].attributes.filter(
          (_, index) => index !== attributeIndex,
        ),
      };

      return {
        ...prev,
        variants,
      };
    });
  };
  const removeVariant = (variantIndex, variant) => {
    debugger;
    if (variant?.id) {
      setDeletedVariantIds((ids) => [...ids, variant.id]);
    }
    setFormState((prev) => {
      if (prev.variants.length === 1) {
        return prev;
      }
      return {
        ...prev,
        variants: prev.variants.filter((_, index) => index !== variantIndex),
      };
    });
  };
  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormState((prev) => ({
      ...prev,
      image: file,
    }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs select-none"
        onClick={() => {
          setIsAddOpen(false);
          setEditingProduct(null);
        }}
      />

      <div className="relative w-[90%] max-w-6xl bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto select-text font-sans border border-stone-200/40 dark:border-stone-800/30">
        <button
          onClick={() => {
            setIsAddOpen(false);
            setEditingProduct(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer z-20"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-stone-150 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-101">
          <h2 className="font-serif text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            {editingProduct
              ? "Update Antiquity Ledger"
              : "Acquire New Antiquity"}
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleFormSubmit}
          className="p-6 sm:p-8 space-y-5 text-xs font-semibold text-stone-505 dark:text-stone-400"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label>Title *</label>
              <input
                required
                type="text"
                value={formState.title}
                onChange={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
                placeholder="e.g. Royal Kundan Pearl Jhumkas Set"
                className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
              />
            </div>
            <div className="space-y-1">
              <label>Description *</label>
              <textarea
                type="text"
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
                placeholder="e.g. Royal Kundan Pearl Jhumkas Set"
                className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
              >
                {formState.description}
              </textarea>
            </div>
            {/* Categories */}
            <div className="space-y-1">
              <label>Category</label>
              <select
                required
                value={formState.categoryId}
                onChange={(e) =>
                  setFormState({ ...formState, categoryId: e.target.value })
                }
                className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label>Primary Image</label>
              <ImageUploader
                setNewPrimaryImages={setNewPrimaryImages}
                setDeletedMediaIds={setDeletedMediaIds}
                images={formState.images}
                multiple={false}
                onChange={(images) =>
                  setFormState((prev) => ({
                    ...prev,
                    images,
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                    Product Variants
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Create variant combinations such as Size, Color or Material.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addVariantRow()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-900 text-white dark:bg-gold-500 dark:text-stone-900 text-xs font-semibold hover:opacity-90"
                >
                  <CirclePlus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {formState.variants.map((variant, index) => {
                return (
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-2">
                    <div className="col-span-1 flex justify-start">
                      <span>#{index + 1} </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {index !== 0 ? (
                        <button
                          onClick={(e) => {
                            removeVariant(index, variant);
                          }}
                          type="button"
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-6 gap-4 p-2">
                      <div className="space-y-2">
                        <label>SKU *</label>
                        <input
                          type="text"
                          required
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(index, "sku", e.target.value)
                          }
                          placeholder="e.g. article-250"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Price's *</label>
                        <input
                          type="number"
                          required
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", e.target.value)
                          }
                          placeholder="e.g. 999.50"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Discounted Price *</label>
                        <input
                          type="number"
                          required
                          value={variant.discountedPrice}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "discountedPrice",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 999.50"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Inventory quantity *</label>
                        <input
                          type="number"
                          required
                          value={variant.qty}
                          onChange={(e) =>
                            updateVariant(index, "qty", e.target.value)
                          }
                          placeholder="e.g. 100"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Material</label>
                        <input
                          type="text"
                          required
                          value={variant.material}
                          onChange={(e) =>
                            updateVariant(index, "material", e.target.value)
                          }
                          placeholder="e.g. Cotton"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Style</label>
                        <input
                          type="text"
                          required
                          value={variant.style}
                          onChange={(e) =>
                            updateVariant(index, "style", e.target.value)
                          }
                          placeholder="e.g. Indo-western"
                          className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                        />
                      </div>
                    </div>
                    <hr />
                    {variant.attributes.map((attribute, attributeIndex) => {
                      return (
                        <div className="space-y-2">
                          <div
                            className={`grid grid-cols-12 gap-3 items-end  dark:border-stone-800 rounded-xl ${attributeIndex > 0 ? "pt-0" : ""} p-4`}
                          >
                            {/* Variant Type */}

                            <div className="col-span-3">
                              {attributeIndex == 0 ? (
                                <label className="block mb-1 text-xs">
                                  Variant Type
                                </label>
                              ) : (
                                ""
                              )}
                              <input
                                value={attribute.variantType}
                                type="text"
                                required
                                onChange={(e) =>
                                  updateVariantAttribute(
                                    index,
                                    attributeIndex,
                                    "variantType",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. size"
                                className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                              />
                            </div>
                            <div className="col-span-3">
                              {attributeIndex == 0 ? (
                                <label className="block mb-1 text-xs">
                                  Variant Value
                                </label>
                              ) : (
                                ""
                              )}

                              <div className="flex flex-wrap gap-2">
                                <input
                                  value={attribute.variantValue}
                                  type="text"
                                  required
                                  onChange={(e) =>
                                    updateVariantAttribute(
                                      index,
                                      attributeIndex,
                                      "variantValue",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. UK-9"
                                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-950 dark:text-stone-100"
                                />
                              </div>
                            </div>
                            <div className="col-span-1 flex justify-start">
                              {attributeIndex === 0 ? (
                                <button
                                  onClick={(e) => addAttributeToVariant(index)}
                                  type="button"
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-500"
                                >
                                  <CirclePlus className="w-4 h-4" />
                                </button>
                              ) : (
                                ""
                              )}
                              {attributeIndex !== 0 ? (
                                <button
                                  onClick={(e) =>
                                    removeAttribute(index, attributeIndex)
                                  }
                                  type="button"
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <hr />
                    <div className="col-span-6 pt-2">
                      <label className="block mb-1 text-xs">
                        Variant Images
                      </label>
                      <div className="col-span-12">
                        <ImageUploader
                          isEditing={editingProduct?.id ? true : false}
                          setDeletedMediaIds={setDeletedMediaIds}
                          images={variant.images}
                          onChange={(images) => {
                            setFormState((prev) => {
                              const variants = [...prev.variants];

                              variants[index] = {
                                ...variants[index],
                                images,
                              };

                              return {
                                ...prev,
                                variants,
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <div className="sm:col-span-2 mt-2 border-t border-stone-100 dark:border-stone-800 pt-3">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider mb-2.5">
                Portal Highlights Triggers
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormState({
                      ...formState,
                      isFeatured: !formState.isFeatured,
                    })
                  }
                  className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    formState.isFeatured
                      ? "bg-emerald-50 border-emerald-500 text-emerald-805 dark:bg-emerald-955/20 border-emerald-505 dark:text-emerald-250"
                      : "border-stone-200 text-stone-400"
                  }`}
                >
                  <Check
                    className={`w-4 h-4 mr-0.5 ${formState.isFeatured ? "opacity-100" : "opacity-0"}`}
                  />
                  Featured Sinks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormState({
                      ...formState,
                      isTrending: !formState.isTrending,
                    })
                  }
                  className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    formState.isTrending
                      ? "bg-sky-50 border-sky-500 text-sky-805 dark:bg-sky-955/20 border-sky-505 dark:text-sky-250"
                      : "border-stone-200 text-stone-400"
                  }`}
                >
                  <Check
                    className={`w-4 h-4 mr-0.5 ${formState.isTrending ? "opacity-100" : "opacity-0"}`}
                  />
                  Trending Sinks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormState({
                      ...formState,
                      isBestSeller: !formState.isBestSeller,
                    })
                  }
                  className={`py-2 px-3.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    formState.isBestSeller
                      ? "bg-amber-50 border-amber-555 text-amber-805 dark:bg-amber-955/20 border-amber-505 dark:text-amber-250"
                      : "border-stone-200 text-stone-400"
                  }`}
                >
                  <Check
                    className={`w-4 h-4 mr-0.5 ${formState.isBestSeller ? "opacity-100" : "opacity-0"}`}
                  />
                  Best Seller
                </button>
              </div>
            </div> */}
          </div>

          {/* submitting */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 font-bold text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2.5 border border-stone-200 dark:border-stone-804 rounded-lg hover:bg-stone-50 text-stone-701 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-950 dark:bg-gold-505 dark:text-stone-950 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Save Entry Chronicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProductTemp;
