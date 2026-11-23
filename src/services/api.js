import { formatDate } from '../utils/formatDate';

// ---------------- Mock data (used when VITE_USE_MOCK !== 'false') ----------------
const BASE = new Date(2026, 9, 29, 10, 32);
const dt = (i, withTime = true) => formatDate(new Date(BASE.getTime() - i * 14 * 3600 * 1000), withTime);
const day = (i) => dt(i * 2, false);

const P = [
  ['Rohit Sharma', 'Indore, MP'], ['Priya Verma', 'Bhopal, MP'], ['Amit Singh', 'Ujjain, MP'],
  ['Neha Patel', 'Indore, MP'], ['Vikram Rao', 'Dewas, MP'], ['Simran Kaur', 'Indore, MP'],
  ['Karan Mehta', 'Mhow, MP'], ['Pooja Desai', 'Indore, MP'],
];
const BIZ = ['QuickFix Services', 'CleanHome', 'FixIt Pro', 'PowerCare', 'HomeTech', 'BuildRight', 'CoolCare', 'Spark Electricals'];
export const CATS = [
  ['Home Cleaning', 'home', 18], ['AC Repair & Service', 'ac', 12], ['Plumbing', 'plumb', 14], ['Electrical', 'elec', 16],
  ['Appliance Repair', 'appl', 11], ['Carpentry', 'carp', 9], ['Painting', 'paint', 10], ['Car Wash', 'car', 8],
];
const SERV = ['AC Repair', 'Home Cleaning', 'Plumbing', 'Electrical Repair', 'Appliance Repair', 'Carpentry', 'Home Cleaning', 'AC Service'];
const AMT = [499, 799, 599, 699, 1199, 899, 699, 899];
const BST = ['In Progress', 'Completed', 'Scheduled', 'Completed', 'Cancelled', 'Completed', 'In Progress', 'Scheduled'];
const N = 48;
const email = (n) => n.toLowerCase().replace(' ', '.') + '@gmail.com';

export const bookings = Array.from({ length: N }, (_, i) => ({
  id: 'BKG-' + (7843 - i), customer: P[i % 8][0], service: SERV[i % 8],
  provider: '', // Provider initially unassigned; assigned later by admin
  date: dt(i), amount: AMT[i % 8], status: i % 11 === 10 ? 'Refunded' : BST[i % 8],
}));

export function assignBookingProvider(bookingId, providerName) {
  const b = bookings.find((x) => x.id === bookingId);
  if (b) {
    b.provider = providerName;
  }
  return b;
}

export const customers = Array.from({ length: 32 }, (_, i) => {
  const [name, location] = P[i % 8];
  return {
    id: 'CU-' + (3154 - i), name: i < 8 ? name : `${name.split(' ')[0]} ${['Jain', 'Gupta', 'Joshi', 'Nair'][i % 4]}`,
    phone: `+91 9${8000 + i * 137} ${45000 + i * 311}`.slice(0, 15), email: email(name), location,
    joined: day(i), status: i % 8 === 4 ? 'Blocked' : 'Active', bookings: 12 - (i % 9), spent: 7480 - i * 120, rating: 4.8,
  };
});

export const TECHNICIANS_DATA = [
  // Plumbing (Plumbers)
  { id: 'SP-1001', name: 'Ramesh Kumar', profession: 'Senior Plumber', service: 'Plumbing', phone: '+91 98260 12345', rating: 4.9, reviews: 142, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1002', name: 'Imran Khan', profession: 'Plumber & Pipefitter', service: 'Plumbing', phone: '+91 98261 23456', rating: 4.8, reviews: 118, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1003', name: 'Manoj Tiwari', profession: 'Plumbing Specialist', service: 'Plumbing', phone: '+91 98262 34567', rating: 4.7, reviews: 95, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1004', name: 'Arun Mishra', profession: 'Drain & Sanitary Plumber', service: 'Plumbing', phone: '+91 98263 45678', rating: 4.8, reviews: 84, location: 'Ujjain, MP', status: 'Active' },

  // AC Repair & Service (AC Technicians)
  { id: 'SP-1005', name: 'Mohit Verma', profession: 'AC Technician', service: 'AC Repair', phone: '+91 98264 56789', rating: 4.9, reviews: 164, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1006', name: 'Rajesh Gupta', profession: 'HVAC & AC Specialist', service: 'AC Repair', phone: '+91 98265 67890', rating: 4.8, reviews: 132, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1007', name: 'Vinod Rathore', profession: 'AC Installation Tech', service: 'AC Repair', phone: '+91 98266 78901', rating: 4.7, reviews: 98, location: 'Dewas, MP', status: 'Active' },
  { id: 'SP-1008', name: 'Sameer Ali', profession: 'AC Service & Gas Filling Tech', service: 'AC Repair', phone: '+91 98267 89012', rating: 4.6, reviews: 76, location: 'Indore, MP', status: 'Pending' },

  // Electrical Repair (Electricians)
  { id: 'SP-1009', name: 'Suresh Patel', profession: 'Certified Electrician', service: 'Electrical Repair', phone: '+91 98268 90123', rating: 4.9, reviews: 155, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1010', name: 'Amit Chauhan', profession: 'Senior Electrician', service: 'Electrical Repair', phone: '+91 98269 01234', rating: 4.8, reviews: 120, location: 'Ujjain, MP', status: 'Active' },
  { id: 'SP-1011', name: 'Dinesh Sen', profession: 'House Wiring Electrician', service: 'Electrical Repair', phone: '+91 98270 12345', rating: 4.7, reviews: 92, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1012', name: 'Kailash Joshi', profession: 'Electrical Appliance Tech', service: 'Electrical Repair', phone: '+91 98271 23456', rating: 4.8, reviews: 105, location: 'Indore, MP', status: 'Active' },

  // Carpentry (Carpenters)
  { id: 'SP-1013', name: 'Deepak Yadav', profession: 'Furniture & Woodwork Carpenter', service: 'Carpentry', phone: '+91 98272 34567', rating: 4.8, reviews: 110, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1014', name: 'Santosh Maurya', profession: 'Modular Kitchen Carpenter', service: 'Carpentry', phone: '+91 98273 45678', rating: 4.7, reviews: 88, location: 'Mhow, MP', status: 'Active' },
  { id: 'SP-1015', name: 'Babulal Sharma', profession: 'Master Carpenter', service: 'Carpentry', phone: '+91 98274 56789', rating: 4.9, reviews: 145, location: 'Dewas, MP', status: 'Active' },
  { id: 'SP-1016', name: 'Mukesh Panchal', profession: 'Door & Lock Repair Carpenter', service: 'Carpentry', phone: '+91 98275 67890', rating: 4.6, reviews: 72, location: 'Indore, MP', status: 'Pending' },

  // Appliance Repair (Appliance Technicians)
  { id: 'SP-1017', name: 'Vikram Singh', profession: 'Appliance Repair Tech', service: 'Appliance Repair', phone: '+91 98276 78901', rating: 4.8, reviews: 125, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1018', name: 'Kamal Soni', profession: 'Washing Machine & Fridge Tech', service: 'Appliance Repair', phone: '+91 98277 89012', rating: 4.7, reviews: 94, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1019', name: 'Naveen Saxena', profession: 'Microwave & RO Purifier Tech', service: 'Appliance Repair', phone: '+91 98278 90123', rating: 4.6, reviews: 82, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1020', name: 'Pankaj Dubey', profession: 'Geyser & Home Appliance Tech', service: 'Appliance Repair', phone: '+91 98279 01234', rating: 4.8, reviews: 115, location: 'Ujjain, MP', status: 'Active' },

  // Home Cleaning (Cleaning Specialists)
  { id: 'SP-1021', name: 'Sunita Sharma', profession: 'Home Deep Cleaning Specialist', service: 'Home Cleaning', phone: '+91 98280 12345', rating: 4.9, reviews: 175, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1022', name: 'Pooja Nair', profession: 'Kitchen & Bathroom Cleaning Pro', service: 'Home Cleaning', phone: '+91 98281 23456', rating: 4.8, reviews: 130, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1023', name: 'Anita Parmar', profession: 'Sofa & Carpet Cleaning Specialist', service: 'Home Cleaning', phone: '+91 98282 34567', rating: 4.7, reviews: 90, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1024', name: 'Rekha Verma', profession: 'Full House Sanitization Pro', service: 'Home Cleaning', phone: '+91 98283 45678', rating: 4.8, reviews: 112, location: 'Dewas, MP', status: 'Suspended' },

  // Painting (Painters)
  { id: 'SP-1025', name: 'Sunil Joshi', profession: 'House & Interior Painter', service: 'Painting', phone: '+91 98284 56789', rating: 4.8, reviews: 105, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1026', name: 'Gaurav Pandey', profession: 'Waterproofing & Wall Painter', service: 'Painting', phone: '+91 98285 67890', rating: 4.7, reviews: 86, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1027', name: 'Lalit Prajapat', profession: 'Texture & Stencil Wall Expert', service: 'Painting', phone: '+91 98286 78901', rating: 4.9, reviews: 138, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1028', name: 'Harish Chandra', profession: 'Distemper & Enamel Painter', service: 'Painting', phone: '+91 98287 89012', rating: 4.6, reviews: 68, location: 'Ujjain, MP', status: 'Pending' },

  // Car Wash (Car Washers)
  { id: 'SP-1029', name: 'Vijay Dubey', profession: 'Car Detailing & Foam Wash Tech', service: 'Car Wash', phone: '+91 98288 90123', rating: 4.8, reviews: 98, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1030', name: 'Rahul Meena', profession: 'Doorstep Car Wash Specialist', service: 'Car Wash', phone: '+91 98289 01234', rating: 4.7, reviews: 84, location: 'Bhopal, MP', status: 'Active' },
  { id: 'SP-1031', name: 'Sanjay Solanki', profession: 'Interior Vacuum & Polisher', service: 'Car Wash', phone: '+91 98290 12345', rating: 4.8, reviews: 110, location: 'Indore, MP', status: 'Active' },
  { id: 'SP-1032', name: 'Pravin Gehlot', profession: 'Ceramic Coating & Car Washer', service: 'Car Wash', phone: '+91 98291 23456', rating: 4.6, reviews: 65, location: 'Dewas, MP', status: 'Active' },
];

export const getProviderDocuments = (tech) => {
  const isPending = tech.status === 'Pending';
  return [
    {
      id: 'DOC-1',
      type: 'National ID / QID (Front & Back)',
      category: 'Identity',
      name: `${tech.name.replace(/\s+/g, '_')}_National_ID.pdf`,
      size: '2.4 MB',
      uploadDate: 'Nov 18, 2026',
      status: isPending ? 'Pending' : 'Verified',
      issuer: 'Ministry of Interior',
      validUntil: 'Dec 2028',
      fileType: 'pdf',
      notes: 'Front and back side scanned clearly.',
    },
    {
      id: 'DOC-2',
      type: 'Trade License & Technical Certificate',
      category: 'Certification',
      name: `${tech.profession.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Certificate.png`,
      size: '3.1 MB',
      uploadDate: 'Nov 18, 2026',
      status: isPending ? 'Pending' : 'Verified',
      issuer: 'Technical Training & Vocational Board',
      validUntil: 'No Expiry',
      fileType: 'image',
      notes: 'Certified level-4 trade qualification.',
    },
    {
      id: 'DOC-3',
      type: 'Experience Letter & Relieving Proof',
      category: 'Experience',
      name: `${tech.name.replace(/\s+/g, '_')}_Relieving_Experience_Letter.pdf`,
      size: '1.8 MB',
      uploadDate: 'Nov 19, 2026',
      status: isPending ? 'Pending' : 'Verified',
      issuer: 'QuickFix MEP Contracting LLC',
      validUntil: 'Permanent',
      fileType: 'pdf',
      notes: 'Shows 5+ years of relevant field experience with job roles verified.',
    },
    {
      id: 'DOC-4',
      type: 'Medical Fitness Certificate',
      category: 'Health',
      name: `${tech.name.replace(/\s+/g, '_')}_Medical_Fitness_Report.pdf`,
      size: '1.5 MB',
      uploadDate: 'Nov 19, 2026',
      status: isPending ? 'Pending' : 'Verified',
      issuer: 'City Care Diagnostic & Occupational Health Clinic',
      validUntil: 'Nov 2027',
      fileType: 'pdf',
      notes: 'Fit to perform technical manual field operations.',
    },
    {
      id: 'DOC-5',
      type: 'Police Clearance Certificate (PCC)',
      category: 'Background',
      name: `${tech.name.replace(/\s+/g, '_')}_PCC_Verification.pdf`,
      size: '1.2 MB',
      uploadDate: 'Nov 20, 2026',
      status: isPending ? 'Pending' : 'Verified',
      issuer: 'State Police Department / Criminal Investigation Branch',
      validUntil: 'Nov 2027',
      fileType: 'pdf',
      notes: 'No criminal records found, background cleared.',
    },
    {
      id: 'DOC-6',
      type: 'Proof of Residential Address',
      category: 'Address',
      name: `${tech.name.replace(/\s+/g, '_')}_Utility_Bill_Address.jpg`,
      size: '940 KB',
      uploadDate: 'Nov 18, 2026',
      status: 'Verified',
      issuer: 'State Electricity Board',
      validUntil: 'Current Year',
      fileType: 'image',
      notes: 'Electricity bill matching current residential location.',
    },
  ];
};

export const providers = TECHNICIANS_DATA.map((t, i) => {
  const documents = getProviderDocuments(t);
  const pendingDocsCount = documents.filter((d) => d.status === 'Pending').length;
  return {
    ...t,
    joined: day(i * 2 + 1),
    business: t.profession, // Trade/Profession instead of generic company
    email: email(t.name),
    bio: `Certified ${t.profession.toLowerCase()} with 8+ years of residential and commercial maintenance experience. Punctual, verified, and specialized in high-quality workmanship.`,
    documents,
    docVerificationStatus: pendingDocsCount === 0 ? 'Verified' : 'Under Review',
    pendingDocsCount,
    experience: [
      {
        role: t.profession,
        company: 'Apex Facility Solutions & MEP',
        from: '2021',
        to: '2024',
        description: 'Lead maintenance technician responsible for on-site troubleshooting, urgent repairs, system diagnostics, and customer satisfaction.',
        docUploaded: true,
      },
      {
        role: `Junior ${t.service} Technician`,
        company: 'Prime Homecare Services',
        from: '2018',
        to: '2021',
        description: 'Assisted in installation, scheduled servicing, parts replacement, and routine inspection for residential clients.',
        docUploaded: true,
      },
    ],
    certificates: [
      {
        title: `Professional ${t.service} Certification`,
        issuer: 'Vocational Training Council',
        year: '2022',
        verified: true,
      },
      {
        title: 'Safety & Hazard Compliance Standards',
        issuer: 'OSHA / National Safety Institute',
        year: '2023',
        verified: true,
      },
    ],
  };
});

export function verifyProviderDocument(providerId, docId, status, notes = '') {
  const p = providers.find((x) => x.id === providerId);
  if (!p) return null;
  const doc = p.documents?.find((d) => d.id === docId);
  if (doc) {
    doc.status = status;
    if (notes) doc.notes = notes;
    p.pendingDocsCount = p.documents.filter((d) => d.status === 'Pending').length;
    p.docVerificationStatus = p.pendingDocsCount === 0 ? 'Verified' : 'Under Review';
  }
  return p;
}

export function approveAllProviderDocuments(providerId) {
  const p = providers.find((x) => x.id === providerId);
  if (!p) return null;
  p.documents?.forEach((d) => {
    d.status = 'Verified';
  });
  p.pendingDocsCount = 0;
  p.docVerificationStatus = 'Verified';
  p.status = 'Active';
  return p;
}

export const categories = CATS.map(([name, icon, services], i) => ({
  id: 'CAT-' + String(i + 1).padStart(3, '0'), name, icon, services,
  description: `Professional ${name.toLowerCase()} services for homes and offices.`,
  status: i === 6 ? 'Inactive' : 'Active', created: dt(i * 14, false),
}));

export const payments = Array.from({ length: N }, (_, i) => {
  const payout = i % 5 === 4;
  const tech = providers[i % providers.length];
  return {
    id: 'TXN-' + (78421 - i), booking: payout ? 'PYO-' + (2214 - i) : 'BKG-' + (7843 - i),
    party: payout ? tech.name : P[i % 8][0], provider: payout ? '—' : tech.name,
    amount: AMT[i % 8], type: payout ? 'Payout' : 'Payment',
    method: payout ? 'Bank' : ['UPI', 'Card', 'UPI', 'Wallet'][i % 4],
    status: payout ? 'Completed' : 'Successful', date: dt(i),
  };
});

const TXT = ['Excellent service! The technician was punctual and professional.', 'Very professional and thorough cleaning.',
  'Good work, but a bit late.', 'Quick and safe service.', 'Service was good, pricing could be better.',
  'Average experience overall.', 'Very happy with the service!', 'Good service and timely.'];
const RT = [5, 5, 4, 5, 4, 3, 5, 4];
export const reviews = Array.from({ length: 24 }, (_, i) => ({
  id: 'RV-' + (2846 - i), customer: P[i % 8][0], booking: 'BKG-' + (7843 - i), provider: BIZ[i % 8], service: SERV[i % 8],
  rating: RT[i % 8], text: TXT[i % 8], date: day(i), status: i % 8 === 5 ? 'Hidden' : 'Published',
  sentiment: RT[i % 8] >= 4 ? 'Positive' : RT[i % 8] === 3 ? 'Neutral' : 'Negative',
}));

export const tickets = ['Payment not reflected', 'Provider did not arrive', 'Unable to reschedule booking', 'Refund request', 'App crashes on checkout',
  'Wrong service charged', 'Update phone number', 'Provider rude behaviour'].flatMap((subject, i) => [0, 1, 2].map((k) => ({
  id: 'TKT-' + (1200 - i * 3 - k), subject, user: P[(i + k) % 8][0], priority: ['High', 'Medium', 'Low'][(i + k) % 3],
  status: ['Open', 'In Progress', 'Resolved'][(i + k * 2) % 3], date: day(i * 3 + k),
})));

export const trend = Array.from({ length: 30 }, (_, i) => {
  const b = Math.round(70 + i * 3.8 + 30 * Math.sin(i / 2.1));
  return { d: 'Oct ' + (i + 1), bookings: b, revenue: b * 1000 };
});
export const statusSplit = [
  { name: 'Completed', value: 620, color: '#22a559' }, { name: 'In Progress', value: 236, color: '#3b82f6' },
  { name: 'Scheduled', value: 198, color: '#fbbf24' }, { name: 'Cancelled', value: 124, color: '#ef4444' },
  { name: 'Refunded', value: 70, color: '#cbd5e1' },
];
export const topCats = [['Home Cleaning', 28], ['AC Repair & Service', 22], ['Plumbing', 15], ['Electrical', 12], ['Appliance Repair', 8]];

export const mock = { bookings, customers, providers, categories, payments, reviews, tickets, trend, statusSplit, topCats };

// ---------------- API client ----------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(BASE_URL + path, {
    method, headers: { 'Content-Type': 'application/json', ...headers }, body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const api = {
  async list(resource) {
    if (USE_MOCK) { await wait(); return mock[resource].map((r) => ({ ...r })); }
    return request('/' + resource);
  },
  async login(email, password) {
    if (USE_MOCK) {
      await wait(300);
      if (!email || !password) throw new Error('Email and password are required');
      return { name: 'Admin', email };
    }
    return request('/auth/login', { method: 'POST', body: { email, password } });
  },
};
