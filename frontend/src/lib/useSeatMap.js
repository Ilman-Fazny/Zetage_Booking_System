// src/lib/useSeatMap.js
import { useState, useEffect, useCallback } from "react";
import api from "./api";

export function useSeatMap() {
  const [sections, setSections] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSeats = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    if (!isPolling) setError("");
    try {
      const { data } = await api.get("/seats");
      setSections(data);
    } catch (err) {
      if (!isPolling) setError("Couldn't load the seat map. Please refresh.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(() => fetchSeats(true), 5000);
    return () => clearInterval(interval);
  }, [fetchSeats]);

  function selectSeat(seat) {
    if (seat.status !== "available") return;
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seat_code === seat.seat_code);
      if (exists) return prev.filter((s) => s.seat_code !== seat.seat_code);
      return [...prev, seat];
    });
  }

  function clearSelection() {
    setSelectedSeats([]);
  }

  return { sections, selectedSeats, selectSeat, clearSelection, loading, error, refetch: fetchSeats };
}
