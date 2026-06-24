import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock historical charts data
const MONTHLY_REVENUE_CHART = [
  { name: 'Jan', Sales: 180000, Expenses: 120000 },
  { name: 'Feb', Sales: 247000, Expenses: 145000 },
  { name: 'Mar', Sales: 310000, Expenses: 185000 },
  { name: 'Apr', Sales: 290000, Expenses: 172000 },
  { name: 'May', Sales: 425000, Expenses: 220000 },
  { name: 'Jun', Sales: 520000, Expenses: 298000 }
];

export const AdminDashboard = () => {
  const { products, orders, users } = useApp();

  // 1. Calculate Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const totalCustomers = users.filter((u) => u.role === 'Customer').length;
    const totalProducts = products.length;

    // Detect products with low inventory stock (threshold <= 5 items)
    const lowStockItems = products.filter((p) => p.inventory <= 5);

    return {
      totalRev,
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockItems
    };
  }, [orders, users, products]);

  // Aggregate category margins for Pie Wheel
  const categoryChartData = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const colorsMap = {
      Jewelry: '#d4af37', // Gold
      Textiles: '#800020', // Maroon
      Handicrafts: '#16a34a', // Green
      Lifestyle: '#0284c7' // Blue
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colorsMap[name] || '#78716c'
    }));
  }, [products]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4AF37]/25 pb-5 h-fit">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4B0011] dark:text-stone-100">
            Administrative Registry
          </h1>
          <p className="text-xs text-stone-550 dark:text-stone-400">
            Overview logs, analytical margins, and customer activity metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 p-2.5 rounded-lg text-gold-700 dark:text-emerald-202 text-xs font-semibold">
          <TrendingUp className="w-4 h-4 mr-0.5 text-gold-600" />
          <span>General Growth Indicators: <strong className="font-bold">+14.2%</strong> vs May</span>
        </div>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Total Turnover</span>
            <span className="text-2xl font-extrabold text-[#2D2926] dark:text-gold-200 block">
              ₹{summaryMetrics.totalRev.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-emerald-600 font-bold block">+18.4% YoY</span>
          </div>
          <div className="p-4 bg-gold-100/20 text-gold-600 rounded-xl font-bold">
            🏛️
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Order volume</span>
            <span className="text-2xl font-extrabold text-[#2D2926] dark:text-stone-105 block">
              {summaryMetrics.totalOrders}
            </span>
            <span className="text-[9px] text-stone-404 block font-medium">Insured shipments</span>
          </div>
          <div className="p-4 bg-gold-100/20 text-gold-600 rounded-xl font-bold">
            📦
          </div>
        </div>

        {/* Metric 3: Total Customers */}
        <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Registered Patrons</span>
            <span className="text-2xl font-extrabold text-[#2D2926] dark:text-stone-105 block">
              {summaryMetrics.totalCustomers}
            </span>
            <span className="text-[9px] text-emerald-600 font-bold block">+5 accounts today</span>
          </div>
          <div className="p-4 bg-gold-100/20 text-gold-600 rounded-xl font-bold">
            👥
          </div>
        </div>

        {/* Metric 4: Total Products */}
        <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/30 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Inventory Sku</span>
            <span className="text-2xl font-extrabold text-[#2D2926] dark:text-stone-105 block">
              {summaryMetrics.totalProducts}
            </span>
            <span className="text-[9px] text-stone-404 block font-medium">4 active lines</span>
          </div>
          <div className="p-4 bg-gold-100/20 text-gold-600 rounded-xl font-bold">
            🗃️
          </div>
        </div>

      </div>

      {/* Low Stock Warning Banner */}
      {summaryMetrics.lowStockItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-955/20 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-medium text-amber-800 dark:text-amber-200">
          <div className="flex gap-2.5 items-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Urgent Stock Depletion Warning</p>
              <p className="text-[10px] opacity-75">The following {summaryMetrics.lowStockItems.length} antiquities are below safe restock thresholds (Qty ≤ 5):</p>
              <div className="flex flex-wrap gap-1 mt-1.5 leading-none">
                {summaryMetrics.lowStockItems.map((item) => (
                  <span key={item.id} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-semibold text-[10px]">
                    {item.name} ({item.inventory} Sku)
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5"
          >
            Adjust Stock
          </Link>
        </div>
      )}

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Earnings Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-105 text-base mb-6 border-b border-stone-100 dark:border-stone-850 pb-3 font-sans">
            Financial Turnovers & Outflow (INR)
          </h3>
          
          <div className="h-80 w-full text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B0011" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4B0011" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#a8a29e" fontSize={11} tickLine={false} />
                <YAxis stroke="#a8a29e" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="Sales" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="Expenses" stroke="#4B0011" strokeWidth={1.5} fillOpacity={1} fill="url(#expenseGrad)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-105 text-base mb-6 border-b border-stone-100 dark:border-stone-850 pb-3 font-sans">
            Category Catalog Ratio
          </h3>

          <div className="h-64 w-full flex items-center justify-center text-xs font-semibold">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} SKUs`, 'Total']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-stone-400 text-xs">No catalog parameters to represent.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders list */}
      <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-850 mb-6">
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-105 text-base font-sans">
            Recent Transmissions Logs
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-gold-600 hover:text-[#D4AF37] hover:underline uppercase tracking-wider flex items-center gap-1 font-sans"
          >
            Review all sales
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-center py-10 text-stone-400 text-xs">No deliveries logged inside ledger books.</p>
        ) : (
          <div className="overflow-x-auto text-xs font-medium">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-2">Order Info</th>
                  <th className="py-2">Commit Date</th>
                  <th className="py-2">Customer Patron</th>
                  <th className="py-2">Settled Sum</th>
                  <th className="py-2">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-105 dark:divide-stone-850/40 text-stone-650 dark:text-stone-300">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-950/20 transition-colors">
                    <td className="py-3 px-1 font-mono font-bold text-gold-700 dark:text-gold-102">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-1">
                      {new Date(o.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-1 font-semibold text-stone-750">
                      {o.userName}
                    </td>
                    <td className="py-3 px-1 font-bold text-stone-900 dark:text-gold-200">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        o.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'Shipped'
                          ? 'bg-sky-101 text-sky-800 bg-sky-100'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
