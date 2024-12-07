import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

// Configure CORS for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'your-production-domain.com'
    : 'http://localhost:5173'
}));

// Proxy middleware configuration
const anthropicProxy = createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ai': '/v1/messages'  // Rewrite path
  },
  onProxyReq: (proxyReq) => {
    // Add API key from server environment
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not defined');
    }
    proxyReq.setHeader('x-api-key', process.env.ANTHROPIC_API_KEY);
    proxyReq.setHeader('anthropic-version', '2023-06-01');
  },
  onError: (err, _req, res: express.Response) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy service error' });
  }
});

app.use('/api/ai', anthropicProxy);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API proxy server running on port ${PORT}`);
});