import React from "react";
import { ArrowDownLeft, ArrowUpRight, Clock, Hash } from "lucide-react";
import { TradeEvent } from "../types";

interface TradeFeedProps {
  trades: TradeEvent[];
}

export const TradeFeed: React.FC<TradeFeedProps> = ({ trades }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-solana-green animate-ping"></span>
          Live Mainnet Stream
        </h3>
        <span className="text-xs text-slate-400 font-mono">Real-time Trade Feed</span>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {trades.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            Waiting for next block execution...
          </div>
        ) : (
          trades.slice(0, 15).map((t, idx) => {
            const isBuy = t.type === "BUY";
            return (
              <div
                key={`${t.signature}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-700 transition-colors text-xs font-mono"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isBuy ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className={`font-bold ${isBuy ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.type} {t.solAmount} SOL
                    </span>
                    <span className="text-slate-500 block text-[10px]">
                      {t.user.slice(0, 4)}...{t.user.slice(-4)} • slot #{t.slot}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-white font-semibold block">
                    {Math.round(t.tokenAmount).toLocaleString()} tokens
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(t.timestamp).toLocaleTimeString()} ({t.latencyMs}ms)
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
