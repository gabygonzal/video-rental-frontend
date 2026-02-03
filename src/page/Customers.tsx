import { useState, useEffect } from 'react';
 import { customerService } from '../services/customerService';
import { Pagination } from '../components/common/Pagination';
import type { Customer } from '../types';

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchCustomers();
    console.log("useEffect");
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll(currentPage, 10);
      console.log(response);
      console.log(response.data);
      setCustomers(response.data);
      setPagination(response.pagination);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const results = await customerService.search(searchTerm);
      setCustomers(results);
      setPagination({ page: 1, limit: results.length, total: results.length, totalPages: 1 });
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.delete(id);
      fetchCustomers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error deleting customer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Customers</h1>
        <button className="bg-white text-gray-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition">
          New Customer
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by ID, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
        />
        <button
          onClick={handleSearch}
          className="bg-white text-gray-900 px-6 py-2 rounded font-medium hover:bg-gray-200 transition"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchTerm('');
            fetchCustomers();
          }}
          className="bg-gray-700 text-white px-6 py-2 rounded font-medium hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {customers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-750">
                <td className="px-6 py-4 text-sm text-gray-300">
                  #{customer.customer_id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {customer.first_name} {customer.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {customer.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {customer.phone || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      customer.active
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {customer.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-gray-400 hover:text-white text-sm">
                    View
                  </button>
                  <button className="text-gray-400 hover:text-white text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.customer_id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!searchTerm && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500">
        Showing {customers.length} of {pagination.total} customers
      </div>
    </div>
  );
};