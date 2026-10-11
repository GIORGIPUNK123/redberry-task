import { useNavigate } from "react-router";
import { NotifyButton } from "./NotifyButton";
import { Badge } from "../hero/Badge";

export const ComingSoonCard = (props: {
  title: string;
  genre: string;
  runtimeMinutes: number;
  age: string;
  posterUrl: string;
  releaseDate: string;
  slug: string;
}) => {
  const { title, genre, runtimeMinutes, age, posterUrl, releaseDate, slug } =
    props;
  const navigate = useNavigate();
  const formattedReleaseDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  }).format(new Date(releaseDate));
  return (
    <div
      onClick={() => navigate(`/movie/${slug}`)}
      className='text-white w-117.5 h-40 shrink-0 cursor-pointer overflow-hidden rounded-[20px] bg-[#1E2031] gap-3.75 flex p-3'
    >
      <img
        src={posterUrl}
        alt={title}
        className='w-57.25 h-full shrink-0 object-cover rounded-[14px]'
      />
      <div className='flex h-full min-w-0 flex-1 flex-col justify-between'>
        <div className='flex flex-col'>
          {/* date */}
          <span className='text-[#EC3013] font-semibold text-xs mb-1.75'>
            IN CINEMAS {formattedReleaseDate.toUpperCase()}
          </span>
          <h3 className='mb-1.75 line-clamp-2 text-xs font-extrabold'>
            {title}
          </h3>
          <span className='mb-1.75 text-xs text-[#A9A9A9]'>
            {genre} · {runtimeMinutes} min
          </span>
          <Badge isRed={true} text={age} />
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
