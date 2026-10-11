export type SeatState = "available" | "sold" | "held" | "unavailable";

export type Seat = {
  id: number;
  code: string;
  label: string;
  state: SeatState;
  aisleAfter: boolean;
  isMine: boolean;
};

export type SeatMap = {
  sessionId: number;
  hall: { id: number; name: string };
  sections: Array<{
    name: string;
    rows: Array<{ label: string; seats: Seat[] }>;
  }>;
};

export type Hold = {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: Array<{
    seatId: number;
    code: string;
    ticketType: { slug: string; name: string };
    price: number;
  }>;
};

export type TicketTypeOption = {
  id: number;
  slug: string;
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
};
