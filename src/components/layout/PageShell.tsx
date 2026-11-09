export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="shell" tabIndex={-1}>
      {children}
    </main>
  );
}
