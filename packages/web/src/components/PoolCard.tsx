import React from "react";
import { TrendingUp, ArrowUpRight, Check, Flame, Layers } from "lucide-react";
import { MeteoraPool } from "../types";

interface PoolCardProps {
  pool: MeteoraPool;
  isSelected: boolean;
  onSelect: (pool: MeteoraPool) => void;
  onOpenSwap: (pool: MeteoraPool) => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  pool,
  isSelected,
  onSelect,
  onOpenSwap
}) => {
  const isGraduated = pool.curve.complete;
  const progress = pool.curve.progressPercent;

  return (
    <div
      onClick={() => onSelect(pool)}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
        isSelected
          ? "bg-slate-900 border-meteora-teal/50 shadow-lg shadow-meteora-teal/10"
          : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solana-purple/30 to-meteora-teal/30 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
            {pool.token.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm tracking-tight group-hover:text-meteora-teal transition-colors">
                {pool.token.name}
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-semibold px-1.5 py-0.5 rounded bg-slate-800">
                ${pool.token.symbol}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ${pool.curve.currentPriceUsd.toFixed(8)}
              <span className="text-[11px] text-slate-500 ml-1.5">
                ({pool.curve.currentPriceSol.toFixed(9)} SOL)
              </span>
            </p>
          </div>
        </div>

        {/* Graduation Status Badge */}
        {isGraduated ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Check className="w-3 h-3" /> Graduated
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-3 h-3" /> Bonding Curve
          </span>
        )}
      </div>

      {/* Migration Progress Bar */}
      <div className="mb-3.5">
        <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
          <span>Curve Migration Progress</span>
          <span className={`font-bold ${isGraduated ? "text-emerald-400" : "text-white"}`}>
            {progress}% ({pool.curve.realSolReserves.toFixed(1)} / {pool.curve.migrationThresholdSol} SOL)
          </span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isGraduated
                ? "bg-gradient-to-r from-emerald-400 to-solana-green"
                : "bg-gradient-to-r from-solana-purple to-meteora-teal"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-800/80 text-xs font-mono mb-3">
        <div>
          <span className="text-[11px] text-slate-500 block">Market Cap</span>
          <span className="text-white font-semibold">${Math.round(pool.curve.marketCapUsd).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">Volume</span>
          <span className="text-white font-semibold">{pool.totalVolumeSol.toFixed(1)} SOL</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">TXs / Ratio</span>
          <span className="text-emerald-400 font-semibold">{pool.buyCount}B</span>
          <span className="text-slate-500 mx-0.5">/</span>
          <span className="text-rose-400 font-semibold">{pool.sellCount}S</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenSwap(pool);
          }}
          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-meteora-teal to-solana-green text-black font-bold text-xs hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1 shadow-md shadow-meteora-teal/10"
        >
          <span>Instant Swap</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
