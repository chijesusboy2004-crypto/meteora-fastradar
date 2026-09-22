import { BondingCurveState, SwapQuote } from "./types.js";

export const SOL_PRICE_USD_ESTIMATE = 150.0;
export const DEFAULT_MIGRATION_THRESHOLD_SOL = 85.0;
export const TOTAL_SUPPLY = 1_000_000_000; // 1 Billion tokens
export const INITIAL_VIRTUAL_SOL = 30.0;
export const INITIAL_VIRTUAL_TOKEN = 1_073_000_000;

export class BondingCurveMath {
  /**
   * Calculates the current instant price of 1 token in SOL
   */
  public static calculatePriceSol(virtualSol: number, virtualTokens: number): number {
    if (virtualTokens <= 0) return 0;
    return virtualSol / virtualTokens;
  }

  /**
   * Calculates the percentage towards the DLMM graduation threshold
   */
  public static calculateProgress(realSol: number, thresholdSol: number = DEFAULT_MIGRATION_THRESHOLD_SOL): number {
    const raw = (realSol / thresholdSol) * 100;
    return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
  }

  /**
   * Simulates a BUY: user deposits SOL in exchange for tokens
   * Formula: k = virtualSol * virtualTokens
   * newVirtualSol = virtualSol + solIn
   * newVirtualTokens = k / newVirtualSol
   * tokensOut = virtualTokens - newVirtualTokens
   */
  public static calculateBuyOutput(
    curve: BondingCurveState,
    solIn: number,
    feeRate: number = 0.01 // 1% fee
  ): SwapQuote {
    const feeSol = solIn * feeRate;
    const netSolIn = solIn - feeSol;

    const currentVirtualSol = curve.virtualSolReserves;
    const currentVirtualTokens = curve.virtualTokenReserves;
    const k = currentVirtualSol * currentVirtualTokens;

    const newVirtualSol = currentVirtualSol + netSolIn;
    const newVirtualTokens = k / newVirtualSol;
    const tokensOut = currentVirtualTokens - newVirtualTokens;

    const spotPriceBefore = this.calculatePriceSol(currentVirtualSol, currentVirtualTokens);
    const executionPrice = netSolIn / (tokensOut || 1);
    const priceImpact = ((executionPrice - spotPriceBefore) / (spotPriceBefore || 1)) * 100;

    return {
      inputMint: "So11111111111111111111111111111111111111112", // Native SOL
      outputMint: "TOKEN_MINT",
      amountIn: solIn,
      estimatedAmountOut: Math.max(0, tokensOut),
      priceImpactPercent: Math.max(0, parseFloat(priceImpact.toFixed(2))),
      feeSol,
      executionPrice,
      minimumReceived: Math.max(0, tokensOut * 0.99) // 1% slippage default
    };
  }

  /**
   * Simulates a SELL: user deposits tokens in exchange for SOL
   * Formula: newVirtualTokens = virtualTokens + tokensIn
   * newVirtualSol = k / newVirtualTokens
   * solOut = virtualSol - newVirtualSol
   */
  public static calculateSellOutput(
    curve: BondingCurveState,
    tokensIn: number,
    feeRate: number = 0.01
  ): SwapQuote {
    const currentVirtualSol = curve.virtualSolReserves;
    const currentVirtualTokens = curve.virtualTokenReserves;
    const k = currentVirtualSol * currentVirtualTokens;

    const newVirtualTokens = currentVirtualTokens + tokensIn;
    const newVirtualSol = k / newVirtualTokens;
    const grossSolOut = currentVirtualSol - newVirtualSol;
    const feeSol = grossSolOut * feeRate;
    const netSolOut = Math.max(0, grossSolOut - feeSol);

    const spotPriceBefore = this.calculatePriceSol(currentVirtualSol, currentVirtualTokens);
    const executionPrice = netSolOut / (tokensIn || 1);
    const priceImpact = ((spotPriceBefore - executionPrice) / (spotPriceBefore || 1)) * 100;

    return {
      inputMint: "TOKEN_MINT",
      outputMint: "So11111111111111111111111111111111111111112",
      amountIn: tokensIn,
      estimatedAmountOut: netSolOut,
      priceImpactPercent: Math.max(0, parseFloat(priceImpact.toFixed(2))),
      feeSol,
      executionPrice,
      minimumReceived: netSolOut * 0.99
    };
  }
}
