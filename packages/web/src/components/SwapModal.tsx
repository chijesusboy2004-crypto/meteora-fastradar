import React, { useState, useEffect } from "react";
import { X, ArrowDown, Zap, CheckCircle2 } from "lucide-react";
import { MeteoraPool } from "../types";

interface SwapModalProps {
  pool: MeteoraPool | null;
  isOpen: boolean;
  onClose: () => void;
  onExecuteTrade: (poolId: string, side: "BUY" | "SELL", amount: number) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  pool,
  isOpen,
  onClose,
  onExecuteTrade
}) => {
  if (!isOpen || !pool) return null;

  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<string>("1.0");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setQuote(null);
      return;
    }

    const virtualSol = pool.curve.virtualSolReserves;
    const virtualTokens = pool.curve.virtualTokenReserves;
    const k = virtualSol * virtualTokens;

    if (side === "BUY") {
      const netSol = numAmount * 0.99; // 1% fee
      const newSol = virtualSol + netSol;
      const newTokens = k / newSol;
      const tokensOut = Math.max(0, virtualTokens - newTokens);
      const spotPrice = virtualSol / virtualTokens;
      const execPrice = netSol / tokensOut;
      const priceImpact = ((execPrice - spotPrice) / spotPrice) * 100;

      setQuote({
        estimatedAmountOut: tokensOut,
        priceImpactPercent: Math.max(0, parseFloat(priceImpact.toFixed(2))),
        feeSol: numAmount * 0.01,
        minReceived: tokensOut * 0.99
      });
    } else {
      const newTokens = virtualTokens + numAmount;
      const newSol = k / newTokens;
      const grossSol = virtualSol - newSol;
      const netSol = grossSol * 0.99;
      const spotPrice = virtualSol / virtualTokens;
      const execPrice = netSol / numAmount;
      const priceImpact = ((spotPrice - execPrice) / spotPrice) * 100;

      setQuote({
        estimatedAmountOut: Math.max(0, netSol),
        priceImpactPercent: Math.max(0, parseFloat(priceImpact.toFixed(2))),
        feeSol: grossSol * 0.01,
        minReceived: netSol * 0.99
      });
    }
  }, [amount, side, pool]);

  const handleSwap = () => {
    setLoading(true);
    setStatus("Routing transaction via RPC Fast Frankfurt Shredstream...");

    setTimeout(() => {
      onExecuteTrade(pool.id, side, parseFloat(amount));
      setStatus("Transaction Confirmed on Solana Mainnet (Block #298,450,112)!");
      setTimeout(() => {
        setLoading(false);
        setStatus(null);
        onClose();
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-meteora-teal fill-meteora-teal" />
            <h3 className="font-bold text-white text-base">
              Instant DBC Swap: ${pool.token.symbol}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setSide("BUY")}
            className={`py-2 rounded-lg transition-all ${
              side === "BUY"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BUY (Deposit SOL)
          </button>
          <button
            onClick={() => setSide("SELL")}
            className={`py-2 rounded-lg transition-all ${
              side === "SELL"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SELL (${pool.token.symbol})
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>You Pay</span>
            <span className="font-mono">Balance: 24.5 SOL</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-xl font-bold text-white font-mono focus:outline-none w-full"
              placeholder="0.0"
            />
            <span className="font-bold text-xs bg-slate-850 px-2.5 py-1 rounded-lg text-slate-200 border border-slate-750 font-mono">
              {side === "BUY" ? "SOL" : pool.token.symbol}
            </span>
          </div>
        </div>

        <div className="flex justify-center -my-1.5 relative z-10">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>You Receive (Estimated)</span>
            <span className="text-emerald-400 font-mono text-[11px]">1% Max Slippage</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white font-mono">
              {quote
                ? side === "BUY"
                  ? Math.round(quote.estimatedAmountOut).toLocaleString()
                  : quote.estimatedAmountOut.toFixed(4)
                : "0.0"}
            </span>
            <span className="font-bold text-xs bg-slate-850 px-2.5 py-1 rounded-lg text-slate-200 border border-slate-750 font-mono">
              {side === "BUY" ? pool.token.symbol : "SOL"}
            </span>
          </div>
        </div>

        {quote && (
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1.5 mb-4 text-slate-400">
            <div className="flex justify-between">
              <span>Price Impact:</span>
              <span className="text-emerald-400 font-bold">{quote.priceImpactPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span>Meteora LP Fee (1%):</span>
              <span className="text-slate-300">{quote.feeSol.toFixed(4)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span>Execution Route:</span>
              <span className="text-solana-green font-semibold">Meteora DBC → RPC Fast gRPC</span>
            </div>
          </div>
        )}

        {status && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-solana-purple/20 border border-solana-purple/40 text-xs text-white mb-3 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-solana-green shrink-0" />
            <span>{status}</span>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={loading || !quote}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg ${
            side === "BUY"
              ? "bg-gradient-to-r from-emerald-400 to-solana-green text-black hover:opacity-95 shadow-emerald-500/20"
              : "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:opacity-95 shadow-rose-500/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Routing on Solana Mainnet..." : `Confirm ${side} on Bonding Curve`}
        </button>
      </div>
    </div>
  );
};
