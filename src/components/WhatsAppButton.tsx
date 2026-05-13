import { waLink } from "@/lib/contact";

export function WhatsAppButton() {
  return (
    <a
      href={waLink("Hi Glam Studio, I'd like to book an appointment.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 md:bottom-6"
      style={{ backgroundColor: "var(--whatsapp)" }}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0012.05 0C5.5 0 .2 5.3.2 11.86a11.79 11.79 0 001.6 5.94L0 24l6.36-1.66a11.86 11.86 0 005.69 1.45h.01c6.55 0 11.85-5.3 11.85-11.86a11.79 11.79 0 00-3.39-8.45zM12.06 21.5a9.62 9.62 0 01-4.9-1.34l-.35-.21-3.78.99 1.01-3.69-.23-.38a9.6 9.6 0 0114.7-12.16 9.5 9.5 0 012.81 6.79c0 5.31-4.32 9.62-9.66 9.62zm5.49-7.2c-.3-.15-1.78-.88-2.05-.98s-.48-.15-.68.15-.78.98-.95 1.18-.35.22-.65.07a7.86 7.86 0 01-2.31-1.43 8.74 8.74 0 01-1.6-2c-.17-.3 0-.46.13-.6s.3-.35.45-.52a2 2 0 00.3-.5.55.55 0 000-.52c-.07-.15-.68-1.63-.93-2.23s-.5-.5-.68-.5h-.58a1.11 1.11 0 00-.8.38 3.36 3.36 0 00-1.05 2.5 5.83 5.83 0 001.22 3.1 13.34 13.34 0 005.1 4.5c.71.3 1.27.48 1.7.62a4.12 4.12 0 001.88.12 3.07 3.07 0 002-1.42 2.5 2.5 0 00.18-1.42c-.07-.13-.27-.2-.57-.35z"/>
      </svg>
    </a>
  );
}
