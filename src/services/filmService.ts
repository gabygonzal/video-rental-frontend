import type { Film, RentalRequest } from "../types";
import { api } from "./apis";

export const filmService = {
  // Get all films
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Film[] }>('/films');
    return response.data.data;
  },

  // Get top 5 films
  getTop5: async () => {
    const response = await api.get<{ success: boolean; data: Film[] }>('/films/top');
    return response.data.data;
  },

  // Search films
  search: async (searchTerm: string, type: 'title' | 'actor' | 'genre' = 'title') => {
    const response = await api.get<{ success: boolean; data: Film[] }>('/films/search', {
      params: { search: searchTerm, type },
    });
    return response.data.data;
  },

  // Get film by ID with actors
  getById: async (id: number) => {
    const response = await api.get(`/films/${id}`);
    return response.data.data;
  },

  // Rent a film
  rentFilm: async (rentalData: RentalRequest) => {
    const response = await api.post('/films/rent', rentalData);
    return response.data;
  },
};