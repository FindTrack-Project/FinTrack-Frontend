import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Api from '../../config/apiConfig';

import mataTutup from '../../assets/mataTutup.svg';
import mataBuka from '../../assets/mataBuka.svg';
import other_pay from '../../assets/other-pay.png';

export const Register = () => {
  const handleRegister = async () => {
  if (password !== confirmPassword) {
    setError('Password dan konfirmasi harus sama');
    return;
  }

  try {
    const response = await Api.post('/auth/register', {
      name,
      email,
      password,
    });
    console.log('Register success:', response.data);
    // redirect ke login
  } catch (err) {
    console.error('Register failed:', err.response?.data?.message || err.message);
    setError(err.response?.data?.message || 'Registrasi gagal');
  }
};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isClosed, setIsClosed] = useState(true);
  const [isConfirmClosed, setIsConfirmClosed] = useState(true);
  const [error, setError] = useState('');

  const togglePassword = () => setIsClosed(!isClosed);
  const toggleConfirmPassword = () => setIsConfirmClosed(!isConfirmClosed);

  return (
    <section>
      <div className="bg-white container-register flex justify-center items-center min-h-screen">
        <div className="lg:w-[30%] w-full px-4">
          <form className="register-container xl:min-w-[380px] lg:min-w-[320px] min-w-full h-auto">
            <h1 className="text-[26px] mb-4 font-bold tracking-[-0.64px] leading-tight">
              Create your <span className="text-greenMain">account</span> 📝
            </h1>

            {/* Name */}
            <div className="input2 flex flex-col mb-6">
              <label htmlFor="name" className="md:text-base text-smallText text-[#5D5D5D] font-semibold">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Contoh: John Doe"
                className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="input2 flex flex-col mb-6">
              <label htmlFor="email" className="md:text-base text-smallText text-[#5D5D5D] font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Contoh: johndoe@gmail.com"
                className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="input2 flex flex-col mb-6 relative">
              <label htmlFor="password" className="md:text-base text-smallText text-[#5D5D5D] font-semibold">
                Password
              </label>
              <input
                id="password"
                type={isClosed ? 'password' : 'text'}
                required
                placeholder="Masukkan Password"
                className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={togglePassword}>
                <img src={isClosed ? mataTutup : mataBuka} alt="toggle" className="w-5" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="input2 flex flex-col mb-6 relative">
              <label htmlFor="confirm-password" className="md:text-base text-smallText text-[#5D5D5D] font-semibold">
                Konfirmasi Password
              </label>
              <input
                id="confirm-password"
                type={isConfirmClosed ? 'password' : 'text'}
                required
                placeholder="Ulangi Password"
                className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={toggleConfirmPassword}>
                <img src={isConfirmClosed ? mataTutup : mataBuka} alt="toggle" className="w-5" />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="wrong-input mt-4 text-center text-red-500">{error}</p>}

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              className="button-register w-full py-3 mt-2 text-white bg-[#333] text-lg font-bold rounded-md hover:brightness-90 transition"
            >
              Daftar
            </button>

            {/* Sign up with Google */}
            <button
              type="button"
              onClick={handleRegister}
              className="button-register w-full py-3 mt-10 text-white bg-[#333] text-base rounded-md hover:brightness-90 flex justify-center items-center gap-3"
            >
              <img src={other_pay} alt="google" />
              <p>Daftar dengan Google</p>
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-stone-500 text-base font-medium">Sudah punya akun? </span>
              <Link to="/login" className="text-greenMain text-base font-bold underline">
                Masuk sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
