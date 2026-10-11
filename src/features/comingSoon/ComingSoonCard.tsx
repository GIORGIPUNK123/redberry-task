import { useNavigate } from "react-router";
import { NotifyButton } from "./NotifyButton";
import { Badge } from "../hero/Badge";

export const ComingSoonCard = (props: {
  title: string;
  genre: string;
  runtimeMinutes: number;
  age: number;
  posterUrl: string;
}) => {
  const navigate = useNavigate();
  const { title, genre, runtimeMinutes, age, posterUrl } = props;
  return (
    <div className='text-white w-117.5 h-40 bg-[#1E2031] rounded-[20px] gap-3.75 flex p-3'>
      <img
        src={posterUrl}
        alt={title}
        className='w-[229px] h-full object-cover rounded-[14px]'
      />
      <div className='flex flex-col justify-between'>
        <div className='flex flex-col'>
          {/* date */}
          <span className='text-[#EC3013] font-semibold text-xs mb-1.75'>
            IN CINEMAS 2 OCTOBER
          </span>
          <h3 className='font-extrabold mb-1.75 text-xs'>{title}</h3>
          <span className='text-[#A9A9A9] text-xs mb-1.75'>
            {genre} · {runtimeMinutes} min
          </span>
          <Badge isRed={true} text={`${age}+`} />
        </div>
        <div className='flex items-center justify-between w-full'>
          {/* notif btn */}
          <NotifyButton
            onClick={() => {
              console.log("notify button clicked");
            }}
          />
        </div>
      </div>
    </div>
  );
};
