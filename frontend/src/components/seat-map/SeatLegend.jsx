// src/components/seat-map/SeatLegend.jsx
export default function SeatLegend() {
  const items = [
    { label: "Available", color: "#f8fafc", border: "#cbd5e1", showSlash: false },
    { label: "Selected", color: "#4f46e5", border: "#4338ca", showSlash: false },
    { label: "Booked (Unavailable)", color: "#f3f4f6", border: "#e2e8f0", showSlash: true },
  ];
  return (
    <div className="flex gap-5 text-xs text-neutral-600 py-1">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 select-none">
          <span
            className="relative w-4 h-4 rounded-[4px] border flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: item.color, borderColor: item.border, borderWidth: '0.75px' }}
          >
            {item.showSlash && (
              <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 16 16" fill="none">
                <line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="1" />
              </svg>
            )}
          </span>
          <span className="font-medium text-neutral-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
