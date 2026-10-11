import type { ChangeEvent } from "react";

export const ModalInput = (props: {
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  status?: "valid" | "error";
  error?: string;
}) => {
  const { label, type, value, onChange, placeholder, status, error } = props;
  return (
    <div className='flex flex-col gap-2'>
      <label
        className={`text-xs font-semibold ${status === "error" ? "text-[#EC3013]" : "text-white"}`}
      >
        {label}
      </label>
      <div className='relative'>
        <input
          type={type}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          className={`w-full rounded-xl bg-[#1E2031] py-2.5 pl-4 pr-10 text-white placeholder:text-[#A9A9A9] outline-none ${status === "error" ? "border border-[#EC3013]" : "border border-transparent"}`}
          placeholder={placeholder ?? label}
        />
        {status && value && (
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${status === "error" ? "text-[#EC3013]" : "text-[#35D58B]"}`}
          >
            {status === "error" ? "!" : "✓"}
          </span>
        )}
      </div>
      {error && (
        <span className='text-xs font-semibold text-[#EC3013]'>{error}</span>
      )}
    </div>
  );
};
