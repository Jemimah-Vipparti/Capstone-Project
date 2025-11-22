export const ChatbotLogo = () => {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robot head */}
      <rect x="16" y="20" width="48" height="36" rx="8" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
      
      {/* Eyes */}
      <circle cx="28" cy="34" r="4" fill="#ffffff"/>
      <circle cx="52" cy="34" r="4" fill="#ffffff"/>
      <circle cx="28" cy="34" r="2" fill="#2563eb"/>
      <circle cx="52" cy="34" r="2" fill="#2563eb"/>
      
      {/* Mouth */}
      <rect x="32" y="44" width="16" height="4" rx="2" fill="#ffffff"/>
      
      {/* Antenna */}
      <line x1="40" y1="20" x2="40" y2="8" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="8" r="3" fill="#ef4444"/>
      
      {/* Body connection */}
      <rect x="36" y="56" width="8" height="8" rx="2" fill="#6b7280"/>
      
      {/* Arms */}
      <rect x="8" y="30" width="8" height="16" rx="4" fill="#6b7280"/>
      <rect x="64" y="30" width="8" height="16" rx="4" fill="#6b7280"/>
      
      {/* Status indicators */}
      <circle cx="60" cy="26" r="2" fill="#10b981"/>
      <circle cx="20" cy="26" r="2" fill="#10b981"/>
      
      {/* Circuit pattern */}
      <path d="M24 48 L28 48 M32 48 L36 48" stroke="#2563eb" strokeWidth="1"/>
      <path d="M44 48 L48 48 M52 48 L56 48" stroke="#2563eb" strokeWidth="1"/>
    </svg>
  );
};