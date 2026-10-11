export const MainButton = (props: {
  text: string;
  onClick: () => void;
  isRed?: boolean;
}) => {
  const { text, onClick, isRed } = props;
  return (
    <button
      className={`flex rounded-full font-extrabold items-center text-center justify-center ${isRed ? "bg-[#EC3013] text-white" : "bg-white text-black"} h-10.25 px-5.5 cursor-pointer`}
      onClick={() => {
        console.log("button clicked");
        onClick();
      }}
    >
      {text}
    </button>
  );
};
