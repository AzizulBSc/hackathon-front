'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './chatbot-markdown.css';

export default function ChatbotPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: `👋 **Hello! I'm your SmartSupport AI assistant.**

I can help you with:
- Password resets and account issues
- Billing and subscription questions  
- Technical support and troubleshooting
- General inquiries about our services

Type your question below or choose from the quick questions! 🚀`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          message: data.message || 'I apologize, I couldn\'t process that request.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback response
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          message: 'I\'m having trouble connecting right now. Would you like to create a support ticket instead?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        message: 'I\'m experiencing technical difficulties. Please try again or create a support ticket.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How do I reset my password?',
    'What are your support hours?',
    'How do I track my ticket?',
    'Can I cancel my subscription?'
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/customer/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                >
                  {msg.sender === 'bot' ? (
                    <div className="chatbot-markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          // Custom rendering for code blocks
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="bg-gray-700 dark:bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Custom styling for pre (code blocks)
                          pre: ({ node, children, ...props }) => (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg my-3 overflow-x-auto font-mono text-sm" {...props}>
                              {children}
                            </pre>
                          ),
                          // Custom styling for links
                          a: ({ node, ...props }) => (
                            <a className="text-blue-400 hover:text-blue-300 underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                          ),
                          // Custom styling for lists
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside my-2 space-y-1" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="ml-4" {...props} />
                          ),
                          // Custom styling for paragraphs
                          p: ({ node, ...props }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                          ),
                          // Custom styling for headings
                          h1: ({ node, ...props }) => (
                            <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-white" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-base font-bold mt-2 mb-1 text-gray-900 dark:text-white" {...props} />
                          ),
                          // Custom styling for blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-2 text-gray-700 dark:text-gray-300" {...props} />
                          ),
                          // Custom styling for tables
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3">
                              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 px-3 py-2 text-left font-semibold" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2" {...props} />
                          ),
                          // Custom styling for strong/bold
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-gray-900 dark:text-white" {...props} />
                          ),
                          // Custom styling for emphasis/italic
                          em: ({ node, ...props }) => (
                            <em className="italic text-gray-800 dark:text-gray-200" {...props} />
                          ),
                          // Custom styling for horizontal rule
                          hr: ({ node, ...props }) => (
                            <hr className="my-4 border-gray-300 dark:border-gray-600" {...props} />
                          ),
                        }}
                      >
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  )}
                  <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSend} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Can&apos;t find what you&apos;re looking for? <Link href="/customer/dashboard" className="text-blue-600 hover:underline">Create a support ticket</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
