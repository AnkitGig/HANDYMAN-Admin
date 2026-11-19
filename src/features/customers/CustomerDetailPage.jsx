import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Wallet,
  Star,
  FileText,
  CreditCard,
  MessageSquare,
  Ban,
  Eye
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { formatCurrency } from '../../utils/formatCurrency';
import { customers, bookings, payments, reviews } from '../../services/api';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customerData = customers.find((c) => c.id === id);

  const [customer, setCustomer] = useState(
    customerData || {
      id: id || 'CU-3154',
      name: 'Customer',
      phone: '+91 98000 45000',
      email: 'customer@gmail.com',
      location: 'Indore, MP',
      joined: 'Oct 29, 2026',
      status: 'Active',
      bookings: 12,
      spent: 7480,
      rating: 4.8,
    }
  );

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'payments' | 'reviews'

  const toggleBlock = () => {
    setCustomer((prev) => ({
      ...prev,
      status: prev.status === 'Blocked' ? 'Active' : 'Blocked',
    }));
  };

  // Associated records for this customer
  const customerBookings = bookings.filter((b) => b.customer === customer.name);
  const customerPayments = payments.filter((p) => p.party === customer.name);
  const customerReviews = reviews.filter((r) => r.customer === customer.name);

  // Table columns definition
  const bookingColumns = [
    { h: '# Booking ID', r: (r) => <span className="font-bold text-slate-800">{r.id}</span> },
    { h: 'Service', r: (r) => <span className="font-semibold">{r.service}</span> },
    { h: 'Provider', r: (r) => r.provider },
    { h: 'Booking Date', r: (r) => r.date },
    { h: 'Amount', r: (r) => <b className="text-slate-800">{formatCurrency(r.amount)}</b> },
    { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
    {
      h: 'Action',
      r: (r) => (
        <button
          onClick={() => navigate(`/bookings/${r.id}`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand hover:bg-red-50 transition"
        >
          <Eye size={14} /> View
        </button>
      ),
    },
  ];

  const paymentColumns = [
    { h: '# Transaction ID', r: (r) => <span className="font-bold text-slate-800">{r.id}</span> },
    { h: 'Booking ID', r: (r) => r.booking },
    { h: 'Type', r: (r) => r.type },
    { h: 'Method', r: (r) => <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">{r.method}</span> },
    { h: 'Date', r: (r) => r.date },
    { h: 'Amount', r: (r) => <b className="text-green-600">{formatCurrency(r.amount)}</b> },
    { h: 'Status', r: (r) => <Badge tone="green">{r.status}</Badge> },
  ];

  const reviewColumns = [
    { h: 'Service', r: (r) => <span className="font-bold text-slate-800">{r.service}</span> },
    { h: 'Provider', r: (r) => r.provider },
    {
      h: 'Rating',
      r: (r) => (
        <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
          <Star size={14} fill="currentColor" /> {r.rating} / 5
        </span>
      ),
    },
    { h: 'Feedback', r: (r) => <span className="italic text-slate-600 truncate max-w-xs block">"{r.text}"</span> },
    { h: 'Date', r: (r) => r.date },
    { h: 'Status', r: (r) => <Badge tone={r.status === 'Published' ? 'green' : 'gray'}>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={16} /> Back to Customers
        </button>
      </div>

      <PageHeader
        title={`Customer: ${customer.name}`}
        sub={`Profile and complete transaction history for ${customer.name}`}
      />

      {/* 1. UPPER BOX: Customer Details (Full Width Card) */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Customer Details</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {customer.id}
            </span>
          </div>

          {/* Block / Unblock Customer Button */}
          <button
            type="button"
            onClick={toggleBlock}
            className={`btn inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold border transition ${
              customer.status === 'Blocked'
                ? 'border-green-600 bg-white text-green-700 hover:bg-green-50'
                : 'border-red-300 bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            <Ban size={15} />
            {customer.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Customer Profile + Contact Info (lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={customer.name} size={64} />
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
                  <Badge>{customer.status}</Badge>
                </div>
                <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {customer.id}
                </span>
              </div>
            </div>

            {/* Contact details grid */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2 text-sm text-slate-600">
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{customer.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>{customer.location}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <CalendarDays size={16} className="text-slate-400 shrink-0" />
                <span>Joined on {customer.joined}</span>
              </p>
            </div>
          </div>

          {/* 3 Stat Cards in a row (lg: 5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <CalendarDays size={22} className="mx-auto text-red-500" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{customer.bookings}</p>
              <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <Wallet size={22} className="mx-auto text-green-600" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">
                {formatCurrency(customer.spent)}
              </p>
              <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <Star size={22} className="mx-auto text-amber-500" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{customer.rating}</p>
              <p className="text-xs text-slate-500 font-medium">Avg. Rating</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. LOWER BOX: Table jisme baki details (Full Width Card) */}
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
            <FileText size={16} /> Booking History ({customerBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition ${
              activeTab === 'payments'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard size={16} /> Payment History ({customerPayments.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star size={16} /> Reviews ({customerReviews.length})
          </button>
        </div>

        {/* Tab Content Table */}
        <div className="p-2 sm:p-4">
          {activeTab === 'bookings' && (
            <Table
              columns={bookingColumns}
              rows={customerBookings}
              empty={<p className="py-10 text-center text-slate-400">No bookings found for this customer.</p>}
            />
          )}

          {activeTab === 'payments' && (
            <Table
              columns={paymentColumns}
              rows={customerPayments}
              empty={<p className="py-10 text-center text-slate-400">No payment records found.</p>}
            />
          )}

          {activeTab === 'reviews' && (
            <Table
              columns={reviewColumns}
              rows={customerReviews}
              empty={<p className="py-10 text-center text-slate-400">No reviews found.</p>}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
