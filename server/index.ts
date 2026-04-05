import 'dotenv/config'
import app from './app.js'
import prisma from './utils/prisma.js'
import { validateEnv } from './utils/env.js'
import { logger } from './utils/logger.js'

// Validate environment variables at startup
validateEnv()

const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    logger.info('Conexão com banco de dados estabelecida')

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`)
      logger.info(`API disponível em http://localhost:${PORT}/api`)
    })
  } catch (error) {
    logger.error({ err: error }, 'Erro ao iniciar servidor')
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Desligando servidor...')
  await prisma.$disconnect()
  logger.info('Conexão com banco de dados encerrada')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Desligando servidor...')
  await prisma.$disconnect()
  logger.info('Conexão com banco de dados encerrada')
  process.exit(0)
})

startServer()