export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  uri?: string;
  supply: number;
}

export interface BondingCurveState {
  virtualSolReserves: number; // in SOL
  virtualTokenReserves: number; // in Tokens
  realSolReserves: number; // in SOL accumulated
  realTokenReserves: number; // in Tokens available for sale
  totalTokenSupply: number;
  complete: boolean; // whether graduated to DLMM
  migrationThresholdSol: number; // target SOL to graduate (e.g. 85 SOL)
  progressPercent: number; // 0% - 100%
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

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  amountIn: number;
  estimatedAmountOut: number;
  priceImpactPercent: number;
  feeSol: number;
  executionPrice: number;
  minimumReceived: number;
}

export interface StreamBenchmark {
  standardRpcLatencyMs: number;
  rpcFastLatencyMs: number;
  improvementPercent: number;
  eventsProcessedPerSec: number;
  activePoolsTracked: number;
  timestamp: number;
}
