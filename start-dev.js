#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Starting Telugu Books Platform...");
console.log("📦 Frontend: http://localhost:8080");
console.log("🔧 Backend: http://localhost:5000");
console.log("💾 Database: MongoDB Atlas");
console.log("-----------------------------------");

// Start backend
const backend = spawn("npm", ["run", "dev"], {
  cwd: join(__dirname, "backend"),
  stdio: ["inherit", "pipe", "pipe"],
});

// Start frontend
const frontend = spawn("npm", ["run", "dev"], {
  cwd: join(__dirname, "frontend"),
  stdio: ["inherit", "pipe", "pipe"],
});

// Backend output
backend.stdout.on("data", (data) => {
  console.log(`🔧 Backend: ${data.toString().trim()}`);
});

backend.stderr.on("data", (data) => {
  console.error(`❌ Backend Error: ${data.toString().trim()}`);
});

// Frontend output
frontend.stdout.on("data", (data) => {
  console.log(`📦 Frontend: ${data.toString().trim()}`);
});

frontend.stderr.on("data", (data) => {
  console.error(`❌ Frontend Error: ${data.toString().trim()}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down servers...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down servers...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle backend exit
backend.on("close", (code) => {
  console.log(`🔧 Backend process exited with code ${code}`);
});

// Handle frontend exit
frontend.on("close", (code) => {
  console.log(`📦 Frontend process exited with code ${code}`);
});

console.log("✅ Both servers starting...");
console.log("Press Ctrl+C to stop all servers");
