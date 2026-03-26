import { Router } from 'express'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, getFavorites)
router.post('/', authenticate, addFavorite)
router.delete('/:cityId', authenticate, removeFavorite)

export default router