import { useState } from "react";
import { AuthButton } from "../../shared/AuthButton";
import { ModalInput } from "./ModalInput";

export const LoginModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { isOpen, setIsOpen } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (!isOpen) return null;

  const canLogIn = email.trim() !== "" && password.trim() !== "";

  return (
    <div
      onClick={() => setIsOpen(false)}
      className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50 '
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='bg-[#070C1C] w-100 h-100 rounded-[28px] p-8 flex flex-col'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-extrabold text-white'>Log in</h2>
          <button
            onClick={() => setIsOpen(false)}
            className='text-white cursor-pointer'
          >
            X
          </button>
        </div>
        <span className='mt-2 text-[#A9A9A9] text-xs'>
          Welcome back to Kino XII
        </span>
        <div className='flex flex-col gap-6 mt-6'>
          <ModalInput
            type='text'
            label='Email'
            value={email}
            onChange={setEmail}
          />
          <ModalInput
            type='password'
            label='Password'
            value={password}
            onChange={setPassword}
          />
        </div>
        <div className='mt-8'>
          <AuthButton
            disabled={!canLogIn}
            text='Log in'
            onClick={() => {
              console.log("Login attempt", { email, password });
            }}
          />
        </div>
        <div className='flex justify-center mt-6 text-sm leading-1.3'>
          <span className='text-[#A9A9A9] text-sm font-normal '>
            Don't have an account?
          </span>
          <button className='cursor-pointer text-[#EC3013] font-extrabold ml-2'>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
