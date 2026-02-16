import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// ============================================================================
// AI Thinking Logger Plugin — streams AI reasoning to a log file + terminal
// Also logs battle results for overnight data collection
// ============================================================================
function aiThinkingLogger(): Plugin {
  const logPath = path.resolve(__dirname, 'ai_thinking.log');
  const battleLogPath = path.resolve(__dirname, 'battle_results.log');

  return {
    name: 'ai-thinking-logger',
    configureServer(server) {
      // Append session header (don't clear — we want continuous logs overnight)
      const sessionHeader = `\n\n${'#'.repeat(80)}\n# NEW SESSION -- ${new Date().toLocaleString()}\n${'#'.repeat(80)}\n\n`;
      fs.appendFileSync(logPath, sessionHeader, 'utf8');
      fs.appendFileSync(battleLogPath, sessionHeader, 'utf8');

      // ── AI Thinking endpoint ──
      server.middlewares.use('/api/log-thinking', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { player, text, side, type } = JSON.parse(body);
            const time = new Date().toLocaleTimeString();

            if (type === 'start') {
              const label = side === 'player' ? 'GPT' : 'R1';
              const separator = `\n${'='.repeat(80)}\n[${time}] [${label}] ${player} -- TURN START\n${'='.repeat(80)}\n`;
              fs.appendFileSync(logPath, separator, 'utf8');
            } else if (type === 'tool_call') {
              const line = `[${time}] ${player} >> ${text}\n`;
              fs.appendFileSync(logPath, line, 'utf8');
            } else if (type === 'thinking') {
              // FULL reasoning text — no truncation for overnight data collection
              const line = `[${time}] ${player} (${text.length} chars):\n${text}\n\n`;
              fs.appendFileSync(logPath, line, 'utf8');
            } else if (type === 'done') {
              const line = `[${time}] ${player} -- TURN COMPLETE (${text} chars of reasoning)\n\n`;
              fs.appendFileSync(logPath, line, 'utf8');
            }
          } catch {
            // Malformed request -- ignore
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('ok');
        });
      });

      // ── Battle Result endpoint — logs game outcomes ──
      server.middlewares.use('/api/log-battle', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const time = new Date().toLocaleString();
            const divider = '-'.repeat(80);

            let entry = `\n${divider}\n`;
            entry += `GAME #${data.gameNumber} -- ${time}\n`;
            entry += `${divider}\n`;
            entry += `WINNER: ${data.winner}\n`;
            entry += `FINAL HP: ${data.p1Name}: ${data.p1Hp} | ${data.p2Name}: ${data.p2Hp}\n`;
            entry += `TURNS: ${data.turns}\n`;
            entry += `DURATION: ${data.durationSeconds}s\n`;

            if (data.eventLog && data.eventLog.length > 0) {
              entry += `\nFULL BATTLE LOG:\n`;
              for (const line of data.eventLog) {
                entry += `  ${line}\n`;
              }
            }

            if (data.p1Deck) {
              entry += `\n${data.p1Name} DECK: ${data.p1Deck}\n`;
            }
            if (data.p2Deck) {
              entry += `\n${data.p2Name} DECK: ${data.p2Deck}\n`;
            }
            if (data.p1Graveyard) {
              entry += `${data.p1Name} GRAVEYARD: ${data.p1Graveyard}\n`;
            }
            if (data.p2Graveyard) {
              entry += `${data.p2Name} GRAVEYARD: ${data.p2Graveyard}\n`;
            }

            entry += `${divider}\n`;

            fs.appendFileSync(battleLogPath, entry, 'utf8');

            // Also append summary to thinking log
            const summary = `\n${'*'.repeat(80)}\n[${time}] GAME #${data.gameNumber} RESULT: ${data.winner} WINS | HP: ${data.p1Name}=${data.p1Hp} vs ${data.p2Name}=${data.p2Hp} | Turns: ${data.turns} | Duration: ${data.durationSeconds}s\n${'*'.repeat(80)}\n`;
            fs.appendFileSync(logPath, summary, 'utf8');
          } catch {
            // Malformed request -- ignore
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('ok');
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Allow Vite to serve files from the parent directory (for docs/ raw imports)
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        secure: true,
        // Prevent response buffering — critical for SSE streaming
        // Extended timeouts for long-running R1 reasoning
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['x-accel-buffering'] = 'no';
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setSocketKeepAlive(true);
          });
          proxy.on('error', (err, _req, res) => {
            console.error('[DeepSeek Proxy Error]', err.message);
            if (res && 'writeHead' in res) {
              (res as any).writeHead(502, { 'Content-Type': 'text/plain' });
              (res as any).end('Proxy error: ' + err.message);
            }
          });
        },
      },
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['x-accel-buffering'] = 'no';
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setSocketKeepAlive(true);
          });
          proxy.on('error', (err, _req, res) => {
            console.error('[OpenAI Proxy Error]', err.message);
            if (res && 'writeHead' in res) {
              (res as any).writeHead(502, { 'Content-Type': 'text/plain' });
              (res as any).end('Proxy error: ' + err.message);
            }
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    aiThinkingLogger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
