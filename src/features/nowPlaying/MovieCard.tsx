import { useNavigate } from "react-router";
import { MainButton } from "../../shared/MainButton";
import { Badge } from "../hero/Badge";

export const Moviecard = (props: {
  title: string;
  genre: string;
  fromPrice: number;
  runtimeMinutes: number;
  age: string;
  posterUrl: string;
  slug: string;
}) => {
  const navigate = useNavigate();
  const { title, genre, fromPrice, runtimeMinutes, age, posterUrl, slug } =
    props;
  return (
    <div
      onClick={() => navigate(`/movie/${slug}`)}
      className='text-white w-65 h-113 shrink-0 cursor-pointer bg-[#1E2031] rounded-[20px] flex flex-col items-center p-3'
    >
      <img
        src={posterUrl}
        alt={title}
        className='w-full h-68 shrink-0 object-cover rounded-[14px]'
      />
      <div className='my-2.5 min-h-18 w-full'>
        <h3 className='mb-1.75 line-clamp-2 text-lg font-extrabold'>{title}</h3>
        <span className='mb-1.75 block text-xs text-[#A9A9A9]'>
          {genre} · {runtimeMinutes} min
        </span>
        <Badge isRed={true} text={age} />
      </div>
      <div className='mt-auto flex w-full items-center justify-between gap-2'>
        <span className='text-xs font-semibold'>From ₾ {fromPrice}</span>
        <MainButton
          text='Buy Ticket'
          isRed={true}
          onClick={() => navigate(`/movie/${slug}`)}
        />
      </div>
    </div>
  );
};
