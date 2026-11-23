import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import { ROUTES } from '../constants/routes';

const Login = lazy(() => import('../features/auth/LoginPage'));
const Dashboard = lazy(() => import('../features/dashboard/DashboardPage'));
const Bookings = lazy(() => import('../features/bookings/BookingsPage'));
const BookingDetail = lazy(() => import('../features/bookings/BookingDetailPage'));
const Providers = lazy(() => import('../features/service-providers/ProvidersPage'));
const ProviderDetail = lazy(() => import('../features/service-providers/ProviderDetailPage'));
const Customers = lazy(() => import('../features/customers/CustomersPage'));
const CustomerDetail = lazy(() => import('../features/customers/CustomerDetailPage'));
const Categories = lazy(() => import('../features/categories/CategoriesPage'));
const Payments = lazy(() => import('../features/payments/PaymentsPage'));
const Reviews = lazy(() => import('../features/reviews/ReviewsPage'));
const Support = lazy(() => import('../features/support/SupportPage'));
const Settings = lazy(() => import('../features/settings/SettingsPage'));

export const router = createBrowserRouter([
  { element: <AuthLayout />, children: [{ path: ROUTES.LOGIN, element: <Login /> }] },
  {
    element: <AdminLayout />,
    children: [
      { path: ROUTES.DASHBOARD, element: <Dashboard /> },
      { path: ROUTES.BOOKINGS, element: <Bookings /> },
      { path: ROUTES.BOOKING_DETAIL, element: <BookingDetail /> },
      { path: ROUTES.PROVIDERS, element: <Providers /> },
      { path: ROUTES.PROVIDER_DETAIL, element: <ProviderDetail /> },
      { path: ROUTES.CUSTOMERS, element: <Customers /> },
      { path: ROUTES.CUSTOMER_DETAIL, element: <CustomerDetail /> },
      { path: ROUTES.CATEGORIES, element: <Categories /> },
      { path: ROUTES.PAYMENTS, element: <Payments /> },
      { path: ROUTES.REVIEWS, element: <Reviews /> },
      { path: ROUTES.SUPPORT, element: <Support /> },
      { path: ROUTES.SETTINGS, element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
]);
