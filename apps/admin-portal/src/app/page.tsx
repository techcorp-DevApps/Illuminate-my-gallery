import { AppShell } from '@illuminate/ui';

const operatingAreas = ['Client communications and follow-up', 'Shoot calendar and booking health', 'Delivery pipeline and outstanding tasks'];

export default function HomePage() {
  return (
    <AppShell
      title="Admin Portal"
      subtitle="Operational control center for managing clients, shoots, contracts, and delivery status across the entire studio pipeline."
      badge="Operations"
    >
      <h2 style={{ marginTop: 0 }}>Today&apos;s priorities</h2>
      <p style={{ marginTop: '0.4rem', color: '#334155', lineHeight: 1.65 }}>
        Monitor every production stage with a clean, actionable view built for daily execution.
      </p>
      <ul style={{ marginBottom: 0, paddingLeft: '1.2rem', color: '#0f172a', lineHeight: 1.8 }}>
        {operatingAreas.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>
    </AppShell>
  );
}
