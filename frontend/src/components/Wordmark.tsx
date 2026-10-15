/** Oversized wordmark: letters spread across the full width, baseline cropped by the parent edge. */
export default function Wordmark() {
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className="flex w-full select-none justify-between px-3 font-display font-medium leading-none text-ink" style={{ fontSize: 'min(15.2vw, 260px)', transform: 'translateY(22%)', letterSpacing: '-0.02em' }}>
        {'VISIT FLOW'.split('').map((c, i) => <span key={i}>{c === ' ' ? '\u00A0' : c}</span>)}
      </div>
    </div>
  );
}
