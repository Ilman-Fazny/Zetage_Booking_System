// src/lib/useAvailability.js
import { useState, useEffect, useCallback } from "react";
import api from "./api";

export function useAvailability() {
  const [availability, setAvailability] = useState({ total: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    try {
      const { data } = await api.get("/availability");
      setAvailability(data);
    } catch (err) {
      console.error("Failed to fetch availability", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
    const interval = setInterval(fetchAvailability, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchAvailability]);

  return { availability, loading };
}
