import oddyseyImg from "../../assets/odyssey.png";
import { HeroOverlay } from "./HeroOverlay";
export const Hero = () => {
  return (
    <>
      <div
        className='bg-center bg-cover h-190'
        style={{ backgroundImage: `url(${oddyseyImg})` }}
      >
        <HeroOverlay
          isPremiere={true}
          heading='The Odyssey'
          age={25}
          duration={120}
          description='A king spends ten years finding his way home from a war he already won, while monsters, gods, and his own restlessness make sure the return takes longer than the fighting did. By the time land comes back into view, the man arriving is not quite the one who left'
        />
      </div>
      <div className='h-190 top-0 left-0 w-full absolute z-1 bg-linear-to-r from-[#000000] to-[#0000001A]'></div>
    </>
  );
};
