import { MainButton } from "../../shared/MainButton";
import { Badge } from "./Badge";

export const HeroOverlay = (props: {
  heading: string;
  age: number;
  duration: number;
  description: string;
  isPremiere: boolean;
}) => {
  const { heading, age, duration, description, isPremiere } = props;
  return (
    <div className='mt-81.25 ml-16.75 flex flex-col absolute z-2 w-135 '>
      <Badge isRed={isPremiere} text='PREMIERE · WEEK OF 15 SEPT' />
      <h2 className='font-extrabold text-[40px] text-white mt-3.75'>
        {heading}
      </h2>
      <div className={`flex gap-2 ${isPremiere ? "my-3.75" : "mb-3.75"}`}>
        <Badge text={age} isRed={true} />
        <Badge text={duration} />
        <Badge text={duration} />
        <Badge text={duration} />
      </div>
      <p className='font-normal  text-sm text-white leading-[1.3]'>
        {description}
      </p>
      <div className='mt-5 gap-2.5 flex'>
        {/* buttons */}
        <MainButton text='Buy Tickets' onClick={() => {}} isRed={true} />
        <MainButton text='All Sessions' onClick={() => {}} isRed={false} />
      </div>
    </div>
  );
};
