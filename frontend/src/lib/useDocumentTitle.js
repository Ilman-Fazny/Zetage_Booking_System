import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Zentage Talent Show` : "Zentage Talent Show";
  }, [title]);
}
