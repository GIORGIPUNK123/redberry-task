import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "../api/axios";
import { Header } from "../features/header/Header";
import type { User } from "../types/auth";
import type {
  CinemaSession,
  FilterOptions,
  FilterOptionsResponse,
  SessionGroup,
  SessionsResponse,
} from "../types/sessions";

export const Sessions = (props: {
  user: User | null;
  onLogout: () => void;
}) => {
  const { user, onLogout } = props;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [groups, setGroups] = useState<SessionGroup[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>(
    () =>
      searchParams.get("venue")?.split(",").filter(Boolean) ??
      searchParams.getAll("venues[]"),
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    () =>
      searchParams.get("format")?.split(",").filter(Boolean) ??
      searchParams.getAll("formats[]"),
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() =>
    searchParams.getAll("languages[]"),
  );
  const [selectedBands, setSelectedBands] = useState<string[]>(() =>
    searchParams.getAll("bands[]"),
  );
  const [selectedDate, setSelectedDate] = useState(
    () => searchParams.get("date") ?? today(),
  );
  const [sort, setSort] = useState(
    () => searchParams.get("sort") ?? "time_asc",
  );
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    api.get<FilterOptionsResponse>("/filter-options").then((response) => {
      setFilters(response.data.data);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", selectedDate);
    params.set("sort", sort);
    params.set("page", String(page));
    selectedVenues.forEach((value) => params.append("venues[]", value));
    selectedFormats.forEach((value) => params.append("formats[]", value));
    selectedLanguages.forEach((value) => params.append("languages[]", value));
    selectedBands.forEach((value) => params.append("bands[]", value));

    api.get<SessionsResponse>("/sessions", { params }).then((response) => {
      setGroups(response.data.data);
      setTotalSessions(response.data.meta.totalSessions);
      setLastPage(response.data.meta.lastPage);
    });
  }, [
    selectedVenues,
    selectedFormats,
    selectedLanguages,
    selectedBands,
    selectedDate,
    sort,
    page,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", selectedDate);
    params.set("sort", sort);
    params.set("page", String(page));
    if (selectedVenues.length) params.set("venue", selectedVenues.join(","));
    if (selectedFormats.length) params.set("format", selectedFormats.join(","));
    if (selectedLanguages.length)
      params.set("language", selectedLanguages.join(","));
    if (selectedBands.length) params.set("band", selectedBands.join(","));
    setSearchParams(params);
  }, [
    selectedVenues,
    selectedFormats,
    selectedLanguages,
    selectedBands,
    selectedDate,
    sort,
    page,
    setSearchParams,
  ]);

  useEffect(() => {
    const venues =
      searchParams.get("venue")?.split(",").filter(Boolean) ??
      searchParams.getAll("venues[]");
    const formats =
      searchParams.get("format")?.split(",").filter(Boolean) ??
      searchParams.getAll("formats[]");
    const languages =
      searchParams.get("language")?.split(",").filter(Boolean) ??
      searchParams.getAll("languages[]");
    const bands =
      searchParams.get("band")?.split(",").filter(Boolean) ??
      searchParams.getAll("bands[]");
    const date = searchParams.get("date") ?? today();
    const nextSort = searchParams.get("sort") ?? "time_asc";
    const nextPage = Number(searchParams.get("page")) || 1;

    setSelectedVenues((current) =>
      sameValues(current, venues) ? current : venues,
    );
    setSelectedFormats((current) =>
      sameValues(current, formats) ? current : formats,
    );
    setSelectedLanguages((current) =>
      sameValues(current, languages) ? current : languages,
    );
    setSelectedBands((current) =>
      sameValues(current, bands) ? current : bands,
    );
    setSelectedDate((current) => (current === date ? current : date));
    setSort((current) => (current === nextSort ? current : nextSort));
    setPage((current) => (current === nextPage ? current : nextPage));
  }, [searchParams]);

  useEffect(() => {
    if (!filters || selectedVenues.length === 0) return;

    const allowedFormats = new Set(
      filters.venues
        .filter((venue) => selectedVenues.includes(venue.slug))
        .flatMap((venue) => venue.formats.map((format) => format.slug)),
    );
    setSelectedFormats((current) => {
      const next = current.filter((format) => allowedFormats.has(format));
      return next.length === current.length ? current : next;
    });
  }, [filters, selectedVenues]);

  const toggle = (
    value: string,
    selected: string[],
    setSelected: (values: string[]) => void,
  ) => {
    setPage(1);
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const clearFilters = () => {
    setSelectedVenues([]);
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedBands([]);
    setSort("time_asc");
    setPage(1);
  };

  const hasActiveFilters =
    selectedVenues.length > 0 ||
    selectedFormats.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedBands.length > 0 ||
    sort !== "time_asc";
  const activeFilterCount =
    Number(selectedVenues.length > 0) +
    Number(selectedFormats.length > 0) +
    Number(selectedLanguages.length > 0) +
    Number(selectedBands.length > 0);
  const visibleFormats = filters
    ? selectedVenues.length === 0
      ? filters.formats
      : filters.formats.filter((format) =>
          filters.venues
            .filter((venue) => selectedVenues.includes(venue.slug))
            .some((venue) =>
              venue.formats.some(
                (venueFormat) => venueFormat.slug === format.slug,
              ),
            ),
        )
    : [];

  return (
    <main className='min-h-screen bg-[#070C1C] text-white'>
      <Header
        loggedIn={Boolean(user)}
        user={user}
        setIsLoginModalOpen={() => {}}
        setIsRegisterModalOpen={() => {}}
        onLogout={onLogout}
      />
      <div className='px-13.5 pb-24 pt-30'>
        <div className='mb-9'>
          <h1 className='text-2xl font-extrabold'>Sessions</h1>
          <p className='mt-1.5 text-sm text-[#A9A9A9]'>
            Browse showtimes across all venues
          </p>
        </div>
        <div className='flex items-start gap-13'>
          <aside className='w-80 shrink-0 rounded-2xl bg-[#1E2031] p-6'>
            <h2 className='text-lg font-extrabold'>Filters</h2>
            {filters && (
              <div className='mt-6 flex flex-col gap-6'>
                <FilterGroup title='Venue'>
                  {filters.venues.map((venue) => (
                    <CheckOption
                      key={venue.slug}
                      label={venue.name}
                      detail={venue.city}
                      checked={selectedVenues.includes(venue.slug)}
                      onChange={() =>
                        toggle(venue.slug, selectedVenues, setSelectedVenues)
                      }
                    />
                  ))}
                </FilterGroup>
                <FilterGroup title='Date'>
                  <div className='flex gap-1.5'>
                    {nextDays().map((date) => (
                      <button
                        key={date.value}
                        type='button'
                        onClick={() => {
                          setSelectedDate(date.value);
                          setPage(1);
                        }}
                        className={`flex h-13 w-9 cursor-pointer flex-col items-center justify-center rounded-lg text-[10px] font-semibold ${selectedDate === date.value ? "bg-[#EC3013] text-white" : "bg-[#2A2C3D] text-white"}`}
                      >
                        <span>{date.weekday}</span>
                        <span>{date.day}</span>
                      </button>
                    ))}
                  </div>
                </FilterGroup>
                <FilterGroup title='Format'>
                  {visibleFormats.map((format) => (
                    <CheckOption
                      key={format.slug}
                      label={format.name}
                      checked={selectedFormats.includes(format.slug)}
                      onChange={() =>
                        toggle(format.slug, selectedFormats, setSelectedFormats)
                      }
                    />
                  ))}
                </FilterGroup>
                <FilterGroup title='Language'>
                  {filters.languages.map((language) => (
                    <CheckOption
                      key={language.slug}
                      label={language.name}
                      checked={selectedLanguages.includes(language.slug)}
                      onChange={() =>
                        toggle(
                          language.slug,
                          selectedLanguages,
                          setSelectedLanguages,
                        )
                      }
                    />
                  ))}
                </FilterGroup>
                <FilterGroup title='Time of day'>
                  {filters.timeBands.map((band) => (
                    <CheckOption
                      key={band.id}
                      label={band.label}
                      checked={selectedBands.includes(band.id)}
                      onChange={() =>
                        toggle(band.id, selectedBands, setSelectedBands)
                      }
                    />
                  ))}
                </FilterGroup>
                {hasActiveFilters && (
                  <button
                    type='button'
                    onClick={clearFilters}
                    className='cursor-pointer rounded-full border border-[#A9A9A9] py-2 text-xs text-white transition-colors hover:bg-[#2A2C3D] active:scale-95'
                  >
                    Clear All Filters
                    <span className='ml-2 text-[#A9A9A9]'>
                      {activeFilterCount} filters active
                    </span>
                  </button>
                )}
              </div>
            )}
          </aside>
          <section className='min-w-0 flex-1'>
            <div className='mb-6 flex items-center justify-between'>
              <span className='text-sm font-semibold'>
                {totalSessions === 0
                  ? "No sessions found"
                  : `Showing ${totalSessions} sessions`}
              </span>
              <label className='flex items-center gap-2 text-sm'>
                <span className='text-[#A9A9A9]'>Sort:</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                  className='bg-transparent font-extrabold outline-none'
                >
                  {filters?.sorts.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      className='bg-[#1E2031]'
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='flex flex-col gap-8'>
              {groups.map((group) => (
                <SessionGroupCard
                  key={group.movie.id}
                  group={group}
                  onMovieClick={() => navigate(`/movie/${group.movie.slug}`)}
                  onSessionClick={(sessionId) =>
                    navigate(`/movie/${group.movie.slug}?session=${sessionId}`)
                  }
                />
              ))}
            </div>
            <div className='mt-12 flex items-center justify-center gap-2'>
              <button
                type='button'
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                className='h-10 w-10 rounded-full bg-[#1E2031] disabled:opacity-40'
              >
                ‹
              </button>
              {Array.from({ length: lastPage }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type='button'
                    onClick={() => setPage(pageNumber)}
                    className={`h-10 w-10 rounded-full text-sm ${page === pageNumber ? "bg-[#EC3013]" : "text-[#A9A9A9] hover:bg-[#1E2031]"}`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type='button'
                disabled={page >= lastPage}
                onClick={() => setPage((current) => current + 1)}
                className='h-10 w-10 rounded-full bg-[#1E2031] disabled:opacity-40'
              >
                ›
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const FilterGroup = (props: { title: string; children: React.ReactNode }) => (
  <section className='border-b border-[#2A2C3D] pb-6 last:border-b-0'>
    <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-[#A9A9A9]'>
      {props.title}
    </h3>
    <div className='flex flex-col gap-3'>{props.children}</div>
  </section>
);

const CheckOption = (props: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className='flex cursor-pointer items-center gap-2.5 text-sm'>
    <input
      type='checkbox'
      checked={props.checked}
      onChange={props.onChange}
      className='h-4.5 w-4.5 cursor-pointer accent-[#EC3013]'
    />
    <span className='font-semibold'>{props.label}</span>
    {props.detail && (
      <span className='text-xs text-[#A9A9A9]'>· {props.detail}</span>
    )}
  </label>
);

const SessionGroupCard = ({
  group,
  onMovieClick,
  onSessionClick,
}: {
  group: SessionGroup;
  onMovieClick: () => void;
  onSessionClick: (sessionId: number) => void;
}) => (
  <section className='border-b border-[#2A2C3D] pb-8'>
    <div className='mb-4 flex items-center gap-4'>
      <img
        src={group.movie.posterUrl}
        alt={group.movie.title}
        className='h-20 w-14 rounded-lg object-cover'
      />
      <button type='button' onClick={onMovieClick} className='cursor-pointer text-left'>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg font-extrabold'>{group.movie.title}</h2>
          <span className='rounded-full bg-[#EC30131A] px-2 py-1 text-xs font-semibold text-[#EC3013]'>
            {group.movie.ageRating.code}
          </span>
        </div>
        <p className='mt-2 text-sm text-[#A9A9A9]'>
          {group.movie.runtimeMinutes} min
        </p>
      </button>
    </div>
    <div className='grid grid-cols-[repeat(auto-fit,minmax(15.75rem,1fr))] gap-3'>
      {group.sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onClick={() => onSessionClick(session.id)}
        />
      ))}
    </div>
  </section>
);

const SessionCard = ({
  session,
  onClick,
}: {
  session: CinemaSession;
  onClick: () => void;
}) => (
  <button
    type='button'
    disabled={session.isSoldOut}
    onClick={onClick}
    className={`rounded-2xl bg-[#1E2031] p-4 text-left ${session.isSoldOut ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
  >
    <div className='flex items-center justify-between'>
      <strong className='text-lg'>{session.time}</strong>
      <span className='rounded-full bg-[#2A2C3D] px-2.5 py-1 text-xs font-semibold'>
        {session.format.name}
      </span>
    </div>
    <div className='mt-3 flex items-end justify-between gap-2 text-xs'>
      <div>
        <p className='text-[#A9A9A9]'>{session.language.name}</p>
        <p className='mt-2 font-semibold'>
          {session.venue.name} · Hall {session.hall.name}
        </p>
      </div>
      <div className='text-right'>
        <p className={session.isSoldOut ? "text-[#A9A9A9]" : "text-[#4ADE80]"}>
          {session.isSoldOut ? "Sold out" : `${session.seatsLeft} left`}
        </p>
        <p className='mt-2 font-extrabold'>₾{session.price}</p>
      </div>
    </div>
  </button>
);

const today = () => new Date().toISOString().slice(0, 10);

const sameValues = (first: string[], second: string[]) =>
  first.length === second.length &&
  first.every((value, index) => value === second[index]);

const nextDays = () =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      value: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      day: date.getDate(),
    };
  });
