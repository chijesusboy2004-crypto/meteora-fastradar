import { MeteoraPool, TradeEvent, StreamBenchmark, TokenMetadata, BondingCurveState } from "./types.js";
import {
  BondingCurveMath,
  SOL_PRICE_USD_ESTIMATE,
  DEFAULT_MIGRATION_THRESHOLD_SOL,
  TOTAL_SUPPLY,
  INITIAL_VIRTUAL_SOL,
  INITIAL_VIRTUAL_TOKEN
} from "./curveMath.js";

const SAMPLE_TOKENS: Array<{ name: string; symbol: string }> = [
  { name: "SuperSolana Sentinel", symbol: "SENTINEL" },
  { name: "Meteora Fast Velocity", symbol: "VELO" },
  { name: "Lagos Lightning", symbol: "EKO" },
  { name: "Naija Turbo", symbol: "TURBO" },
  { name: "Dynamic Bonding Cat", symbol: "DBCAT" },
  { name: "Solana Shred gRPC", symbol: "SHRED" },
  { name: "Aperture Pulse", symbol: "PULSE" },
  { name: "Frankfurt LowLatency", symbol: "FRA" }
];

export class MeteoraSimulator {
  private pools: Map<string, MeteoraPool> = new Map();
  private listeners: Array<(event: { type: string; data: any }) => void> = [];
  private isRunning: boolean = false;
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.seedInitialPools();
  }

  private generateAddress(prefix: string): string {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let result = prefix;
    for (let i = 0; i < 38; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private seedInitialPools(): void {
    SAMPLE_TOKENS.slice(0, 5).forEach((t, idx) => {
      const realSol = 12.5 + idx * 14.8;
      const virtualSol = INITIAL_VIRTUAL_SOL + realSol;
      const currentPriceSol = BondingCurveMath.calculatePriceSol(virtualSol, INITIAL_VIRTUAL_TOKEN);
      const progress = BondingCurveMath.calculateProgress(realSol);

      const pool: MeteoraPool = {
        id: this.generateAddress("DBC"),
        programId: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
        baseMint: this.generateAddress("TKN"),
        quoteMint: "So11111111111111111111111111111111111111112",
        token: {
          mint: this.generateAddress("TKN"),
          name: t.name,
          symbol: t.symbol,
          decimals: 6,
          supply: TOTAL_SUPPLY
        },
        curve: {
          virtualSolReserves: virtualSol,
          virtualTokenReserves: INITIAL_VIRTUAL_TOKEN - (realSol * 10_000_000),
          realSolReserves: realSol,
          realTokenReserves: TOTAL_SUPPLY - (realSol * 10_000_000),
          totalTokenSupply: TOTAL_SUPPLY,
          complete: progress >= 100,
          migrationThresholdSol: DEFAULT_MIGRATION_THRESHOLD_SOL,
          progressPercent: progress,
          currentPriceSol,
          currentPriceUsd: currentPriceSol * SOL_PRICE_USD_ESTIMATE,
          marketCapUsd: currentPriceSol * SOL_PRICE_USD_ESTIMATE * TOTAL_SUPPLY
        },
        createdAt: Date.now() - (idx * 180_000),
        lastUpdated: Date.now(),
        totalVolumeSol: 45.8 + (idx * 22.3),
        txCount: 85 + (idx * 40),
        buyCount: 60 + (idx * 28),
        sellCount: 25 + (idx * 12),
        streamLatencyMs: 140 + Math.floor(Math.random() * 80),
        rpcSource: "RPC Fast (FRA-1 Shredstream)"
      };

      this.pools.set(pool.id, pool);
    });
  }

  public subscribe(cb: (event: { type: string; data: any }) => void): void {
    this.listeners.push(cb);
  }

  private broadcast(type: string, data: any): void {
    this.listeners.forEach(cb => cb({ type, data }));
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // Simulate high-frequency streaming events
    this.intervalTimer = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.25) {
        this.simulateNewPool();
      } else {
        this.simulateTrade();
      }
      this.broadcastBenchmark();
    }, 1800);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  }

  public getPools(): MeteoraPool[] {
    return Array.from(this.pools.values()).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  public getPoolById(id: string): MeteoraPool | undefined {
    return this.pools.get(id);
  }

  private simulateNewPool(): void {
    const randomToken = SAMPLE_TOKENS[Math.floor(Math.random() * SAMPLE_TOKENS.length)];
    const virtualSol = INITIAL_VIRTUAL_SOL;
    const priceSol = BondingCurveMath.calculatePriceSol(virtualSol, INITIAL_VIRTUAL_TOKEN);

    const newPool: MeteoraPool = {
      id: this.generateAddress("DBC"),
      programId: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
      baseMint: this.generateAddress("TKN"),
      quoteMint: "So11111111111111111111111111111111111111112",
      token: {
        mint: this.generateAddress("TKN"),
        name: `${randomToken.name} #${Math.floor(Math.random() * 900 + 100)}`,
        symbol: randomToken.symbol,
        decimals: 6,
        supply: TOTAL_SUPPLY
      },
      curve: {
        virtualSolReserves: virtualSol,
        virtualTokenReserves: INITIAL_VIRTUAL_TOKEN,
        realSolReserves: 0,
        realTokenReserves: TOTAL_SUPPLY,
        totalTokenSupply: TOTAL_SUPPLY,
        complete: false,
        migrationThresholdSol: DEFAULT_MIGRATION_THRESHOLD_SOL,
        progressPercent: 0,
        currentPriceSol: priceSol,
        currentPriceUsd: priceSol * SOL_PRICE_USD_ESTIMATE,
        marketCapUsd: priceSol * SOL_PRICE_USD_ESTIMATE * TOTAL_SUPPLY
      },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      totalVolumeSol: 0,
      txCount: 0,
      buyCount: 0,
      sellCount: 0,
      streamLatencyMs: 120 + Math.floor(Math.random() * 60),
      rpcSource: "RPC Fast (FRA-1 Shredstream)"
    };

    this.pools.set(newPool.id, newPool);
    this.broadcast("NEW_POOL", newPool);
  }

  private simulateTrade(): void {
    const pools = Array.from(this.pools.values()).filter(p => !p.curve.complete);
    if (pools.length === 0) return;

    const pool = pools[Math.floor(Math.random() * pools.length)];
    const isBuy = Math.random() > 0.35;
    const solAmount = isBuy ? parseFloat((0.5 + Math.random() * 4.5).toFixed(2)) : parseFloat((0.2 + Math.random() * 2.0).toFixed(2));

    const quote = isBuy
      ? BondingCurveMath.calculateBuyOutput(pool.curve, solAmount)
      : BondingCurveMath.calculateSellOutput(pool.curve, solAmount * 10_000_000);

    const newRealSol = isBuy
      ? pool.curve.realSolReserves + solAmount
      : Math.max(0, pool.curve.realSolReserves - quote.estimatedAmountOut);

    const newVirtualSol = INITIAL_VIRTUAL_SOL + newRealSol;
    const newPriceSol = BondingCurveMath.calculatePriceSol(newVirtualSol, INITIAL_VIRTUAL_TOKEN);
    const progress = BondingCurveMath.calculateProgress(newRealSol);

    pool.curve.realSolReserves = newRealSol;
    pool.curve.virtualSolReserves = newVirtualSol;
    pool.curve.progressPercent = progress;
    pool.curve.currentPriceSol = newPriceSol;
    pool.curve.currentPriceUsd = newPriceSol * SOL_PRICE_USD_ESTIMATE;
    pool.curve.marketCapUsd = newPriceSol * SOL_PRICE_USD_ESTIMATE * TOTAL_SUPPLY;
    pool.totalVolumeSol += solAmount;
    pool.txCount += 1;
    if (isBuy) pool.buyCount += 1;
    else pool.sellCount += 1;
    pool.lastUpdated = Date.now();

    if (progress >= 100 && !pool.curve.complete) {
      pool.curve.complete = true;
      this.broadcast("CURVE_MIGRATION", {
        poolId: pool.id,
        token: pool.token,
        targetDex: "Meteora DLMM V2",
        totalLiquiditySol: pool.curve.realSolReserves
      });
    }

    const trade: TradeEvent = {
      signature: this.generateAddress("sig"),
      poolId: pool.id,
      type: isBuy ? "BUY" : "SELL",
      user: this.generateAddress("usr"),
      solAmount,
      tokenAmount: quote.estimatedAmountOut,
      priceSol: newPriceSol,
      priceUsd: newPriceSol * SOL_PRICE_USD_ESTIMATE,
      timestamp: Date.now(),
      slot: 298_450_000 + Math.floor(Math.random() * 5000),
      latencyMs: 135 + Math.floor(Math.random() * 50)
    };

    this.broadcast("TRADE", { trade, pool });
  }

  private broadcastBenchmark(): void {
    const benchmark: StreamBenchmark = {
      standardRpcLatencyMs: 980 + Math.floor(Math.random() * 250),
      rpcFastLatencyMs: 140 + Math.floor(Math.random() * 40),
      improvementPercent: 82.4,
      eventsProcessedPerSec: 14.2 + parseFloat((Math.random() * 4.0).toFixed(1)),
      activePoolsTracked: this.pools.size,
      timestamp: Date.now()
    };
    this.broadcast("BENCHMARK", benchmark);
  }
}
