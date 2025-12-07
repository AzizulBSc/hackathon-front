'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'agent') {
          router.push('/agent/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
    // Auto submit after setting form data
    setTimeout(() => {
      const form = document.querySelector('form');
      form.requestSubmit();
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartSupport
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Quick Login (Click to login with demo accounts):</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => quickLogin('customer@test.com', 'password')}
                className="w-full px-3 py-2 text-left text-sm bg-white dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 rounded-lg transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-200">Customer</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">customer@test.com</div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">Click to login →</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('agent@test.com', 'password')}
                className="w-full px-3 py-2 text-left text-sm bg-white dark:bg-gray-600 hover:bg-green-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 rounded-lg transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span>🎧</span>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-200">Agent</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">agent@test.com</div>
                  </div>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400">Click to login →</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('admin@test.com', 'password')}
                className="w-full px-3 py-2 text-left text-sm bg-white dark:bg-gray-600 hover:bg-purple-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 rounded-lg transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span>⚙️</span>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-200">Admin</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">admin@test.com</div>
                  </div>
                </div>
                <span className="text-xs text-purple-600 dark:text-purple-400">Click to login →</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
