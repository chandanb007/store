import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Coupon, Address, Review, Notification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data';
import { login as authLogin } from "../services/authService";

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  currentUser: User | null;
  users: User[];
  notifications: Notification[];
  theme: "light" | "dark";

  // Products Management
  addProduct: (product: Omit<Product, "id" | "rating" | "reviews">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;

  // Cart Actions
  addToCart: (product: Product, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateCartQty: (
    productId: string,
    quantity: number,
    variant?: string,
  ) => void;
  clearCart: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;

  // Orders
  placeOrder: (
    billingAddress: Address,
    paymentMethod: any,
    discountCode?: string,
  ) => Order | null;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
    trackingNumber?: string,
  ) => void;

  // Coupon Actions
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;

  // Session Actions
  login: (
    email: string,
    passwordEncoded: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    name: string,
    passwordEncoded: string,
    role: "Customer" | "Admin",
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (name: string, addresses: Address[]) => void;
  forgotPassword: (email: string) => { success: boolean; message: string };

  // System Tools
  addNotification: (type: Notification["type"], message: string) => void;
  removeNotification: (id: string) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@heritage.com',
    name: 'Vikramaditya Dev (Admin)',
    role: 'Admin',
    addresses: [
      {
        fullName: 'Vikramaditya Dev',
        street: '12, Royal Palace Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302001',
        country: 'India',
        phone: '9876543210'
      }
    ]
  },
  {
    id: 'user-customer',
    email: 'customer@heritage.com',
    name: 'Aditi Rao',
    role: 'Customer',
    addresses: [
      {
        fullName: 'Aditi Rao',
        street: 'Apt 4B, Coral Breeze Apartments',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
        phone: '9812345678'
      }
    ],
    wishlist: ['prod-1', 'prod-2']
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HT-2026-1001',
    userEmail: 'customer@heritage.com',
    userName: 'Aditi Rao',
    items: [
      {
        product: INITIAL_PRODUCTS[1], // Handcrafted Pastel Meenakari Jhumkas
        quantity: 1,
        selectedVariant: 'Standard'
      },
      {
        product: INITIAL_PRODUCTS[5], // Royale Brass Floating Urli Bowl
        quantity: 1,
        selectedVariant: 'Brass'
      }
    ],
    subtotal: 7090,
    shipping: 150,
    discount: 500,
    total: 6740,
    billingAddress: {
      fullName: 'Aditi Rao',
      street: 'Apt 4B, Coral Breeze Apartments',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
      phone: '9812345678'
    },
    paymentMethod: 'UPI',
    status: 'Completed',
    trackingNumber: 'TRACK-8899120',
    date: '2026-06-10T14:32:00-07:00'
  },
  {
    id: 'ord-1002',
    orderNumber: 'HT-2026-1002',
    userEmail: 'customer@heritage.com',
    userName: 'Aditi Rao',
    items: [
      {
        product: INITIAL_PRODUCTS[2], // Kashi Crimson Banarasi Silk Saree
        quantity: 1
      }
    ],
    subtotal: 24500,
    shipping: 0,
    discount: 3675, // FESTIVE15 used
    total: 20825,
    billingAddress: {
      fullName: 'Aditi Rao',
      street: 'Apt 4B, Coral Breeze Apartments',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
      phone: '9812345678'
    },
    paymentMethod: 'Credit Card',
    status: 'Shipped',
    trackingNumber: 'TRACK-9912384',
    date: '2026-06-15T09:12:00-07:00'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem("ht_products");
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("ht_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const stored = localStorage.getItem("ht_wishlist");
    return stored ? JSON.parse(stored) : SEED_USERS[1].wishlist || [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem("ht_orders");
    return stored ? JSON.parse(stored) : SEED_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = localStorage.getItem("ht_coupons");
    return stored ? JSON.parse(stored) : INITIAL_COUPONS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("ht_users");
    return stored ? JSON.parse(stored) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("ht_current_user");
    return stored ? JSON.parse(stored) : SEED_USERS[1]; // Logged in as customer by default for smooth demo
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("ht_theme");
    return (stored as "light" | "dark") || "light";
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

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
  const addNotification = (type: Notification["type"], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
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
  const addProduct = (product: Omit<Product, "id" | "rating" | "reviews">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviews: [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addNotification("success", `Product "${product.name}" added successfully.`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addNotification(
      "success",
      `Product "${updated.name}" updated successfully.`,
    );
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification("warning", `Product "${product?.name || "Item"}" deleted.`);
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!currentUser) {
      addNotification("error", "Please login to submit reviews.");
      return;
    }
    const newReview: Review = {
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
  const addToCart = (product: Product, quantity: number, variant?: string) => {
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

  const removeFromCart = (productId: string, variant?: string) => {
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

  const updateCartQty = (
    productId: string,
    quantity: number,
    variant?: string,
  ) => {
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
  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      addNotification("info", "Please sign in to save wishlist items.");
      return;
    }

    let updatedWishlist: string[];
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
  const placeOrder = (
    billingAddress: Address,
    paymentMethod: any,
    discountCode?: string,
  ) => {
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
    const newOrder: Order = {
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

  const updateOrderStatus = (
    orderId: string,
    status: Order["status"],
    trackingNumber?: string,
  ) => {
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
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addNotification("success", `Promotion coupon ${coupon.code} created.`);
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)),
    );
    addNotification("info", `Coupon status updated.`);
  };

  // Auth Operations
  const login = async (email: string, passwordEncoded: string) => {
    console.log("test");
    // Standard mock credentials
    // const foundUser = users.find(
    //   (u) => u.email.toLowerCase() === email.toLowerCase(),
    // );
    // if (!foundUser) {
    //   return { success: false, error: "Account not found with this email." };
    // }
    try {
      const response = await authLogin({
        email,
        passwordEncoded,
      });

      if (response.status == 200) {
        const foundUser = response.data.data.user;
        setCurrentUser(foundUser);
        setWishlist(foundUser.wishlist || []);
        addNotification("success", `Welcome back, ${foundUser.firstName}!`);
        return { success: true };
      }
    } catch (error) {
      console.log(error);
    }
  };;

  const register = (
    email: string,
    name: string,
    passwordEncoded: string,
    role: "Customer" | "Admin",
  ) => {
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (alreadyExists) {
      return { success: false, error: "Email address already registered." };
    }

    const newUser: User = {
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
    setWishlist([]);
    clearCart();
    addNotification("info", "Logged out successfully. Have a nice day!");
  };

  const updateProfile = (name: string, addresses: Address[]) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name, addresses };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
    );
    addNotification("success", "Profile and addresses updated successfully.");
  };

  const forgotPassword = (email: string) => {
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
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
