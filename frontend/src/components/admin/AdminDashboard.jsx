import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Layers, 
  UtensilsCrossed, 
  Users,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard = () => {
  const { orders, foodItems, pickupSlots, setAdminTab } = useApp();

  // Metric computations
  const totalOrders = orders.length;
  const todayOrders = orders.filter(o => {
    const diffHours = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 3600);
    return diffHours <= 24;
  }).length;

  const pendingOrders = orders.filter(o => ['Placed', 'Accepted', 'Preparing'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'Collected').length;
  const lowStockItems = foodItems.filter(f => f.stock <= 5).length;

  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Popular items ranking computation
  const itemCounts = {};
  orders.forEach(o => {
    if (o.status !== 'Cancelled') {
      o.items.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    }
  });

  const popularRankings = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxPopularCount = popularRankings[0]?.[1] || 1;

  // Hourly orders simulation data
  const hourlyData = [
    { hour: '11 AM', orders: 12 },
    { hour: '12 PM', orders: 28 },
    { hour: '1 PM', orders: 45 },
    { hour: '2 PM', orders: 30 },
    { hour: '3 PM', orders: 15 },
    { hour: '4 PM', orders: 20 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Campus Canteen Analytics & Control</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Master Admin Overview • Queue Capacity & Revenue Metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAdminTab('menu-mgmt')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Manage Menu
          </button>

          <button 
            onClick={() => setAdminTab('pickup-slots')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Manage Slots
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Sales</span>
          <span className="text-2xl font-black text-emerald-600">₹{totalSales}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">+18% vs yesterday</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <span className="text-2xl font-black text-slate-900">{totalOrders}</span>
          <span className="text-[10px] text-slate-500 block">All-time volume</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Today's Orders</span>
          <span className="text-2xl font-black text-purple-600">{todayOrders}</span>
          <span className="text-[10px] text-purple-700 font-semibold block">Active today</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Queue</span>
          <span className="text-2xl font-black text-amber-600">{pendingOrders}</span>
          <span className="text-[10px] text-amber-700 font-semibold block">In kitchen prep</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-emerald-600">{completedOrders}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">Picked up</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Low Stock Alert</span>
          <span className="text-2xl font-black text-rose-600">{lowStockItems}</span>
          <span className="text-[10px] text-rose-700 font-semibold block">Items &lt; 5 units</span>
        </div>

      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART 1: Orders by Hour Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Hourly Peak Order Distribution
              </h3>
              <p className="text-xs text-slate-500">Canteen rush period monitoring (Lunch Peak 12 PM - 1 PM)</p>
            </div>
            <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
              Live Feed
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
            {hourlyData.map((d, i) => {
              const maxVal = 50;
              const heightPct = (d.orders / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-extrabold text-slate-700 opacity-0 group-hover:opacity-100 transition">
                    {d.orders}
                  </span>
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-teal-400 rounded-2xl group-hover:brightness-110 transition-all duration-500 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-xs font-bold text-slate-600 mt-1">{d.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: Popular Food Items Horizontal Progress Bars */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Most Popular Food Items
            </h3>
            <p className="text-xs text-slate-500">Ranked by total quantity ordered</p>
          </div>

          <div className="space-y-4">
            {popularRankings.map(([name, qty], idx) => {
              const pct = Math.round((qty / maxPopularCount) * 100);
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>#{idx + 1} {name}</span>
                    <span className="text-emerald-600 font-extrabold">{qty} sold</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
