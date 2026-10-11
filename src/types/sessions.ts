import type { Movie, MovieFormat } from "./movies";

export type SessionLanguage = {
  id: number;
  slug: string;
  name: string;
  code: string;
};

export type SessionVenue = {
  id: number;
  slug: string;
  name: string;
  city: string;
};

export type CinemaSession = {
  id: number;
  date: string;
  time: string;
  timeBand: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: { id: number; name: string };
  venue: SessionVenue;
  format: MovieFormat;
  language: SessionLanguage;
  movie: Movie;
};

export type SessionGroup = {
  movie: Movie;
  sessions: CinemaSession[];
};

export type SessionsResponse = {
  data: SessionGroup[];
  meta: {
    currentPage: number;
    lastPage: number;
    totalSessions: number;
    totalMovies: number;
  };
};

export type FilterOptions = {
  venues: Array<SessionVenue & { formats: MovieFormat[] }>;
  formats: MovieFormat[];
  languages: SessionLanguage[];
  timeBands: Array<{ id: string; label: string }>;
  sorts: Array<{ id: string; label: string }>;
  ticketTypes: import("./booking").TicketTypeOption[];
  maxSeatsPerOrder: number;
  holdMinutes: number;
};

export type FilterOptionsResponse = {
  data: FilterOptions;
};
