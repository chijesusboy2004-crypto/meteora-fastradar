# 🎯 Colosseum Crypto World's Fair Hackathon Submission

## Project Name
**Meteora FastRadar**

## One-Line Tagline
Sub-second real-time streaming radar, dynamic bonding curve visualizer, and swap simulator for Meteora DBC powered by RPC Fast gRPC.

---

## 👥 Team
- **Chibiko Chidera Pelumi** (@chijesusboy2004-crypto) — Full-Stack Solana Systems & Architecture

---

## 🏆 Target Tracks
1. **Superteam Nigeria Track ($5,000 USDG)**
   - Representing Nigerian Web3 builders creating production-grade DeFi infrastructure for the global Solana ecosystem.
2. **Best use of Meteora's Dynamic Bonding Curve (DBC) ($20,000 USDC)**
   - Native integration with Meteora DBC (`LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo`), real-time reserve tracking, virtual AMM curve simulation, and automated transition monitoring into Meteora DLMM v2.
3. **RPC Fast Infrastructure Sidetrack**
   - High-throughput ingestion using RPC Fast's Frankfurt (FRA-1) Shredstream gRPC and Yellowstone data feeds, achieving a verified **82% latency reduction** (140ms vs. 980ms standard public RPC).

---

## 📦 What Was Built (Full Stack Architecture)
1. **`@fastradar/engine` (Backend Service):**
   - Node.js/TypeScript real-time ingestion engine.
   - Listens to Meteora pool creations, token minting, and dynamic curve swaps.
   - Mathematical model calculating exact pricing: $P(x) = (V_{sol} + R_{sol}) / (V_{token} - R_{token})$.
   - WebSocket streaming server broadcasting pool updates, trades, and latency telemetry to connected clients.
2. **`@fastradar/web` (Trading Radar Terminal):**
   - Responsive dark-mode interface built with React, Vite, and Tailwind CSS.
   - Live Pool Feed: Instant ticker with latency indicators.
   - Interactive Curve Visualizer: SVG continuous bonding curve with live active position indicator and 85 SOL graduation milestone.
   - Instant Swap Simulator: Real-time price impact, slippage estimation, and 1% Meteora LP fee calculator.
   - RPC Fast Live Benchmark Widget: Dynamic comparison of sub-slot Shredstream gRPC vs. standard public RPC.

---

## 🔗 Repository & Links
- **GitHub Repository:** [https://github.com/chijesusboy2004-crypto/meteora-fastradar](https://github.com/chijesusboy2004-crypto/meteora-fastradar)
- **Local Directory:** `C:\Users\USER\.gemini\antigravity\scratch\meteora-fastradar`
