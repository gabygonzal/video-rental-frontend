import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filmService } from '../services/filmService';
import type { Actor, Film } from '../types';
 
export const FilmDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [film, setFilm] = useState<Film & { actors?: Actor[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRentModal, setShowRentModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFilm(parseInt(id));
    }
  }, [id]);

  const fetchFilm = async (filmId: number) => {
    try {
      setLoading(true);
      const data = await filmService.getById(filmId);
      setFilm(data);
    } catch (error) {
      console.error('Error fetching film:', error);
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

  if (!film) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Film not found</h2>
        <button
          onClick={() => navigate('/films')}
          className="bg-white text-gray-900 px-4 py-2 rounded"
        >
          Back to Films
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/films')}
        className="text-gray-400 hover:text-white"
      >
        ← Back to Films
      </button>

      {/* Film Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={film.image_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image'}
            alt={film.title}
            className="w-full rounded-lg border border-gray-700"
          />
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{film.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded text-sm">{film.rating}</span>
              <span>{film.release_year}</span>
              <span>{film.length} min</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-sm">{film.genre}</span>
            </div>
          </div>

          <p className="text-gray-300 text-lg">{film.description}</p>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-700">
            <div>
              <p className="text-gray-400 text-sm">Rental Rate</p>
              <p className="text-2xl font-bold text-white">${film.rental_rate?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Copies</p>
              <p className="text-2xl font-bold text-white">{film.available_copies}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Rentals</p>
              <p className="text-2xl font-bold text-white">{film.rental_count}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className={`text-xl font-bold ${film.available_copies && film.available_copies > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {film.available_copies && film.available_copies > 0 ? 'Available' : 'Out of Stock'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRentModal(true)}
            disabled={!film.available_copies || film.available_copies <= 0}
            className="w-full bg-white text-gray-900 py-3 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rent This Film
          </button>
        </div>
      </div>

      {/* Cast */}
      {film.actors && film.actors.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {film.actors.map((actor) => (
              <div
                key={actor.actor_id}
                onClick={() => navigate(`/actors/${actor.actor_id}`)}
                className="text-center cursor-pointer hover:bg-gray-700 p-3 rounded transition"
              >
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">👤</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {actor.first_name} {actor.last_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && (
        <RentModal
          film={film}
          onClose={() => setShowRentModal(false)}
          onSuccess={() => {
            setShowRentModal(false);
            if (id) fetchFilm(parseInt(id));
          }}
        />
      )}
    </div>
  );
};

// Rent Modal Component
interface RentModalProps {
  film: Film;
  onClose: () => void;
  onSuccess: () => void;
}

const RentModal = ({ film, onClose, onSuccess }: RentModalProps) => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRent = async () => {
    if (!customerId) {
      alert('Please enter a customer ID');
      return;
    }

    try {
      setLoading(true);
      await filmService.rentFilm({
        customer_id: parseInt(customerId),
        film_id: film.film_id,
      });
      alert('Film rented successfully!');
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error renting film');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Rent Film</h2>
        <p className="text-gray-400 mb-4">
          Renting: <span className="text-white font-semibold">{film.title}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Customer ID</label>
            <input
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter customer ID"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRent}
              disabled={loading}
              className="flex-1 bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Rental'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};