export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
}

export interface BondingCurveState {
  virtualSolReserves: number;
  virtualTokenReserves: number;
  realSolReserves: number;
  realTokenReserves: number;
  totalTokenSupply: number;
  complete: boolean;
  migrationThresholdSol: number;
  progressPercent: number;
  currentPriceSol: number;
  currentPriceUsd: number;
  marketCapUsd: number;
}

export interface MeteoraPool {
  id: string;
  programId: string;
  baseMint: string;
  quoteMint: string;
  token: TokenMetadata;
  curve: BondingCurveState;
  createdAt: number;
  lastUpdated: number;
  totalVolumeSol: number;
  txCount: number;
  buyCount: number;
  sellCount: number;
  streamLatencyMs: number;
  rpcSource: string;
}

export interface TradeEvent {
  signature: string;
  poolId: string;
  type: "BUY" | "SELL";
  user: string;
  solAmount: number;
  tokenAmount: number;
  priceSol: number;
  priceUsd: number;
  timestamp: number;
  slot: number;
  latencyMs: number;
}

export interface StreamBenchmark {
  standardRpcLatencyMs: number;
  rpcFastLatencyMs: number;
  improvementPercent: number;
  eventsProcessedPerSec: number;
  activePoolsTracked: number;
  timestamp: number;
}
