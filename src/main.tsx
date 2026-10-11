import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { api } from "./api/axios";
import { Home } from "./pages/Home";
import { Sessions } from "./pages/Sessions";
import { Profile } from "./pages/Profile.tsx";
import { Movie } from "./pages/Movie.tsx";
import { Seats } from "./pages/Seats.tsx";
import type { User } from "./types/auth";

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    api
      .get<{ data: User }>("/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.data);
        setIsLoggedIn(true);
      })
      .catch(logout)
      .finally(() => setIsCheckingAuth(false));
  }, []);

  if (isCheckingAuth) return null;

  return (
    <Routes>
      <Route
        index
        element={
          <Home
            isLoggedIn={isLoggedIn}
            user={user}
            onLogin={(loggedInUser) => {
              setUser(loggedInUser);
              setIsLoggedIn(true);
            }}
            onLogout={logout}
          />
        }
      />
      <Route
        path='/movie/:slug'
        element={<Movie user={user} onLogout={logout} />}
      />
      <Route
        path='/sessions/:sessionId/seats'
        element={<Seats user={user} />}
      />
      <Route
        path='/sessions'
        element={<Sessions user={user} onLogout={logout} />}
      />
      <Route
        path='/profile'
        element={
          isLoggedIn ? (
            <Profile
              user={user}
              onLogout={logout}
              onUserUpdated={setUser}
            />
          ) : (
            <Navigate to='/' replace />
          )
        }
      />
    </Routes>
  );
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
);
