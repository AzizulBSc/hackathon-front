'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AgentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filter, setFilter] = useState({ status: '', priority: '', search: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'agent') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        api.get('/tickets/stats'),
        api.get('/tickets')
      ]);

      console.log('Stats Response:', statsRes);
      console.log('Tickets Response:', ticketsRes);

      // Handle different response structures
      const statsData = statsRes.data?.data || statsRes.data || {};
      const ticketsData = ticketsRes.data?.data?.data || ticketsRes.data?.data || [];

      console.log('Parsed Stats:', statsData);
      console.log('Parsed Tickets:', ticketsData);

      setStats(statsData);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTickets([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setFilterLoading(true);

      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.search) params.append('search', filter.search);

      const response = await api.get(`/tickets?${params}`);

      console.log('Filtered Tickets Response:', response);

      // Handle Laravel pagination structure: data.data.data
      const ticketsData = response.data?.data?.data || response.data?.data || response.data || [];

      console.log('Parsed Filtered Tickets:', ticketsData);

      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setFilterLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      fetchTickets();
    }, filter.search ? 500 : 0); // 500ms debounce for search, immediate for filters

    return () => clearTimeout(timeoutId);
  }, [filter, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartSupport
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Agent Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">🎧 {user?.role}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Assigned Tickets</CardDescription>
              <CardTitle className="text-3xl">{stats.assigned || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">{stats.in_progress || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved Today</CardDescription>
              <CardTitle className="text-3xl">{stats.resolved_today || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Resolved</CardDescription>
              <CardTitle className="text-3xl">{stats.resolved_total || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ticket Queue</CardTitle>
            <CardDescription>
              Manage and respond to customer tickets
              {tickets.length > 0 && (
                <span className="ml-2 text-blue-600 font-semibold">
                  ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="🔍 Search by subject or customer..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full"
                />

                <Select
                  value={filter.status || "all"}
                  onValueChange={(value) => setFilter({ ...filter, status: value === "all" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">✅ Open</SelectItem>
                    <SelectItem value="in_progress">⏳ In Progress</SelectItem>
                    <SelectItem value="resolved">✔️ Resolved</SelectItem>
                    <SelectItem value="closed">🔒 Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.priority || "all"}
                  onValueChange={(value) => setFilter({ ...filter, priority: value === "all" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🔵 Medium</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display & Reset */}
              {(filter.status || filter.priority || filter.search) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filter.search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: "{filter.search}"
                      <button
                        onClick={() => setFilter({ ...filter, search: '' })}
                        className="ml-1 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {filter.status && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {filter.status}
                      <button
                        onClick={() => setFilter({ ...filter, status: '' })}
                        className="ml-1 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {filter.priority && (
                    <Badge variant="secondary" className="gap-1">
                      Priority: {filter.priority}
                      <button
                        onClick={() => setFilter({ ...filter, priority: '' })}
                        className="ml-1 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter({ status: '', priority: '', search: '' })}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardContent className="p-0">
            {filterLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Filtering...</p>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(tickets) || tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        {filterLoading ? (
                          <span>Loading tickets...</span>
                        ) : (filter.status || filter.priority || filter.search) ? (
                          <div>
                            <p className="text-lg font-semibold">No tickets found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-semibold">No tickets available</p>
                            <p className="text-sm mt-1">Tickets will appear here when assigned</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>{ticket.customer?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(ticket.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/agent/tickets/${ticket.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
