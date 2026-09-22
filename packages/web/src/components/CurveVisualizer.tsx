import React from "react";
import { TrendingUp, Layers, Info, CheckCircle } from "lucide-react";
import { MeteoraPool } from "../types";

interface CurveVisualizerProps {
  pool: MeteoraPool | null;
}

export const CurveVisualizer: React.FC<CurveVisualizerProps> = ({ pool }) => {
  if (!pool) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 font-mono text-xs">
        Select a Meteora pool to inspect its dynamic bonding curve
      </div>
    );
  }

  const { curve, token } = pool;
  const currentProgress = curve.progressPercent;

  const points = [];
  const width = 500;
  const height = 220;
  const padding = 25;

  for (let i = 0; i <= 20; i++) {
    const xRatio = i / 20;
    const yRatio = Math.pow(xRatio, 1.8);
    const x = padding + xRatio * (width - 2 * padding);
    const y = height - padding - yRatio * (height - 2 * padding);
    points.push(`${x},${y}`);
  }

  const curvePath = `M ${points.join(" L ")}`;

  const currentRatio = Math.min(1, currentProgress / 100);
  const activeX = padding + currentRatio * (width - 2 * padding);
  const activeY = height - padding - Math.pow(currentRatio, 1.8) * (height - 2 * padding);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Dynamic Bonding Curve: {token.name} (${token.symbol})
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-solana-purple/20 text-solana-purple border border-solana-purple/30 font-semibold">
              k = V_sol × V_token
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Current pool pricing & automated DLMM transition threshold
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Target Migration:</span>
          <span className="text-solana-green font-bold">{curve.migrationThresholdSol} SOL</span>
        </div>
      </div>

      <div className="relative w-full h-[220px] bg-slate-950/70 rounded-xl border border-slate-850 p-2 overflow-hidden mb-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1E293B" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#1E293B" strokeWidth="1" />
          <line x1={padding} y1={(height - padding) / 2} x2={width - padding} y2={(height - padding) / 2} stroke="#1E293B" strokeDasharray="3,3" strokeWidth="1" />

          <path
            d={`${curvePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
            fill="url(#areaGradient)"
          />

          <path d={curvePath} fill="none" stroke="url(#curveGradient)" strokeWidth="3.5" strokeLinecap="round" />

          <circle cx={activeX} cy={activeY} r="7" fill="#14F195" className="animate-pulse shadow-lg" />
          <circle cx={activeX} cy={activeY} r="12" fill="#14F195" opacity="0.3" />

          <circle cx={width - padding} cy={padding} r="4" fill="#00E5FF" />
          <text x={width - padding - 75} y={padding + 14} fill="#00E5FF" fontSize="10" fontFamily="monospace">
            DLMM Graduation
          </text>
        </svg>

        <div
          className="absolute text-[11px] font-mono font-bold bg-slate-900/90 text-solana-green border border-solana-green/40 px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm pointer-events-none"
          style={{
            left: `${Math.min(75, Math.max(10, (activeX / width) * 100))}%`,
            top: "20%"
          }}
        >
          {currentProgress}% Filled ({curve.realSolReserves.toFixed(2)} SOL)
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 block">Real SOL Reserves</span>
          <span className="text-white font-bold text-sm">{curve.realSolReserves.toFixed(2)} SOL</span>
        </div>
        <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 block">Virtual SOL Reserves</span>
          <span className="text-white font-bold text-sm">{curve.virtualSolReserves.toFixed(2)} SOL</span>
        </div>
        <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 block">Remaining for DLMM</span>
          <span className="text-amber-400 font-bold text-sm">
            {Math.max(0, curve.migrationThresholdSol - curve.realSolReserves).toFixed(2)} SOL
          </span>
        </div>
        <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 block">Stream Latency</span>
          <span className="text-solana-green font-bold text-sm">{pool.streamLatencyMs} ms</span>
        </div>
      </div>
    </div>
  );
};
