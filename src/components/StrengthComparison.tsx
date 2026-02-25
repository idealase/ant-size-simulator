interface Props {
  carryMultiple: number;
}

export function StrengthComparison({ carryMultiple }: Props) {
  const rounded = Math.max(0, carryMultiple);

  let comparison: string;
  if (rounded >= 50) {
    comparison = 'A human lifting 3 pickup trucks';
  } else if (rounded >= 20) {
    comparison = 'A human lifting a small car';
  } else if (rounded >= 5) {
    comparison = 'A human lifting a refrigerator';
  } else if (rounded >= 1) {
    comparison = 'A human carrying a heavy backpack';
  } else if (rounded >= 0.1) {
    comparison = 'A human struggling to carry a pillow';
  } else {
    comparison = 'Cannot even support its own weight';
  }

  return (
    <div className="card">
      <h2>Strength Comparison</h2>
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: rounded > 1 ? 'var(--success)' : 'var(--danger)' }}>
          {rounded >= 1 ? `${rounded.toFixed(1)}×` : `${rounded.toFixed(2)}×`}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          body weight carry capacity
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-light)', marginTop: 8, fontStyle: 'italic' }}>
          Equivalent to: {comparison}
        </div>
      </div>
    </div>
  );
}
