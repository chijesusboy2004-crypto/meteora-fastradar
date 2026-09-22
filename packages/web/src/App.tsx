import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { BenchmarkWidget } from "./components/BenchmarkWidget";
import { PoolCard } from "./components/PoolCard";
import { CurveVisualizer } from "./components/CurveVisualizer";
import { TradeFeed } from "./components/TradeFeed";
import { SwapModal } from "./components/SwapModal";
import { MeteoraPool, TradeEvent, StreamBenchmark } from "./types";
import { Search, Filter, Sparkles, Trophy, ExternalLink, Github } from "lucide-react";

export function App() {
  const [pools, setPools] = useState<MeteoraPool[]>([]);
  const [selectedPool, setSelectedPool] = useState<MeteoraPool | null>(null);
  const [trades, setTrades] = useState<TradeEvent[]>([]);
  const [benchmark, setBenchmark] = useState<StreamBenchmark | null>(null);
  const [filterTab, setFilterTab] = useState<"ALL" | "NEAR_MIGRATION" | "GRADUATED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [swapModalPool, setSwapModalPool] = useState<MeteoraPool | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Connect to WebSocket streaming engine
  useEffect(() => {
    const wsUrl = window.location.hostname === "localhost" ? "ws://localhost:3001" : `wss://${window.location.host}`;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("[FastRadar Web] Connected to Live Stream Engine");
      };

      ws.onmessage = (evt) => {
        try {
          const message = JSON.parse(evt.data);
          if (message.type === "INITIAL_STATE") {
            setPools(message.data.pools);
            if (message.data.pools.length > 0) {
              setSelectedPool(message.data.pools[0]);
            }
          } else if (message.type === "NEW_POOL") {
            setPools((prev) => [message.data, ...prev]);
          } else if (message.type === "TRADE") {
            const { trade, pool } = message.data;
            setTrades((prev) => [trade, ...prev].slice(0, 30));
            setPools((prev) =>
              prev.map((p) => (p.id === pool.id ? pool : p))
            );
            setSelectedPool((curr) => (curr && curr.id === pool.id ? pool : curr));
          } else if (message.type === "BENCHMARK") {
            setBenchmark(message.data);
          }
        } catch (err) {
          console.error("[FastRadar Web] Error parsing stream message:", err);
        }
      };

      ws.onerror = () => {
        console.warn("[FastRadar Web] WebSocket offline, switching to REST fallback polling");
      };
    } catch (e) {
      console.warn("WebSocket init error:", e);
    }

    // Fallback initial REST fetch
    fetch("/api/pools")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPools(data);
          setSelectedPool(data[0]);
        }
      })
      .catch(() => {});

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Filtered pool list
  const filteredPools = pools.filter((p) => {
    const matchesSearch =
      p.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "NEAR_MIGRATION") {
      return p.curve.progressPercent >= 50 && !p.curve.complete;
    }
    if (filterTab === "GRADUATED") {
      return p.curve.complete;
    }
    return true;
  });

  const handleExecuteTrade = (poolId: string, side: "BUY" | "SELL", amount: number) => {
    // Add local simulated trade event immediately
    const mockTrade: TradeEvent = {
      signature: "5xyz" + Math.random().toString(36).substring(2, 10),
      poolId,
      type: side,
      user: "7x2F...9c1A",
      solAmount: amount,
      tokenAmount: amount * 12_500_000,
      priceSol: selectedPool ? selectedPool.curve.currentPriceSol : 0.00002,
      priceUsd: selectedPool ? selectedPool.curve.currentPriceUsd : 0.003,
      timestamp: Date.now(),
      slot: 298450120,
      latencyMs: 142
    };
    setTrades((prev) => [mockTrade, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      <Navbar
        benchmark={benchmark}
        connected={walletConnected}
        onConnectWallet={() => setWalletConnected(!walletConnected)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Hackathon Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-solana-purple/20 via-meteora-teal/10 to-solana-green/20 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-solana-purple/30 text-solana-purple border border-solana-purple/40">
              <Trophy className="w-5 h-5 text-solana-green" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Colosseum Crypto World's Fair Hackathon Entry
                <span className="text-[11px] bg-meteora-teal/20 text-meteora-teal px-2 py-0.5 rounded-full font-mono">
                  Meteora DBC + RPC Fast
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Triple-track submission: Superteam Nigeria Track ($5k USDG) • Meteora DBC ($20k USDC) • RPC Fast Infrastructure
              </p>
            </div>
          </div>
          <a
            href="https://github.com/chijesusboy2004-crypto"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View Architecture</span>
          </a>
        </div>

        {/* Live Infrastructure Benchmark */}
        <BenchmarkWidget benchmark={benchmark} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pools Feed (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Filter Tabs */}
              <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold w-full sm:w-auto">
                <button
                  onClick={() => setFilterTab("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "ALL"
                      ? "bg-gradient-to-r from-meteora-teal to-solana-green text-black font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All Pools ({pools.length})
                </button>
                <button
                  onClick={() => setFilterTab("NEAR_MIGRATION")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "NEAR_MIGRATION"
                      ? "bg-amber-500 text-black font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Near Migration (&gt;50%)
                </button>
                <button
                  onClick={() => setFilterTab("GRADUATED")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "GRADUATED"
                      ? "bg-emerald-500 text-black font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Graduated DLMM
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search token or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-meteora-teal/50 font-mono"
                />
              </div>
            </div>

            {/* Pools Grid */}
            <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
              {filteredPools.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
                  No pools matched your filter query.
                </div>
              ) : (
                filteredPools.map((p) => (
                  <PoolCard
                    key={p.id}
                    pool={p}
                    isSelected={selectedPool?.id === p.id}
                    onSelect={(pool) => setSelectedPool(pool)}
                    onOpenSwap={(pool) => setSwapModalPool(pool)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Active Curve Visualizer & Trade Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CurveVisualizer pool={selectedPool} />
            <TradeFeed trades={trades} />
          </div>
        </div>
      </main>

      {/* Swap Modal */}
      <SwapModal
        pool={swapModalPool}
        isOpen={Boolean(swapModalPool)}
        onClose={() => setSwapModalPool(null)}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-4 text-center text-xs text-slate-500 font-mono">
        Meteora FastRadar © 2026 • Built for Colosseum Hackathon • RPC Fast Mainnet Low-Latency Streaming
      </footer>
    </div>
  );
}
export default App;
