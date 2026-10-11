import { useNavigate } from "react-router";
import { MainButton } from "../../shared/MainButton";
import { Badge } from "../hero/Badge";

export const Moviecard = (props: {
  title: string;
  genre: string;
  fromPrice: number;
  runtimeMinutes: number;
  age: number;
  posterUrl: string;
}) => {
  const navigate = useNavigate();
  const { title, genre, fromPrice, runtimeMinutes, age, posterUrl } = props;
  return (
    <div className='text-white w-65 h-113 bg-[#1E2031] rounded-[20px] flex flex-col items-center p-3'>
      <img
        src={posterUrl}
        alt={title}
        className='w-full h-full object-cover rounded-[14px]'
      />
      <div className='my-2.5 w-full'>
        <h3 className='font-extrabold mb-1.75 text-lg'>{title}</h3>
        <span className='text-[#A9A9A9] text-xs mb-1.75'>
          {genre} · {runtimeMinutes} min
        </span>
        <Badge isRed={true} text={`${age}+`} />
      </div>
      <div className='flex items-center justify-between w-full'>
        <span className='text-xs font-semibold'>From ₾ {fromPrice}</span>
        <MainButton
          text='Buy Ticket'
          isRed={true}
          onClick={() => {
            navigate("movie/gasgasga");
          }}
        />
      </div>
    </div>
  );
};
