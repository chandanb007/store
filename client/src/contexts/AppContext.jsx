import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data.js';
import { login as authLogin } from "../services/authService";
import * as categoryService from "../services/categoryService.js";

const AppContext = createContext(undefined);

const SEED_USERS = [
  {
    id: "user-admin",
    email: "admin@heritage.com",
    name: "Vikramaditya Dev (Admin)",
    role: "Admin",
    addresses: [
      {
        fullName: "Vikramaditya Dev",
        street: "12, Royal Palace Road",
        city: "Jaipur",
        state: "Rajasthan",
        zipCode: "302001",
        country: "India",
        phone: "9876543210",
      },
    ],
  },
  {
    id: "user-customer",
    email: "customer@heritage.com",
    name: "Aditi Rao",
    role: "Customer",
    addresses: [
      {
        fullName: "Aditi Rao",
        street: "Apt 4B, Coral Breeze Apartments",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
        phone: "9812345678",
      },
    ],
    wishlist: ["prod-1", "prod-2"],
  },
];

const SEED_ORDERS = [
  {
    id: "ord-1001",
    orderNumber: "HT-2026-1001",
    userEmail: "customer@heritage.com",
    userName: "Aditi Rao",
    items: [
      {
        product: INITIAL_PRODUCTS[1], // Handcrafted Pastel Meenakari Jhumkas
        quantity: 1,
        selectedVariant: "Standard",
      },
      {
        product: INITIAL_PRODUCTS[5], // Royale Brass Floating Urli Bowl
        quantity: 1,
        selectedVariant: "Brass",
      },
    ],
    subtotal: 7090,
    shipping: 150,
    discount: 500,
    total: 6740,
    billingAddress: {
      fullName: "Aditi Rao",
      street: "Apt 4B, Coral Breeze Apartments",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      phone: "9812345678",
    },
    paymentMethod: "UPI",
    status: "Completed",
    trackingNumber: "TRACK-8899120",
    date: "2026-06-10T14:32:00-07:00",
  },
  {
    id: "ord-1002",
    orderNumber: "HT-2026-1002",
    userEmail: "customer@heritage.com",
    userName: "Aditi Rao",
    items: [
      {
        product: INITIAL_PRODUCTS[2], // Kashi Crimson Banarasi Silk Saree
        quantity: 1,
      },
    ],
    subtotal: 24500,
    shipping: 0,
    discount: 3675, // FESTIVE15 used
    total: 20825,
    billingAddress: {
      fullName: "Aditi Rao",
      street: "Apt 4B, Coral Breeze Apartments",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      phone: "9812345678",
    },
    paymentMethod: "Credit Card",
    status: "Shipped",
    trackingNumber: "TRACK-9912384",
    date: "2026-06-15T09:12:00-07:00",
  },
];

// Helper functions for dynamic hex shading
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 212, g: 175, b: 55 }; // default gold r,g,b
};

const rgbToHex = (r, g, b) => {
  const clamp = (val) => Math.round(Math.max(0, Math.min(255, val)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const adjustShade = (hex, percent) => {
  try {
    const { r, g, b } = hexToRgb(hex);
    if (percent > 0) {
      const factor = percent / 100;
      return rgbToHex(
        r + (255 - r) * factor,
        g + (255 - g) * factor,
        b + (255 - b) * factor,
      );
    } else {
      const factor = Math.abs(percent) / 100;
      return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
    }
  } catch (e) {
    return hex;
  }
};

export const AppProvider = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("ht_products");
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("ht_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("ht_wishlist");
    return stored ? JSON.parse(stored) : SEED_USERS[1].wishlist || [];
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("ht_orders");
    return stored ? JSON.parse(stored) : SEED_ORDERS;
  });

  const [coupons, setCoupons] = useState(() => {
    const stored = localStorage.getItem("ht_coupons");
    return stored ? JSON.parse(stored) : INITIAL_COUPONS;
  });

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("ht_users");
    return stored ? JSON.parse(stored) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("ht_current_user");
    return stored ? JSON.parse(stored) : SEED_USERS[1]; // Logged in as customer by default for smooth demo
  });

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("ht_theme");
    return stored || "light";
  });

  const [themeConfig, setThemeConfig] = useState(() => {
    const stored = localStorage.getItem("ht_theme_config");
    return stored
      ? JSON.parse(stored)
      : {
          primaryGold: "#b89047",
          secondaryMaroon: "#2563eb",
          serifFont: "Outfit",
          radius: "12px",
          bgLight: "#f8fafc",
          bgDark: "#0b0f19",
          tagline: "Magnificent Living & Household Masterpieces",
          logoText: "CASA'LUX",
        };
  });
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [disabledCategories, setDisabledCategories] = useState(() => {
    const stored = localStorage.getItem("ht_disabled_categories");
    return stored ? JSON.parse(stored) : [];
  });

  const [notifications, setNotifications] = useState([]);

  // Sync theme changes
  useEffect(() => {
    localStorage.setItem("ht_theme_config", JSON.stringify(themeConfig));
  }, [themeConfig]);

  // Sync categories changes
  useEffect(() => {
    localStorage.setItem("ht_categories", JSON.stringify(categories));
  }, [categories]);

  // Sync disabled categories changes
  useEffect(() => {
    localStorage.setItem(
      "ht_disabled_categories",
      JSON.stringify(disabledCategories),
    );
  }, [disabledCategories]);

  // Inject Google Fonts dynamic loader
  useEffect(() => {
    if (themeConfig?.serifFont) {
      const fontId = "custom-serif-family-head";
      let fontLink = document.getElementById(fontId);
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = fontId;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      }
      const fontParam = themeConfig.serifFont.replace(/\s+/g, "+");
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontParam}:wght@400;500;600;700&display=swap`;
    }
  }, [themeConfig?.serifFont]);

  // Apply Theme custom properties to root document
  useEffect(() => {
    const root = document.documentElement;
    if (!themeConfig) return;

    // Set custom font & backgrounds
    root.style.setProperty(
      "--font-serif-custom",
      `"${themeConfig.serifFont}", Georgia, serif`,
    );
    root.style.setProperty("--radius-custom", themeConfig.radius);
    root.style.setProperty("--bg-light", themeConfig.bgLight);
    root.style.setProperty("--bg-dark", themeConfig.bgDark);

    // Apply primary gold shades
    const primaryGold = themeConfig.primaryGold || "#d4af37";
    root.style.setProperty("--gold-50", adjustShade(primaryGold, 90));
    root.style.setProperty("--gold-100", adjustShade(primaryGold, 75));
    root.style.setProperty("--gold-200", adjustShade(primaryGold, 55));
    root.style.setProperty("--gold-300", adjustShade(primaryGold, 35));
    root.style.setProperty("--gold-400", adjustShade(primaryGold, 15));
    root.style.setProperty("--gold-500", primaryGold);
    root.style.setProperty("--gold-600", adjustShade(primaryGold, -15));
    root.style.setProperty("--gold-700", adjustShade(primaryGold, -35));
    root.style.setProperty("--gold-800", adjustShade(primaryGold, -55));
    root.style.setProperty("--gold-900", adjustShade(primaryGold, -75));

    // Apply secondary maroon shades
    const secondaryMaroon = themeConfig.secondaryMaroon || "#800020";
    root.style.setProperty("--maroon-50", adjustShade(secondaryMaroon, 90));
    root.style.setProperty("--maroon-100", adjustShade(secondaryMaroon, 75));
    root.style.setProperty("--maroon-200", adjustShade(secondaryMaroon, 55));
    root.style.setProperty("--maroon-300", adjustShade(secondaryMaroon, 35));
    root.style.setProperty("--maroon-400", adjustShade(secondaryMaroon, 15));
    root.style.setProperty("--maroon-500", secondaryMaroon);
    root.style.setProperty("--maroon-600", adjustShade(secondaryMaroon, -15));
    root.style.setProperty("--maroon-700", adjustShade(secondaryMaroon, -35));
    root.style.setProperty("--maroon-800", adjustShade(secondaryMaroon, -55));
    root.style.setProperty("--maroon-900", adjustShade(secondaryMaroon, -75));
  }, [themeConfig]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("ht_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ht_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ht_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("ht_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("ht_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("ht_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("ht_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ht_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Notifications
  const addNotification = (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    addNotification(
      "info",
      `Switched to ${theme === "light" ? "Dark" : "Light"} theme`,
    );
  };

  // Products Management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviews: [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addNotification("success", `Product "${product.name}" added successfully.`);
  };

  const updateProduct = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addNotification(
      "success",
      `Product "${updated.name}" updated successfully.`,
    );
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification("warning", `Product "${product?.name || "Item"}" deleted.`);
  };

  const addReview = (productId, rating, comment) => {
    if (!currentUser) {
      addNotification("error", "Please login to submit reviews.");
      return;
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: currentUser.firstName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating = parseFloat(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1),
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: avgRating,
          };
        }
        return p;
      }),
    );
    addNotification("success", "Thank you for your valuable feedback!");
  };

  // Cart Actions
  const addToCart = (product, quantity, variant) => {
    const selectedVariant = variant || "Standard";

    // Check stock limit
    if (product.inventory < quantity) {
      addNotification(
        "error",
        `Only ${product.inventory} items available in stock.`,
      );
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant === selectedVariant,
      );

      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const newQty = item.quantity + quantity;
        if (newQty > product.inventory) {
          addNotification(
            "error",
            `Maximum available stock reached (${product.inventory} items).`,
          );
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: newQty };
        addNotification(
          "success",
          `Updated "${product.name}" quantity to ${newQty} in cart.`,
        );
        return updated;
      } else {
        addNotification(
          "success",
          `Added "${product.name}" (${selectedVariant}) to cart.`,
        );
        return [...prev, { product, quantity, selectedVariant }];
      }
    });
  };

  const removeFromCart = (productId, variant) => {
    const selectedVariant = variant || "Standard";
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedVariant === selectedVariant
          ),
      ),
    );
    addNotification("info", `Removed item from cart.`);
  };

  const updateCartQty = (productId, quantity, variant) => {
    const selectedVariant = variant || "Standard";
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedVariant === selectedVariant
        ) {
          if (quantity > item.product.inventory) {
            addNotification(
              "error",
              `Only ${item.product.inventory} items available in stock.`,
            );
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    if (!currentUser) {
      addNotification("info", "Please sign in to save wishlist items.");
      return;
    }

    let updatedWishlist;
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
      addNotification("info", "Removed from Wishlist");
    } else {
      updatedWishlist = [...wishlist, productId];
      addNotification("success", "Added to Wishlist");
    }

    setWishlist(updatedWishlist);

    // Update users catalog as well
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, wishlist: updatedWishlist } : u,
      ),
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, wishlist: updatedWishlist } : null,
    );
  };

  // Placement of Orders
  const placeOrder = (billingAddress, paymentMethod, discountCode) => {
    if (!currentUser) {
      addNotification("error", "Please register or login to complete orders.");
      return null;
    }
    if (cart.length === 0) {
      addNotification("error", "Your shopping cart is empty.");
      return null;
    }

    // Calculate subtotal, discount
    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        (item.product.discountPrice || item.product.price) * item.quantity,
      0,
    );
    let discount = 0;

    if (discountCode) {
      const activeCoupon = coupons.find(
        (c) => c.code.toUpperCase() === discountCode.toUpperCase() && c.active,
      );
      if (activeCoupon) {
        if (!activeCoupon.minOrder || subtotal >= activeCoupon.minOrder) {
          if (activeCoupon.type === "percentage") {
            discount = parseFloat(
              ((subtotal * activeCoupon.value) / 100).toFixed(2),
            );
          } else {
            discount = activeCoupon.value;
          }
        }
      }
    }

    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal - discount + shipping;

    // Deduct inventories
    setProducts((prevProds) =>
      prevProds.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            inventory: Math.max(0, p.inventory - cartItem.quantity),
          };
        }
        return p;
      }),
    );

    const orderNumStr = 1000 + orders.length + 1;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `HT-2026-${orderNumStr}`,
      userEmail: currentUser.email,
      userName: currentUser.firstName,
      items: [...cart],
      subtotal,
      shipping,
      discount,
      total,
      billingAddress,
      paymentMethod,
      status: "Pending",
      date: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addNotification(
      "success",
      `Order ${newOrder.orderNumber} placed successfully!`,
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId, status, trackingNumber) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
          };
        }
        return o;
      }),
    );
    addNotification("success", `Order status updated to: ${status}`);
  };

  // Coupons
  const addCoupon = (coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addNotification("success", `Promotion coupon ${coupon.code} created.`);
  };
  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)),
    );
    addNotification("info", `Coupon status updated.`);
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const response = await authLogin(email, password);
      if (response.status == 200) {
        const foundUser = response.data.data.user;
        setCurrentUser(foundUser);
        localStorage.setItem("token", response.data.data.token);
        //setWishlist(foundUser.wishlist || []);
        addNotification("success", `Welcome back, ${foundUser.firstName}!`);
        return { success: true };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const register = (email, name, passwordEncoded, role) => {
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (alreadyExists) {
      return { success: false, error: "Email address already registered." };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      addresses: [],
      wishlist: [],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setWishlist([]);
    addNotification(
      "success",
      `Account created successfully. Welcome ${name}!`,
    );
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    setWishlist([]);
    clearCart();
    addNotification("info", "Logged out successfully. Have a nice day!");
  };

  const updateProfile = (name, addresses) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name, addresses };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
    );
    addNotification("success", "Profile and addresses updated successfully.");
  };

  const forgotPassword = (email) => {
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (exists) {
      return {
        success: true,
        message: `Password reset link dispatched to ${email}.`,
      };
    }
    return {
      success: false,
      message: "No registered user matches this email address.",
    };
  };

  const updateThemeConfig = (newConfig) => {
    setThemeConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem("ht_theme_config", JSON.stringify(updated));
      return updated;
    });
    addNotification(
      "success",
      "Theme & appearance config updated successfully!",
    );
  };

  const createCategory = async (name, description) => {
    try {
      if (!name || name.trim() === "") {
        addNotification("error", "Category name cannot be empty");
        return;
      }
      let formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      const response = await categoryService.createCategory(formData);
      if (response.status == 201) {
        addNotification(
          "success",
          `Category "${name.trim()}" added successfully.`,
        );
        loadCategories();
        return true;
      }
    } catch (error) {
      addNotification(
        "error",
        error.response?.data?.message || "Something went wrong.",
      );
      return false;
    }
  };

  const updateCategory = async (catId, newName, newDescription) => {
    if (!catId || newName.trim() === "" || newDescription.trim() === "") {
      addNotification(
        "error",
        "New category name or description cannot be empty",
      );
      return;
    }
    const sanitizedData = {
      name: newName.trim(),
      description: newDescription.trim(),
    };
    const response = await updateCategoryData(catId, sanitizedData);
    if (response.status == 200) {
      addNotification("success", response.data.message);
      loadCategories();
    }
  };

  const deleteCategory = async (catId) => {
    const response = await categoryService.deleteTheCategory(catId);
    if (response.status == 200) {
      addNotification("success", response.data.message);
      loadCategories();
    }
  };
  const restoreCategory = async (catId) => {
    const response = await categoryService.restoreCategory(catId);
    if (response.status == 200) {
      addNotification("success", response.data.message);
      loadCategories();
    }
  };
  const toggleCategoryDisabled = async (catId, status) => {
    const response = await categoryService.updateCategoryStatus(catId, status);
    if (response.status == 200) {
      addNotification("success", response.data.message);
    }
    loadCategories();
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        coupons,
        currentUser,
        users,
        notifications,
        theme,
        themeConfig,
        updateThemeConfig,
        categories,
        loadCategories,
        disabledCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        restoreCategory,
        toggleCategoryDisabled,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        placeOrder,
        updateOrderStatus,
        addCoupon,
        toggleCoupon,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        addNotification,
        removeNotification,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
