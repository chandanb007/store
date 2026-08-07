import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import AddProductTemp from "../pages/admin/product/addProduct.jsx";
const apiUrl = import.meta.env.VITE_API_URL;
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
import ProductListing from "./admin/product/productListing.jsx";
import { object } from "motion/react-client";

export const AdminProducts = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    addNotification,
    categories,
    loadCategories,
  } = useApp();

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const emptyVariant = {
    images: [],
    sku: "",
    price: "",
    discountedPrice: "",
    qty: "",
    material: "",
    style: "",
    attributes: [
      {
        variantType: "",
        variantValue: "",
      },
    ],
  };
  const [formState, setFormState] = useState({
    title: "",
    categoryId: "",
    description: "",
    images: [],
    variants: [emptyVariant],
  });
  const [newPrimaryImages, setNewPrimaryImages] = useState([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);
  const addVariantRow = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          images: [],
          sku: "",
          price: "",
          discountedPrice: "",
          qty: "",
          material: "",
          style: "",
          attributes: [
            {
              variantType: "",
              variantValue: "",
            },
          ],
        },
      ],
    }));
  };
  const resetForm = () => {
    setFormState({
      images: [],
      sku: "",
      price: "",
      discountedPrice: "",
      qty: "",
      material: "",
      style: "",
      attributes: [
        {
          variantType: "",
          variantValue: "",
        },
      ],
    });
  };

  const handleOpenAdd = () => {
    //resetForm();
    setIsAddOpen(true);
    loadCategories();
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const variants = product.variants.map((variant) => {
      const attributes = variant.variantValues.map((attribute) => {
        return {
          variantValue: attribute.value.value,
          variantType: attribute.value.variantType.name,
        };
      });
      const variantImages = variant.productMedia.map((media) => ({
        productMediaId: media.id,
        mediaId: media.mediaId,
        isPrimary: media.isPrimary,
        isExisting: true,
        url: apiUrl + media.media.url,
      }));
      return {
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        discountedPrice: variant.discountedPrice,
        qty: variant.qty,
        material: variant.material,
        style: variant.style,
        attributes: attributes,
        images: variantImages,
      };
    });
    const primaryImages = product.productMedia.map((media) => ({
      productMediaId: media.id,
      mediaId: media.mediaId,
      isPrimary: media.isPrimary,
      isExisting: true,
      url: apiUrl + media.media.url,
    }));
    setFormState({
      images: primaryImages,
      title: product.title,
      description: product.description,
      categoryId: product.categoryId,
      variants: variants,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingProduct == null) {
      addProduct(formState);
    } else {
      console.log(editingProduct.id);
      updateProduct(
        editingProduct.id,
        formState,
        deletedMediaIds,
        deletedVariantIds,
      );
    }
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-150/45 dark:border-stone-850 pb-5 h-fit">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4B0011] dark:text-stone-105">
            Inventory Catalog
          </h1>
          <p className="text-xs text-stone-500">
            Regulate active product entries, Sku stock limits, and promo ratings
            weights.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-xl bg-stone-950 dark:bg-gold-505 dark:bg-gold-500 dark:text-stone-950 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 hover:scale-110 transition-transform" />
          Acquire New Product
        </button>
      </div>

      {/* Main product listings table */}
      <ProductListing
        handleOpenEdit={handleOpenEdit}
        products={products}
        setIsAddOpen={setIsAddOpen}
      ></ProductListing>

      {/* dialog forms drawer (Add / Edit item) */}
      {(isAddOpen || editingProduct) && (
        <AddProductTemp
          setDeletedVariantIds={setDeletedVariantIds}
          setNewPrimaryImages={setNewPrimaryImages}
          setDeletedMediaIds={setDeletedMediaIds}
          setEditingProduct={setEditingProduct}
          setIsAddOpen={setIsAddOpen}
          editingProduct={editingProduct}
          handleFormSubmit={handleFormSubmit}
          formState={formState}
          loadCategories={loadCategories}
          categories={categories}
          addVariantRow={addVariantRow}
          setFormState={setFormState}
        />
      )}
    </div>
  );
};
