/**
 * engine.ts — Pure simulation engine.
 *
 * Given a SimParams object, compute all derived outputs including capacity
 * proxies, health scores, viability index, carry capacity, and failure modes.
 *
 * This module has ZERO runtime dependencies on React, DOM, or any UI library.
 * It is fully deterministic: same inputs → same outputs.
 */

import type { SimOutputs, SimParams } from './types';
import {
  BASELINE_CARRY_MULTIPLE,
  HEALTH_FLOOR,
  HEALTH_CEILING,
  VIABILITY_WEIGHTS,
} from './simDefaults';
import { detectFailures, FAILURE_MODES } from './failureModes';

/** Clamp a value between min and max. */
function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/** Convert a capacity proxy to a health score (0-100). */
function proxyToHealth(proxy: number): number {
  return 100 * clamp((proxy - HEALTH_FLOOR) / (HEALTH_CEILING - HEALTH_FLOOR), 0, 1);
}

/**
 * Weighted geometric mean of health scores.
 * Uses floor of 0.001 to avoid log(0).
 */
function weightedGeometricMean(values: number[], weights: number[]): number {
  let logSum = 0;
  for (let i = 0; i < values.length; i++) {
    logSum += weights[i] * Math.log(Math.max(0.001, values[i]));
  }
  return Math.exp(logSum);
}

/**
 * Run one tick of the simulation.
 *
 * @param p - All simulation parameters.
 * @returns Fully computed outputs including health scores and failure info.
 */
export function simulate(p: SimParams): SimOutputs {
  const { pow, max } = Math;

  // ── Scale factor and derived quantities ────────────────────────────────
  const s = p.bodyLength / p.baselineLength;
  const mass = pow(s, 3);
  const surfaceArea = pow(s, 2);

  // ── Capacity proxies ──────────────────────────────────────────────────

  // 1. Tracheal Respiration: diffusion distance grows linearly, O2 demand as s³
  //    Higher O2 fraction compensates proportionally
  const respirationCapacity = (p.o2Fraction / 0.21) * (1 / s);

  // 2. Exoskeleton Structural: square-cube on chitin, gravity worsens it
  const exoskeletonCapacity = 1 / (pow(s, 1.4) * p.gravity);

  // 3. Muscle Force: force∝L², weight∝L³, gravity compounds
  const muscleCapacity = 1 / (s * p.gravity);

  // 4. Metabolic Rate: Kleiber's law mismatch, gravity compounds
  const metabolicCapacity = 1 / (pow(s, 0.75) * p.gravity);

  // ── Health scores (0-100) ─────────────────────────────────────────────
  const respirationHealth = proxyToHealth(respirationCapacity);
  const exoskeletonHealth = proxyToHealth(exoskeletonCapacity);
  const muscleHealth = proxyToHealth(muscleCapacity);
  const metabolicHealth = proxyToHealth(metabolicCapacity);

  // ── Viability index — weighted geometric mean ──────────────────────────
  const viabilityRaw = weightedGeometricMean(
    [respirationHealth, exoskeletonHealth, muscleHealth, metabolicHealth],
    [VIABILITY_WEIGHTS.respiration, VIABILITY_WEIGHTS.exoskeleton, VIABILITY_WEIGHTS.muscle, VIABILITY_WEIGHTS.metabolic],
  );
  const viabilityIndex = clamp(viabilityRaw, 0, 100);

  // ── Ant-specific: carry capacity ──────────────────────────────────────
  const carryCapacityMultiple = max(0, BASELINE_CARRY_MULTIPLE / (s * p.gravity));

  // ── Failure detection ─────────────────────────────────────────────────
  const activeFailures = detectFailures({
    respiration: respirationCapacity,
    exoskeleton: exoskeletonCapacity,
    muscle: muscleCapacity,
    metabolic: metabolicCapacity,
  });

  const failureOrder = Object.keys(FAILURE_MODES);
  let failureMode: string | null = null;
  for (const id of failureOrder) {
    if (activeFailures.includes(id)) {
      failureMode = id;
      break;
    }
  }

  return {
    scaleFactor: s,
    mass,
    surfaceArea,
    respirationCapacity,
    exoskeletonCapacity,
    muscleCapacity,
    metabolicCapacity,
    respirationHealth,
    exoskeletonHealth,
    muscleHealth,
    metabolicHealth,
    viabilityIndex,
    carryCapacityMultiple,
    activeFailures,
    failureMode,
  };
}
