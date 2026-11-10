export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="shell flex-1 focus:outline-none">
      {children}
    </main>
  );
}
