/** Inline SVG payment brand logos — small and optimized for footer */

export const VisaLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 780 500" className={className} aria-label="Visa">
    <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7zM540.7 159.4c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.2 64.7-.3 28.2 26.5 43.9 46.8 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.6 10.2 59.6 10.5 56.2 0 92.6-26.3 93-66.8.2-22.3-14-39.2-44.6-53.2-18.6-9.1-30-15.1-29.9-24.3 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 30 3.5 39.8 7.5l4.8 2.2 7.2-42.9zM661.6 153h-41.3c-12.8 0-22.4 3.5-28 16.3l-79.4 179.4h56.2l11.2-29.4h68.6l6.5 29.4h49.6l-43.4-195.7zm-65.9 126.3c4.4-11.3 21.5-54.7 21.5-54.7-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47.2 12.5 57.1h-44.7v-.6zM232.8 153l-52.3 133.4-5.6-27.2c-9.7-31.2-39.9-65-73.7-81.9l47.9 171.3 56.6-.1 84.2-195.5h-57.1z" fill="#1a1f71"/>
    <path d="M131.9 153H47.8l-.7 4c67.2 16.2 111.7 55.4 130.1 102.5L158.9 170c-3.2-12.4-12.7-16.5-27-17z" fill="#f7a600"/>
  </svg>
);

export const MastercardLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 780 500" className={className} aria-label="Mastercard">
    <circle cx="312" cy="250" r="150" fill="#eb001b"/>
    <circle cx="468" cy="250" r="150" fill="#f79e1b"/>
    <path d="M390 130.7c-38.6 30.5-63.4 77.7-63.4 130.3s24.8 99.8 63.4 130.3c38.6-30.5 63.4-77.7 63.4-130.3s-24.8-99.8-63.4-130.3z" fill="#ff5f00"/>
  </svg>
);

export const EloLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} aria-label="Elo">
    <circle cx="18" cy="20" r="10" fill="none" stroke="#00a4e0" strokeWidth="4" strokeDasharray="20 43"/>
    <circle cx="18" cy="20" r="10" fill="none" stroke="#ef4123" strokeWidth="4" strokeDasharray="20 43" strokeDashoffset="-21"/>
    <circle cx="18" cy="20" r="10" fill="none" stroke="#ffc72c" strokeWidth="4" strokeDasharray="20 43" strokeDashoffset="-42"/>
    <text x="34" y="26" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="20" fill="currentColor">elo</text>
  </svg>
);

export const PixLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} aria-label="Pix">
    <path d="M20 8l8 8-8 8-8-8z M28 16l8 8-8 8-8-8z M20 24l8 8-8 8-8-8z M12 16l8 8-8 8-8-8z" fill="#32bcad" transform="scale(0.7) translate(4, -2)"/>
    <text x="38" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#32bcad">Pix</text>
  </svg>
);

export const HipercardLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} aria-label="Hipercard">
    <rect x="2" y="6" width="116" height="28" rx="4" fill="#822124" transform="skewX(-5)"/>
    <text x="16" y="26" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="white">Hipercard</text>
  </svg>
);

export const AmexLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} aria-label="American Express">
    <rect width="100" height="40" rx="4" fill="#006fcf"/>
    <text x="50" y="18" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" fill="white">AMERICAN</text>
    <text x="50" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" fill="white">EXPRESS</text>
  </svg>
);

export const BoletoLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} aria-label="Boleto">
    {[8,16,22,30,36,44,50,58,64,72,78,86].map((x, i) => (
      <rect key={i} x={x} y="4" width={i % 3 === 0 ? 4 : 2} height="32" fill="#666" rx="0.5"/>
    ))}
  </svg>
);

export const BrazilFlag = ({ className = "h-5" }: { className?: string }) => (
  <svg viewBox="0 0 30 21" className={className} aria-label="Brasil">
    <rect width="30" height="21" fill="#009b3a" rx="2"/>
    <path d="M15 2.5L27.5 10.5L15 18.5L2.5 10.5Z" fill="#fedf00"/>
    <circle cx="15" cy="10.5" r="5" fill="#002776"/>
    <path d="M10.5 10.5c0-1.2.5-2.3 1.3-3.2 1.5.2 3 .8 4.2 1.8-1.2 1-2.7 1.6-4.2 1.8-.8-.9-1.3-2-1.3-3.2z" fill="none"/>
    <rect x="10" y="9.5" width="10" height="2" fill="#fff" rx="1" opacity="0.3"/>
  </svg>
);
