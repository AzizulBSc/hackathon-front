'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AgentTicketDetail() {
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      const response = await api.get(`/tickets/${params.id}`);
      console.log('Ticket API Response:', response);

      // Handle different response structures
      const ticketData = response.data?.data || response.data;
      console.log('Parsed Ticket Data:', ticketData);

      setTicket(ticketData);
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
      await api.post(`/tickets/${params.id}/reply`, {
        message: reply,
        is_internal: isInternal
      });

      setSuccess('Reply sent successfully!');
      setReply('');
      setIsInternal(false);
      await fetchTicket(); // Refresh ticket data
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/tickets/${params.id}`, { status: newStatus });
      setSuccess('Status updated successfully!');
      await fetchTicket();
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/tickets/${params.id}`, { priority: newPriority });
      setSuccess('Priority updated successfully!');
      await fetchTicket();
    } catch (err) {
      setError('Failed to update priority');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/agent/dashboard')}>
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {ticket.ticket_number}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.subject}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Conversation */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>{ticket.messages?.length || 0} messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${message.is_internal
                        ? 'bg-yellow-50 border border-yellow-200'
                        : message.sender.role === 'customer'
                          ? 'bg-gray-50'
                          : 'bg-blue-50'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {message.sender.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.sender.role}
                          </Badge>
                          {message.is_internal && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Internal Note
                            </Badge>
                          )}
                          {message.is_bot && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              🤖 Bot
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle>Reply to Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReply} className="space-y-4">
                  <Textarea
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                    required
                  />

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Internal Note (only visible to agents)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={sending}>
                      {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReply('')}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{ticket.customer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm">{ticket.customer?.email || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <Select
                    value={ticket.status}
                    onValueChange={handleUpdateStatus}
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Priority</p>
                  <Select
                    value={ticket.priority}
                    onValueChange={handleUpdatePriority}
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm">{formatDate(ticket.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm">{formatDate(ticket.updated_at)}</p>
                </div>

                {ticket.agent && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="text-sm font-medium">{ticket.agent.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleUpdateStatus('in_progress')}
                  disabled={ticket.status === 'in_progress' || updating}
                >
                  Mark In Progress
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={ticket.status === 'resolved' || updating}
                >
                  Mark Resolved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
