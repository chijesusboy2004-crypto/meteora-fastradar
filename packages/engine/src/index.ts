import { createServer } from "./server.js";

const PORT = parseInt(process.env.PORT || "3001", 10);
const server = createServer(PORT);

server.start();

process.on("SIGINT", () => {
  console.log("\n[FastRadar Engine] Shutting down gracefully...");
  server.stop();
  process.exit(0);
});
