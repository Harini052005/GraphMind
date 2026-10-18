import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import { checkFalkorHealth, closeFalkorConnection } from './graph/client.js'
import { initializeSchema, seedSemanticPatterns } from './graph/schema.js'
import patternsRouter from './routes/patterns.routes.js'

const app = express()

// Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const falkorStatus = await checkFalkorHealth()
  const status = falkorStatus.connected ? 'ok' : 'degraded'

  res.status(falkorStatus.connected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    falkordb: falkorStatus,
    llm: {
      configured: Boolean(config.llm.apiKey),
      model: config.llm.model,
      fallbackMode: !config.llm.apiKey ? 'active' : 'ready',
    },
  })
})

// Mount Routes
app.use('/api/patterns', patternsRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    },
  })
})

// Graceful Shutdown
const server = app.listen(config.port, async () => {
  console.log(`[RecallGraph Backend] Running on http://localhost:${config.port}`)
  console.log(`[RecallGraph Backend] Environment: ${config.nodeEnv}`)

  // Initialize graph schema and seed patterns asynchronously
  try {
    await initializeSchema()
    await seedSemanticPatterns()
  } catch (err) {
    console.warn('[Bootstrap] Note during graph bootstrap:', err.message)
  }
})

async function gracefulShutdown(signal) {
  console.log(`\n[RecallGraph Backend] Received ${signal}. Shutting down gracefully...`)
  server.close(async () => {
    await closeFalkorConnection()
    process.exit(0)
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export { app, server }
