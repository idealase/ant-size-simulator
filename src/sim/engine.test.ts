/**
 * engine.test.ts — Unit tests for the ant simulation core.
 */

import { describe, it, expect } from 'vitest';
import { simulate } from './engine';
import { DEFAULT_PARAMS, RESPIRATION_THRESHOLD, EXOSKELETON_THRESHOLD, MUSCLE_THRESHOLD, METABOLIC_THRESHOLD } from './simDefaults';
import type { SimParams } from './types';

/** Helper: clone defaults with overrides */
function params(overrides: Partial<SimParams> = {}): SimParams {
  return { ...DEFAULT_PARAMS, ...overrides };
}

describe('simulate — capacities decrease as size increases', () => {
  const sizes = [0.012, 0.05, 0.1, 0.5, 1.0, 2.0];

  it('respirationCapacity decreases with body length', () => {
    const caps = sizes.map(L => simulate(params({ bodyLength: L })).respirationCapacity);
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('exoskeletonCapacity decreases with body length', () => {
    const caps = sizes.map(L => simulate(params({ bodyLength: L })).exoskeletonCapacity);
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('muscleCapacity decreases with body length', () => {
    const caps = sizes.map(L => simulate(params({ bodyLength: L })).muscleCapacity);
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('metabolicCapacity decreases with body length', () => {
    const caps = sizes.map(L => simulate(params({ bodyLength: L })).metabolicCapacity);
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });
});

describe('simulate — viability bounded [0, 100]', () => {
  it('viability is within [0, 100] for various sizes', () => {
    for (const L of [0.001, 0.01, 0.012, 0.1, 0.5, 1.0, 2.0]) {
      const out = simulate(params({ bodyLength: L }));
      expect(out.viabilityIndex).toBeGreaterThanOrEqual(0);
      expect(out.viabilityIndex).toBeLessThanOrEqual(100);
    }
  });
});

describe('simulate — default params produce stable ant', () => {
  it('all capacities exceed failure thresholds', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.respirationCapacity).toBeGreaterThan(RESPIRATION_THRESHOLD);
    expect(out.exoskeletonCapacity).toBeGreaterThan(EXOSKELETON_THRESHOLD);
    expect(out.muscleCapacity).toBeGreaterThan(MUSCLE_THRESHOLD);
    expect(out.metabolicCapacity).toBeGreaterThan(METABOLIC_THRESHOLD);
  });

  it('no active failures', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.activeFailures).toHaveLength(0);
    expect(out.failureMode).toBeNull();
  });
});

describe('simulate — very large ant triggers failures', () => {
  it('triggers at least one failure at 2m', () => {
    const out = simulate(params({ bodyLength: 2.0 }));
    expect(out.activeFailures.length).toBeGreaterThan(0);
    expect(out.failureMode).not.toBeNull();
  });

  it('viability is very low for large ant', () => {
    const out = simulate(params({ bodyLength: 2.0 }));
    expect(out.viabilityIndex).toBeLessThan(5);
  });
});

describe('simulate — O2 effects on respiration', () => {
  it('higher O2 improves respiration capacity', () => {
    const low = simulate(params({ o2Fraction: 0.15 }));
    const normal = simulate(params({ o2Fraction: 0.21 }));
    const high = simulate(params({ o2Fraction: 0.35 }));
    expect(high.respirationCapacity).toBeGreaterThan(normal.respirationCapacity);
    expect(normal.respirationCapacity).toBeGreaterThan(low.respirationCapacity);
  });
});

describe('simulate — gravity effects', () => {
  it('lower gravity improves all gravity-dependent capacities', () => {
    const earth = simulate(params({ gravity: 1.0 }));
    const moon = simulate(params({ gravity: 0.16 }));
    expect(moon.exoskeletonCapacity).toBeGreaterThan(earth.exoskeletonCapacity);
    expect(moon.muscleCapacity).toBeGreaterThan(earth.muscleCapacity);
    expect(moon.metabolicCapacity).toBeGreaterThan(earth.metabolicCapacity);
  });
});

describe('simulate — carry capacity', () => {
  it('decreases with size', () => {
    const caps = [0.012, 0.05, 0.1, 0.5].map(
      L => simulate(params({ bodyLength: L })).carryCapacityMultiple,
    );
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('baseline ant carries 50x body weight', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.carryCapacityMultiple).toBeCloseTo(50, 1);
  });
});

describe('simulate — golden-case snapshot for default params', () => {
  it('default params produce known outputs', () => {
    const out = simulate(DEFAULT_PARAMS);

    // Scale factor = 0.012 / 0.012 = 1.0
    expect(out.scaleFactor).toBeCloseTo(1.0, 6);

    // All capacities = 1.0 at baseline
    expect(out.respirationCapacity).toBeCloseTo(1.0, 6);
    expect(out.exoskeletonCapacity).toBeCloseTo(1.0, 6);
    expect(out.muscleCapacity).toBeCloseTo(1.0, 6);
    expect(out.metabolicCapacity).toBeCloseTo(1.0, 6);

    // All health scores = 100
    expect(out.respirationHealth).toBeCloseTo(100, 1);
    expect(out.exoskeletonHealth).toBeCloseTo(100, 1);
    expect(out.muscleHealth).toBeCloseTo(100, 1);
    expect(out.metabolicHealth).toBeCloseTo(100, 1);

    // Viability = 100
    expect(out.viabilityIndex).toBeCloseTo(100, 1);

    // Carry capacity = 50
    expect(out.carryCapacityMultiple).toBeCloseTo(50, 1);

    // No failures
    expect(out.activeFailures).toHaveLength(0);
    expect(out.failureMode).toBeNull();
  });
});
