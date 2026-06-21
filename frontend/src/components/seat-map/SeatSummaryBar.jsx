// src/components/seat-map/SeatSummaryBar.jsx
export default function SeatSummaryBar({ selectedSeat, price, onContinue }) {
  if (!selectedSeat) {
    return (
      <div className="text-sm text-neutral-500 text-center py-3">
        Tap a seat to select it
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="text-sm">
        <span className="font-medium text-neutral-900">{selectedSeat.seat_code}</span>
        <span className="text-neutral-500 ml-2">{selectedSeat.section}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-900">LKR {price.toLocaleString()}</span>
        <button
          onClick={onContinue}
          className="bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-800 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
