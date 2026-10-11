import notifyIcon from "../../assets/notify.png";
export const NotifyButton = (props: { onClick: () => void }) => {
  const { onClick } = props;
  return (
    <button
      className={`gap-1 border-[#A9A9A9] border border-solid font-semibold flex rounded-full items-center text-xs text-center justify-center bg-transparent h-7 px-5.5 cursor-pointer`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <img src={notifyIcon} alt='Notify' />
      Notify Me
    </button>
  );
};
