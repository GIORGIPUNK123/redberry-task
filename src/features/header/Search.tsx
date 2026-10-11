import { useState } from "react";
import searchIcon from "../../assets/search.png";

export const Search = () => {
  const [query, setQuery] = useState("");

  return (
    <div className='relative'>
      <img
        src={searchIcon}
        alt=''
        className='absolute -translate-y-1/2 pointer-events-none left-3 top-1/2'
      />
      <input
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label='Search films and live events'
        className='leading-[1.3] h-10.25 w-95 rounded-full bg-white/10 px-3 text-left pl-8 text-sm font-normal'
        placeholder='Search films and live events'
      />
    </div>
  );
};
