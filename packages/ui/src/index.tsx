import React from 'react';

type AppShellProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
};

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '2.5rem 1.25rem',
    background:
      'radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 40%), radial-gradient(circle at 15% 20%, rgba(217, 70, 239, 0.1), transparent 35%), #f8fafc',
    color: '#0f172a',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
  } as const,
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
  } as const,
  header: {
    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
    color: '#f8fafc',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 16px 32px rgba(15, 23, 42, 0.2)',
    marginBottom: '1.5rem',
  } as const,
  badge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    fontWeight: 700,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '999px',
    padding: '0.35rem 0.7rem',
    marginBottom: '0.8rem',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    lineHeight: 1.1,
    fontWeight: 750,
  } as const,
  subtitle: {
    marginTop: '0.8rem',
    marginBottom: 0,
    color: '#cbd5e1',
    maxWidth: '64ch',
    lineHeight: 1.6,
  } as const,
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(4px)',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
  } as const,
} as const;

export function AppShell({ title, subtitle, badge = 'Illuminate Platform', children }: AppShellProps) {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.badge}>{badge}</div>
          <h1 style={styles.title}>{title}</h1>
          {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
        </header>
        <section style={styles.panel}>{children}</section>
      </div>
    </main>
  );
}
