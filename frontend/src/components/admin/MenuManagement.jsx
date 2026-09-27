import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, DollarSign, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MenuManagement = () => {
  const { foodItems, addFoodItem, editFoodItem, deleteFoodItem, toggleFoodAvailability, bulkPriceUpdate } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'snacks',
    description: '',
    price: 80,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
    prepTimeMinutes: 10,
    tags: 'vegetarian'
  });

  const [bulkPriceData, setBulkPriceData] = useState({
    percentage: 10,
    category: 'All'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'snacks',
      description: '',
      price: 80,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      available: true,
      prepTimeMinutes: 10,
      tags: 'vegetarian'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ 
      ...item, 
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || 'vegetarian') 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemId = editingItem ? (editingItem._id || editingItem.id) : null;
    const formattedData = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags
    };

    if (editingItem) {
      editFoodItem(itemId, formattedData);
    } else {
      addFoodItem(formattedData);
    }
    setIsModalOpen(false);
  };

  const handleBulkPriceSubmit = (e) => {
    e.preventDefault();
    bulkPriceUpdate(bulkPriceData.percentage, 0, bulkPriceData.category);
    setIsBulkPriceModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Food Menu Management</h1>
          <p className="text-[#64748B] text-xs sm:text-sm">Create, edit, bulk price update, and toggle canteen food items</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBulkPriceModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Percent className="w-4 h-4" /> Bulk Price Update
          </button>

          <button 
            onClick={handleOpenAdd}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add New Food Item
          </button>
        </div>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#64748B] uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Food Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Prep Time</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {foodItems.map(food => {
                const foodId = food._id || food.id;

                return (
                  <tr key={foodId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-[#172018] text-sm block">{food.name}</span>
                          <span className="text-[#64748B] text-[10px] line-clamp-1 max-w-xs">{food.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#64748B] capitalize">{food.category}</td>
                    <td className="px-6 py-4 font-black text-[#172018] text-sm">₹{food.price}</td>

                    <td className="px-6 py-4">
                      <span className={`font-bold ${food.stock <= 5 ? 'text-rose-600 font-black' : 'text-[#172018]'}`}>
                        {food.stock} units {food.stock <= 5 && '(Low Stock)'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#64748B]">
                      ~{food.prepTimeMinutes || food.preparationTime || 10} mins
                    </td>

                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleFoodAvailability(foodId)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                          food.available && food.stock > 0
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/30'
                            : 'bg-[#FEE2E2] text-[#B91C1C] border-[#EF4444]/30'
                        }`}
                      >
                        {food.available && food.stock > 0 ? 'Active' : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(food)}
                          className="p-2 text-[#64748B] hover:text-[#16A34A] hover:bg-[#DCFCE7] rounded-xl transition"
                          title="Edit Food"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => deleteFoodItem(foodId)}
                          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-rose-50 rounded-xl transition"
                          title="Delete Food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172018]/60 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#172018] p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#172018]">
              {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#172018]">
              <div>
                <label className="block mb-1">Food Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                  placeholder="e.g. Paneer Tikka Wrap"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A] capitalize"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Stock Count</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block mb-1">Prep Time (Mins)</label>
                  <input 
                    type="number" 
                    value={formData.prepTimeMinutes}
                    onChange={e => setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })}
                    required
                    min="1"
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Tags (Comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="vegetarian, spicy, south-indian"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] font-mono text-[11px] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="availableCheck"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-[#16A34A] rounded border-slate-300"
                />
                <label htmlFor="availableCheck">Item Available for Pre-Order</label>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-sm"
              >
                {editingItem ? 'Save Changes' : 'Create Food Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Price Update Modal */}
      {isBulkPriceModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172018]/60 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsBulkPriceModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#172018] p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#172018]">Bulk Price Adjustment</h2>
            <p className="text-xs text-[#64748B]">Adjust prices across items in a category by percentage</p>

            <form onSubmit={handleBulkPriceSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1">Target Category</label>
                <select 
                  value={bulkPriceData.category}
                  onChange={e => setBulkPriceData({ ...bulkPriceData, category: e.target.value })}
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A] capitalize"
                >
                  <option value="All">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Percentage Change (%)</label>
                <input 
                  type="number"
                  value={bulkPriceData.percentage}
                  onChange={e => setBulkPriceData({ ...bulkPriceData, percentage: Number(e.target.value) })}
                  required
                  placeholder="e.g. 10 for +10% price hike, -5 for 5% discount"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-sm"
              >
                Apply Bulk Price Shift
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
