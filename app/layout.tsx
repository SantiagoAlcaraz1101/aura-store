import type { Metadata } from 'next';
import { AppShell } from '@/features/common/components/shell';
import './globals.css';
export const metadata: Metadata = { title: 'Aura Store — Tu próximo par favorito', description: 'Sneakers con identidad. Explora la selección de Aura Store y consulta tu próximo par.', icons: { icon: '/assets/images/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" suppressHydrationWarning><body><AppShell>{children}</AppShell></body></html>; }
