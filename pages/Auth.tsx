
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Github, Mail } from 'lucide-react';

interface AuthPageProps {
  type: 'login' | 'signup';
  onAuth: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ type, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Side */}
      <div className="hidden md:flex flex-col justify-center bg-[#fafafa] w-1/2 p-12 lg:p-24">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Organize your work and life, finally.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Become focused, organized, and calm with TaskFlow. The world’s #1 task manager and to-do list app.
          </p>
          <img 
            src="https://picsum.photos/seed/auth/800/600" 
            alt="Productivity" 
            className="rounded-2xl shadow-2xl border border-gray-100"
          />
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-[#db4c3f] rounded flex items-center justify-center text-white font-black text-xl">T</div>
            <span className="text-2xl font-extrabold tracking-tight">TaskFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {type === 'login' ? 'Log in' : 'Sign up'}
          </h2>

          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <hr className="border-gray-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-xs font-bold text-gray-400 uppercase">Or</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-gray-400 outline-none transition-colors"
                  placeholder="Enter your name..."
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-gray-400 outline-none transition-colors"
                placeholder="Enter your email..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                {type === 'login' && (
                  <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">Forgot password?</button>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-gray-400 outline-none transition-colors"
                placeholder="Enter your password..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#db4c3f] hover:bg-[#c53727] text-white font-bold py-3 rounded-md shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
            >
              {type === 'login' ? 'Log in' : 'Sign up with Email'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {type === 'login' ? (
              <>Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
