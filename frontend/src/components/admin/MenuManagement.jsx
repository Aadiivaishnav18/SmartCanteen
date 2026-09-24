import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Image, DollarSign, Package, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MenuManagement = () => {
  const { foodItems, addFoodItem, editFoodItem, deleteFoodItem, toggleFoodAvailability } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Snacks',
    description: '',
    price: 80,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
    prepTimeMinutes: 10
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Snacks',
      description: '',
      price: 80,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      available: true,
      prepTimeMinutes: 10
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      editFoodItem(editingItem.id, formData);
    } else {
      addFoodItem(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Food Menu Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Create, edit, price, and toggle canteen food items</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition"
        >
          <Plus className="w-4 h-4" /> Add New Food Item
        </button>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Food Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {foodItems.map(food => (
                <tr key={food.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{food.name}</span>
                        <span className="text-slate-400 text-[10px] line-clamp-1 max-w-xs">{food.description}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-700">{food.category}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">₹{food.price}</td>

                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-800">{food.stock} units</span>
                  </td>

                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleFoodAvailability(food.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                        food.available && food.stock > 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {food.available && food.stock > 0 ? 'Active' : 'Out of Stock'}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(food)}
                        className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                        title="Edit Food"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => deleteFoodItem(food.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Food"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900">
              {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Food Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  placeholder="e.g. Paneer Tikka Wrap"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Meals">Meals</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Stock Count</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="availableCheck"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="availableCheck">Item Available for Pre-Order</label>
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-xl text-sm transition"
              >
                {editingItem ? 'Save Changes' : 'Create Food Item'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
