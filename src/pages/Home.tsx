import { useState } from "react";
import { Header } from "../features/header/Header";
import { Hero } from "../features/hero/Hero";
import { LoginModal } from "../features/modals/LoginModal";
import { RegisterModal } from "../features/modals/RegisterModal";
import { NowPlaying } from "../features/nowPlaying/NowPlaying";
import { Line } from "../shared/Line";
import { ComingSoon } from "../features/comingSoon/ComingSoon";
import { useAuth } from "../features/auth/useAuth";
import type { User } from "../types/auth";
import { Footer } from "../features/footer/Footer";
export const Home = (props: {
  isLoggedIn: boolean;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}) => {
  const { isLoggedIn, user, onLogin, onLogout } = props;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { login, register, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);

    if (!response) return false;

    onLogin(response.user);
    return true;
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    avatar: File | null,
  ) => {
    const response = await register(
      username,
      email,
      password,
      passwordConfirmation,
      avatar,
    );

    if (!response) return false;

    onLogin(response.user);
    return true;
  };

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <div>
      <LoginModal
        isOpen={isLoginModalOpen}
        setIsOpen={setIsLoginModalOpen}
        onLogin={handleLogin}
        onSwitchToRegister={openRegister}
        error={error}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        setIsOpen={setIsRegisterModalOpen}
        onRegister={handleRegister}
        onSwitchToLogin={openLogin}
        error={error}
      />
      <Header
        loggedIn={isLoggedIn}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        onLogout={onLogout}
        user={user}
      />
      <Hero />
      <NowPlaying />
      <div className='my-10'>
        <Line />
      </div>
      <ComingSoon />
      <div className='my-10'></div>
      <Footer />
    </div>
  );
};
