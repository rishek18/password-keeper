// client/src/pages/Dashboard.js
// (This is the final, corrected version)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { encryptData, decryptData } from '../lib/crypto';
import VaultItemModal from '../components/VaultItemModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Plus, LogOut, Search, Copy, Edit, Trash2, Shield, Eye, EyeOff, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, masterPassword, logout, user } = useAuth();
  const navigate = useNavigate();
  const [vaultItems, setVaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !masterPassword) {
      toast.error('Please login to access your vault');
      navigate('/login');
      return;
    }
    fetchVaultItems();
  }, [isAuthenticated, masterPassword, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(vaultItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vaultItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, vaultItems]);

  const fetchVaultItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vault');
      const decryptedItems = response.data.map((item) => ({
        ...item,
        title: decryptData(item.title, masterPassword),
        username: decryptData(item.username, masterPassword),
        password: decryptData(item.password, masterPassword),
        url: decryptData(item.url, masterPassword),
        notes: decryptData(item.notes, masterPassword),
      }));
      setVaultItems(decryptedItems);
      setFilteredItems(decryptedItems);
    } catch (error) {
      console.error('Error fetching vault items:', error);
      toast.error('Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (formData) => {
    try {
      const encryptedData = {
        title: encryptData(formData.title, masterPassword),
        username: encryptData(formData.username, masterPassword),
        password: encryptData(formData.password, masterPassword),
        url: encryptData(formData.url || '', masterPassword),
        notes: encryptData(formData.notes || '', masterPassword),
      };

      if (currentItem) {
        await api.put(`/vault/${currentItem._id}`, encryptedData);
        toast.success('Vault item updated successfully');
      } else {
        await api.post('/vault', encryptedData);
        toast.success('Vault item created successfully');
      }
      setIsModalOpen(false);
      setCurrentItem(null);
      fetchVaultItems();
    } catch (error) {
      console.error('Error saving vault item:', error);
      toast.error('Failed to save vault item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      await api.delete(`/vault/${itemId}`);
      toast.success('Vault item deleted successfully');
      fetchVaultItems();
    } catch (error) { // THIS BLOCK IS NOW CORRECTED
      console.error('Error deleting vault item:', error);
      toast.error('Failed to delete vault item');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        navigator.clipboard.writeText('');
      }, 15000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const togglePasswordVisibility = (itemId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    // The JSX part of this component remains unchanged
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" data-testid="dashboard">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">VaultKeeper</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vault items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-vault-input"
            />
          </div>
          <Button
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2"
            data-testid="add-item-btn"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </Button>
        </div>
        {filteredItems.length === 0 ? (
           <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No items found' : 'Your vault is empty'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start by adding your first password'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => {
                    setCurrentItem(null);
                    setIsModalOpen(true);
                  }}
                  data-testid="add-first-item-btn"
                >
                  Add Your First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow" data-testid={`vault-item-${item._id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid="vault-item-title">{item.title}</CardTitle>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center space-x-1 mt-1"
                          data-testid="vault-item-url"
                        >
                          <span className="truncate">{item.url}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        data-testid="edit-item-btn"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        data-testid="delete-item-btn"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Username</p>
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate" data-testid="vault-item-username">{item.username}</span>
                      <button
                        onClick={() => copyToClipboard(item.username)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        data-testid="copy-username-btn"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Password</p>
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm font-mono" data-testid="vault-item-password">
                        {visiblePasswords[item._id] ? item.password : '••••••••'}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => togglePasswordVisibility(item._id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          data-testid="toggle-password-btn"
                        >
                          {visiblePasswords[item._id] ? (
                            <EyeOff className="h-3.5 w-3.5 text-gray-600" />
                          ) : (
                            <Eye className="h-3.5 w-3.5 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          data-testid="copy-password-btn"
                        >
                          <Copy className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {item.notes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded" data-testid="vault-item-notes">
                        {item.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <VaultItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
        onSave={handleSaveItem}
        item={currentItem}
      />
    </div>
  );
};

export default Dashboard;