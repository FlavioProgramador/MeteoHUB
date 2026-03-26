import 'dotenv/config'
import app from './app.js'
import prisma from './utils/prisma.js'

const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Conexão com banco de dados estabelecida')

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📡 API disponível em http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('🔌 Conexão com banco de dados encerrada')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  console.log('🔌 Conexão com banco de dados encerrada')
  process.exit(0)
})

startServer()