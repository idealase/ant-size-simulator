/**
 * Failure Mode Definitions for Ant Size Simulator
 *
 * Failure modes are first-class entities representing discrete physiological
 * breakdown events that occur when scaling constraints exceed viable limits.
 */

import type { FailureModeDefinition, Subsystem } from './types';
import {
  RESPIRATION_THRESHOLD,
  EXOSKELETON_THRESHOLD,
  MUSCLE_THRESHOLD,
  METABOLIC_THRESHOLD,
} from './simDefaults';

export interface ScalingProxies {
  respiration: number;
  exoskeleton: number;
  muscle: number;
  metabolic: number;
}

export const FAILURE_MODES: Record<string, FailureModeDefinition> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // RESPIRATION FAILURES
  // ═══════════════════════════════════════════════════════════════════════════

  TRACHEAL_COLLAPSE: {
    id: 'TRACHEAL_COLLAPSE',
    subsystem: 'respiration',
    severity: 'catastrophic',
    title: 'Tracheal Respiration Collapse',
    shortDescription:
      'The tracheal system cannot deliver oxygen to internal tissues. The ant suffocates.',
    longDescription: `
**The Physics of Failure**

Ants breathe through a network of **tracheae** — tiny air-filled tubes that branch throughout the body, delivering oxygen directly to tissues by passive diffusion. There are no lungs, no blood-based oxygen transport. Air enters through **spiracles** (small openings along the body segments) and diffuses inward.

This system is exquisitely efficient at small scales. But diffusion obeys a brutal physical law:

**Diffusion time scales with the square of distance.**

As the ant grows, two things happen:
1. **Body volume (and oxygen demand) increases as L³**
2. **Tracheal surface area increases only as L²**
3. **Diffusion distance to the deepest tissues increases linearly with L**

The oxygen supply-demand ratio collapses as 1/L. Internal tissues starve for oxygen long before they could die of any other cause.

**The Carboniferous Precedent**

During the Carboniferous period (~300 million years ago), atmospheric oxygen reached ~35% (vs. today's 21%). Giant insects thrived: dragonflies with 70 cm wingspans, millipedes over 2 meters long. When O₂ levels dropped, so did maximum insect size. The correlation is almost perfectly linear.

This simulator lets you test this directly — crank up the O₂ fraction and watch the tracheal capacity improve.

**The Result**

At this size, internal tissues become hypoxic. Muscle cells switch to anaerobic metabolism (producing lactic acid). Neural function degrades. The ant's body becomes an oxygen desert — alive at the surface, dying in the core.

**Why There Are No Large Tracheal Breathers Today**

Active circulatory systems (hearts, blood vessels, hemoglobin/hemocyanin) evolved precisely to solve this problem. Insects chose a different evolutionary path — staying small instead. The largest living insects (some beetles at ~17 cm) are already at the ragged edge of tracheal capacity.
    `.trim(),
    recoveryHint: 'Increase atmospheric O₂ above 30%, or reduce body size below the diffusion limit.',
    proxyThreshold: RESPIRATION_THRESHOLD,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXOSKELETON FAILURES
  // ═══════════════════════════════════════════════════════════════════════════

  EXOSKELETON_FAILURE: {
    id: 'EXOSKELETON_FAILURE',
    subsystem: 'exoskeleton',
    severity: 'catastrophic',
    title: 'Exoskeleton Structural Failure',
    shortDescription:
      'The chitin exoskeleton cannot support the scaled mass. Catastrophic buckling imminent.',
    longDescription: `
**The Physics of Failure**

An ant's exoskeleton is made of **chitin** — a biological polymer that is remarkably strong for its weight. The exoskeleton serves as both armor and skeleton, providing structural support, muscle attachment, and protection from desiccation.

But chitin obeys the same laws of physics as everything else.

**The Square-Cube Law on Chitin**

- **Structural load capacity** (proportional to cross-sectional area) scales as L²
- **Body mass** (proportional to volume) scales as L³
- **Compressive stress** on the exoskeleton scales as L³/L² = L

The capacity formula uses an exponent of 1.4 (not 1.0) because the exoskeleton is a thin shell. Shell buckling theory shows that thin-walled structures fail earlier than solid ones under compressive loads — the critical buckling stress decreases with the ratio of radius to wall thickness.

**Why Molting Makes It Worse**

Arthropods must **molt** (shed and regrow their exoskeleton) to grow. During molting, the new exoskeleton is soft and provides almost no structural support. For a small ant, this vulnerable period lasts hours. For a scaled-up ant, the soft exoskeleton would collapse under gravity before it could harden.

Even if molting were somehow possible, the new exoskeleton would need to be proportionally much thicker, which adds mass, which increases stress — a vicious feedback loop.

**The Result**

The exoskeleton buckles and fractures under the ant's own weight. Leg segments collapse inward. The body segments compress against each other. The internal organs, which depend on the exoskeleton for shape and support, are crushed.

**Why Endoskeletons Won**

Vertebrate endoskeletons can be optimally thickened at stress points, grow without vulnerable molting phases, and scale much more efficiently. The largest arthropods alive today (Japanese spider crabs, ~4 kg) are aquatic — buoyancy offloads most of the structural demand.
    `.trim(),
    recoveryHint: 'Reduce gravity below 0.3g to lower structural loading.',
    proxyThreshold: EXOSKELETON_THRESHOLD,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MUSCLE FAILURES
  // ═══════════════════════════════════════════════════════════════════════════

  MUSCLE_DEFICIT: {
    id: 'MUSCLE_DEFICIT',
    subsystem: 'muscle',
    severity: 'hard',
    title: 'Muscle Force Deficit',
    shortDescription:
      'Muscles cannot generate enough force relative to body weight. The ant cannot move.',
    longDescription: `
**The Physics of Failure**

Ants are legendary for their strength. A leafcutter ant can carry 50 times its own body weight. But this superhero reputation is a direct consequence of being small, not of having magical muscles.

**Why Small Animals Are "Stronger"**

Muscle force is proportional to **cross-sectional area** (L²), but body weight is proportional to **volume** (L³). The force-to-weight ratio therefore scales as:

Force / Weight = L² / L³ = 1/L

A normal ant has a force-to-weight ratio roughly 50:1. Double its size, and that ratio halves. At 100× size, it drops to 0.5:1 — the ant can barely support its own body, let alone carry anything.

**The Carry Capacity Collapse**

This simulator tracks carry capacity as a multiple of body weight. At baseline, an ant carries 50× its body weight. As it scales up:
- 10× size: carries ~5× body weight
- 50× size: carries ~1× body weight (barely standing)
- 100× size: cannot support itself

**Gravity Compounds the Problem**

Higher gravity directly increases the weight the muscles must overcome without improving force output. On Jupiter (2.5g), even a normal-sized ant would struggle.

**The Result**

The ant's legs cannot generate enough force to lift its body. Attempts to walk result in trembling, buckling, and collapse. The mandibles — which normally crack seeds and carry loads — cannot close against their own weight.
    `.trim(),
    recoveryHint: 'Reduce gravity below 0.5g, or reduce body size significantly.',
    proxyThreshold: MUSCLE_THRESHOLD,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // METABOLIC FAILURES
  // ═══════════════════════════════════════════════════════════════════════════

  METABOLIC_CRISIS: {
    id: 'METABOLIC_CRISIS',
    subsystem: 'metabolic',
    severity: 'hard',
    title: 'Metabolic Rate Crisis',
    shortDescription:
      'Energy demand outpaces the ability to produce and distribute ATP. Systemic failure.',
    longDescription: `
**The Physics of Failure**

Metabolic rate follows **Kleiber's Law**: basal metabolic rate scales as M^0.75, where M is body mass. Since mass scales as L³, metabolic rate scales as L^2.25. But the systems that deliver energy (tracheal oxygen delivery, gut absorption, metabolic enzyme activity) scale at different rates.

**The Scaling Mismatch**

- **Energy demand** (basal metabolic rate) scales as s^2.25
- **Oxygen delivery** (tracheal) scales as ~s² (surface area limited)
- **Food processing** (gut volume) scales as s³ but is rate-limited by surface absorption (~s²)
- **Heat dissipation** (surface area) scales as s²

The net result is that energy demand grows faster than the systems that supply it. The metabolic exponent of 0.75 in the capacity formula captures this mismatch.

**Why Ants Don't Get "Upgrades"**

Mammals solved metabolic scaling through:
- Active circulatory systems (hearts pump oxygenated blood)
- Lungs with enormous internal surface area
- Kidneys that regulate metabolic waste

Insects have none of these. Their metabolic architecture is hardwired for small size. There is no evolutionary path to "upgrade" an ant's metabolism without fundamentally redesigning its body plan.

**The Result**

ATP production cannot keep pace with demand. Cellular functions degrade. Neural signaling slows. Muscle contractions weaken. The ant enters a metabolic death spiral where every attempt at activity deepens the energy deficit.
    `.trim(),
    recoveryHint: 'Reduce gravity or body size to lower total metabolic demand.',
    proxyThreshold: METABOLIC_THRESHOLD,
  },
};

/** Get failure mode definition by ID. */
export const getFailureMode = (id: string): FailureModeDefinition | undefined => {
  return FAILURE_MODES[id];
};

/** Get all failure modes for a specific subsystem. */
export const getFailureModesForSubsystem = (subsystem: Subsystem): FailureModeDefinition[] => {
  return Object.values(FAILURE_MODES).filter(fm => fm.subsystem === subsystem);
};

/** Check if a specific proxy value has crossed the failure threshold. */
export const isProxyInFailure = (proxyValue: number, threshold: number): boolean => {
  return proxyValue < threshold;
};

/** Detect all active failures based on current proxy values. */
export const detectFailures = (proxies: ScalingProxies): string[] => {
  const activeFailureIds: string[] = [];

  if (isProxyInFailure(proxies.respiration, FAILURE_MODES.TRACHEAL_COLLAPSE.proxyThreshold)) {
    activeFailureIds.push('TRACHEAL_COLLAPSE');
  }

  if (isProxyInFailure(proxies.exoskeleton, FAILURE_MODES.EXOSKELETON_FAILURE.proxyThreshold)) {
    activeFailureIds.push('EXOSKELETON_FAILURE');
  }

  if (isProxyInFailure(proxies.muscle, FAILURE_MODES.MUSCLE_DEFICIT.proxyThreshold)) {
    activeFailureIds.push('MUSCLE_DEFICIT');
  }

  if (isProxyInFailure(proxies.metabolic, FAILURE_MODES.METABOLIC_CRISIS.proxyThreshold)) {
    activeFailureIds.push('METABOLIC_CRISIS');
  }

  return activeFailureIds;
};
