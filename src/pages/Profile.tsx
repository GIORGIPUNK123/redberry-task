import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../api/axios";
import { Header } from "../features/header/Header";
import type { User } from "../types/auth";
import calendarIcon from "../assets/calendar.png";
import type { Order, TicketsResponse } from "../types/tickets";
import type { FilterOptionsResponse } from "../types/sessions";

export const Profile = (props: {
  user: User | null;
  onLogout: () => void;
  onUserUpdated: (user: User) => void;
}) => {
  const { user, onLogout, onUserUpdated } = props;
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"personalInfo" | "myTickets">(
    searchParams.get("tickets") ? "myTickets" : "personalInfo",
  );
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? "");
  const [preferredVenueId, setPreferredVenueId] = useState(
    user?.preferredVenue?.id.toString() ?? "",
  );
  const [ticketFilter, setTicketFilter] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [tickets, setTickets] = useState<Order[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [venues, setVenues] = useState<FilterOptionsResponse["data"]["venues"]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    api.get<FilterOptionsResponse>("/filter-options").then((response) => {
      setVenues(response.data.data.venues);
    });
  }, []);

  useEffect(() => {
    if (activeTab !== "myTickets") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoadingTickets(true);
    api
      .get<TicketsResponse>("/tickets", {
        params: { filter: ticketFilter },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTickets(response.data.data))
      .finally(() => setIsLoadingTickets(false));
  }, [activeTab, ticketFilter]);

  const inputClassName =
    "mt-2 w-full rounded-xl bg-[#1E2031] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#A9A9A9]";

  const saveProfile = async () => {
    setIsSaving(true);
    setProfileError("");
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("mobileNumber", mobileNumber);
      formData.append("dateOfBirth", dateOfBirth);
      if (preferredVenueId) formData.append("preferredVenueId", preferredVenueId);
      const response = await api.put<{ data: User }>("/profile", formData);
      onUserUpdated(response.data.data);
    } catch (error: any) {
      setProfileError(error.response?.data?.message ?? "Could not save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className='min-h-screen bg-[#070C1C]  text-white'>
      <Header
        loggedIn={true}
        user={user}
        setIsLoginModalOpen={() => {}}
        setIsRegisterModalOpen={() => {}}
        onLogout={onLogout}
      />
      <div className='px-16 mt-30'>
        <h1 className='text-2xl font-extrabold'>My Profile</h1>
        <div className='mt-7.5 flex gap-8.5 border-b border-white/10 text-sm font-semibold'>
          <button
            type='button'
            className={`cursor-pointer pb-3 ${activeTab === "personalInfo" ? "border-b-2 border-[#EC3013]" : ""}`}
            onClick={() => setActiveTab("personalInfo")}
          >
            <span>Personal Information</span>
          </button>
          <button
            type='button'
            className={`cursor-pointer pb-3 ${activeTab === "myTickets" ? "border-b-2 border-[#EC3013]" : ""}`}
            onClick={() => setActiveTab("myTickets")}
          >
            <span>My Tickets</span>
          </button>
        </div>
        <div className='mt-8'>
          {activeTab === "personalInfo" ? (
            <form
              className='max-w-220'
              onSubmit={(event) => {
                event.preventDefault();
                saveProfile();
              }}
            >
              <label className='block text-xs font-semibold'>
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClassName}
                  placeholder='e.g. John Doe'
                />
              </label>
              <label className='block mt-5 text-xs font-semibold'>
                Email
                <input
                  value={user?.email ?? ""}
                  disabled
                  className={`${inputClassName} cursor-not-allowed opacity-70`}
                />
                <span className='mt-1 block text-[10px] font-normal text-[#A9A9A9]'>
                  Set at registration and cannot be changed
                </span>
              </label>
              <label className='block mt-5 text-xs font-semibold'>
                Mobile number
                <input
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  className={inputClassName}
                  placeholder='e.g. 599123456'
                />
              </label>
              <label className='block mt-5 text-xs font-semibold'>
                Date of birth
                <span className='relative block'>
                  <input
                    type='date'
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    className={`${inputClassName} appearance-none pr-12 [&::-webkit-calendar-picker-indicator]:hidden`}
                  />
                  <img
                    src={calendarIcon}
                    alt=''
                    className='absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-4 top-1/2'
                  />
                </span>
              </label>
              <label className='block mt-5 text-xs font-semibold'>
                Preferred venue (optional)
                <span className='relative block'>
                  <select
                    value={preferredVenueId}
                    onChange={(event) =>
                      setPreferredVenueId(event.target.value)
                    }
                    className={`${inputClassName} appearance-none pr-12`}
                  >
                    <option value=''>Choose a venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                  <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A9A9A9]'>
                    ⌄
                  </span>
                </span>
              </label>
              <button
                type='submit'
                className='mt-7 rounded-full bg-[#EC3013] px-5 py-2.5 text-xs font-extrabold text-white'
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              {profileError && <p role='alert' className='mt-3 text-xs text-[#EC3013]'>{profileError}</p>}
            </form>
          ) : (
            <div className='flex flex-col gap-5'>
              <div className='flex w-fit gap-1 rounded-xl bg-[#1E2031] p-1'>
                {(["upcoming", "past"] as const).map((filter) => (
                  <button
                    key={filter}
                    type='button'
                    onClick={() => setTicketFilter(filter)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize ${ticketFilter === filter ? "bg-[#2A2C3D] text-white" : "text-[#A9A9A9]"}`}
                  >
                    {filter} {ticketFilter === filter ? tickets.length : ""}
                  </button>
                ))}
              </div>
              {isLoadingTickets ? (
                <p className='text-sm text-[#A9A9A9]'>Loading tickets...</p>
              ) : tickets.length === 0 ? (
                <p className='text-sm text-[#A9A9A9]'>No tickets yet.</p>
              ) : (
                tickets.map((order) => (
                  <TicketCard key={order.id} order={order} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const TicketCard = ({ order }: { order: Order }) => {
  const { session } = order;
  const sessionDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(session.date));

  return (
    <article className='flex min-h-46 flex-col rounded-[26px] bg-[#1E2031] lg:flex-row'>
      <div className='flex flex-1 items-center gap-5 p-6'>
        <img
          src={session.movie.posterUrl}
          alt={session.movie.title}
          className='h-34 w-25 shrink-0 rounded-[10px] object-cover'
        />
        <div className='flex min-w-0 flex-1 flex-col gap-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-xl font-extrabold'>{session.movie.title}</h2>
            <span className='rounded-full bg-[#EC30131A] px-2 py-1 text-xs font-semibold text-[#EC3013]'>
              {session.movie.ageRating.code}
            </span>
            <span className='text-sm text-[#A9A9A9]'>
              {session.movie.runtimeMinutes} min
            </span>
          </div>
          <div className='grid gap-4 text-sm sm:grid-cols-3'>
            <TicketMeta
              label='Date'
              value={`${sessionDate} · ${session.time}`}
            />
            <TicketMeta
              label='Venue'
              value={`${session.venue.name} · Hall ${session.hall.name}`}
            />
            <TicketMeta
              label='Format'
              value={`${session.format.name} · ${session.language.name}`}
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs font-semibold uppercase tracking-wide text-[#A9A9A9]'>
              Seats
            </span>
            {order.tickets.map((ticket) => (
              <span
                key={ticket.id}
                className='rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold'
              >
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <aside className='flex min-w-64 flex-col justify-between border-t border-dashed border-[#2A2C3D] p-6 lg:border-l lg:border-t-0'>
        <TicketMeta label='Order' value={`#${order.reference}`} />
        <div>
          <div className='flex items-baseline justify-between'>
            <span className='text-sm text-[#A9A9A9]'>Total paid</span>
            <strong className='text-2xl'>₾{order.totalPrice}</strong>
          </div>
          <button
            type='button'
            disabled={!order.isRefundable}
            className='mt-3 w-full rounded-full bg-white/10 px-5 py-2 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50'
          >
            Refund
          </button>
          {!order.isRefundable && (
            <p className='mt-2 text-center text-xs text-[#A9A9A9]'>
              Refund unavailable
            </p>
          )}
        </div>
      </aside>
    </article>
  );
};

const TicketMeta = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-col gap-1'>
    <span className='text-xs font-semibold uppercase tracking-wide text-[#A9A9A9]'>
      {label}
    </span>
    <span className='font-semibold'>{value}</span>
  </div>
);
