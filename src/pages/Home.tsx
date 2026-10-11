import { useState } from "react";
import { Header } from "../features/header/Header";
import { Hero } from "../features/hero/Hero";
import { LoginModal } from "../features/modals/LoginModal";
import { NowPlaying } from "../features/nowPlaying/NowPlaying";
import { Line } from "../shared/Line";
import { ComingSoon } from "../features/comingSoon/ComingSoon";

export const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  console.log("isLoginModalOpen", isLoginModalOpen);
  return (
    <div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <Header loggedIn={false} setIsLoginModalOpen={setIsLoginModalOpen} />
      <Hero />
      <NowPlaying />
      <div className='my-10'>
        <Line />
      </div>
      <ComingSoon />
    </div>
  );
};
