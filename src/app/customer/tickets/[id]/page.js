'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CustomerTicketDetail() {
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Ticket API Response:', data);

        // Handle different response structures
        const ticketData = data.data?.data || data.data;
        console.log('Parsed Ticket Data:', ticketData);

        setTicket(ticketData);
      } else {
        setError('Failed to load ticket');
      }
    } catch (err) {
      setError('Failed to load ticket');
      console.error('Fetch ticket error:', err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: reply
        })
      });

      if (response.ok) {
        setSuccess('Reply sent successfully!');
        setReply('');
        await fetchTicket(); // Refresh ticket data
      } else {
        setError('Failed to send reply');
      }
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/customer/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
            >
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {ticket.ticket_number}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.subject}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Subject</h3>
                  <p className="text-gray-700 dark:text-gray-300">{ticket.subject}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Conversation ({ticket.messages?.length || 0} messages)
              </h2>
              <div className="space-y-4">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages
                    .filter(message => !message.is_internal) // Hide internal notes from customer
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${message.sender?.role === 'customer'
                            ? 'bg-blue-50 border border-blue-200'
                            : message.is_bot
                              ? 'bg-purple-50 border border-purple-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {message.sender?.name || 'System'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${message.sender?.role === 'customer'
                                ? 'bg-blue-100 text-blue-800'
                                : message.is_bot
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                              {message.is_bot ? '🤖 Bot' : message.sender?.role || 'System'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages yet</p>
                )}
              </div>
            </div>

            {/* Reply Form - Only show if ticket is not closed */}
            {ticket.status !== 'closed' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Add Reply</h2>
                <form onSubmit={handleReply} className="space-y-4">
                  <textarea
                    placeholder="Type your message..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReply('')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            )}

            {ticket.status === 'closed' && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  This ticket is closed. You cannot add new replies.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Ticket Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Number</p>
                  <p className="font-mono font-semibold">{ticket.ticket_number}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-sm">{formatDate(ticket.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm">{formatDate(ticket.updated_at)}</p>
                </div>

                {ticket.agent && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Agent</p>
                    <p className="text-sm font-medium">{ticket.agent.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Chat with our AI assistant for instant answers!
              </p>
              <Link
                href="/customer/chatbot"
                className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                💬 Chat with AI
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
