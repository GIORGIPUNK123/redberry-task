export const AuthButton = (props: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const { text, onClick, disabled } = props;
  return (
    <button
      type='button'
      disabled={disabled}
      className={`w-full flex rounded-full font-extrabold items-center text-center justify-center ${disabled ? "bg-[#505261] text-[#A9A9A9] cursor-not-allowed" : "bg-[#EC3013] text-white cursor-pointer"} h-10.25 px-5.5 `}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
