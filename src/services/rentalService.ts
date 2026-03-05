import { api } from "./apis";

 
export const rentalService = {
  // Return a rented film
  returnFilm: async (rentalId: number) => {
    const response = await api.put(`/rentals/${rentalId}/return`);
    return response.data;
  },
};