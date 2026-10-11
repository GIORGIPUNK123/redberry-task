export const Badge = (props: { text: string | number; isRed?: boolean }) => {
  const { text, isRed } = props;
  return (
    <div
      className={`w-fit rounded-full py-1.5 px-3 font-semibold text-xs ${isRed ? "bg-[#EC30131A] text-[#EC3013]" : "bg-[#FFFFFF1A] text-white"} `}
    >
      {text}
    </div>
  );
};
