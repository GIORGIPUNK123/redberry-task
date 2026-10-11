import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../../Logo";
import { MainButton } from "../../shared/MainButton";
import { Search } from "./Search";
import type { User } from "../../types/auth";

export const Header = (props: {
  loggedIn: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  setIsRegisterModalOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  user: User | null;
}) => {
  const {
    loggedIn,
    setIsLoginModalOpen,
    setIsRegisterModalOpen,
    onLogout,
    user,
  } = props;
  const displayName = user?.fullName || user?.username || "Account";
  const initials = displayName.slice(0, 2).toUpperCase();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center text-white z-2  fixed  top-0 w-full px-15 pt-7.5 pb-10 bg-linear-to-b from-black to-transparent '>
      <div className='flex items-center gap-9'>
        <Logo />
        <div
          className='text-xs font-semibold cursor-pointer '
          onClick={() => navigate("/sessions")}
        >
          SESSIONS
        </div>
      </div>
      <div className='flex items-center gap-8'>
        {/* buttons and search */}
        <Search />
        {loggedIn ? (
          <div className='relative'>
            <button
              type='button'
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              aria-expanded={isProfileMenuOpen}
              className='flex items-center gap-3 text-sm font-semibold text-left text-white cursor-pointer'
            >
              <span className='relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#202337] text-xs font-bold overflow-hidden'>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  initials
                )}
                <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#22C55E] border-2 border-[#070C1C]' />
              </span>
              <span>{displayName}</span>
              <span className='text-xs'>{isProfileMenuOpen ? "⌃" : "⌄"}</span>
            </button>
            {isProfileMenuOpen && (
              <div className='absolute right-0 top-12 z-10 w-68 rounded-2xl bg-[#070C1C] p-4 text-white shadow-xl border border-[#2A2C3D]'>
                <div className='flex items-center gap-3'>
                  <span className='relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#202337] text-xs font-bold overflow-hidden'>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={displayName}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      initials
                    )}
                  </span>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-bold'>
                      {user?.fullName || user?.username || ""}
                    </p>
                    <p className='truncate text-xs text-[#A9A9A9]'>
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                <div
                  className={`mt-4 rounded-xl p-3 ${
                    user?.profileComplete
                      ? "bg-[#0F2A1F]"
                      : "bg-[#211A1A]"
                  }`}
                >
                  {user?.profileComplete ? (
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-bold text-[#22C55E]'>
                        Profile Complete
                      </p>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='#22C55E'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <p className='text-sm font-bold text-[#F08A00]'>
                        Profile incomplete
                      </p>
                      <p className='text-xs text-[#A9A9A9]'>
                        Please complete your profile to enable booking
                      </p>
                    </>
                  )}
                </div>
                <div className='flex flex-col pb-2 mt-3 border-b border-white/10'>
                  <button
                    type='button'
                    onClick={() => navigate("/profile")}
                    className='flex items-center gap-3 py-3 text-sm font-semibold text-left cursor-pointer'
                  >
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                    <span>My Profile</span>
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate("/profile?tickets=1")}
                    className='flex items-center gap-3 py-3 text-sm font-semibold text-left cursor-pointer'
                  >
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' />
                      <path d='M13 5v2' />
                      <path d='M13 17v2' />
                      <path d='M13 11v2' />
                    </svg>
                    <span>My Tickets</span>
                  </button>
                </div>
                <button
                  type='button'
                  onClick={onLogout}
                  className='flex cursor-pointer items-center gap-3 pt-3 text-sm font-semibold text-[#EC3013]'
                >
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                    <polyline points='16 17 21 12 16 7' />
                    <line x1='21' y1='12' x2='9' y2='12' />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className='flex gap-3'>
            <MainButton
              text='Sign Up'
              onClick={() => setIsRegisterModalOpen(true)}
              isRed={true}
            />
            <MainButton
              text='Log in'
              onClick={() => setIsLoginModalOpen(true)}
              isRed={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
