import { useNavigate } from 'react-router';

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className='font-extrabold text-xl items-center flex w-fit gap-1.5 cursor-pointer'
      onClick={() => {
        navigate('/');
      }}
    >
      <span className='text-white'>KINO</span>
      <span className='text-[#EC3013]'>XII</span>
    </div>
  );
};
