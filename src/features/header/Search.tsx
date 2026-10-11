import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/axios";
import type { Movie } from "../../types/movies";

type SearchResult = Movie;

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api
        .get<{ data: SearchResult[] }>("/search", {
          params: { q: query.trim() },
          signal: controller.signal,
        })
        .then((response) => {
          setResults(response.data.data);
          setHasSearched(true);
        })
        .catch(() => {
          /* aborted or network error */
        })
        .finally(() => setIsLoading(false));
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const goToMovie = (slug: string) => {
    navigate(`/movie/${slug}`);
    setIsOpen(false);
  };

  const showResults = hasSearched && !isLoading;
  const noResults = showResults && results.length === 0;

  return (
    <div ref={containerRef} className='relative'>
      {/* Search bar */}
      <div
        className='flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-[7px]'
        style={{ width: 480 }}
      >
        <svg
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#FFFFFF'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='shrink-0'
        >
          <circle cx='11' cy='11' r='8' />
          <line x1='21' y1='21' x2='16.65' y2='16.65' />
        </svg>
        <input
          type='search'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onMouseDown={() => setIsOpen(true)}
          aria-label='Search films and live events'
          className='flex-1 bg-transparent text-sm font-normal text-white outline-none placeholder:text-[#505261]'
          style={{ minWidth: 0 }}
          placeholder='Search films and live events'
        />
        {query && (
          <button
            type='button'
            onClick={clearQuery}
            aria-label='Clear search'
            className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10'
          >
            <svg
              width='10'
              height='10'
              viewBox='0 0 10 10'
              fill='none'
              stroke='#FFFFFF'
              strokeWidth='1.5'
              strokeLinecap='round'
            >
              <line x1='1.5' y1='1.5' x2='8.5' y2='8.5' />
              <line x1='8.5' y1='1.5' x2='1.5' y2='8.5' />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className='absolute right-0 top-[52px] z-50 flex flex-col rounded-2xl border border-[#2A2C3D] bg-[#070C1C] p-2 shadow-[0px_2px_6px_rgba(0,0,0,0.2),0px_20px_48px_-8px_rgba(0,0,0,0.2)]'
          style={{ width: 480 }}
        >
          {/* Empty state */}
          {!query && (
            <div className='flex flex-col items-center px-6 py-8 text-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/10'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z' />
                  <path d='M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6' />
                  <path d='M8 6v12' />
                  <path d='M16 6v12' />
                </svg>
              </div>
              <div className='h-2' />
              <p className='text-sm font-semibold text-white'>
                What do you want to watch?
              </p>
              <div className='h-1.5' />
              <p className='text-sm text-[#A9A9A9]'>
                Search by title, director or cast
              </p>
              <div className='h-2.5' />
              <button
                type='button'
                onClick={() => navigate("/sessions")}
                className='rounded-full bg-white/10 px-[22px] py-[13px] text-sm font-extrabold text-white'
              >
                Browse all sessions
              </button>
            </div>
          )}

          {/* Loading */}
          {query && isLoading && (
            <div className='px-3 py-6 text-center text-sm text-[#A9A9A9]'>
              Searching...
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div className='flex flex-col items-center px-6 py-8 text-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/10'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='11' cy='11' r='8' />
                  <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
              </div>
              <div className='h-2' />
              <p className='text-base font-semibold text-white'>
                No results for “{query}”
              </p>
              <div className='h-1.5' />
              <p className='text-sm text-[#A9A9A9]'>
                Check the spelling or try another film or live event.
              </p>
              <div className='h-2.5' />
              <button
                type='button'
                onClick={() => navigate("/sessions")}
                className='rounded-full bg-white/10 px-[22px] py-[13px] text-sm font-extrabold text-white'
              >
                Browse all sessions
              </button>
            </div>
          )}

          {/* Results */}
          {showResults && results.length > 0 && (
            <>
              <div className='flex items-center justify-between px-2.5 py-1.5'>
                <span className='text-xs font-semibold uppercase tracking-[0.06em] text-[#A9A9A9]'>
                  Films & Events
                </span>
                <span className='text-xs text-[#A9A9A9]'>
                  {results.length} results
                </span>
              </div>
              <div className='flex flex-col'>
                {results.map((movie) => (
                  <button
                    key={movie.id}
                    type='button'
                    onClick={() => goToMovie(movie.slug)}
                    className='flex items-center gap-3.5 rounded-[10px] px-2.5 py-2 text-left transition-colors hover:bg-white/5'
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className='h-14 w-10 shrink-0 rounded-[6px] object-cover'
                    />
                    <div className='flex min-w-0 flex-1 flex-col gap-[3px]'>
                      <span className='truncate text-sm font-semibold text-white'>
                        {movie.title}
                      </span>
                      <span className='text-xs text-[#A9A9A9]'>
                        {capitalize(movie.kind)} · {movie.ageRating.code} ·{" "}
                        {movie.runtimeMinutes} min
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        movie.isComingSoon ? "text-[#E27E04]" : "text-white"
                      }`}
                    >
                      {movie.isComingSoon
                        ? "Coming Soon"
                        : `from ₾${movie.fromPrice}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
