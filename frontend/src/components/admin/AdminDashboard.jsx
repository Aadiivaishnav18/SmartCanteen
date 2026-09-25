import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  UtensilsCrossed,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard = () => {
  const { orders, foodItems, pickupSlots, setAdminTab } = useApp();

  const metrics = useMemo(() => {
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

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      completedOrders,
      lowStockItems,
      totalSales,
      popularRankings
    };
  }, [orders, foodItems]);

  const hourlyData = [
    { hour: '11 AM', orders: 12 },
    { hour: '12 PM', orders: 28 },
    { hour: '1 PM', orders: 45 },
    { hour: '2 PM', orders: 30 },
    { hour: '3 PM', orders: 15 },
    { hour: '4 PM', orders: 20 },
  ];

  const maxPopularCount = metrics.popularRankings[0]?.[1] || 1;
  const maxHourly = Math.max(...hourlyData.map(d => d.orders));

  const KPICard = ({ label, value, subtext, trend, trendValue, icon: Icon }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-[#16A34A]" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-black text-[#172018] tabular-nums">{value}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">{subtext}</span>
          {trendValue && (
            <div className={`flex items-center gap-0.5 text-xs font-bold ${trend === 'up' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#172018] to-[#166534] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Admin Canteen Analytics</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Campus Canteen Operations & Revenue Overview</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAdminTab('menu-mgmt')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Menu Manager
          </button>

          <button 
            onClick={() => setAdminTab('pickup-slots')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition"
          >
            <Layers className="w-4 h-4" />
            Pickup Slots
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard 
          label="Total Revenue"
          value={`₹${metrics.totalSales}`}
          subtext="All-time sales"
          trend="up"
          trendValue="+18%"
          icon={BarChart3}
        />
        
        <KPICard 
          label="Total Volume"
          value={metrics.totalOrders}
          subtext="Orders count"
          icon={BarChart3}
        />
        
        <KPICard 
          label="Today's Orders"
          value={metrics.todayOrders}
          subtext="24h active"
          trend="up"
          trendValue="+12%"
          icon={TrendingUp}
        />
        
        <KPICard 
          label="In Prep Queue"
          value={metrics.pendingOrders}
          subtext="Active in kitchen"
          icon={Layers}
        />
        
        <KPICard 
          label="Completed"
          value={metrics.completedOrders}
          subtext="Collected"
          icon={TrendingUp}
        />
        
        <KPICard 
          label="Low Stock"
          value={metrics.lowStockItems}
          subtext="< 5 units"
          trend={metrics.lowStockItems > 0 ? 'down' : 'up'}
          icon={UtensilsCrossed}
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#172018]">Order Flow Rate</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Hourly distribution (Peak window: 12 PM - 1 PM)</p>
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-[#DCFCE7] text-[#15803D] rounded-full border border-[#16A34A]/30">
              Live Flow
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-4">
            {hourlyData.map((data, idx) => {
              const heightPct = (data.orders / maxHourly) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                  <span className="text-xs font-bold text-[#172018] opacity-0 group-hover/bar:opacity-100 transition">
                    {data.orders}
                  </span>
                  <div 
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] rounded-t-xl transition-all duration-300"
                    style={{ height: `${heightPct}%`, minHeight: '12px' }}
                  />
                  <span className="text-xs font-semibold text-[#64748B]">{data.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Food Items */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#172018]">Top Selling Foods</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Ranked by volume ordered</p>
          </div>

          <div className="space-y-4">
            {metrics.popularRankings.map(([name, qty], idx) => {
              const pct = Math.round((qty / maxPopularCount) * 100);
              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#15803D]">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#172018] truncate">{name}</span>
                    </div>
                    <span className="text-xs font-black text-[#172018]">{qty} units</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
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