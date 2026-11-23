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
  XCircle,
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
  Building2,
  Plus,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  providers,
  bookings,
  verifyProviderDocument,
  verifyProviderCertificate,
  addProviderExperience,
  addProviderCertificate,
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
  const [rejectDoc, setRejectDoc] = useState(null); // doc being rejected
  const [reason, setReason] = useState('');
  const [viewDoc, setViewDoc] = useState(null); // doc being previewed
  const [confirm, setConfirm] = useState(null); // { title, message, onYes }
  const [toast, setToast] = useState('');
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'experience' | 'bookings'
  const [expSubTab, setExpSubTab] = useState('experience'); // 'certificates' | 'experience'

  // Modals for adding experience or certificate
  const [addingExp, setAddingExp] = useState(false);
  const [addingCert, setAddingCert] = useState(false);
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    from: '2024',
    to: '2024',
    description: '',
  });
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    year: '2024',
  });

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
  const verifiedCertsCount = certificates.filter((c) => c.verified).length;
  const assignedBookings = bookings.filter((b) => b.provider === provider.name);
  const isPending = provider.status === 'Pending';
  const isActive = provider.status === 'Active';

  const setDocStatus = (doc, status, notes = '') => {
    verifyProviderDocument(provider.id, doc.id, status, notes);
    refresh();
    notify(
      status === 'Verified'
        ? `${doc.type} approved`
        : status === 'Rejected'
          ? `${doc.type} rejected`
          : `${doc.type} moved back to pending`
    );
  };

  const submitReject = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setDocStatus(rejectDoc, 'Rejected', reason.trim());
    setRejectDoc(null);
    setReason('');
  };

  const toggleCert = (index, currentVerified) => {
    verifyProviderCertificate(provider.id, index, !currentVerified);
    refresh();
  };

  const handleSaveExp = (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    addProviderExperience(provider.id, {
      ...newExp,
      docUploaded: true,
      docName: `${newExp.role.replace(/\s+/g, '_')}_Experience_Proof.pdf`,
    });
    setNewExp({ role: '', company: '', from: '2024', to: '2024', description: '' });
    setAddingExp(false);
    refresh();
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) return;
    addProviderCertificate(provider.id, {
      ...newCert,
      verified: true,
      file: `${newCert.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`,
    });
    setNewCert({ title: '', issuer: '', year: '2024' });
    setAddingCert(false);
    refresh();
  };

  const approveAll = () => {
    approveAllProviderDocuments(provider.id);
    refresh();
    notify('All documents approved & provider activated');
  };

  const setStatus = (status) => {
    provider.status = status;
    refresh();
    notify(`Provider marked as ${status}`);
  };

  const ask = (title, message, onYes) => setConfirm({ title, message, onYes });

  const btnBase =
    'inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition';
  const docColumns = [
    {
      h: 'Document',
      r: (d) => (
        <div className="flex min-w-[210px] items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {d.fileType === 'image' ? <FileImage size={18} /> : <FileText size={18} />}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-slate-800">{d.type}</p>
            <p className="max-w-[210px] truncate text-xs text-slate-400" title={d.name}>
              {d.name} · {d.size}
            </p>
          </div>
        </div>
      ),
    },
    {
      h: 'Issued By',
      r: (d) => <span className="block min-w-[130px] max-w-[200px] whitespace-normal text-slate-600">{d.issuer}</span>,
    },
    { h: 'Uploaded', r: (d) => <span className="text-slate-500">{d.uploadDate}</span> },
    { h: 'Valid Until', r: (d) => <span className="text-slate-500">{d.validUntil}</span> },
    {
      h: 'Status',
      r: (d) => (
        <div>
          <Badge>{d.status}</Badge>
          {d.status === 'Rejected' && d.notes && (
            <p className="mt-1 max-w-[160px] whitespace-normal text-[11px] leading-snug text-red-600" title={d.notes}>
              {d.notes}
            </p>
          )}
        </div>
      ),
    },
    {
      h: 'Actions',
      r: (d) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="View document"
            aria-label="View document"
            onClick={() => setViewDoc(d)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <Eye size={14} />
          </button>
          {d.status !== 'Verified' && (
            <button
              type="button"
              onClick={() => setDocStatus(d, 'Verified')}
              className={`${btnBase} bg-emerald-600 text-white shadow-xs hover:bg-emerald-700`}
            >
              <Check size={13} /> Approve
            </button>
          )}
          {d.status === 'Pending' && (
            <button
              type="button"
              onClick={() => {
                setReason('');
                setRejectDoc(d);
              }}
              className={`${btnBase} border border-brand-200 bg-white text-red-600 hover:bg-brand-50`}
            >
              <X size={13} /> Reject
            </button>
          )}
          {d.status !== 'Pending' && (
            <button
              type="button"
              onClick={() => setDocStatus(d, 'Pending')}
              className={`${btnBase} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
            >
              Mark Pending
            </button>
          )}
        </div>
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
          type="button"
          onClick={() => navigate(`/bookings/${b.id}`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand transition hover:bg-brand-50"
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
        title={`Technician: ${provider.name}`}
        sub={`Profile, verification documents, and assigned jobs for ${provider.name}`}
      />

      {/* 1. PROFILE & VERIFICATION CARD */}
      <Card className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">Provider Details</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {provider.id}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={() => ask('Approve all documents?', `This verifies every document & certificate of ${provider.name} and activates the provider.`, approveAll)}
                  className="btn inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
                >
                  <CheckCircle2 size={16} /> Approve All Documents & Activate
                </button>
                <button
                  type="button"
                  onClick={() => ask('Reject provider?', `${provider.name}'s application will be marked as Rejected.`, () => setStatus('Rejected'))}
                  className="btn inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-brand-50 transition"
                >
                  <XCircle size={15} /> Reject
                </button>
              </>
            ) : isActive ? (
              <button
                type="button"
                onClick={() => ask('Suspend provider?', `${provider.name} will not receive any new bookings until reactivated.`, () => setStatus('Suspended'))}
                className="btn inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-brand-50 transition"
              >
                <Ban size={15} /> Suspend Provider
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className="btn inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
              >
                <CheckCircle2 size={16} /> Reactivate Provider
              </button>
            )}
          </div>
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
              <CalendarDays size={22} className="mx-auto text-brand" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{assignedBookings.length}</p>
              <p className="text-xs font-medium text-slate-500">Assigned Jobs</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <ShieldCheck size={22} className="mx-auto text-emerald-600" />
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
            <div className="space-y-6 p-2 sm:p-4">
              {/* Segmented control matching mobile app onboarding flow */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="inline-flex rounded-xl bg-slate-100 p-1.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setExpSubTab('certificates')}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold transition-all ${expSubTab === 'certificates'
                        ? 'bg-brand text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Award size={15} /> Certificates ({verifiedCertsCount}/{certificates.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpSubTab('experience')}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold transition-all ${expSubTab === 'experience'
                        ? 'bg-brand text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Briefcase size={15} /> Experience ({experience.length})
                  </button>
                </div>

                <div>
                  {expSubTab === 'experience' ? (
                    <button
                      type="button"
                      onClick={() => setAddingExp(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                    >
                      <Plus size={15} /> Add Experience
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingCert(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                    >
                      <Plus size={15} /> Add Certificate
                    </button>
                  )}
                </div>
              </div>

              {/* 1. EXPERIENCE TAB */}
              {expSubTab === 'experience' && (
                <div className="space-y-4">
                  {experience.map((e, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                            <Briefcase size={20} />
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h4 className="text-base font-bold text-slate-900">{e.role}</h4>
                              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                {e.from} – {e.to}
                              </span>
                            </div>
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                              <Building2 size={13} className="text-slate-400" />
                              <span>{e.company}</span>
                            </p>
                          </div>
                        </div>

                        {e.docUploaded && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={13} /> Proof Document Attached
                          </span>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50/80 p-3.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Job Responsibilities &amp; Work Summary
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{e.description}</p>
                      </div>

                      {e.docUploaded && e.docName && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <FileText size={14} className="text-slate-400" />
                          <span className="font-medium text-slate-700">{e.docName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">Relieving &amp; Experience Certificate</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {!experience.length && (
                    <div className="py-12 text-center">
                      <Briefcase size={32} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-sm font-semibold text-slate-500">No work experience added yet.</p>
                      <button
                        type="button"
                        onClick={() => setAddingExp(true)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                      >
                        <Plus size={14} /> Add First Experience
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CERTIFICATES TAB */}
              {expSubTab === 'certificates' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {certificates.map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <BadgeCheck size={22} />
                          </span>
                          <Badge tone={c.verified ? 'green' : 'yellow'}>
                            {c.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>

                        <h4 className="mt-3 text-sm font-bold text-slate-900">{c.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">
                          Issued by <span className="font-semibold text-slate-700">{c.issuer}</span> · Year {c.year}
                        </p>

                        {c.file && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            <FileImage size={15} className="text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{c.file}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-3 flex justify-end">
                        {c.verified ? (
                          <button
                            type="button"
                            onClick={() => toggleCert(i, true)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            <X size={13} /> Mark Pending
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleCert(i, false)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                          >
                            <Check size={13} /> Approve Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {!certificates.length && (
                    <div className="col-span-2 py-12 text-center">
                      <Award size={32} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-sm font-semibold text-slate-500">No certificates uploaded yet.</p>
                      <button
                        type="button"
                        onClick={() => setAddingCert(true)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                      >
                        <Plus size={14} /> Add First Certificate
                      </button>
                    </div>
                  )}
                </div>
              )}
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

      {/* MODAL: ADD WORK EXPERIENCE */}
      {addingExp && (
        <Modal title="Add Work Experience" onClose={() => setAddingExp(false)}>
          <form className="space-y-4" onSubmit={handleSaveExp}>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Role / Job Title
              </label>
              <input
                required
                className="field"
                placeholder="e.g. Senior Plumber"
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Company Name
              </label>
              <input
                required
                className="field"
                placeholder="e.g. Apex Facility Solutions LLC"
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  From Year
                </label>
                <input
                  required
                  type="text"
                  className="field"
                  placeholder="2021"
                  value={newExp.from}
                  onChange={(e) => setNewExp({ ...newExp, from: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  To Year
                </label>
                <input
                  required
                  type="text"
                  className="field"
                  placeholder="2024"
                  value={newExp.to}
                  onChange={(e) => setNewExp({ ...newExp, to: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Job Responsibilities &amp; Description
              </label>
              <textarea
                rows={3}
                required
                className="field"
                placeholder="Describe key responsibilities and hands-on expertise..."
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="light" onClick={() => setAddingExp(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Experience</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: ADD CERTIFICATE */}
      {addingCert && (
        <Modal title="Add Professional Certificate" onClose={() => setAddingCert(false)}>
          <form className="space-y-4" onSubmit={handleSaveCert}>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Certificate Title
              </label>
              <input
                required
                className="field"
                placeholder="e.g. Master Plumbing &amp; Pipefitting Certificate"
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Issuing Authority / Organization
              </label>
              <input
                required
                className="field"
                placeholder="e.g. Vocational Training &amp; Technical Council"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Year of Issue
              </label>
              <input
                required
                className="field"
                placeholder="2024"
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="light" onClick={() => setAddingCert(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Certificate</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject document (reason required) */}
      {rejectDoc && (
        <Modal title="Reject document" onClose={() => setRejectDoc(null)}>
          <form onSubmit={submitReject} className="space-y-3">
            <p className="text-sm text-slate-600">
              <b>{rejectDoc.type}</b> will be marked as rejected. The technician will see the reason below.
            </p>
            <textarea
              required
              autoFocus
              rows={3}
              className="field"
              placeholder="Reason for rejection (e.g. Image is blurry, document expired)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="light" onClick={() => setRejectDoc(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!reason.trim()}>
                Reject Document
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View document details */}
      {viewDoc && (
        <Modal title={viewDoc.type} onClose={() => setViewDoc(null)}>
          <div className="space-y-2.5 text-sm">
            {[
              ['File', viewDoc.name],
              ['Size', viewDoc.size],
              ['Category', viewDoc.category],
              ['Issued by', viewDoc.issuer],
              ['Uploaded', viewDoc.uploadDate],
              ['Valid until', viewDoc.validUntil],
              ['Notes', viewDoc.notes || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">{k}</span>
                <span className="break-all text-right font-semibold text-slate-800">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Status</span>
              <Badge>{viewDoc.status}</Badge>
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.onYes();
            setConfirm(null);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-2xl animate-pop">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}
