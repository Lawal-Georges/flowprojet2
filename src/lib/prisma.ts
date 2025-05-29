import { PrismaClient } from '@prisma/client'


// Singleton amélioré avec typage
const prismaClientSingleton = (): PrismaClient => {
  const client = new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
      ...(process.env.NODE_ENV === 'development'
        ? [{ level: 'query', emit: 'event' } as const]
        : []),
    ],
  })

  // Logging des requêtes en dev
  if (process.env.NODE_ENV === 'development') {
    client.$on('query', (e: { query: string; duration: number }) => {
      console.log('\n📝 Query:', e.query)
      console.log('⏱️  Duration:', e.duration, 'ms')
    })
  }

  return client
}

// Déclaration globale type-safe
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Initialisation
const prisma = globalThis.prisma ?? prismaClientSingleton()

// Connexion automatique en production
if (process.env.NODE_ENV === 'production') {
  (prisma as PrismaClient).$connect()
    .then(() => console.log('✅ Prisma Client connecté'))
    .catch((err: unknown) => {
      console.error('❌ Erreur de connexion Prisma:', err)
      process.exit(1)
    })
}

// Hot-reload safe
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Nettoyage propre
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
})

export default prisma
