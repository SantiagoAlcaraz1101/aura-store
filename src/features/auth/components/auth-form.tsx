'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { ApiError, errorMessage } from '../../common/http';
import { Button, Input, Status } from '../../common/components/ui';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const auth = useAuth(); const router = useRouter(); const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const registering = mode === 'register';
  useEffect(() => { if (auth.user) router.replace('/'); }, [auth.user, router]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const values = new FormData(event.currentTarget);
    const input = { name: String(values.get('name') ?? '').trim(), email: String(values.get('email') ?? '').trim(), password: String(values.get('password') ?? '') };
    const fields: Record<string, string> = {};
    if (registering && (input.name.length < 3 || input.name.length > 80)) fields.name = 'Escribe tu nombre entre 3 y 80 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) fields.email = 'Escribe un correo válido.';
    if (!input.password || (registering && input.password.length < 8)) fields.password = registering ? 'Usa al menos 8 caracteres.' : 'Escribe tu contraseña.';
    if (new TextEncoder().encode(input.password).length > 72) fields.password = 'La contraseña no puede superar 72 bytes.';
    setError(''); setErrors(fields);
    if (Object.keys(fields).length) { form.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(fields)[0]}"]`)?.focus(); return; }
    setBusy(true);
    try { if (registering) await auth.register(input); else await auth.login({ email: input.email, password: input.password }); }
    catch (error) { setError(errorMessage(error)); if (error instanceof ApiError) setErrors(error.fields); }
    finally { setBusy(false); }
  }
  return <section className="mx-auto max-w-lg px-5 py-16"><p className="eyebrow">TU PRÓXIMA ROTACIÓN</p><h1 className="mb-4 mt-4 text-5xl font-semibold tracking-tight">{registering ? 'Crea tu cuenta.' : 'Qué bueno verte.'}</h1><p className="mb-8 text-muted">{registering ? 'Guarda tus solicitudes y encuentra tu próximo par.' : 'Ingresa para consultar tus solicitudes y elegir tu próximo par.'}</p>
    <form ref={form} onSubmit={submit} noValidate className="space-y-5 rounded border border-line p-6">
      {registering && <Input id="auth-name" name="name" label="Nombre" autoComplete="name" required maxLength={80} error={errors.name}/>}
      <Input id="auth-email" name="email" label="Correo electrónico" type="email" autoComplete="email" required maxLength={120} error={errors.email}/>
      <Input id="auth-password" name="password" label="Contraseña" type="password" autoComplete={registering ? 'new-password' : 'current-password'} required error={errors.password}/>
      {registering && <p className="text-sm text-muted">Al menos 8 caracteres; máximo 72 bytes. No uses una contraseña personal en esta entrega académica.</p>}
      {error && <Status error>{error}</Status>}<Button type="submit" disabled={busy} className="w-full">{busy ? 'Un momento…' : registering ? 'Crear cuenta' : 'Ingresar'} ↗</Button>
      <p className="text-sm text-muted">{registering ? '¿Ya tienes una cuenta?' : '¿Primera vez aquí?'} <Link className="font-semibold text-ink underline" href={registering ? '/login' : '/registro'}>{registering ? 'Ingresa' : 'Regístrate'}</Link></p>
    </form></section>;
}
