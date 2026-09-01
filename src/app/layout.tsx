import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CBT SMKS Putra Anda Binjai',
  description: 'Sistem Ujian Online Computer Based Test untuk SMKS Putra Anda Binjai',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
