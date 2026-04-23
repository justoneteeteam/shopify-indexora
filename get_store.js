import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sessions = await prisma.session.findMany()
  console.log("Sessions:", sessions)
  
  const stores = await prisma.store.findMany()
  console.log("Stores:", stores)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
