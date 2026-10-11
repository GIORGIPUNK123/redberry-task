export type Venue = {
  id: number;
  slug: string;
  name: string;
  city: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue: Venue | null;
  profileComplete: boolean;
};

export type AuthResponse = {
  data: {
    user: User;
    token: string;
  };
};