/** Static drawn route: used for mobile, reduced motion and browsers without WebGL. */
export default function SceneFallback() {
  return (
    <svg className="pointer-events-none absolute right-0 top-10 hidden h-[70%] w-[55%] sm:block" viewBox="0 0 500 360" fill="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <line key={`v${i}`} x1={i * 55} y1="0" x2={i * 55} y2="360" stroke="#141C2B" strokeOpacity=".12" />)}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={`h${i}`} x1="0" y1={i * 60} x2="500" y2={i * 60} stroke="#141C2B" strokeOpacity=".12" />)}
      <ellipse cx="220" cy="190" rx="150" ry="95" stroke="#141C2B" strokeOpacity=".2" />
      <ellipse cx="220" cy="190" rx="95" ry="58" stroke="#141C2B" strokeOpacity=".2" />
      <path d="M50 280 C120 240 150 120 220 150 S340 250 440 90" stroke="#2C4A8F" strokeWidth="2.5" strokeDasharray="8 6" />
      {[[50, 280], [150, 170], [220, 150], [330, 230], [440, 90]].map(([x, y], i) => <rect key={i} x={x - 6} y={y - 6} width="12" height="12" fill="#EFE9DD" stroke="#2C4A8F" strokeWidth="2" />)}
    </svg>
  );
}
