import { SPECIES_PRESETS } from '../sim';
import type { SimParams } from '../sim';

interface Props {
  params: SimParams;
  onChange: (p: SimParams) => void;
}

export function Controls({ params, onChange }: Props) {
  const set = (patch: Partial<SimParams>) => onChange({ ...params, ...patch });

  // Log-scale slider for body length: 0.001m to 2m
  const logMin = Math.log10(0.001);
  const logMax = Math.log10(2);
  const logVal = Math.log10(params.bodyLength);

  return (
    <div className="card">
      <h2>Controls</h2>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Species Preset
        <select
          value={params.baselineLength}
          onChange={e => {
            const bl = Number(e.target.value);
            set({ baselineLength: bl, bodyLength: bl });
          }}
          style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.4rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}
        >
          {SPECIES_PRESETS.map(p => (
            <option key={p.name} value={p.baselineLength}>{p.name} ({(p.baselineLength * 1000).toFixed(1)}mm)</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Body Length: {params.bodyLength < 0.01 ? `${(params.bodyLength * 1000).toFixed(1)}mm` : `${params.bodyLength.toFixed(3)}m`}
        <input
          type="range"
          min={logMin}
          max={logMax}
          step={0.01}
          value={logVal}
          onChange={e => set({ bodyLength: Math.pow(10, Number(e.target.value)) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        O₂ Fraction: {(params.o2Fraction * 100).toFixed(0)}%
        <input
          type="range"
          min={0.10}
          max={0.35}
          step={0.01}
          value={params.o2Fraction}
          onChange={e => set({ o2Fraction: Number(e.target.value) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Gravity: {params.gravity.toFixed(2)}g
        <input
          type="range"
          min={0.1}
          max={2.0}
          step={0.01}
          value={params.gravity}
          onChange={e => set({ gravity: Number(e.target.value) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
    </div>
  );
}
