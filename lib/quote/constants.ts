export const MAX_FILE_MB = 50;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const MATERIALS = {
  PLA: { density: 1.24 },
  ABS: { density: 1.04 },
  PETG: { density: 1.27 },
  ASA: { density: 1.07 },
} as const;

export type MaterialKey = keyof typeof MATERIALS;
