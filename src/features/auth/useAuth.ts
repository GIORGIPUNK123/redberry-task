import { useState } from "react";
import axios from "axios";
import { api } from "../../api/axios";
import type { AuthResponse } from "../../types/auth";

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "Something went wrong.";

  const data = error.response?.data ?? {};
  const fieldErrors = Object.values(data.errors ?? {})
    .flat()
    .join(" ");
  return fieldErrors || data.message || "Something went wrong.";
};

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);

    try {
      const response = await api.post<AuthResponse>("/login", {
        email,
        password,
      });
      const { token, user } = response.data.data;

      if (!token) {
        setError("Login failed. Please try again.");
        return null;
      }

      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    }
  };
  const register = async (
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    avatar: File | null,
  ) => {
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      if (avatar) formData.append("avatar", avatar);

      const response = await api.post<AuthResponse>("/register", formData);
      const { token, user } = response.data.data;

      if (!token) {
        setError("Registration failed. Please try again.");
        return null;
      }

      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    }
  };

  return { login, register, error };
};
