import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
 
export const CustomerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchCustomer(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchCustomer = async (customerId: number) => {
    try {
      const data = await customerService.getById(customerId);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        active: data.active ?? true,
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Error loading customer data');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isEdit && id) {
        await customerService.update(parseInt(id), formData);
      } else {
        await customerService.create(formData);
      }
      navigate('/customers');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error saving customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {isEdit ? 'Edit Customer' : 'New Customer'}
        </h1>
        <button
          onClick={() => navigate('/customers')}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`w-full bg-gray-900 border ${
              errors.first_name ? 'border-red-500' : 'border-gray-700'
            } rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600`}
          />
          {errors.first_name && (
            <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`w-full bg-gray-900 border ${
              errors.last_name ? 'border-red-500' : 'border-gray-700'
            } rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600`}
          />
          {errors.last_name && (
            <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-gray-900 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Active Status */}
        {isEdit && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-white bg-gray-900 border-gray-700 rounded focus:ring-0"
            />
            <label className="ml-2 text-sm text-gray-300">Active Customer</label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="flex-1 bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};