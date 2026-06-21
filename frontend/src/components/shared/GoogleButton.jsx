import { useEffect, useRef } from "react";

export default function GoogleButton({ onCredential }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    let intervalId;

    function initGoogleButton() {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => onCredential(response.credential),
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
        });
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        return true;
      }
      return false;
    }

    const loaded = initGoogleButton();
    if (!loaded) {
      intervalId = setInterval(() => {
        initGoogleButton();
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onCredential]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
