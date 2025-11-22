export const PenguinLogo = () => {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Penguin body */}
      <ellipse cx="40" cy="50" rx="18" ry="25" fill="#2c2c2c"/>
      
      {/* Penguin belly */}
      <ellipse cx="40" cy="52" rx="12" ry="18" fill="#ffffff"/>
      
      {/* Penguin head */}
      <circle cx="40" cy="28" r="15" fill="#2c2c2c"/>
      
      {/* Eyes */}
      <circle cx="35" cy="25" r="3" fill="#ffffff"/>
      <circle cx="45" cy="25" r="3" fill="#ffffff"/>
      <circle cx="35" cy="25" r="1.5" fill="#000000"/>
      <circle cx="45" cy="25" r="1.5" fill="#000000"/>
      
      {/* Beak */}
      <path d="M40 30 L37 33 L43 33 Z" fill="#ff8c00"/>
      
      {/* Waving wing (right) */}
      <g transform="rotate(-30 55 45)">
        <ellipse cx="55" cy="45" rx="8" ry="4" fill="#2c2c2c"/>
      </g>
      
      {/* Left wing */}
      <ellipse cx="25" cy="45" rx="6" ry="12" fill="#2c2c2c"/>
      
      {/* Feet */}
      <ellipse cx="33" cy="72" rx="4" ry="2" fill="#ff8c00"/>
      <ellipse cx="47" cy="72" rx="4" ry="2" fill="#ff8c00"/>
      
      {/* Wave motion lines */}
      <path d="M60 35 Q65 30 70 35" stroke="#3b82f6" strokeWidth="2" fill="none"/>
      <path d="M62 40 Q67 35 72 40" stroke="#3b82f6" strokeWidth="2" fill="none"/>
    </svg>
  );
};