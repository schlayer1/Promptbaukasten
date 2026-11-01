import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const CANDIDATE_FLASH_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite-preview',
];

function geminiLocalProxyPlugin(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/gemini') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }

      let rawBody = '';
      req.on('data', (chunk: any) => {
        rawBody += chunk;
      });

      req.on('end', async () => {
        try {
          const body = JSON.parse(rawBody || '{}');
          const clientKey = (typeof body.apiKey === 'string' && body.apiKey.trim() !== 'serverless-proxy')
            ? body.apiKey.trim()
            : '';
          const serverKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
          const activeKey = clientKey || serverKey;

          if (!activeKey) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'Kein Gemini API-Schlüssel konfiguriert (GEMINI_API_KEY fehlt im Environment).'
            }));
            return;
          }

          const { systemPrompt, userPrompt, model, temperature = 0.3 } = body;
          const candidateModels: string[] = [];
          if (model && model !== 'auto' && !candidateModels.includes(model)) {
            candidateModels.push(model);
          }
          for (const m of CANDIDATE_FLASH_MODELS) {
            if (!candidateModels.includes(m)) {
              candidateModels.push(m);
            }
          }

          let lastErrorMessage = '';
          const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;

          for (const currentModel of candidateModels) {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`;
            try {
              const fetchResp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                  generationConfig: { temperature, maxOutputTokens: 6000 }
                })
              });

              if (fetchResp.ok) {
                const data: any = await fetchResp.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text, model: currentModel }));
                  return;
                }
              }

              const errJson: any = await fetchResp.json().catch(() => ({}));
              lastErrorMessage = errJson.error?.message || `HTTP ${fetchResp.status}`;
            } catch (err: any) {
              lastErrorMessage = err?.message || String(err);
            }
          }

          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Kein Modell erreichbar: ${lastErrorMessage}` }));
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e?.message || 'Server error' }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'gemini-local-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), geminiLocalProxyPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        }
      }
    }
  }
});
