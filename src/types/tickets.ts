export type TicketType = {
  slug: string;
  name: string;
};

export type Ticket = {
  id: number;
  seatCode: string;
  ticketType: TicketType;
  price: number;
};

export type TicketSession = {
  date: string;
  time: string;
  hall: { name: string };
  venue: { name: string };
  format: { name: string };
  language: { name: string };
  movie: {
    title: string;
    posterUrl: string;
    ageRating: { code: string };
    runtimeMinutes: number;
  };
};

export type Order = {
  id: number;
  reference: string;
  totalPrice: number;
  isUpcoming: boolean;
  isRefundable: boolean;
  session: TicketSession;
  tickets: Ticket[];
};

export type TicketsResponse = {
  data: Order[];
};
