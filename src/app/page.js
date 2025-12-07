'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      console.log('User found', user);
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (parsedUser.role === 'agent') {
        router.push('/agent/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    }

    const checkAPI = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        const data = await response.json();
        setApiStatus('✅ Connected');
        setApiData(data);
      } catch (error) {
        setApiStatus('❌ Disconnected');
        console.error('API Error:', error);
      }
    };

    checkAPI();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans p-4 md:p-8">
      <main className="flex flex-col items-center justify-center max-w-5xl w-full">
        {/* Logo/Brand */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SmartSupport
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">AI-Powered Customer Support System</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 w-full">
          {/* Project Description */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              🎯 Intelligent Ticketing System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              A modern customer support platform with AI-powered chatbot, real-time ticket management,
              and role-based dashboards. Built for efficiency and powered by cutting-edge AI technology.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              ✨ Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold text-gray-900 dark:text-white">AI Chatbot</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">Intelligent responses with FAQ matching</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎫</div>
                <div className="font-semibold text-gray-900 dark:text-white">Smart Ticketing</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">Priority-based ticket management</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">Real-time performance metrics</div>
              </div>
            </div>
          </div>

          {/* AI Model Info */}
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-center mb-3">
              <span className="text-3xl mr-2">🧠</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Powered by AI
              </h3>
            </div>
            <div className="text-center mb-4">
              <div className="inline-block bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Primary Model</p>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Llama 3.3 70B Versatile
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">via Groq API (Super Fast)</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="font-semibold text-gray-900 dark:text-white">⚡ Speed</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">500+ tokens/sec</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="font-semibold text-gray-900 dark:text-white">🎯 Accuracy</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">High precision responses</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="font-semibold text-gray-900 dark:text-white">💰 Cost</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">Free tier available</div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">
              🛠️ Tech Stack
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <h4 className="text-lg font-semibold mb-3">Frontend</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✓ Next.js 15.5</li>
                  <li>✓ React 19</li>
                  <li>✓ Tailwind CSS</li>
                  <li>✓ shadcn/ui</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
                <h4 className="text-lg font-semibold mb-3">Backend</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✓ Laravel 10</li>
                  <li>✓ MySQL</li>
                  <li>✓ RESTful API</li>
                  <li>✓ Sanctum Auth</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <h4 className="text-lg font-semibold mb-3">AI & Tools</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✓ Groq API</li>
                  <li>✓ Llama 3.3 70B</li>
                  <li>✓ Markdown Support</li>
                  <li>✓ Code Highlighting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Backend API Status</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{apiStatus}</p>
              </div>
              {apiData && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Environment</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{apiData.environment || 'Production'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              🔑 Demo Accounts Available
            </p>
            <div className="grid md:grid-cols-3 gap-2 text-xs">
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <span className="font-semibold">Customer:</span> customer@test.com
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <span className="font-semibold">Agent:</span> agent@test.com
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <span className="font-semibold">Admin:</span> admin@test.com
              </div>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 text-center">
              All passwords: <code className="bg-yellow-100 dark:bg-yellow-900/50 px-2 py-0.5 rounded">password</code>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 text-white font-bold text-lg transition-all hover:shadow-2xl hover:scale-105 transform"
            >
              🚀 Get Started
            </Link>
            <Link
              href="/register"
              className="flex h-14 items-center justify-center rounded-xl border-2 border-indigo-600 dark:border-indigo-400 px-8 font-bold text-lg transition-all hover:bg-indigo-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:scale-105 transform"
            >
              📝 Sign Up Free
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Built with ❤️ for exceptional customer support
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span>⚡ Lightning Fast</span>
            <span>•</span>
            <span>🔒 Secure</span>
            <span>•</span>
            <span>🌐 Cloud Ready</span>
          </div>

          {/* Developer Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
              Developed by
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Azizul Hoque
              </span>
              <a
                href="https://github.com/AzizulBSc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all hover:scale-105 transform"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Full Stack Developer | Laravel & Next.js Specialist
            </p>

            {/* Copilot Premium Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-300 dark:border-purple-700 rounded-lg">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.75 12.22c0-1.5-.68-2.85-1.74-3.75.87-.29 1.5-1.13 1.5-2.11 0-1.24-1-2.25-2.25-2.25h-11.5c-1.24 0-2.25 1.01-2.25 2.25 0 .98.63 1.82 1.5 2.11-1.06.9-1.74 2.25-1.74 3.75 0 1.5.68 2.85 1.74 3.75-.87.29-1.5 1.13-1.5 2.11 0 1.24 1.01 2.25 2.25 2.25h11.5c1.25 0 2.25-1.01 2.25-2.25 0-.98-.63-1.82-1.5-2.11 1.06-.9 1.74-2.25 1.74-3.75zm-14.87-4.85c0-.41.34-.76.76-.76h10.5c.41 0 .76.35.76.76s-.35.76-.76.76h-10.5c-.42 0-.76-.35-.76-.76zm12.38 10.98c0 .41-.35.76-.76.76h-10.5c-.42 0-.76-.35-.76-.76s.34-.76.76-.76h10.5c.41 0 .76.35.76.76zm-1.5-4.88h-9c-.41 0-.75-.34-.75-.75v-2c0-.41.34-.75.75-.75h9c.41 0 .75.34.75.75v2c0 .41-.34.75-.75.75z" />
              </svg>
              <div className="text-left">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  Built with GitHub Copilot Premium
                </p>
                <p className="text-[10px] text-purple-600 dark:text-purple-400">
                  AI-Assisted Development
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
