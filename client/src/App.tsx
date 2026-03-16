import React, { useState, useEffect } from 'react';
import { itemService } from './services/api';
import * as Types from './types';
const { Item } = Types;

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'other'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updatedItem = await itemService.update(editingItem._id, formData);
        setItems(prev => prev.map(item => 
          item._id === editingItem._id ? updatedItem : item
        ));
        alert('Item updated successfully!');
      } else {
        const newItem = await itemService.create(formData);
        setItems(prev => [newItem, ...prev]);
        alert('Item created successfully!');
      }
      resetForm();
    } catch (err) {
      alert('An error occurred');
      console.error(err);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.delete(id);
        setItems(prev => prev.filter(item => item._id !== id));
        alert('Item deleted successfully!');
      } catch (err) {
        alert('Error deleting item');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, category: 'other' });
    setEditingItem(null);
    setShowForm(false);
  };

  const getCategoryLabel = (category: string): string => {
    const categories: Record<string, string> = {
      electronics: '📱 Electronics',
      clothing: '👕 Clothing',
      books: '📚 Books',
      other: '📦 Other'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      electronics: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400',
      clothing: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400',
      books: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400',
      other: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with glass effect */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
                  ✨ CRUD Application
                </span>
              </h1>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="group relative px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white font-semibold shadow-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></span>
                <span className="relative flex items-center gap-2">
                  {showForm ? '✖ Close' : '➕ New Item'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/80 backdrop-blur-md border border-red-300/30 rounded-2xl text-white shadow-2xl animate-shake">
              <p className="font-medium">❌ {error}</p>
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="mb-12 backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
              <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-md">
                {editingItem ? '📝 Edit Item' : '✨ Add New Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90">
                      Name <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90">
                      Category <span className="text-red-300">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                    >
                      <option value="electronics" className="bg-purple-800">📱 Electronics</option>
                      <option value="clothing" className="bg-purple-800">👕 Clothing</option>
                      <option value="books" className="bg-purple-800">📚 Books</option>
                      <option value="other" className="bg-purple-800">📦 Other</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-white/90">
                      Description <span className="text-red-300">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                      placeholder="Enter item description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90">
                      Price (₹) <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/20">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group relative px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 rounded-xl blur transition-opacity duration-300"></span>
                    <span className="relative">
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full"></div>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20">
              <div className="text-8xl mb-4 animate-bounce">📭</div>
              <p className="text-3xl text-white font-bold drop-shadow-lg">No items found</p>
              <p className="text-white/70 mt-2 text-lg">Click the "New Item" button to add your first item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="group backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 overflow-hidden border border-white/20 animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-md">
                        {item.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-lg ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    
                    <p className="text-white/80 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-bold text-green-300 drop-shadow-lg">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                      <button
                        onClick={() => handleEdit(item)}
                        className="group/btn px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all duration-200 font-medium flex items-center gap-1"
                      >
                        <span className="group-hover/btn:rotate-12 transition-transform duration-200">✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="group/btn px-4 py-2 bg-red-500/30 backdrop-blur-md rounded-xl text-white hover:bg-red-500/40 transition-all duration-200 font-medium flex items-center gap-1"
                      >
                        <span className="group-hover/btn:scale-110 transition-transform duration-200">🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-white/40 text-sm backdrop-blur-sm">
          <p>✨ Built with 💖 using React, TypeScript, Tailwind CSS, Node.js & MongoDB ✨</p>
        </footer>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;