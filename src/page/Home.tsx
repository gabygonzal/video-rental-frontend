import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmService } from '../services/filmService';
import { actorService } from '../services/actorService';
import type { Actor, Film } from '../types';
 
export const Home = () => {
  const [topFilms, setTopFilms] = useState<Film[]>([]);
  const [topActors, setTopActors] = useState<(Actor & { total_rentals?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [films, actors] = await Promise.all([
        filmService.getTop5(),
        actorService.getTop5(),
      ]);
      setTopFilms(films);
      setTopActors(actors);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Video Rental Store
        </h1>
        <p className="text-lg text-gray-400">
          Manage your video rental business
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/films"
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Films</h2>
          <p className="text-gray-400 text-sm">Browse and manage films</p>
        </Link>

        <Link
          to="/customers"
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Customers</h2>
          <p className="text-gray-400 text-sm">Manage customer information</p>
        </Link>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-2">Analytics</h2>
          <p className="text-gray-400 text-sm">View rental statistics</p>
        </div>
      </div>

      {/* Top 5 Films */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Top 5 Most Rented Films</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topFilms.map((film, index) => (
              <Link
                key={film.film_id}
                to={`/films/${film.film_id}`}
                className="group"
              >
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  <img
                    src={film.image_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image'}
                    alt={film.title}
                    className="w-full h-72 object-cover rounded border border-gray-700 group-hover:border-gray-500 transition"
                  />
                </div>
                <h3 className="mt-2 font-medium text-white text-sm line-clamp-1 group-hover:text-gray-300 transition">
                  {film.title}
                </h3>
                <p className="text-xs text-gray-500">{film.rental_count} rentals</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Actors */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Top 5 Actors</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topActors.map((actor, index) => (
              <Link
                key={actor.actor_id}
                to={`/actors/${actor.actor_id}`}
                className="group text-center"
              >
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 group-hover:border-gray-500 transition">
                    <span className="text-6xl">👤</span>
                  </div>
                </div>
                <h3 className="mt-2 font-medium text-white text-sm group-hover:text-gray-300 transition">
                  {actor.first_name} {actor.last_name}
                </h3>
                <p className="text-xs text-gray-500">{actor.total_rentals} total rentals</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};