import { useRef, useEffect } from 'react';
import { simulate } from '../sim';
import type { SimParams } from '../sim';
import { RESPIRATION_THRESHOLD, EXOSKELETON_THRESHOLD, MUSCLE_THRESHOLD, METABOLIC_THRESHOLD } from '../sim/simDefaults';

interface Props {
  params: SimParams;
}

const COLORS = {
  respiration: '#ef4444',
  exoskeleton: '#f97316',
  muscle: '#eab308',
  metabolic: '#3b82f6',
};

export function StressChart({ params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = { top: 10, right: 10, bottom: 25, left: 35 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    // Generate data points on log scale
    const logMin = Math.log10(0.001);
    const logMax = Math.log10(2);
    const n = 100;
    const points: { logSize: number; resp: number; exo: number; musc: number; meta: number }[] = [];

    for (let i = 0; i < n; i++) {
      const logSize = logMin + (logMax - logMin) * (i / (n - 1));
      const bodyLength = Math.pow(10, logSize);
      const out = simulate({ ...params, bodyLength });
      points.push({
        logSize,
        resp: out.respirationCapacity,
        exo: out.exoskeletonCapacity,
        musc: out.muscleCapacity,
        meta: out.metabolicCapacity,
      });
    }

    const xScale = (logSize: number) => pad.left + ((logSize - logMin) / (logMax - logMin)) * pw;
    const yScale = (v: number) => pad.top + ph - Math.min(1, Math.max(0, v)) * ph;

    // Threshold lines
    const thresholds = [
      { val: RESPIRATION_THRESHOLD, color: COLORS.respiration },
      { val: EXOSKELETON_THRESHOLD, color: COLORS.exoskeleton },
      { val: MUSCLE_THRESHOLD, color: COLORS.muscle },
      { val: METABOLIC_THRESHOLD, color: COLORS.metabolic },
    ];
    for (const t of thresholds) {
      ctx.beginPath();
      ctx.moveTo(pad.left, yScale(t.val));
      ctx.lineTo(w - pad.right, yScale(t.val));
      ctx.strokeStyle = t.color;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // Draw lines
    const drawLine = (key: 'resp' | 'exo' | 'musc' | 'meta', color: string) => {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const x = xScale(points[i].logSize);
        const y = yScale(points[i][key]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawLine('resp', COLORS.respiration);
    drawLine('exo', COLORS.exoskeleton);
    drawLine('musc', COLORS.muscle);
    drawLine('meta', COLORS.metabolic);

    // Current size marker
    const currentLogSize = Math.log10(params.bodyLength);
    const cx = xScale(currentLogSize);
    ctx.beginPath();
    ctx.moveTo(cx, pad.top);
    ctx.lineTo(cx, pad.top + ph);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Y-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('1.0', pad.left - 4, pad.top + 4);
    ctx.fillText('0', pad.left - 4, pad.top + ph + 4);

    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText('1mm', xScale(logMin), h - 4);
    ctx.fillText('2m', xScale(logMax), h - 4);
  }, [params]);

  return (
    <div className="card">
      <h2>Capacity Proxies</h2>
      <canvas ref={canvasRef} width={300} height={180} style={{ width: '100%' }} />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.7rem', marginTop: 4 }}>
        <span style={{ color: COLORS.respiration }}>Respiration</span>
        <span style={{ color: COLORS.exoskeleton }}>Exoskeleton</span>
        <span style={{ color: COLORS.muscle }}>Muscle</span>
        <span style={{ color: COLORS.metabolic }}>Metabolic</span>
      </div>
    </div>
  );
}
