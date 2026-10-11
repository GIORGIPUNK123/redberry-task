import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { api } from "../api/axios";
import { Header } from "../features/header/Header";
import { Seats } from "./Seats";
import type { User } from "../types/auth";
import type { MovieDetail } from "../types/movies";
import type { CinemaSession, SessionVenue } from "../types/sessions";

type MovieSessionsResponse = {
  data: Array<{ venue: SessionVenue; sessions: CinemaSession[] }>;
};

export const Movie = (props: { user: User | null; onLogout: () => void }) => {
  const { user, onLogout } = props;
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const autoOpenSessionId = searchParams.get("session");
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [sessionGroups, setSessionGroups] = useState<
    MovieSessionsResponse["data"]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    api.get<{ data: MovieDetail }>(`/movies/${slug}`).then((response) => {
      setMovie(response.data.data);
      setSelectedDate(response.data.data.availableDates[0] ?? null);
    });
  }, [slug]);

  useEffect(() => {
    if (!slug || !selectedDate) return;

    api
      .get<MovieSessionsResponse>(`/movies/${slug}/sessions`, {
        params: { date: selectedDate },
      })
      .then((response) => setSessionGroups(response.data.data));
  }, [slug, selectedDate]);

  if (!movie) return <main className='min-h-screen bg-[#070C1C]' />;

  const ageBlocked =
    user?.age !== null &&
    user?.age !== undefined &&
    user.age < movie.ageRating.minAge &&
    movie.ageRating.minAge >= 16;

  return (
    <>
      <main className='min-h-screen bg-[#070C1C] text-white'>
      <Header
        loggedIn={Boolean(user)}
        user={user}
        setIsLoginModalOpen={() => {}}
        setIsRegisterModalOpen={() => {}}
        onLogout={onLogout}
      />
      <section className='relative h-141.75 overflow-hidden'>
        <img
          src={movie.backdropUrl}
          alt=''
          className='absolute inset-0 h-full w-full object-cover blur-sm'
        />
        <div className='absolute inset-0 bg-[#070C1C]/50 backdrop-blur-sm' />
        <div className='absolute bottom-10 left-15 flex items-end gap-8'>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className='h-93.5 w-72.25 rounded-[14px] object-cover shadow-2xl'
          />
          <div className='mb-2 max-w-145'>
            <span className='rounded-full bg-[#EC30131A] px-2.5 py-1.5 text-xs font-semibold text-[#EC3013]'>
              {movie.isComingSoon ? "COMING SOON" : "NOW PLAYING"}
            </span>
            <h1 className='mt-4 text-[2.5rem] font-extrabold'>{movie.title}</h1>
            <p className='mt-4 text-sm leading-[1.3]'>{movie.synopsis}</p>
            <div className='mt-5 flex flex-wrap gap-2'>
              <span className='rounded-full bg-[#EC30131A] px-2.5 py-1.5 text-xs font-semibold text-[#EC3013]'>
                {movie.ageRating.code}
              </span>
              <span className='rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-semibold'>
                {movie.runtimeMinutes} Min
              </span>
              {movie.formats.slice(0, 2).map((format) => (
                <span
                  key={format.id}
                  className='rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-semibold'
                >
                  {format.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className='flex gap-9 px-13 py-8'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-xl font-extrabold'>Sessions</h2>
          <div className='mt-5 flex gap-2 overflow-x-auto pb-2'>
            {movie.availableDates.slice(0, 7).map((date) => (
              <button
                key={date}
                type='button'
                onClick={() => setSelectedDate(date)}
                className={`flex h-20 min-w-20 cursor-pointer flex-col items-center justify-center rounded-2xl text-xs font-semibold ${selectedDate === date ? "bg-[#EC3013]" : "bg-[#1E2031]"}`}
              >
                <span>{formatWeekday(date)}</span>
                <strong className='mt-1 text-lg'>
                  {new Date(date).getDate()}
                </strong>
              </button>
            ))}
          </div>
          <div className='mt-8 flex flex-col gap-7'>
            {sessionGroups.length === 0 ? (
              <p className='text-sm text-[#A9A9A9]'>
                No sessions on this date.
              </p>
            ) : (
              sessionGroups.map((group) => (
                <div key={group.venue.id}>
                  <h3 className='mb-3 text-sm font-extrabold'>
                    {group.venue.name}
                  </h3>
                  <div className='flex flex-wrap gap-2.5'>
                    {groupByHall(group.sessions).map(([hallName, sessions]) => (
                      <div
                        key={hallName}
                        className='rounded-[18px] bg-[#1E2031] p-3.75'
                      >
                        <h4 className='mb-2 text-xs font-semibold'>
                          Hall {hallName}
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {sessions.map((session) => (
                            <SessionTicket
                              key={session.id}
                              session={session}
                              disabled={session.isSoldOut || ageBlocked}
                              onClick={() =>
                                navigate(`/sessions/${session.id}/seats`)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {ageBlocked && (
                    <p className='mt-3 rounded-xl bg-[#E27E041A] p-3 text-xs text-[#E27E04]'>
                      This film is rated {movie.ageRating.code}. You cannot buy
                      tickets for it with this account.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <aside className='w-110 shrink-0 px-6'>
          <h2 className='text-xl font-extrabold'>Details</h2>
          <MovieDetail label='Director' value={movie.director} />
          <MovieDetail label='Main cast' value={movie.cast} />
          <MovieDetail
            label='Duration'
            value={`${movie.runtimeMinutes} minutes`}
          />
          <MovieDetail
            label='Release date'
            value={formatDate(movie.releaseDate)}
          />
          <MovieDetail
            label='Formats'
            value={movie.formats.map((format) => format.name).join(", ")}
          />
          <MovieDetail label='From' value={`₾${movie.fromPrice}`} />
          <div className='mt-6 rounded-xl bg-[#E27E041A] p-3 text-xs text-[#E27E04]'>
            <strong className='block uppercase'>Rating note</strong>
            <span className='mt-2 block'>
              {movie.ageRating.code} · {movie.ageRating.description}
            </span>
          </div>
        </aside>
      </section>
      </main>
      {autoOpenSessionId && user && (
        <Seats
          user={user}
          sessionId={autoOpenSessionId}
          onClose={() => navigate(`/movie/${slug}`)}
        />
      )}
    </>
  );
};

const SessionTicket = (props: {
  session: CinemaSession;
  disabled: boolean;
  onClick: () => void;
}) => {
  const { session, disabled, onClick } = props;

  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`relative flex h-20.25 w-51.75 overflow-hidden rounded-xl bg-[#070C1C] text-left ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-[#10172A]"}`}
    >
      <span className='absolute -right-1.75 -top-1.75 h-3.5 w-3.5 rounded-full bg-[#1E2031]' />
      <span className='absolute -right-1.75 -bottom-1.75 h-3.5 w-3.5 rounded-full bg-[#1E2031]' />
      <span className='flex w-31 flex-col items-center justify-center border-r border-dashed border-white/50'>
        <strong className='text-xl'>{session.time}</strong>
        <span className='mt-1.5 flex items-center gap-1.5 text-xs text-[#A9A9A9]'>
          {session.language.code}
          <span className='rounded-full bg-[#1E2031] px-2.5 py-1 text-[10px] font-semibold text-[#A9A9A9]'>
            {session.format.name}
          </span>
        </span>
      </span>
      <span className='flex w-20.75 flex-col items-center justify-center'>
        <strong className='text-lg text-[#EC3013]'>₾{session.price}</strong>
        <span className='mt-1 flex items-center gap-1 text-xs text-[#A9A9A9]'>
          ◆ {session.isSoldOut ? "Sold out" : `${session.seatsLeft} left`}
        </span>
      </span>
    </button>
  );
};

const groupByHall = (sessions: CinemaSession[]) =>
  Array.from(
    sessions.reduce((groups, session) => {
      const current = groups.get(session.hall.name) ?? [];
      groups.set(session.hall.name, [...current, session]);
      return groups;
    }, new Map<string, CinemaSession[]>()),
  );

const MovieDetail = ({ label, value }: { label: string; value: string }) => (
  <div className='mt-5'>
    <p className='text-xs font-semibold uppercase text-[#A9A9A9]'>{label}</p>
    <p className='mt-1 text-sm font-semibold'>{value}</p>
  </div>
);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const formatWeekday = (value: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(value),
  );
