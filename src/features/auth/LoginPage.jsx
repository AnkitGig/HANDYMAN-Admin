import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('admin@gts.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await login(email, password); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-extrabold">Welcome back</h1>
      <p className="text-sm text-slate-500">Sign in to manage GTS. (Demo mode: any password works.)</p>
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <Button className="w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</Button>
    </form>
  );
}
