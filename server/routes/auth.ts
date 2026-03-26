import { Router } from 'express'
import { register, login, getProfile } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)

export default router