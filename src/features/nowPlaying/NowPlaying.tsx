import { Moviecard } from "./MovieCard";

export const NowPlaying = () => {
  return (
    <div className='mx-17.5 mt-8 relative'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-extrabold text-white '>Now Playing</h1>
        <span className='cursor-pointer text-[#EC3013] text-sm font-semibold z-2'>
          See All
        </span>
      </div>
      <div className='flex flex-nowrap gap-4.25 overflow-x-auto scroll-smooth [width:none] -none [&::-webkit-scrollbar]:hidden'>
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
        <Moviecard
          title='Movie 1'
          genre='Action'
          fromPrice={10}
          runtimeMinutes={120}
          age={18}
          posterUrl='https://react.dev/images/docs/react-devtools-extension.png'
        />
      </div>
      <div className='absolute inset-y-0 right-0 w-full pointer-events-none bg-linear-to-l from-[#070C1C] from-0% to-transparent to-20%'></div>
    </div>
  );
};
