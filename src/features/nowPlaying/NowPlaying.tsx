import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Movie, MoviesResponse } from "../../types/movies";
import { Moviecard } from "./MovieCard";

export const NowPlaying = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    api
      .get<MoviesResponse>("/movies/now-playing")
      .then((response) => setMovies(response.data.data));
  }, []);

  return (
    <div className='mx-17.5 mt-8 relative'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-extrabold text-white '>Now Playing</h1>
        <span className='cursor-pointer text-[#EC3013] text-sm font-semibold z-2'>
          See All
        </span>
      </div>
      <div className='flex flex-nowrap gap-4.25 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden'>
        {movies.map((movie) => (
          <Moviecard
            key={movie.id}
            title={movie.title}
            genre={movie.genres[0]?.name ?? movie.kind}
            fromPrice={movie.fromPrice}
            runtimeMinutes={movie.runtimeMinutes}
            age={movie.ageRating.code}
            posterUrl={movie.posterUrl}
            slug={movie.slug}
          />
        ))}
      </div>
      <div className='absolute inset-y-0 right-0 w-full pointer-events-none bg-linear-to-l from-[#070C1C] from-0% to-transparent to-20%'></div>
    </div>
  );
};
