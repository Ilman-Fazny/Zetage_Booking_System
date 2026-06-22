// src/pages/SeatSelectionPage.jsx
import { useNavigate } from "react-router-dom";
import { useSeatMap } from "../lib/useSeatMap";
import TheatreMap from "../components/seat-map/TheatreMap";
import SeatLegend from "../components/seat-map/SeatLegend";
import SeatSummaryBar from "../components/seat-map/SeatSummaryBar";

const EVENT_PRICE = 5000; // LKR — matches backend config.EVENT_PRICE

export default function SeatSelectionPage() {
  const { sections, selectedSeat, selectSeat, loading, error } = useSeatMap();
  const navigate = useNavigate();

  function handleContinue() {
    if (!selectedSeat) return;
    navigate("/details", { state: { seat: selectedSeat } });
  }

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading seat map...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-neutral-900">Select your seat</h1>
          <p className="text-sm text-neutral-500">Zentage Talent Show · September 6, 2026</p>
        </div>

        <div className="mb-3">
          <SeatLegend />
        </div>

        <TheatreMap
          sections={sections}
          selectedSeat={selectedSeat}
          onSelect={selectSeat}
        />

        <div className="mt-3 bg-white border border-neutral-200 rounded-xl px-4">
          <SeatSummaryBar
            selectedSeat={selectedSeat}
            price={EVENT_PRICE}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}
