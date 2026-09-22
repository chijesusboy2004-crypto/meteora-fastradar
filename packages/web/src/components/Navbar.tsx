import React from "react";
import { Zap, Radio, Globe, Shield, Wallet } from "lucide-react";
import { StreamBenchmark } from "../types";

interface NavbarProps {
  benchmark: StreamBenchmark | null;
  connected: boolean;
  onConnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ benchmark, connected, onConnectWallet }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Track Badges */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-meteora-teal via-solana-purple to-solana-green p-0.5 flex items-center justify-center shadow-lg shadow-meteora-teal/10">
            <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-solana-green fill-solana-green" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Meteora <span className="text-meteora-teal">FastRadar</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-solana-purple/20 text-solana-purple border border-solana-purple/30 font-semibold">
                DBC v2
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Colosseum Hackathon Sidetrack
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              Superteam Nigeria
            </p>
          </div>
        </div>

        {/* Live RPC Fast Telemetry Badge & Wallet Connect */}
        <div className="flex items-center space-x-3">
          {/* RPC Fast Node Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-solana-green"></span>
            </span>
            <span className="text-slate-400 font-mono">RPC Fast FRA-1:</span>
            <span className="font-mono text-solana-green font-semibold">
              {benchmark ? `${benchmark.rpcFastLatencyMs}ms` : "142ms"}
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium">
              -82% Latency
            </span>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={onConnectWallet}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-md ${
              connected
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-gradient-to-r from-solana-purple to-meteora-teal text-black font-bold hover:opacity-90 shadow-meteora-teal/20"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{connected ? "7x2F...9c1A (Mainnet)" : "Connect Solana Wallet"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
