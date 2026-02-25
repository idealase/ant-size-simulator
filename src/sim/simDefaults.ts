/**
 * simDefaults.ts — All named constants and default parameter values for the
 * Ant Size Simulator.
 *
 * Design rationale:
 * - A real carpenter ant has a body length ~12 mm. We start with these
 *   defaults so the sim begins in a stable state and the user can scale up
 *   until the square-cube law destroys everything.
 * - Every constant is named, typed, and documented here. No magic numbers.
 */

import type { SimParams, SpeciesPreset } from './types';

// ─── Species presets ─────────────────────────────────────────────────────────

export const SPECIES_PRESETS: SpeciesPreset[] = [
  { name: 'Fire Ant', baselineLength: 0.0015 },
  { name: 'Carpenter Ant', baselineLength: 0.012 },
  { name: 'Bullet Ant', baselineLength: 0.025 },
];

// ─── Capacity thresholds ─────────────────────────────────────────────────────

/** Tracheal respiration capacity below this = catastrophic */
export const RESPIRATION_THRESHOLD = 0.30;

/** Exoskeleton capacity below this = catastrophic */
export const EXOSKELETON_THRESHOLD = 0.30;

/** Muscle force capacity below this = hard failure */
export const MUSCLE_THRESHOLD = 0.35;

/** Metabolic rate capacity below this = hard failure */
export const METABOLIC_THRESHOLD = 0.35;

// ─── Baseline ant physiology ─────────────────────────────────────────────────

/** Baseline carry capacity as multiple of body weight */
export const BASELINE_CARRY_MULTIPLE = 50;

// ─── Health conversion constants ─────────────────────────────────────────────

/** Proxy value at which health = 0 */
export const HEALTH_FLOOR = 0.1;

/** Proxy value at which health = 100 */
export const HEALTH_CEILING = 1.0;

// ─── Viability weights (must sum to 1.0) ─────────────────────────────────────

export const VIABILITY_WEIGHTS = {
  respiration: 0.30,
  exoskeleton: 0.30,
  muscle: 0.20,
  metabolic: 0.20,
} as const;

// ─── Default simulation parameters ──────────────────────────────────────────

export const DEFAULT_PARAMS: SimParams = {
  bodyLength: 0.012,
  baselineLength: 0.012,
  o2Fraction: 0.21,
  gravity: 1.0,
};
