import { useNavigate } from "react-router";

export const Logo = (props: { small?: boolean }) => {
  const { small } = props;
  const navigate = useNavigate();
  return (
    <div
      className={`font-extrabold ${small ? "text-sm gap-1" : "text-xl gap-1.5"} items-center flex w-fit  cursor-pointer`}
      onClick={() => {
        navigate("/");
      }}
    >
      <span className='text-white'>KINO</span>
      <span className='text-[#EC3013]'>XII</span>
    </div>
  );
};
