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
import Filters from './common/Filters.jsx';import Pagination from './common/pagination.jsx';


export const AdminProducts = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    addNotification,
    categories,
    loadCategories,
    loadProducts
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
    isEnabled : "",
    images: [],
    variants: [emptyVariant],
  });
  const [newPrimaryImages, setNewPrimaryImages] = useState([]);
  const [deletedProductMediaIds, setDeletedProductMediaIds] = useState([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);
  const [primaryProductMediaId, setPrimaryProductMediaId] = useState(null);
  const [deletedVariantAttributes,setDeletedVariantAttributes] = useState([]);
  const [pagination,setPagination] = useState([]);
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
      
      let attributes = variant.variantValues.map((attribute) => {
        return {
          id: attribute.id,
          variantValue: attribute.value.value,
          valueId: attribute.value.id,
          variantType: attribute.value.variantType.name,
        };
      });
      console.log(variant);
      if (attributes.length == 0) {
         attributes = [{
          variantValue: "",
          variantType: "",
        }];
      }
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
    const primaryImages = product.productMedia.map((media) => {
      return {
        productMediaId: media.id,
        mediaId: media.mediaId,
        isPrimary: media.isPrimary,
        isExisting: true,
        url: apiUrl + media.media.url,
      };
    });
    const primaryImage = primaryImages.find((image) => image.isPrimary);
    setPrimaryProductMediaId(primaryImage?.productMediaId ?? null);
    setFormState({
      images: primaryImages,
      title: product.title,
      isEnabled: product.isEnabled,
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
      console.log(primaryProductMediaId);
      console.log(formState.images);
      updateProduct(
        editingProduct.id,
        formState,
        deletedProductMediaIds,
        deletedVariantIds,
        primaryProductMediaId,
        deletedVariantAttributes
      );
    }
    setIsAddOpen(false);
    setEditingProduct(null)
    loadProducts(filters);

  };
  const filterConfig = [
    {
        name: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
        width: "sm",
    },

    {
        name: "search",
        label: "Product Name/Description",
        type: "text",
        placeholder: "Search product...",
        width: "lg",
    },

    {
        name: "minPrice",
        label: "Min Price",
        type: "number",
        placeholder: "₹ 0",
        width: "sm",
    },

    {
        name: "maxPrice",
        label: "Max Price",
        type: "number",
        placeholder: "₹10,000",
        width: "sm",
    },

    {
        name: "category",
        label: "Category",
        type: "select",
        options: categories,
        width: "md",
    },
];
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    page : "",
  });
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
        ...prev,
        [name]: value,
    }));
  };
  
  const handleApplyFilters = () => {
     loadProducts(filters);
  };
  const handleClearFilters = () => {
    setFilters({  status: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    category: "",})
    loadProducts();
  }
const handlePageChange = async (page) => {
    setPagination((prev) => ({
        ...prev,
        page,
    }));
    loadProducts({
        ...filters,
        page,
        pageSize: pagination.pageSize,
    });
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
      <Filters   
        filters={filterConfig}
        values={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      >
      </Filters>
      {/* Main product listings table   //}
      // 
    */}
      <ProductListing
        filters={filters}
        loadProducts={loadProducts}
        handleOpenEdit={handleOpenEdit}
        products={products}
        setIsAddOpen={setIsAddOpen}
        deleteProduct={deleteProduct}
        restoreProduct={restoreProduct}
      ></ProductListing>
      {products.data.length > 0 ? 
          <Pagination
          currentPage={products?.pagination?.page}
          totalPages={products?.pagination?.totalPages}
          onPageChange={handlePageChange}
          totalItems={products?.pagination?.total}
          pageSize={products?.pagination?.pageSize}        
        />
      : ""}
      
      {/* dialog forms drawer (Add / Edit item) */}
      {(isAddOpen || editingProduct) && (
        <AddProductTemp
          setDeletedVariantIds={setDeletedVariantIds}
          setNewPrimaryImages={setNewPrimaryImages}
          setDeletedProductMediaIds={setDeletedProductMediaIds}
          setEditingProduct={setEditingProduct}
          setIsAddOpen={setIsAddOpen}
          editingProduct={editingProduct}
          handleFormSubmit={handleFormSubmit}
          formState={formState}
          loadCategories={loadCategories}
          categories={categories}
          addVariantRow={addVariantRow}
          setFormState={setFormState}
          setPrimaryProductMediaId={setPrimaryProductMediaId}
          setDeletedVariantAttributes={setDeletedVariantAttributes}
        />
      )}
    </div>
  );
};
