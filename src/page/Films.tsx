import { useState, useEffect } from 'react';
 import { filmService } from '../services/filmService';
import type { Film } from '../types';

export const Films = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'actor' | 'genre'>('title');
  const [selectedGenre, setSelectedGenre] = useState<any>('all');

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    console.log("useEffect");
    filterFilms();
  }, [selectedGenre, films]);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const data = await filmService.getAll();
      setFilms(data);
      setFilteredFilms(data);
    } catch (error) {
      console.error('Error fetching films:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredFilms(films);
      return;
    }

    try {
      setLoading(true);
      const results = await filmService.search(searchTerm, searchType);
      setFilteredFilms(results);
    } catch (error) {
      console.error('Error searching films:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFilms = () => {
    if (selectedGenre === 'all') {
      setFilteredFilms(films);
    } else {
      setFilteredFilms(films.filter(film => film.genre === selectedGenre));
    }
  };

  const genres = ['all', ...Array.from(new Set(films.map(f => f.genre).filter(Boolean)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Films</h1>
        <div className="text-sm text-gray-400">
          {filteredFilms.length} films
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
          />
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'actor' | 'genre')}
            className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-gray-600"
          >
            <option value="title">Title</option>
            <option value="actor">Actor</option>
            <option value="genre">Genre</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-white text-gray-900 px-6 py-2 rounded font-medium hover:bg-gray-200 transition"
          >
            Search
          </button>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setFilteredFilms(films);
            }}
            className="bg-gray-700 text-white px-6 py-2 rounded font-medium hover:bg-gray-600 transition"
          >
            Clear
          </button>
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                selectedGenre === genre
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre === 'all' ? 'All' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Films Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredFilms.map((film) => (
          <div
            key={film.film_id}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition"
          >
            <img
              src={film.image_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image'}
              alt={film.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-white text-sm line-clamp-1">
                {film.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{film.release_year}</span>
                <span>{film.length} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {film.genre}
                </span>
                <span className="text-sm font-semibold text-white">
                  ${film.rental_rate?.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-700 text-xs text-gray-500">
                <span>{film.available_copies} available</span>
                <span>{film.rental_count} rentals</span>
              </div>

              <button className="w-full bg-white text-gray-900 py-2 rounded text-sm font-medium hover:bg-gray-200 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No films found
        </div>
      )}
    </div>
  );
};