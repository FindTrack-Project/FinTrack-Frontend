import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Api from '../../config/apiConfig';

import mataTutup from '../../assets/mataTutup.svg';
import mataBuka from '../../assets/mataBuka.svg';
import other_pay from '../../assets/other-pay.png';

export const Login = () => {
  const handleLogin = async () => {
  try {
    const response = await Api.post('/auth/login', {
      email,
      password,
    });
    console.log('Login success:', response.data);
    // simpan token atau redirect
  } catch (err) {
    console.error('Login failed:', err.response?.data?.message || err.message);
    setError(err.response?.data?.message || 'Login gagal');
  }
};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isClosed, setIsClosed] = useState(true);
  const [error, setError] = useState('');

  const toggleEye = () => setIsClosed(!isClosed);

  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <form className="w-full max-w-md p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Nice to <span className="text-greenMain">see you</span> again 👋
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Contoh: JohnDoe@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type={isClosed ? 'password' : 'text'}
            required
            placeholder="Masukkan Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute right-3 top-10 cursor-pointer" onClick={toggleEye}>
            <img src={isClosed ? mataTutup : mataBuka} alt="toggle eye" className="w-5" />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:brightness-90 transition"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white mt-6 py-3 rounded-md flex items-center justify-center gap-3 hover:brightness-90 transition"
        >
          <img src={other_pay} alt="Google" className="w-5" />
          <span>Or sign in with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="text-greenMain font-semibold underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
