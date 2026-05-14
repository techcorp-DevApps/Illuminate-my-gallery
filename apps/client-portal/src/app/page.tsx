import { AppShell } from '@illuminate/ui';

const quickActions = ['Review latest proof gallery', 'Approve retouch selections', 'Track booking milestones'];

export default function HomePage() {
  return (
    <AppShell
      title="Client Portal"
      subtitle="A focused workspace where your clients can review galleries, make selections, and stay aligned on delivery timelines without friction."
      badge="Client Experience"
    >
      <h2 style={{ marginTop: 0 }}>Welcome back</h2>
      <p style={{ marginTop: '0.4rem', color: '#334155', lineHeight: 1.65 }}>
        Everything your clients need is organized in one clear flow: review, select, approve, and receive.
      </p>
      <ul style={{ marginBottom: 0, paddingLeft: '1.2rem', color: '#0f172a', lineHeight: 1.8 }}>
        {quickActions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </AppShell>
  );
}
