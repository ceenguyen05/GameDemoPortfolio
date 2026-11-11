/** The collection's eight-point spark, as SVG so it looks the same on every device. */
export function Spark() {
  return (
    <svg className="spark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
