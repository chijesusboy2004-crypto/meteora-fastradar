import React from "react";
import { Activity, Gauge, Cpu, CheckCircle2 } from "lucide-react";
import { StreamBenchmark } from "../types";

interface BenchmarkProps {
  benchmark: StreamBenchmark | null;
}

export const BenchmarkWidget: React.FC<BenchmarkProps> = ({ benchmark }) => {
  const rpcFast = benchmark ? benchmark.rpcFastLatencyMs : 142;
  const standardRpc = benchmark ? benchmark.standardRpcLatencyMs : 980;
  const improvement = benchmark ? benchmark.improvementPercent : 82.4;
  const eventsPerSec = benchmark ? Number(benchmark.eventsProcessedPerSec).toFixed(1) : "16.2";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-meteora-teal/10 text-meteora-teal border border-meteora-teal/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              RPC Fast Stream Infrastructure
              <span className="text-[10px] bg-solana-green/20 text-solana-green px-2 py-0.5 rounded-full font-mono font-semibold">
                Frankfurt (FRA-1)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Low-latency Shredstream gRPC vs Public JSON-RPC comparison for Meteora DBC
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-solana-purple" />
            <span>Throughput:</span>
            <span className="text-white font-bold">{eventsPerSec} events/s</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sub-slot Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-emerald-500/20">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              RPC Fast (Optimized gRPC Stream)
            </span>
            <span className="font-mono font-bold text-emerald-400">{rpcFast} ms</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-solana-green to-meteora-teal h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (rpcFast / 1000) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Standard Public Solana RPC
            </span>
            <span className="font-mono font-bold text-amber-400">{standardRpc} ms</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500/60 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (standardRpc / 1000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
