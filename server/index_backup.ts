import express, { type Request, Response, NextFunction } from "express";
import { spawn } from "child_process";
import path from "path";

const app = express();

// Start Nuxt 3 frontend on port 3000
console.log('🚀 Starting Nuxt 3 frontend...');
const frontendDir = path.join(process.cwd(), 'frontend');
const nuxtProcess = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'pipe'
});

nuxtProcess.stdout?.on('data', (data) => {
  console.log(`[Nuxt] ${data}`);
});

nuxtProcess.stderr?.on('data', (data) => {
  console.log(`[Nuxt Error] ${data}`);
});

// Proxy all requests to Nuxt frontend
app.use((req, res) => {
  res.redirect(`http://localhost:3000${req.url}`);
});

const port = parseInt(process.env.PORT!) || 5000;
app.listen(port, () => {
  console.log(`🎯 Proxy server running on port ${port}`);
  console.log(`📋 Redirecting to Nuxt 3 frontend on port 3000`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});