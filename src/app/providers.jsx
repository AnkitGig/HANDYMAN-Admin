import { Suspense } from 'react';
import { Loader } from '../components/common/Loader';

// Add global providers here (toasts, query client, theme, ...)
export default function Providers({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
