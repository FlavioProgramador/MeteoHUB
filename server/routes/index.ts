import { Router } from 'express'
import authRoutes from './auth.js'
import favoritesRoutes from './favorites.js'
import historyRoutes from './history.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/favorites', favoritesRoutes)
router.use('/history', historyRoutes)

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router