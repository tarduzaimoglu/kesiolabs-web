import {
  CAL_K, FLOW, INFILL_EFF,
  NOZZLE_MM, LAYER_H_MM, WALLS, TOP_LAYERS, BOTTOM_LAYERS,
  MIN_TOTAL_TRY, COLOR_UPCHARGE_FACTOR, BASE_COLORS,
  MATERIALS, type MaterialKey,
} from "./constants";

export type Metrics = {
  volumeMM3: number;
  saMM2: number;
  sahMM2: number;
};

export type PricingInput = {
  metrics: Metrics | null;
  material: MaterialKey;
  colorHex: string;
  infillPct: number;
  qty: number;
};

export type PricingResult = {
  weightG: number;
  unitTRY: number;
  totalTRY: number;
  finalTotalTRY: number;
  gramPriceUsed: number;
  densityUsed: number;
  colorFactorApplied: boolean;
  minimumApplied: boolean;
};

export function calcPricing(input: PricingInput): PricingResult {
  const { metrics, material, colorHex, infillPct, qty } = input;

  const mat = MATERIALS[material];
  const density = mat.density;
  const gramPrice = mat.gramPrice;

  const colorFactorApplied = !BASE_COLORS.has(colorHex.toLowerCase());
  const colorFactor = colorFactorApplied ? COLOR_UPCHARGE_FACTOR : 1.0;

  if (!metrics) {
    return {
      weightG: 0,
      unitTRY: 0,
      totalTRY: 0,
      finalTotalTRY: 0,
      gramPriceUsed: gramPrice,
      densityUsed: density,
      colorFactorApplied,
      minimumApplied: false,
    };
  }

  const { volumeMM3, saMM2, sahMM2 } = metrics;

  const solidCm3 = volumeMM3 / 1000.0;
  const SA_cm2 = saMM2 / 100.0;
  const SAh_cm2 = sahMM2 / 100.0;

  const wallThick_cm = (WALLS * NOZZLE_MM * 0.92) / 10.0;

  const Vtb_cm3 = SAh_cm2 * (TOP_LAYERS + BOTTOM_LAYERS) * (LAYER_H_MM / 10.0);
  const SAside_cm2 = Math.max(0, SA_cm2 - SAh_cm2);

  let Vwall_cm3 = SAside_cm2 * wallThick_cm;
  Vwall_cm3 = Math.min(Vwall_cm3, solidCm3 * 0.35);

  const core_cm3 = Math.max(0, solidCm3 - Vtb_cm3 - Vwall_cm3);
  const Vinf_cm3 = core_cm3 * (infillPct / 100) * INFILL_EFF;

  const Vtot_cm3 = (Vtb_cm3 + Vwall_cm3 + Vinf_cm3) * FLOW * CAL_K;

  const weightG = Vtot_cm3 * density;

  const unitTRY = weightG * gramPrice * colorFactor;
  const totalTRY = unitTRY * qty;

  const minimumApplied = totalTRY > 0 && totalTRY < MIN_TOTAL_TRY;
  const finalTotalTRY = minimumApplied ? MIN_TOTAL_TRY : totalTRY;

  return {
    weightG,
    unitTRY,
    totalTRY,
    finalTotalTRY,
    gramPriceUsed: gramPrice,
    densityUsed: density,
    colorFactorApplied,
    minimumApplied,
  };
}
