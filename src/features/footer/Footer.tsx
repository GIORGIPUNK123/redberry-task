import { Logo } from "../../Logo";
import { Line } from "../../shared/Line";

export const Footer = () => {
  return (
    <footer className='px-8.5 text-white flex flex-col h-24'>
      <Line />
      <div className='flex items-center justify-between mt-5'>
        <Logo small />
        <span className='text-[#A9A9A9] leading-[1.3] text-xs'>
          © 2026 Kino XII. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
