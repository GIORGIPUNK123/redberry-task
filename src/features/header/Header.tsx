import { useNavigate } from "react-router";
import { Logo } from "../../Logo";
import { MainButton } from "../../shared/MainButton";
import { Search } from "./Search";

export const Header = (props: {
  loggedIn: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
}) => {
  const { loggedIn, setIsLoginModalOpen } = props;
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
        <div className='flex gap-3'>
          <MainButton text='Sign Up' onClick={() => {}} isRed={true} />
          <MainButton
            text='Log in'
            onClick={() => {
              setIsLoginModalOpen(true);
            }}
            isRed={false}
          />
        </div>
      </div>
    </div>
  );
};
