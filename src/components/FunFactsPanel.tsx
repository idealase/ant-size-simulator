interface Props {
  scaleFactor: number;
}

const FACTS = [
  { maxScale: 2, text: 'At this size, your ant is still within the range of real-world insects. Goliath beetles reach about 12cm.' },
  { maxScale: 10, text: 'Your ant is now the size of a rat. Ants this big existed in the Carboniferous, when O₂ levels were ~35%.' },
  { maxScale: 50, text: 'Your ant is the size of a dog. No arthropod this large has ever existed on land. The exoskeleton is under extreme stress.' },
  { maxScale: 100, text: 'Your ant is human-sized. In the movie "Them!" (1954), ants this big terrorized the American Southwest. Physics says no.' },
  { maxScale: 500, text: 'Your ant is the size of a car. At this scale, the tracheal system failed long ago. This ant is a suffocating sculpture.' },
  { maxScale: Infinity, text: 'Your ant is the size of a building. Every biological system has failed catastrophically. This is a monument to the square-cube law.' },
];

export function FunFactsPanel({ scaleFactor }: Props) {
  const fact = FACTS.find(f => scaleFactor <= f.maxScale) ?? FACTS[FACTS.length - 1];

  return (
    <div className="card">
      <h2>Did You Know?</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {fact.text}
      </p>
    </div>
  );
}
