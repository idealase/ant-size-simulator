/**
 * types.ts — Shared types for the Ant Size Simulator.
 *
 * These types are intentionally free of React / DOM concerns so the sim
 * module stays portable and testable.
 */

// ─── Input parameters ───────────────────────────────────────────────────────

export interface SimParams {
  /** Current body length in meters */
  bodyLength: number;
  /** Baseline body length for selected species (m) */
  baselineLength: number;
  /** Atmospheric O2 fraction (0.10-0.35, default 0.21) */
  o2Fraction: number;
  /** Gravity multiplier (0.1-2.0, default 1.0) */
  gravity: number;
}

// ─── Output results ─────────────────────────────────────────────────────────

export interface SimOutputs {
  /** bodyLength / baselineLength */
  scaleFactor: number;
  /** Relative mass (s^3) */
  mass: number;
  /** Relative surface area (s^2) */
  surfaceArea: number;

  // Capacity proxies (1.0 = baseline, lower = worse)
  /** Tracheal diffusion capacity */
  respirationCapacity: number;
  /** Exoskeleton structural integrity */
  exoskeletonCapacity: number;
  /** Muscle force-to-weight ratio */
  muscleCapacity: number;
  /** Metabolic energy balance */
  metabolicCapacity: number;

  // Health scores (0-100)
  respirationHealth: number;
  exoskeletonHealth: number;
  muscleHealth: number;
  metabolicHealth: number;

  /** Overall viability index (0-100) */
  viabilityIndex: number;

  /** How many times body weight the ant can carry */
  carryCapacityMultiple: number;

  /** IDs of currently active failure modes */
  activeFailures: string[];
  /** The dominant failure mode, or null */
  failureMode: string | null;
}

// ─── Species preset ─────────────────────────────────────────────────────────

export interface SpeciesPreset {
  name: string;
  baselineLength: number;
}

// ─── Failure mode types ─────────────────────────────────────────────────────

export type FailureSeverity = 'hard' | 'catastrophic';
export type Subsystem = 'respiration' | 'exoskeleton' | 'muscle' | 'metabolic';

export interface FailureModeDefinition {
  id: string;
  subsystem: Subsystem;
  severity: FailureSeverity;
  title: string;
  shortDescription: string;
  longDescription: string;
  recoveryHint: string | null;
  proxyThreshold: number;
}
