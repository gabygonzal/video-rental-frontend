import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { rentalService } from '../services/rentalService';
import type { Customer, RentalWithDetails } from '../types';
 
export const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer & { rentals?: RentalWithDetails[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomer(parseInt(id));
    }
  }, [id]);

  const fetchCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      const data = await customerService.getById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId: number) => {
    if (!confirm('Mark this film as returned?')) return;

    try {
      await rentalService.returnFilm(rentalId);
      if (id) fetchCustomer(parseInt(id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error returning film');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Customer not found</h2>
        <button
          onClick={() => navigate('/customers')}
          className="bg-white text-gray-900 px-4 py-2 rounded"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const activeRentals = customer.rentals?.filter(r => r.status === 'rented') || [];
  const pastRentals = customer.rentals?.filter(r => r.status === 'returned') || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/customers')}
        className="text-gray-400 hover:text-white"
      >
        ← Back to Customers
      </button>

      {/* Customer Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {customer.first_name} {customer.last_name}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-medium rounded ${
                customer.active
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {customer.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={() => navigate(`/customers/edit/${customer.customer_id}`)}
            className="bg-white text-gray-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition"
          >
            Edit Customer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Customer ID</p>
            <p className="text-white font-medium">#{customer.customer_id}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white font-medium">{customer.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="text-white font-medium">{customer.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Member Since</p>
            <p className="text-white font-medium">
              {new Date(customer.created_at!).toLocaleDateString()}
            </p>
          </div>
          {customer.address && (
            <div className="md:col-span-2">
              <p className="text-gray-400">Address</p>
              <p className="text-white font-medium">{customer.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Rentals */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Active Rentals ({activeRentals.length})
        </h2>

        {activeRentals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No active rentals</p>
        ) : (
          <div className="space-y-4">
            {activeRentals.map((rental) => (
              <div
                key={rental.rental_id}
                className="bg-gray-900 rounded p-4 border border-gray-700 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{rental.title}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Rental ID: #{rental.rental_id}</p>
                    <p>
                      Rented on:{' '}
                      {new Date(rental.rental_date!).toLocaleDateString()}
                    </p>
                    <p>Rate: ${rental.rental_rate?.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleReturn(rental.rental_id)}
                  className="bg-white text-gray-900 px-4 py-2 rounded font-medium hover:bg-gray-200 transition"
                >
                  Mark as Returned
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rental History */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Rental History ({pastRentals.length})
        </h2>

        {pastRentals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No rental history</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                    Film
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                    Rental Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                    Return Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pastRentals.map((rental) => (
                  <tr key={rental.rental_id}>
                    <td className="px-4 py-3 text-sm text-white">{rental.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(rental.rental_date!).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {rental.return_date
                        ? new Date(rental.return_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      ${rental.rental_rate?.toFixed(2)}
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