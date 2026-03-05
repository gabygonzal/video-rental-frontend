import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { actorService } from '../services/actorService';
import type { Actor, Film } from '../types';
 
export const ActorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actor, setActor] = useState<Actor & { top_films?: Film[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchActor(parseInt(id));
    }
  }, [id]);

  const fetchActor = async (actorId: number) => {
    try {
      setLoading(true);
      const data = await actorService.getById(actorId);
      setActor(data);
    } catch (error) {
      console.error('Error fetching actor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Actor not found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-gray-900 px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="text-gray-400 hover:text-white"
      >
        ← Back to Home
      </button>

      {/* Actor Details */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-6xl">👤</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {actor.first_name} {actor.last_name}
            </h1>
            {actor.birth_date && (
              <p className="text-gray-400 mb-4">
                Born: {new Date(actor.birth_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="bg-gray-900 px-4 py-2 rounded border border-gray-700">
                <p className="text-xs text-gray-400">Actor ID</p>
                <p className="text-lg font-semibold text-white">#{actor.actor_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Rented Films */}
      {actor.top_films && actor.top_films.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Top 5 Most Rented Films</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {actor.top_films.map((film, index) => (
              <div
                key={film.film_id}
                onClick={() => navigate(`/films/${film.film_id}`)}
                className="group cursor-pointer"
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
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>{film.release_year}</span>
                  <span>{film.rental_count} rentals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Films */}
      {(!actor.top_films || actor.top_films.length === 0) && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <p className="text-gray-400">This actor has no films in our store yet.</p>
        </div>
      )}
    </div>
  );
};