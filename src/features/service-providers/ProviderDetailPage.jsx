import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  Star,
  Ban,
  CheckCircle2,
  ShieldCheck,
  Award,
  Briefcase,
  FileText,
  FileImage,
  Check,
  X,
  Eye,
  BadgeCheck,
  Wrench,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import {
  providers,
  bookings,
  verifyProviderDocument,
  approveAllProviderDocuments,
} from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const TAB_BASE = 'flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition';
const TAB_ON = 'border-brand text-brand';
const TAB_OFF = 'border-transparent text-slate-500 hover:text-slate-800';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const source = providers.find((p) => p.id === id);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'experience' | 'bookings'

  if (!source) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-slate-500">Service provider not found.</p>
        <button
          onClick={() => navigate('/providers')}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          ← Back to Service Providers
        </button>
      </div>
    );
  }

  const provider = source;
  const docs = provider.documents || [];
  const experience = provider.experience || [];
  const certificates = provider.certificates || [];
  const verifiedCount = docs.filter((d) => d.status === 'Verified').length;
  const assignedBookings = bookings.filter((b) => b.provider === provider.name);
  const isPending = provider.status === 'Pending';
  const isActive = provider.status === 'Active';

  const toggleDoc = (doc) => {
    verifyProviderDocument(provider.id, doc.id, doc.status === 'Verified' ? 'Pending' : 'Verified');
    refresh();
  };

  const approveAll = () => {
    approveAllProviderDocuments(provider.id);
    refresh();
  };

  const setStatus = (status) => {
    provider.status = status;
    refresh();
  };

  const docColumns = [
    {
      h: 'Document',
      r: (d) => (
        <div className="flex items-center gap-3 whitespace-normal">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {d.fileType === 'image' ? <FileImage size={18} /> : <FileText size={18} />}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-slate-800">{d.type}</p>
            <p className="max-w-[260px] truncate text-xs text-slate-400">
              {d.name} · {d.size}
            </p>
          </div>
        </div>
      ),
    },
    { h: 'Issued By', r: (d) => <span className="text-slate-600">{d.issuer}</span> },
    { h: 'Uploaded', r: (d) => <span className="text-slate-500">{d.uploadDate}</span> },
    { h: 'Valid Until', r: (d) => <span className="text-slate-500">{d.validUntil}</span> },
    { h: 'Status', r: (d) => <Badge>{d.status}</Badge> },
    {
      h: 'Action',
      r: (d) =>
        d.status === 'Verified' ? (
          <button
            type="button"
            onClick={() => toggleDoc(d)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <X size={13} /> Mark Pending
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleDoc(d)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
          >
            <Check size={13} /> Approve
          </button>
        ),
    },
  ];

  const bookingColumns = [
    { h: '# Booking ID', r: (b) => <span className="font-bold text-slate-800">{b.id}</span> },
    { h: 'Customer', r: (b) => <span className="font-semibold">{b.customer}</span> },
    { h: 'Service', r: (b) => b.service },
    { h: 'Date', r: (b) => <span className="text-slate-500">{b.date}</span> },
    { h: 'Amount', r: (b) => <b className="text-slate-800">{formatCurrency(b.amount)}</b> },
    { h: 'Status', r: (b) => <Badge>{b.status}</Badge> },
    {
      h: 'Action',
      r: (b) => (
        <button
          onClick={() => navigate(`/bookings/${b.id}`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand transition hover:bg-red-50"
        >
          <Eye size={14} /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/providers')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Back to Service Providers
        </button>
      </div>

      <PageHeader
        title={`Service Provider: ${provider.name}`}
        sub={`Profile, verification documents and job history for ${provider.name}`}
      />

      {/* 1. PROFILE CARD */}
      <Card className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Provider Details</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {provider.id}
            </span>
          </div>

          {isPending ? (
            <button
              type="button"
              onClick={approveAll}
              className="btn rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <CheckCircle2 size={16} /> Approve All &amp; Activate
            </button>
          ) : isActive ? (
            <button
              type="button"
              onClick={() => setStatus('Suspended')}
              className="btn rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <Ban size={15} /> Suspend Provider
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStatus('Active')}
              className="btn rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 size={15} /> Reactivate Provider
            </button>
          )}
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-12">
          {/* Identity + contact */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center gap-4">
              <Avatar name={provider.name} size={64} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-900">{provider.name}</h3>
                  <Badge>{provider.status}</Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                    <Wrench size={14} className="text-slate-400" /> {provider.profession}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{provider.service}</span>
                </p>
              </div>
            </div>

            {provider.bio && (
              <p className="text-sm leading-relaxed text-slate-500">{provider.bio}</p>
            )}

            <div className="grid gap-3 pt-1 text-sm text-slate-600 sm:grid-cols-2">
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-slate-400" />
                <span>{provider.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-slate-400" />
                <span className="truncate">{provider.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="shrink-0 text-slate-400" />
                <span>{provider.location}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <CalendarDays size={16} className="shrink-0 text-slate-400" />
                <span>Registered on {provider.joined}</span>
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 text-center lg:col-span-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <Star size={22} className="mx-auto text-amber-500" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{provider.rating}</p>
              <p className="text-xs font-medium text-slate-500">{provider.reviews} Reviews</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <CalendarDays size={22} className="mx-auto text-red-500" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{assignedBookings.length}</p>
              <p className="text-xs font-medium text-slate-500">Assigned Jobs</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <ShieldCheck size={22} className="mx-auto text-green-600" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">
                {verifiedCount}/{docs.length}
              </p>
              <p className="text-xs font-medium text-slate-500">Docs Verified</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. TABS CARD */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 bg-slate-50/40 px-6 pt-4">
          <button
            onClick={() => setActiveTab('documents')}
            className={`${TAB_BASE} ${activeTab === 'documents' ? TAB_ON : TAB_OFF}`}
          >
            <ShieldCheck size={16} /> Document Verification ({verifiedCount}/{docs.length})
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`${TAB_BASE} ${activeTab === 'experience' ? TAB_ON : TAB_OFF}`}
          >
            <Award size={16} /> Experience &amp; Certificates
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${TAB_BASE} ${activeTab === 'bookings' ? TAB_ON : TAB_OFF}`}
          >
            <CalendarDays size={16} /> Assigned Jobs ({assignedBookings.length})
          </button>
        </div>

        <div className="p-2 sm:p-4">
          {activeTab === 'documents' && (
            <Table
              columns={docColumns}
              rows={docs}
              empty={<p className="py-10 text-center text-slate-400">No documents uploaded.</p>}
            />
          )}

          {activeTab === 'experience' && (
            <div className="grid gap-6 p-2 lg:grid-cols-2">
              {/* Work experience */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Briefcase size={16} className="text-slate-400" /> Work Experience
                </h4>
                <div className="space-y-3">
                  {experience.map((e, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{e.role}</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-500">{e.company}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {e.from} – {e.to}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{e.description}</p>
                      {e.docUploaded && (
                        <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={13} /> Proof document uploaded
                        </p>
                      )}
                    </div>
                  ))}
                  {!experience.length && (
                    <p className="py-6 text-center text-sm text-slate-400">No experience added.</p>
                  )}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Award size={16} className="text-slate-400" /> Certificates
                </h4>
                <div className="space-y-3">
                  {certificates.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <BadgeCheck size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{c.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {c.issuer} · {c.year}
                        </p>
                      </div>
                      <Badge tone={c.verified ? 'green' : 'yellow'}>
                        {c.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                  {!certificates.length && (
                    <p className="py-6 text-center text-sm text-slate-400">No certificates added.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <Table
              columns={bookingColumns}
              rows={assignedBookings}
              empty={<p className="py-10 text-center text-slate-400">No bookings assigned yet.</p>}
            />
          )}
        </div>
      </Card>
    </div>
  );
}