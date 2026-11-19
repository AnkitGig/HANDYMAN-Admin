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
  id: 'BKG-' + (7843 - i), customer: P[i % 8][0], service: SERV[i % 8], provider: BIZ[i % 8],
  date: dt(i), amount: AMT[i % 8], status: i % 11 === 10 ? 'Refunded' : BST[i % 8],
}));

export const customers = Array.from({ length: 32 }, (_, i) => {
  const [name, location] = P[i % 8];
  return {
    id: 'CU-' + (3154 - i), name: i < 8 ? name : `${name.split(' ')[0]} ${['Jain', 'Gupta', 'Joshi', 'Nair'][i % 4]}`,
    phone: `+91 9${8000 + i * 137} ${45000 + i * 311}`.slice(0, 15), email: email(name), location,
    joined: day(i), status: i % 8 === 4 ? 'Blocked' : 'Active', bookings: 12 - (i % 9), spent: 7480 - i * 120, rating: 4.8,
  };
});

export const providers = Array.from({ length: 32 }, (_, i) => ({
  id: 'SP-' + (1045 - i), name: i < 8 ? ['Ravi Sharma', ...P.slice(1).map((p) => p[0])][i] : P[i % 8][0] + ' ' + (i % 4 + 2),
  rating: [4.8, 4.7, 4.6, 4.9, 4.5, 4.8, 4.6, 4.7][i % 8], reviews: 126 - (i % 8) * 7,
  business: BIZ[i % 8], service: SERV[i % 8], location: P[i % 8][1], joined: day(i),
  status: ['Active', 'Active', 'Pending', 'Active', 'Suspended', 'Active', 'Active', 'Pending'][i % 8],
}));

export const categories = CATS.map(([name, icon, services], i) => ({
  id: 'CAT-' + String(i + 1).padStart(3, '0'), name, icon, services,
  description: `Professional ${name.toLowerCase()} services for homes and offices.`,
  status: i === 6 ? 'Inactive' : 'Active', created: dt(i * 14, false),
}));

export const payments = Array.from({ length: N }, (_, i) => {
  const payout = i % 5 === 4;
  return {
    id: 'TXN-' + (78421 - i), booking: payout ? 'PYO-' + (2214 - i) : 'BKG-' + (7843 - i),
    party: payout ? BIZ[i % 8] : P[i % 8][0], provider: payout ? '—' : BIZ[i % 8],
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
