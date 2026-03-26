import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'

const app = express()

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)

// Parse JSON bodies
app.use(express.json())

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api', routes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
  })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
  })
})

export default app