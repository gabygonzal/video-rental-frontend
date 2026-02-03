import type { Customer, PaginatedResponse } from "../types";
import { api } from "./apis";

 
export const customerService = {
  // Obtener todos los clientes con paginación
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', {
      params: { page, limit },
    });
    return response.data;
  },

  // Buscar clientes
  search: async (searchTerm: string) => {
    const response = await api.get<{ success: boolean; data: Customer[] }>('/customers/search', {
      params: { search: searchTerm },
    });
    return response.data.data;
  },

  // Obtener un cliente por ID
  getById: async (id: number) => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },

  // Crear un nuevo cliente
  create: async (customer: Omit<Customer, 'customer_id' | 'created_at'>) => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  // Actualizar un cliente
  update: async (id: number, customer: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  // Eliminar un cliente
  delete: async (id: number) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};