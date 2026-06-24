'use client'

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, loginWithGoogle, loginWithGithub, signup, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (error) {
      // Error is handled by the auth context
      console.error('Auth error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
    } catch (error) {
      console.error('Github login error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-sm transition-transform transform">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            disabled={loading}
          />

          <input
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="flex flex-col space-y-3">
          <button
            className="w-full py-3 bg-white border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>

          <button
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 shadow-md hover:shadow-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGithubLogin}
            disabled={loading}
          >
            Continue with Github
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setIsSignUp(!isSignUp)}
            type="button"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
