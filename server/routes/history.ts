import { Router } from 'express'
import {
  getHistory,
  addToHistory,
  clearHistory,
} from '../controllers/historyController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, getHistory)
router.post('/', authenticate, addToHistory)
router.delete('/', authenticate, clearHistory)

export default router