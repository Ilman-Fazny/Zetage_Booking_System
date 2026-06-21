// src/lib/useSeatMap.js
import { useState, useEffect, useCallback } from "react";
import api from "./api";

export function useSeatMap() {
  const [sections, setSections] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/seats");
      setSections(data);
    } catch (err) {
      setError("Couldn't load the seat map. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  function selectSeat(seat) {
    if (seat.status !== "available") return;
    setSelectedSeat((prev) => (prev?.seat_code === seat.seat_code ? null : seat));
  }

  return { sections, selectedSeat, selectSeat, loading, error, refetch: fetchSeats };
}
