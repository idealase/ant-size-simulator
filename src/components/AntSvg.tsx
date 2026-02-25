import type { SimOutputs } from '../sim';

interface Props {
  outputs: SimOutputs;
}

export function AntSvg({ outputs }: Props) {
  const health = outputs.viabilityIndex;
  // Color transitions: green -> yellow -> orange -> red
  const hue = Math.max(0, Math.min(120, (health / 100) * 120));
  const bodyColor = `hsl(${hue}, 70%, 35%)`;
  const legColor = `hsl(${hue}, 60%, 25%)`;

  // Droop factor: legs sag as viability drops
  const droop = Math.max(0, (100 - health) / 100) * 15;

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
      <svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        {/* Legs - 3 pairs */}
        {/* Front pair */}
        <line x1="105" y1="100" x2={70} y2={60 + droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="105" y1="100" x2={70} y2={140 - droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />
        {/* Middle pair */}
        <line x1="150" y1="100" x2={115} y2={50 + droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="150" y1="100" x2={115} y2={150 - droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />
        {/* Rear pair */}
        <line x1="195" y1="100" x2={230} y2={55 + droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="195" y1="100" x2={230} y2={145 - droop} stroke={legColor} strokeWidth="3" strokeLinecap="round" />

        {/* Head */}
        <ellipse cx="85" cy="100" rx="22" ry="18" fill={bodyColor} />
        {/* Mandibles */}
        <line x1="67" y1="92" x2="55" y2="82" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="67" y1="108" x2="55" y2="118" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
        {/* Antennae */}
        <path d="M75 86 Q60 60 45 55" stroke={legColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M80 84 Q70 55 55 45" stroke={legColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="78" cy="94" r="3" fill="#fff" opacity="0.7" />
        <circle cx="78" cy="106" r="3" fill="#fff" opacity="0.7" />

        {/* Thorax */}
        <ellipse cx="125" cy="100" rx="25" ry="20" fill={bodyColor} />
        {/* Petiole (narrow waist) */}
        <ellipse cx="157" cy="100" rx="8" ry="10" fill={bodyColor} />
        {/* Abdomen (gaster) */}
        <ellipse cx="200" cy="100" rx="35" ry="28" fill={bodyColor} />

        {/* Scale indicator */}
        <text x="150" y="185" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
          {outputs.scaleFactor < 10 ? `${outputs.scaleFactor.toFixed(1)}×` : `${Math.round(outputs.scaleFactor)}×`} scale
        </text>
      </svg>
    </div>
  );
}
