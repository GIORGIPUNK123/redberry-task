export const ModalInput = (props: {
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (value: string) => void;
}) => {
  const { label, type, value, onChange } = props;
  return (
    <div className='flex flex-col gap-2.5'>
      <label className='text-xs font-semibold text-white'>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event: any) => onChange(event.target.value)}
        className='bg-[#1E2031] text-white placeholder:text-[#A9A9A9] rounded-xl py-2.5 px-4'
        placeholder={label}
      />
    </div>
  );
};
