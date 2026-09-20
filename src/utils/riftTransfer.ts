// RIFT Transfer State Machine & Types

export type RiftTransferState =
  | 'idle'
  | 'approaching'
  | 'proximity'
  | 'connected'
  | 'seam_open'
  | 'transferring'
  | 'reconstructing'
  | 'complete'
  | 'thunder_flash';

export interface RiftEndpoint {
  id: string;
  position: { x: number; y: number };
  type: 'source' | 'destination';
  label?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface ProximityConfig {
  connectionThreshold: number; // Distance to trigger connection
  magneticStrength: number; // Pull strength
  particleCount: number; // Max particles
  thunderFlashDuration: number; // ms
}

export const DEFAULT_PROXIMITY_CONFIG: ProximityConfig = {
  connectionThreshold: 80,
  magneticStrength: 0.5,
  particleCount: 50,
  thunderFlashDuration: 550,
};

// State transitions
export const STATE_TRANSITIONS: Record<RiftTransferState, RiftTransferState[]> = {
  idle: ['approaching'],
  approaching: ['proximity', 'idle'],
  proximity: ['connected', 'approaching'],
  connected: ['seam_open', 'proximity'],
  seam_open: ['transferring', 'connected'],
  transferring: ['reconstructing', 'seam_open'],
  reconstructing: ['complete', 'transferring'],
  complete: ['thunder_flash', 'complete'],
  thunder_flash: ['idle', 'complete'],
};

// Timing constants (ms)
export const TIMING = {
  PROXIMITY_RESPONSE: 250,
  CONNECTION: 400,
  SEAM_OPENING: 200,
  PARTICLE_TRANSITION: 800,
  RECONSTRUCTION: 450,
  THUNDER_FLASH: 550,
} as const;
