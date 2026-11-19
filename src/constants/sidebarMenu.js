import { Home, CalendarDays, UserCog, User, List, CreditCard, Star, Headphones, Settings } from 'lucide-react';
import { ROUTES as R } from './routes';

export const SIDEBAR_MENU = [
  { to: R.DASHBOARD, label: 'Dashboard', icon: Home },
  { to: R.BOOKINGS, label: 'Bookings', icon: CalendarDays, badge: 12 },
  { to: R.PROVIDERS, label: 'Service Providers', icon: UserCog },
  { to: R.CUSTOMERS, label: 'Customers', icon: User },
  { to: R.CATEGORIES, label: 'Categories', icon: List },
  { to: R.PAYMENTS, label: 'Payments', icon: CreditCard },
  { to: R.REVIEWS, label: 'Reviews', icon: Star },
  { to: R.SUPPORT, label: 'Support', icon: Headphones, badge: 3 },
  { to: R.SETTINGS, label: 'Settings', icon: Settings },
];
