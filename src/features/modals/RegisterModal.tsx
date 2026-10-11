import { useEffect, useState } from "react";
import { AuthButton } from "../../shared/AuthButton";
import { ModalInput } from "./ModalInput";
import uploadIcon from "../../assets/upload.png";
export const RegisterModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onRegister: (
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    avatar: File | null,
  ) => Promise<boolean>;
  onSwitchToLogin: () => void;
  error: string | null;
}) => {
  const { isOpen, setIsOpen, onRegister, onSwitchToLogin, error } = props;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(avatar);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatar]);
  if (!isOpen) return null;

  const canRegister =
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    password === confirmPassword;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50 '
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='bg-[#070C1C] w-143 rounded-[28px] p-10 flex flex-col'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-extrabold text-white'>Sign up</h2>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='text-white cursor-pointer'
          >
            X
          </button>
        </div>
        <span className='mt-2 text-[#A9A9A9] text-xs'>
          Welcome back to Kino XII
        </span>
        <div className='flex items-center gap-4 mt-7'>
          <label
            htmlFor='avatar-upload'
            className='flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#1E2031] text-xl text-[#7F8190]'
          >
            {avatar ? (
              <img
                src={avatarPreview}
                alt='Selected avatar'
                className='object-cover w-full h-full'
              />
            ) : (
              <img src={uploadIcon} alt='' className='w-6 h-6' />
            )}
          </label>
          <input
            id='avatar-upload'
            type='file'
            accept='.jpg,.jpeg,.png,.webp'
            className='hidden'
            onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
          />
          <span className='flex flex-col'>
            <span className='text-lg font-extrabold text-white'>
              Upload avatar <span className='font-normal'>(optional)</span>
            </span>
            <span className='text-sm text-[#A9A9A9]'>
              {avatar?.name || "JPG, PNG or WEBP"}
            </span>
          </span>
        </div>
        <div className='flex flex-col gap-6 mt-8'>
          <ModalInput
            type='text'
            label='Username'
            value={username}
            onChange={setUsername}
            placeholder='User'
            status={username ? "valid" : undefined}
          />
          <ModalInput
            type='text'
            label='Email'
            value={email}
            onChange={setEmail}
            placeholder='example@gmail.com'
            status={email ? "valid" : undefined}
          />
          <div className='grid grid-cols-2 gap-4'>
            <ModalInput
              type='password'
              label='Password'
              value={password}
              onChange={setPassword}
              status={password ? "valid" : undefined}
            />
            <ModalInput
              type='password'
              label='Confirm password'
              value={confirmPassword}
              onChange={setConfirmPassword}
              status={
                confirmPassword
                  ? password === confirmPassword
                    ? "valid"
                    : "error"
                  : undefined
              }
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
            />
          </div>
        </div>
        {error && (
          <p
            role='alert'
            aria-live='polite'
            className='mt-3 text-xs text-[#EC3013]'
          >
            {error}
          </p>
        )}
        <div className='mt-8'>
          <AuthButton
            disabled={!canRegister}
            text='Sign up'
            onClick={async () => {
              const registered = await onRegister(
                username,
                email,
                password,
                confirmPassword,
                avatar,
              );

              if (registered) setIsOpen(false);
            }}
          />
        </div>
        <div className='flex justify-center mt-6 text-sm leading-1.3'>
          <span className='text-[#A9A9A9] text-sm font-normal'>
            Already have an account?
          </span>
          <button
            type='button'
            onClick={onSwitchToLogin}
            className='ml-2 cursor-pointer font-extrabold text-[#EC3013]'
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};
