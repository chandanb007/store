
import { useApp } from "../../../contexts/AppContext.jsx";
import {
    
    Tag,
    CircleDollarSign,
    ShoppingBasket,
    ShoppingCart,
    UserRound,
    CalendarClock,
    Edit2
} from "lucide-react";
import Pagination from "../../common/Pagination.jsx";
import { useSearchParams } from "react-router-dom";
import { useEffect,useState } from "react";
import Filters from "../../common/Filters.jsx";
export const OrderListing = () => {
    const { orders,getOrders } = useApp();
    const orderList = orders?.orders ?? [];
   const [pagination,setPagination] = useState([]);
    const filterConfig = [
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Pending",value: "PENDING" },
                { label: "Paid",value: "PAID" },
                { label: "Processing",value: "PROCESSING" },
                { label: "Shipped",value: "SHIPPED" },
                { label: "Delivered",value: "DELIVERED" },
                { label: "Cancelled",value: "CANCELLED" },
            ],
            width: "sm",
        },
        {
            name: "paymentMethod",
            label: "Payment Method",
            type: "select",
            options: [
                { label: "COD",value: "COD" },
                { label: "Other",value: "0" },
            ],
            width: "sm",
        },

        {
            name: "orderNumber",
            label: "Order Number",
            type: "text",
            placeholder: "Search with order number...",
            width: "lg",
        },
        {
            name: "customer",
            label: "Customer name",
            type: "text",
            placeholder: "Search with customer name..",
            width: "lg",
        },

        {
            name: "minPrice",
            label: "Min order price",
            type: "number",
            placeholder: "₹ 0",
            width: "sm",
        },

        {
            name: "maxPrice",
            label: "Max order price",
            type: "number",
            placeholder: "₹10,000",
            width: "sm",
        },
        {
            name: "minDate",
            label: "From date",
            type: "date",
            width: "sm",
        },
        {
            name: "maxDate",
            label: "To date",
            type: "date",
            width: "sm",
        },
    ];
    const [filters, setFilters] = useState({
        status: "",
        orderNumber: "",
        customer: "",
        minPrice: "",
        maxPrice: "",
        minDate: "",
        maxDate: "",
        page: pagination?.page,
        pageSize : pagination?.limit
    });
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "-";

        return `₹${
            Number(amount).toLocaleString("en-IN",{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        } `;
    };
    const handlePageChange = (page) => {
        debugger;
        setPagination((prev) => ({
            ...prev,
            page,
        }));
        getOrders({
            ...filters,
            page,
            pageSize: pagination.pageSize,
        });     
    }
    const handleFilterChange = (name,value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleApplyFilters = () => {
        debugger;
        getOrders(filters);
    }
    const handleClearFilters = () => {
        setFilters({
            status: "",
            orderNumber: "",
            customer: "",
            minPrice: "",
            maxPrice: "",
            minDate: "",
            maxDate: "",
            page: "",
        })
        getOrders();
    }
    return (
        <>
            <Filters   
            filters={filterConfig}
                values={filters}
                onChange={handleFilterChange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
        />
        <div className="overflow-hidden rounded-2xl border border-stone-200/40 bg-white text-xs shadow-xs transition-all duration-300 hover:shadow-md dark:border-stone-800/30 dark:bg-stone-900/60">
            <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[#2D2926] dark:text-stone-100">
                    <thead>
                        <tr className="border-b border-stone-150 bg-[#FDFCF8] text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:border-stone-850 dark:bg-stone-950/20">
                            <th className="px-4 py-3">Order Number</th>
                            <th className="px-4 py-3">Customer Name</th>
                            <th className="px-4 py-3">Order Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Grand Total</th>
                            <th className="px-4 py-3 text-center">
                                Admin Controls
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 whitespace-nowrap font-medium text-stone-700 dark:divide-stone-850/40 dark:text-stone-300">
                        {orderList.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-10 text-center text-stone-400"
                                >
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orderList.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`hover:bg-[#FDFCF8] dark:hover:bg-stone-950/10 transition-colors`}
                                >
                                    {/* Category */}
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-955/20 text-[10px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-200 flex items-center gap-1 w-fit border border-[#D4AF37]/20">
                                            <ShoppingCart className="w-3 h-3 text-gold-600" />
                                            {order.orderNumber}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold font-mono text-xs flex items-center gap-1.5">
                                            <UserRound className="w-3 h-3 text-gold-600" />
                                            {order.fullName}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold font-mono text-xs flex items-center gap-1.5">
                                            <CalendarClock className="w-3 h-3 text-gold-600" />
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </td>
                                    {/* Inventory stock */}
                                    <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-[#10b981]/40 dark:border-emerald-800/20">
                                            {order.status}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold font-mono text-xs flex items-center gap-1.5">
                                            {formatCurrency(order.grandTotal)}
                                        </span>
                                    </td>
                                    {/* edit or delete click actions */}
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                               className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-gold-500 hover:border-gold-300 dark:hover:border-gold-700 hover:scale-105 transition-all cursor-pointer"
                                                title="Edit Entry"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
            <Pagination
                currentPage={orders?.pagination?.page}
                totalPages={orders?.pagination?.totalPages}
                onPageChange={handlePageChange}
                totalItems={orders?.pagination?.total}
                pageSize={orders?.pagination?.pageSize}
            />
        </>
    );
};
