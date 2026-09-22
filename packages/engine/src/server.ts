import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { MeteoraSimulator } from "./simulator.js";
import { BondingCurveMath } from "./curveMath.js";

export function createServer(port: number = 3001) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const simulator = new MeteoraSimulator();

  // Active WebSocket clients
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    // Send initial snapshot of all pools
    ws.send(JSON.stringify({
      type: "INITIAL_STATE",
      data: {
        pools: simulator.getPools(),
        timestamp: Date.now()
      }
    }));

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  // Wire simulator events to WebSocket broadcast
  simulator.subscribe((event) => {
    const payload = JSON.stringify(event);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  // REST API Routes
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "Meteora FastRadar Engine",
      network: "Solana Mainnet-Beta (RPC Fast FRA-1)",
      timestamp: Date.now()
    });
  });

  app.get("/api/pools", (req, res) => {
    res.json(simulator.getPools());
  });

  app.get("/api/pools/:id", (req, res) => {
    const pool = simulator.getPoolById(req.params.id);
    if (!pool) return res.status(404).json({ error: "Pool not found" });
    res.json(pool);
  });

  app.post("/api/quote", (req, res) => {
    const { poolId, side, amount } = req.body;
    const pool = simulator.getPoolById(poolId);
    if (!pool) return res.status(404).json({ error: "Pool not found" });

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const quote = side === "BUY"
      ? BondingCurveMath.calculateBuyOutput(pool.curve, numAmount)
      : BondingCurveMath.calculateSellOutput(pool.curve, numAmount);

    res.json(quote);
  });

  return {
    start: () => {
      server.listen(port, () => {
        console.log(`[FastRadar Engine] HTTP & WebSocket Server running on port ${port}`);
        simulator.start();
      });
    },
    stop: () => {
      simulator.stop();
      server.close();
    }
  };
}
