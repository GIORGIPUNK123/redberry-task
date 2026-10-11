import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import arrowLeft from "../../assets/arrow-left-01-round.png";
import arrowRight from "../../assets/arrow-right-01-round.png";
import oddyseyImg from "../../assets/odyssey.png";
import type { Movie, MoviesResponse } from "../../types/movies";
import { HeroOverlay } from "./HeroOverlay";

export const Hero = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    api
      .get<MoviesResponse>("/movies/featured")
      .then((response) => setMovies(response.data.data));
  }, []);

  useEffect(() => {
    if (movies.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [movies.length]);

  const activeMovie = movies[activeIndex];

  return (
    <section className='relative overflow-hidden h-190'>
      <div
        key={activeMovie?.id ?? "fallback"}
        className='absolute inset-0 animate-[heroFade_700ms_ease-out] bg-center bg-cover'
        style={{
          backgroundImage: `url(${activeMovie?.backdropUrl ?? oddyseyImg})`,
        }}
      />
      <div className='absolute inset-0 z-1 bg-linear-to-r from-[#000000] to-[#0000001A]' />
      {activeMovie && (
        <HeroOverlay
          isPremiere={activeMovie.isFeatured}
          heading={activeMovie.title}
          age={activeMovie.ageRating.code}
          duration={activeMovie.runtimeMinutes}
          description={activeMovie.synopsis ?? ""}
          formats={activeMovie.formats.slice(0, 2).map((format) => format.name)}
        />
      )}
      {movies.length > 1 && (
        <div className='absolute bottom-12 left-16.75 right-16.75 z-3 flex items-center gap-3'>
          <div className='flex flex-1 gap-1.25'>
            {movies.map((movie, movieIndex) => (
              <button
                key={movie.id}
                type='button'
                aria-label={`Go to slide ${movieIndex + 1}`}
                onClick={() => setActiveIndex(movieIndex)}
                className={`h-0.75 flex-1 cursor-pointer transition-colors duration-300 ${movieIndex === activeIndex ? "bg-[#EC3013]" : "bg-white"}`}
              />
            ))}
          </div>
          <button
            type='button'
            aria-label='Previous slide'
            onClick={() =>
              setActiveIndex((activeIndex - 1 + movies.length) % movies.length)
            }
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0D2940CC] text-3xl leading-none text-white'
          >
            <img src={arrowLeft} alt='' className='w-full h-full p-1' />
          </button>
          <button
            type='button'
            aria-label='Next slide'
            onClick={() => setActiveIndex((activeIndex + 1) % movies.length)}
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0D2940CC] text-3xl leading-none text-white'
          >
            <img src={arrowRight} alt='' className='w-full h-full p-1' />
          </button>
        </div>
      )}
    </section>
  );
};
