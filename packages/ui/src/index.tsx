import React from 'react';

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main style={{ fontFamily: 'sans-serif', margin: '2rem' }}>
      <h1>{title}</h1>
      {children}
    </main>
  );
}
