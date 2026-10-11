export type MovieGenre = {
  id: number;
  slug: string;
  name: string;
};

export type MovieFormat = {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
};

export type AgeRating = {
  code: string;
  minAge: number;
  description: string;
};

export type Movie = {
  id: number;
  slug: string;
  title: string;
  kind: string;
  runtimeMinutes: number;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  isComingSoon: boolean;
  isFeatured: boolean;
  fromPrice: number;
  ageRating: AgeRating;
  genres: MovieGenre[];
  formats: MovieFormat[];
  synopsis?: string;
};

export type MovieDetail = Movie & {
  synopsis: string;
  director: string;
  cast: string;
  availableDates: string[];
};

export type MoviesResponse = {
  data: Movie[];
};
