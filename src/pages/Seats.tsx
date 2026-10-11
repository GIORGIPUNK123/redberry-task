import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../api/axios";
import type { User } from "../types/auth";
import type { CinemaSession } from "../types/sessions";
import type { Hold, Seat, SeatMap, TicketTypeOption } from "../types/booking";

type Props = { user: User | null; sessionId?: string; onClose?: () => void };
type Step = "seats" | "checkout" | "confirmation";
type SelectedSeat = Seat & { ticketType: TicketTypeOption };

export const Seats = ({ user, sessionId: providedSessionId, onClose }: Props) => {
  const { sessionId: routeSessionId } = useParams();
  const sessionId = providedSessionId ?? routeSessionId;
  const navigate = useNavigate();
  const [session, setSession] = useState<CinemaSession | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeOption[]>([]);
  const [maxSeats, setMaxSeats] = useState(3);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [hold, setHold] = useState<Hold | null>(null);
  const [step, setStep] = useState<Step>("seats");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    total: number;
  } | null>(null);

  const loadSeats = () => {
    if (!sessionId) return;
    api
      .get<{ data: SeatMap }>(`/sessions/${sessionId}/seats`)
      .then((response) => setSeatMap(response.data.data));
  };

  useEffect(() => {
    if (!sessionId) return;
    api
      .get<{ data: CinemaSession }>(`/sessions/${sessionId}`)
      .then((response) => {
        setSession(response.data.data);
      });
    api
      .get<{ data: SeatMap }>(`/sessions/${sessionId}/seats`)
      .then((response) => {
        setSeatMap(response.data.data);
      });
    api
      .get<{
        data: { ticketTypes: TicketTypeOption[]; maxSeatsPerOrder: number };
      }>("/filter-options")
      .then((response) => {
        setTicketTypes(response.data.data.ticketTypes);
        setMaxSeats(response.data.data.maxSeatsPerOrder);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!hold?.isLive) return;
    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(hold.expiresAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(remaining);
      return remaining;
    };

    updateTimer();
    const timer = window.setInterval(() => {
      if (updateTimer() <= 0) {
        setHold(null);
        setSelectedSeats([]);
        setStep("seats");
        setError("Your hold time expired. Please re-select your seats.");
        loadSeats();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hold]);

  const selectedTotal = selectedSeats.reduce(
    (total, seat) => total + (session?.price ?? 0) * seat.ticketType.priceRatio,
    0,
  );

  const selectSeat = (seat: Seat) => {
    if (seat.state !== "available" || seat.isMine) return;
    setError("");
    const existing = selectedSeats.find((selected) => selected.id === seat.id);
    if (existing) {
      setSelectedSeats((current) =>
        current.filter((selected) => selected.id !== seat.id),
      );
      return;
    }
    if (selectedSeats.length >= maxSeats) {
      setError(`You can select up to ${maxSeats} seats.`);
      return;
    }
    const adult =
      ticketTypes.find((type) => type.slug === "adult") ?? ticketTypes[0];
    if (adult)
      setSelectedSeats((current) => [
        ...current,
        { ...seat, ticketType: adult },
      ]);
  };

  const changeTicketType = (seatId: number, type: TicketTypeOption) => {
    setSelectedSeats((current) =>
      current.map((seat) =>
        seat.id === seatId ? { ...seat, ticketType: type } : seat,
      ),
    );
  };

  const createHold = async () => {
    if (!sessionId || selectedSeats.length === 0) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await api.post<{ data: Hold }>(
        `/sessions/${sessionId}/holds`,
        {
          seats: selectedSeats.map((seat) => ({
            seatId: seat.id,
            ticketType: seat.ticketType.slug,
          })),
        },
      );
      setHold(response.data.data);
      setStep("checkout");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ?? "Some seats could not be held.",
      );
      if (requestError.response?.status === 409) {
        setSelectedSeats((current) =>
          current.filter(
            (seat) =>
              !requestError.response.data.contested?.includes(seat.code),
          ),
        );
        loadSeats();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70'>
        <div className='w-96 rounded-3xl bg-[#070C1C] p-8 text-white'>
          <h1 className='text-xl font-extrabold'>Log in to continue</h1>
          <p className='mt-3 text-sm text-[#A9A9A9]'>
            You need an account to choose seats.
          </p>
          <button
            type='button'
            onClick={() => navigate("/")}
            className='mt-6 w-full rounded-full bg-[#EC3013] py-3 font-extrabold'
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!session || !seatMap)
    return <main className='min-h-screen bg-[#070C1C]' />;

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm'
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='flex max-h-[90vh] w-285 flex-col gap-8 overflow-auto rounded-[28px] bg-[#070C1C] p-8 text-white shadow-2xl'
      >
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-xl font-extrabold'>{session.movie.title}</h1>
            <p className='mt-2 text-xs text-[#A9A9A9]'>
              {session.venue.name} · Hall {session.hall.name} · {session.date} ·{" "}
              {session.time} · {session.format.name} · {session.language.name}
            </p>
          </div>
          <span className='rounded-xl bg-[#1E2031] px-4 py-2 text-center text-xs font-semibold text-[#A9A9A9]'>
            SEATS HELD
            <br />
            <strong className='text-white'>
              {hold ? formatSeconds(remainingSeconds) : "8:00"}
            </strong>
          </span>
        </div>
        <div className='grid min-h-0 grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] gap-5'>
          <div className='min-w-0'>
            <div className='flex rounded-full bg-[#1E2031] p-1 text-xs font-semibold'>
              <span
                className={`flex-1 rounded-full py-2 text-center ${step === "seats" ? "bg-[#EC3013]" : ""}`}
              >
                SEATS
              </span>
              <span
                className={`flex-1 rounded-full py-2 text-center ${step !== "seats" ? "bg-[#EC3013]" : ""}`}
              >
                CHECKOUT
              </span>
            </div>
            {step === "seats" ? (
              <SeatMapView
                seatMap={seatMap}
                selectedSeats={selectedSeats}
                onSelect={selectSeat}
              />
            ) : step === "checkout" ? (
              <CheckoutStep
                user={user}
                hold={hold}
                isLoading={isLoading}
                onSubmit={(form) =>
                  submitOrder(
                    form,
                    hold,
                    setIsLoading,
                    setError,
                    setConfirmation,
                    setStep,
                  )
                }
              />
            ) : (
              <Confirmation
                reference={confirmation?.reference ?? ""}
                total={confirmation?.total ?? 0}
                onClose={() => navigate("/")}
              />
            )}
          </div>
          {step !== "confirmation" && (
            <BookingSummary
              seats={selectedSeats}
              total={hold?.subtotal ?? selectedTotal}
              ticketTypes={ticketTypes}
              onTicketTypeChange={changeTicketType}
              onNext={createHold}
              disabled={
                step === "seats" && (selectedSeats.length === 0 || isLoading)
              }
            />
          )}
        </div>
        {error && (
          <p role='alert' className='text-xs text-[#EC3013]'>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

const SeatMapView = (props: {
  seatMap: SeatMap;
  selectedSeats: SelectedSeat[];
  onSelect: (seat: Seat) => void;
}) => (
  <div className='mt-8 rounded-2xl bg-[#1E2031] p-6'>
    <div className='rounded-b-2xl bg-[#2A2C3D] py-2 text-center text-xs font-semibold'>
      SCREEN
    </div>
    <div className='mt-8 flex flex-col gap-7'>
      {props.seatMap.sections.map((section) => (
        <section key={section.name}>
          <h2 className='mb-4 text-xs font-semibold uppercase text-[#A9A9A9]'>
            {section.name}
          </h2>
          <div className='flex flex-col gap-3'>
            {section.rows.map((row) => (
              <div key={row.label} className='flex items-center gap-2'>
                <span className='w-5 text-center text-xs font-semibold'>
                  {row.label}
                </span>
                <div className='flex flex-wrap gap-2'>
                  {row.seats.map((seat) => {
                    const selected = props.selectedSeats.some(
                      (item) => item.id === seat.id,
                    );
                    return (
                      <button
                        key={seat.id}
                        type='button'
                        disabled={seat.state !== "available" && !selected}
                        onClick={() => props.onSelect(seat)}
                        className={`h-11 w-11 rounded-[10px] border text-sm font-extrabold ${selected ? "border-[#EC3013] bg-[#EC3013]" : seat.state === "available" ? "cursor-pointer border-[#505261] bg-[#1E2031]" : seat.state === "held" ? "cursor-not-allowed bg-[#2A2C3D] text-[#A9A9A9]" : "cursor-not-allowed border-transparent bg-[#1E2031] text-[#505261]"}`}
                      >
                        {seat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
    <div className='mt-8 flex flex-wrap justify-center gap-5 text-xs text-[#A9A9A9]'>
      <Legend color='bg-[#1E2031]' label='Available' />
      <Legend color='bg-[#EC3013]' label='Selected' />
      <Legend color='bg-[#1E2031]' label='Sold' />
      <Legend color='bg-[#2A2C3D]' label='Held by another user' />
    </div>
  </div>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <span className='flex items-center gap-2'>
    <span className={`h-4 w-4 rounded ${color}`} />
    {label}
  </span>
);

const BookingSummary = (props: {
  seats: SelectedSeat[];
  total: number;
  ticketTypes: TicketTypeOption[];
  onTicketTypeChange: (seatId: number, type: TicketTypeOption) => void;
  onNext: () => void;
  disabled: boolean;
}) => (
  <aside className='flex flex-col justify-between border-l border-[#1E2031] pl-6'>
    <div>
      <h2 className='text-base font-extrabold'>Your seats · Max 3</h2>
      <p className='mt-3 text-xs text-[#A9A9A9]'>
        Pick up to 3 seats from the map. Each seat can carry its own ticket
        type.
      </p>
      <div className='mt-6 flex flex-col gap-3'>
        {props.seats.map((seat) => (
          <div key={seat.id} className='rounded-xl bg-[#1E2031] p-3'>
            <div className='flex justify-between text-xs'>
              <span>Seat {seat.code}</span>
              <strong>₾{seat.ticketType.priceRatio * 100}</strong>
            </div>
            <div className='mt-3 flex gap-1'>
              {props.ticketTypes.map((type) => (
                <button
                  key={type.slug}
                  type='button'
                  onClick={() => props.onTicketTypeChange(seat.id, type)}
                  className={`rounded-full px-2 py-1 text-[10px] ${seat.ticketType.slug === type.slug ? "bg-[#EC3013] text-white" : "bg-[#2A2C3D] text-[#A9A9A9]"}`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className='mt-8'>
      <div className='flex justify-between font-extrabold'>
        <span>SUBTOTAL</span>
        <span>₾{props.total.toFixed(2)}</span>
      </div>
      <button
        type='button'
        disabled={props.disabled}
        onClick={props.onNext}
        className='mt-5 w-full rounded-full bg-[#EC3013] py-3 text-sm font-extrabold disabled:bg-[#505261] disabled:text-[#A9A9A9]'
      >
        Next: Checkout
      </button>
    </div>
  </aside>
);

const CheckoutStep = (props: {
  user: User;
  hold: Hold | null;
  isLoading: boolean;
  onSubmit: (form: Record<string, string>) => void;
}) => {
  const [form, setForm] = useState({
    fullName: props.user.fullName ?? "",
    email: props.user.email,
    mobileNumber: props.user.mobileNumber ?? "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <form
      className='mt-8 flex flex-col gap-5'
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit(form);
      }}
    >
      <Field
        label='Full name'
        value={form.fullName}
        onChange={(value) => update("fullName", value)}
      />
      <div className='grid grid-cols-2 gap-4'>
        <Field
          label='Email'
          value={form.email}
          onChange={(value) => update("email", value)}
        />
        <Field
          label='Mobile number'
          value={form.mobileNumber}
          onChange={(value) => update("mobileNumber", value)}
        />
      </div>
      <hr className='border-[#1E2031]' />
      <Field
        label='Card number'
        value={form.cardNumber}
        placeholder='e.g. 1234 4567 8901 2345'
        onChange={(value) => update("cardNumber", value)}
      />
      <div className='grid grid-cols-2 gap-4'>
        <Field
          label='Expiry'
          value={form.expiry}
          placeholder='e.g. 12/34'
          onChange={(value) => update("expiry", value)}
        />
        <Field
          label='CVV'
          value={form.cvv}
          placeholder='e.g. 123'
          onChange={(value) => update("cvv", value)}
        />
      </div>
      <button
        disabled={props.isLoading || !props.hold}
        className='mt-3 rounded-full bg-[#EC3013] py-3 font-extrabold disabled:bg-[#505261]'
      >
        Pay & Complete Order
      </button>
    </form>
  );
};

const Field = (props: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) => (
  <label className='flex flex-col gap-2 text-xs font-semibold'>
    {props.label}
    <input
      required
      value={props.value}
      placeholder={props.placeholder ?? "e.g. Text"}
      onChange={(event) => props.onChange(event.target.value)}
      className='rounded-xl bg-[#1E2031] px-4 py-3 text-sm text-white outline-none placeholder:text-[#A9A9A9]'
    />
  </label>
);

const submitOrder = async (
  form: Record<string, string>,
  hold: Hold | null,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void,
  setConfirmation: (value: { reference: string; total: number }) => void,
  setStep: (value: Step) => void,
) => {
  if (!hold) return;
  setLoading(true);
  try {
    const response = await api.post<{
      data: { reference: string; totalPrice: number };
    }>("/orders", { ...form, holdId: hold.holdId });
    setConfirmation({
      reference: response.data.data.reference,
      total: response.data.data.totalPrice,
    });
    setStep("confirmation");
  } catch (error: any) {
    setError(
      error.response?.data?.message ??
        "Payment failed. Please check your details.",
    );
  } finally {
    setLoading(false);
  }
};

const Confirmation = (props: {
  reference: string;
  total: number;
  onClose: () => void;
}) => (
  <div className='flex min-h-105 flex-col items-center justify-center text-center'>
    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#4ADE80] text-3xl'>
      ✓
    </div>
    <h2 className='mt-5 text-3xl font-extrabold'>Booking confirmed!</h2>
    <p className='mt-3 text-[#A9A9A9]'>Your tickets are ready.</p>
    <span className='mt-6 rounded-full bg-[#2A2C3D] px-8 py-2 text-sm font-extrabold'>
      ORDER #{props.reference}
    </span>
    <p className='mt-3 text-sm'>Total paid · ₾{props.total}</p>
    <button
      type='button'
      onClick={props.onClose}
      className='mt-8 rounded-full bg-[#EC3013] px-8 py-3 font-extrabold'
    >
      Back to home
    </button>
  </div>
);

const formatSeconds = (remaining: number) =>
  `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
