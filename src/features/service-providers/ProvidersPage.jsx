import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, Clock, Ban, Star, MapPin, Layers, Tag, Phone, Mail, CalendarDays, FileText, ShieldCheck, Check, X } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ROUTES } from '../../constants/routes';

/* Document verification summary, always derived from the provider's documents */
const getVerification = (r) => {
  const docs = r.documents || [];
  const verified = docs.filter((d) => d.status === 'Verified').length;
  const pending = docs.length - verified;
  return { total: docs.length, verified, pending, isVerified: docs.length > 0 && pending === 0 };
};

/* "Verify" shortcut shown only for unverified providers */
function VerifyButton({ r, ctx }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      title="Review & verify documents"
      onClick={() => navigate(ctx.detailPath.replace(':id', r.id))}
      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
    >
      <ShieldCheck size={13} /> Verify
    </button>
  );
}

/* Clean, side panel for technician details & document verification */
function ProviderPanel({ row: r, ctx }) {
  const Row = ({ icon: I, children }) => (
    <p className="flex items-center gap-3 text-xs text-slate-600">
      <I size={15} className="text-slate-400 shrink-0" />
      <span>{children}</span>
    </p>
  );

  const docs = r.documents || [
    { id: 'd1', type: 'National ID (Front & Back)', name: 'QID_Card.pdf', status: r.status === 'Active' ? 'Verified' : 'Pending' },
    { id: 'd2', type: 'Trade Certificate', name: 'Plumbing_Master_Cert.png', status: r.status === 'Active' ? 'Verified' : 'Pending' },
    { id: 'd3', type: 'Experience Letter', name: 'Relieving_Letter.pdf', status: r.status === 'Active' ? 'Verified' : 'Pending' },
    { id: 'd4', type: 'Medical Fitness Certificate', name: 'Medical_Report.pdf', status: 'Verified' },
    { id: 'd5', type: 'Police Clearance (PCC)', name: 'PCC_Clearance.pdf', status: r.status === 'Active' ? 'Verified' : 'Pending' },
  ];

  const handleApproveAll = () => {
    ctx.update(r.id, {
      status: 'Active',
      docVerificationStatus: 'Verified',
      documents: docs.map((d) => ({ ...d, status: 'Verified' })),
    });
  };

  const handleToggleDoc = (docId) => {
    const nextDocs = docs.map((d) => (d.id === docId ? { ...d, status: d.status === 'Verified' ? 'Pending' : 'Verified' } : d));
    const allVerified = nextDocs.every((d) => d.status === 'Verified');
    ctx.update(r.id, {
      documents: nextDocs,
      docVerificationStatus: allVerified ? 'Verified' : 'Under Review',
      status: allVerified ? 'Active' : r.status,
    });
  };

  const isPending = r.status === 'Pending';

  return (
    <div className="space-y-5 text-sm">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar name={r.name} size={56} />
        <div>
          <p className="flex items-center gap-2 font-bold text-slate-900 text-base">
            {r.name}
            <Badge>{r.status}</Badge>
          </p>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{r.profession || r.business}</p>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 mt-1 inline-block">
            {r.id}
          </span>
        </div>
      </div>

      {/* Basic Contact Info */}
      <div className="space-y-2 border-y border-slate-100 py-3.5">
        <Row icon={Phone}>{r.phone}</Row>
        <Row icon={Layers}>{r.service}</Row>
        <Row icon={MapPin}>{r.location}</Row>
        <Row icon={CalendarDays}>Joined on {r.joined}</Row>
      </div>

      {/* Document Verification Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#800000]" />
            Document Verification
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
          >
            {isPending ? 'Under Review' : 'Verified'}
          </span>
        </div>

        <div className="space-y-2">
          {docs.map((doc) => {
            const ok = doc.status === 'Verified';
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs transition hover:bg-white hover:border-slate-200 hover:shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    <FileText size={14} />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{doc.type}</p>
                    <p className="text-[10px] text-slate-400 truncate">{doc.name}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDoc(doc.id)}
                  title={ok ? 'Click to mark Pending' : 'Click to Approve'}
                  className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition ${ok
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-amber-100 text-amber-900 hover:bg-emerald-600 hover:text-white'
                    }`}
                >
                  {ok ? <Check size={12} /> : null}
                  {ok ? 'Verified' : 'Approve'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="pt-2">
        {isPending ? (
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold shadow-xs transition"
            onClick={handleApproveAll}
          >
            <CheckCircle2 size={15} />
            Approve All Documents & Activate
          </button>
        ) : r.status === 'Active' ? (
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 py-2 text-xs font-bold transition"
            onClick={() => ctx.update(r.id, { status: 'Suspended' })}
          >
            <Ban size={14} />
            Suspend Technician
          </button>
        ) : (
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold shadow-xs transition"
            onClick={() => ctx.update(r.id, { status: 'Active' })}
          >
            <CheckCircle2 size={14} />
            Reactivate Technician
          </button>
        )}
      </div>
    </div>
  );
}

export default function Providers() {
  return (
    <ListPage
      title="Service Providers"
      sub="Manage, verify, and monitor all plumbers, electricians, and technicians."
      noun="providers"
      file="providers"
      resource="providers"
      detailPath={ROUTES.PROVIDER_DETAIL}
      panel={ProviderPanel}
      panelTitle="Technician Details"
      searchPh="Search by technician name, profession, phone, or location..."
      searchKeys={['name', 'profession', 'service', 'phone', 'location', 'id']}
      tabs={['Active', 'Pending', 'Suspended']}
      filters={[
        { key: 'service', label: 'All Categories', icon: Layers },
        { key: 'location', label: 'All Locations', icon: MapPin },
        { key: 'status', label: 'All Status', icon: Tag },
      ]}
      add={{
        label: 'Add Provider',
        fields: [
          ['name', 'Technician name'],
          ['profession', 'Profession / Specialty (e.g. Plumber)'],
          ['service', 'Service category'],
          ['phone', 'Phone number'],
          ['location', 'Location'],
        ],
        make: (v) => ({
          ...v,
          id: 'SP-' + (1100 + Math.floor(Math.random() * 900)),
          rating: 5.0,
          reviews: 0,
          joined: formatDate(new Date(), false),
          status: 'Pending',
          business: v.profession,
        }),
      }}
      stats={() => [
        { icon: Users, label: 'Total Technicians', value: '427', change: '+6.3%', tint: 'blue' },
        { icon: CheckCircle2, label: 'Active', value: '384', change: '+8.9%', tint: 'green' },
        { icon: Clock, label: 'Pending Approval', value: '28', change: '-12.5%', tint: 'purple' },
        { icon: Ban, label: 'Suspended', value: '15', change: '+7.1%', tint: 'red' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id}</b> },
        {
          h: 'Technician',
          r: (r) => (
            <span className="flex items-center gap-3">
              <Avatar name={r.name} size={40} />
              <span className="leading-tight">
                <b className="block text-slate-900">{r.name}</b>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {r.rating} ({r.reviews} jobs)
                </span>
              </span>
            </span>
          ),
        },
        {
          h: 'Profession / Trade',
          r: (r) => <span className="font-semibold text-slate-800">{r.profession || r.business}</span>,
        },
        {
          h: 'Category',
          r: (r) => (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold">
              {r.service}
            </span>
          ),
        },
        {
          h: 'Phone',
          r: (r) => <span className="text-xs font-medium text-slate-600">{r.phone}</span>,
        },
        { h: 'Location', r: (r) => r.location },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        {
          h: 'Verification',
          r: (r) => {
            const v = getVerification(r);
            return (
              <span className="flex flex-col items-start gap-1">
                <Badge tone={v.isVerified ? 'green' : 'yellow'}>
                  {v.isVerified ? 'Verified' : 'Not Verified'}
                </Badge>
                <span className="text-[11px] font-medium text-slate-400">
                  {v.total === 0 ? 'No documents' : `${v.verified}/${v.total} docs verified`}
                </span>
              </span>
            );
          },
        },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} edit={false} extra={(row, cx) => !getVerification(row).isVerified && <VerifyButton r={row} ctx={cx} />} /> },
      ]}
    />
  );
}