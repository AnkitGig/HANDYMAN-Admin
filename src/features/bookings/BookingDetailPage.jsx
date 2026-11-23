import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  User,
  Wrench,
  Building2,
  IndianRupee,
  Clock,
  Wallet,
  Star,
  FileText,
  CreditCard,
  Ban,
  Eye,
  CheckCircle2,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { formatCurrency } from '../../utils/formatCurrency';
import { bookings, customers, payments } from '../../services/api';
import AssignProviderModal from './AssignProviderModal';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find booking
  const [bookingList, setBookingList] = useState(bookings);
  const booking = bookingList.find((b) => b.id === id);

  // Find associated customer
  const matchedCustomer = customers.find((c) => c.name === booking?.customer) || {
    id: 'CU-3154',
    name: booking?.customer || 'Customer',
    phone: '+91 98000 45000',
    email: (booking?.customer?.toLowerCase().replace(' ', '.') || 'customer') + '@gmail.com',
    location: 'Indore, MP',
    joined: 'Oct 29, 2026',
    status: 'Active',
    bookings: 12,
    spent: 7480,
    rating: 4.8,
  };

  const [customerState, setCustomerState] = useState(matchedCustomer);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'In Progress');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'payments'
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-slate-700">Booking Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The booking "{id}" does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/bookings')}>
          ← Back to Bookings
        </Button>
      </div>
    );
  }

  const toggleCustomerBlock = () => {
    setCustomerState((prev) => ({
      ...prev,
      status: prev.status === 'Blocked' ? 'Active' : 'Blocked',
    }));
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    setBookingList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // Associated records
  const customerBookings = bookings.filter((b) => b.customer === booking.customer);
  const customerPayments = payments.filter((p) => p.party === booking.customer);

  const bookingInfo = [
    { icon: Wrench, label: 'Service Booked', value: booking.service },
    {
      icon: Building2,
      label: 'Service Provider',
      value: (
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="font-bold text-slate-800">
            {booking.provider || <span className="text-amber-600 font-semibold italic text-xs">Unassigned</span>}
          </span>
          <button
            type="button"
            onClick={() => setAssignModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50/80 px-2 py-0.5 text-xs font-bold text-brand hover:bg-brand-100 transition shadow-2xs"
          >
            <UserCheck size={12} />
            <span>{booking.provider ? 'Change' : 'Assign'}</span>
          </button>
        </div>
      ),
    },
    { icon: Calendar, label: 'Booking Date & Time', value: booking.date },
    { icon: MapPin, label: 'Service Location', value: `${customerState.location} (Customer Address)` },
  ];

  // Table columns definition
  const bookingColumns = [
    {
      h: '# Booking ID',
      r: (r) => (
        <span className="flex items-center gap-2 font-bold text-slate-800">
          {r.id}
          {r.id === booking.id && (
            <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand uppercase">
              Current
            </span>
          )}
        </span>
      ),
    },
    { h: 'Service', r: (r) => <span className="font-semibold">{r.service}</span> },
    { h: 'Provider', r: (r) => r.provider },
    { h: 'Booking Date', r: (r) => r.date },
    { h: 'Amount', r: (r) => <b className="text-slate-800">{formatCurrency(r.amount)}</b> },
    { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
    {
      h: 'Action',
      r: (r) =>
        r.id !== booking.id ? (
          <button
            onClick={() => navigate(`/bookings/${r.id}`)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand-50 transition"
          >
            <Eye size={14} /> View
          </button>
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">Viewing</span>
        ),
    },
  ];

  const paymentColumns = [
    { h: '# Transaction ID', r: (r) => <span className="font-bold text-slate-800">{r.id}</span> },
    { h: 'Booking Ref', r: (r) => r.booking },
    { h: 'Type', r: (r) => r.type },
    { h: 'Payment Method', r: (r) => <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">{r.method}</span> },
    { h: 'Date', r: (r) => r.date },
    { h: 'Amount', r: (r) => <b className="text-green-600">{formatCurrency(r.amount)}</b> },
    { h: 'Status', r: (r) => <Badge tone="green">{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top back button */}
      <div>
        <button
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={16} /> Back to Bookings
        </button>
      </div>

      <PageHeader
        title={`Booking ${booking.id}`}
        sub={`Manage and track booking details for ${booking.customer}.`}
      />

      {/* ======================================================== */}
      {/* 1. CARD 1 (TOP): BOOKING DETAILS (FULL WIDTH)            */}
      {/* ======================================================== */}
      <Card className="p-6">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Booking Details</h2>
            <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {booking.id}
            </span>
            <Badge>{currentStatus}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50/80 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand-100 transition shadow-2xs"
            >
              <UserCheck size={14} />
              <span>{booking.provider ? 'Change Provider' : 'Assign Provider'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Update Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand"
              >
                {['In Progress', 'Completed', 'Scheduled', 'Cancelled', 'Refunded'].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 items-start">
          {/* Service & Schedule info (8 cols) */}
          <div className="lg:col-span-8 grid gap-3 sm:grid-cols-2">
            {bookingInfo.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-slate-600">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary Box (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment Breakdown
            </h3>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Base Service Fee</span>
              <span className="font-semibold text-slate-800">{formatCurrency(booking.amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Platform Fee & GST</span>
              <span className="font-semibold text-slate-800">QAR 0 (Included)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 pt-2.5 text-base font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span className="text-brand">{formatCurrency(booking.amount)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* 2. CARD 2 (MIDDLE): CUSTOMER DETAILS (FULL WIDTH)        */}
      {/* ======================================================== */}
      <Card className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Customer Details</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {customerState.id}
            </span>
            <button
              onClick={() => navigate(`/customers/${customerState.id}`)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              View Full Profile <ExternalLink size={12} />
            </button>
          </div>

          {/* Block / Unblock Customer Button */}
          <button
            type="button"
            onClick={toggleCustomerBlock}
            className={`btn inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold border transition ${
              customerState.status === 'Blocked'
                ? 'border-green-600 bg-white text-green-700 hover:bg-green-50'
                : 'border-brand-200 bg-white text-red-600 hover:bg-brand-50'
            }`}
          >
            <Ban size={14} />
            {customerState.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
          </button>
        </div>

        {/* Profile + Stats layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Customer Profile Info (lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={customerState.name} size={64} />
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-900">{customerState.name}</h3>
                  <Badge>{customerState.status}</Badge>
                </div>
                <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {customerState.id}
                </span>
              </div>
            </div>

            {/* Contact details grid */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2 text-sm text-slate-600">
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{customerState.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{customerState.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>{customerState.location}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <CalendarDays size={16} className="text-slate-400 shrink-0" />
                <span>Joined on {customerState.joined}</span>
              </p>
            </div>
          </div>

          {/* 3 Stat Cards in a row (lg: 5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <CalendarDays size={22} className="mx-auto text-brand" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{customerState.bookings}</p>
              <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <Wallet size={22} className="mx-auto text-green-600" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">
                {formatCurrency(customerState.spent)}
              </p>
              <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <Star size={22} className="mx-auto text-amber-500" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{customerState.rating}</p>
              <p className="text-xs text-slate-500 font-medium">Avg. Rating</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* 3. CARD 3 (BOTTOM): TABLE WITH DETAILS (FULL WIDTH)      */}
      {/* ======================================================== */}
      <Card className="overflow-hidden">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-6 pt-4 bg-slate-50/40">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} /> Customer's Booking History ({customerBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition ${
              activeTab === 'payments'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard size={16} /> Related Payments ({customerPayments.length})
          </button>
        </div>

        {/* Tab Content Table */}
        <div className="p-2 sm:p-4">
          {activeTab === 'bookings' && (
            <Table
              columns={bookingColumns}
              rows={customerBookings}
              empty={<p className="py-10 text-center text-slate-400">No bookings found.</p>}
            />
          )}

          {activeTab === 'payments' && (
            <Table
              columns={paymentColumns}
              rows={customerPayments}
              empty={<p className="py-10 text-center text-slate-400">No payment records found.</p>}
            />
          )}
        </div>
      </Card>

      {assignModalOpen && (
        <AssignProviderModal
          booking={booking}
          onClose={() => setAssignModalOpen(false)}
          onAssign={(bookingId, newProvider) => {
            setBookingList((prev) =>
              prev.map((b) => (b.id === bookingId ? { ...b, provider: newProvider } : b))
            );
          }}
        />
      )}
    </div>
  );
}
