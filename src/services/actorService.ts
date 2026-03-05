import type { Actor, Film } from "../types";
import { api } from "./apis";

 
export const actorService = {
  // Get all actors
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Actor[] }>('/actors');
    return response.data.data;
  },

  // Get top 5 actors
  getTop5: async () => {
    const response = await api.get<{ success: boolean; data: Actor[] }>('/actors/top');
    return response.data.data;
  },

  // Get actor by ID with top 5 films
  getById: async (id: number) => {
    const response = await api.get(`/actors/${id}`);
    return response.data.data;
  },

  // Get all films for an actor
  getActorFilms: async (id: number) => {
    const response = await api.get<{ success: boolean; data: Film[] }>(`/actors/${id}/films`);
    return response.data.data;
  },
};