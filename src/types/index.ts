// Film interface
export interface Film {
  film_id: number;
  title: string;
  description?: string;
  release_year?: number;
  rental_rate?: number;
  length?: number;
  rating?: string;
  genre?: string;
  rental_count?: number;
  available_copies?: number;
  image_url?: string;
  created_at?: string;
}

// Actor interface
export interface Actor {
  actor_id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  created_at?: string;
}

// Customer interface
export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  active?: boolean;
  created_at?: string;
}

// Rental interface
export interface Rental {
  rental_id: number;
  customer_id: number;
  film_id: number;
  rental_date?: string;
  return_date?: string | null;
  status?: 'rented' | 'returned';
  title?: string;
  rental_rate?: number;
}

// Film with actors (for detail view)
export interface FilmWithActors extends Film {
  actors?: Actor[];
}

// Actor with top films
export interface ActorWithFilms extends Actor {
  films?: Film[];
  top_films?: Film[];
}

// Customer with rental history
export interface CustomerWithRentals extends Customer {
  rentals?: RentalWithDetails[];
}

// Rental with full details
export interface RentalWithDetails extends Rental {
  film?: Film;
  customer?: Customer;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search parameters
export interface SearchParams {
  search?: string;
  type?: 'title' | 'actor' | 'genre' | 'name';
}

// Rental request payload
export interface RentalRequest {
  customer_id: number;
  film_id: number;
}

// Return rental request payload
export interface ReturnRentalRequest {
  rental_id: number;
}

// Statistics for dashboard
export interface DashboardStats {
  total_films: number;
  total_customers: number;
  total_rentals: number;
  active_rentals: number;
  revenue: number;
}

// Top films data
export interface TopFilm extends Film {
  rank?: number;
}

// Top actors data
export interface TopActor extends Actor {
  rental_count?: number;
  top_films?: Film[];
}