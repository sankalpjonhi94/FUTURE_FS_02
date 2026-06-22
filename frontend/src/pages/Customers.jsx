import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { getCustomersApi, deleteCustomerApi } from '../api/leadApi';
import { FiSearch, FiTrash2, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await getCustomersApi({ search, page, limit: 10 });
      setCustomers(data.customers);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomerApi(id);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch {
      toast.error('Error deleting customer');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Customers" />
        <main className="p-6">
          {/* Search */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search customers..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <span className="text-sm text-gray-500">Total: <strong>{total}</strong></span>
          </div>

          {loading ? (
            <Loader />
          ) : customers.length === 0 ? (
            <div className="card text-center py-16">
              <FiUser className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-400">No customers yet. Convert leads to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <div key={customer._id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-lg font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    {customer.phone && <p>📞 {customer.phone}</p>}
                    {customer.company && <p>🏢 {customer.company}</p>}
                    <p>💰 Total: ₹{customer.totalPurchases?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Added {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Customers;
