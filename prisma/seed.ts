import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function main() {
  // Créer les bâtiments
  const buildings = await Promise.all([
    prisma.building.create({
      data: {
        name: "Résidence Les Fleurs",
        address: "123 rue des Fleurs, 75001 Paris",
      },
    }),
    prisma.building.create({
      data: {
        name: "Le Marais Élégant",
        address: "45 rue des Archives, 75004 Paris",
      },
    }),
    prisma.building.create({
      data: {
        name: "Tour Montparnasse Résidence",
        address: "12 rue du Départ, 75015 Paris",
      },
    }),
    prisma.building.create({
      data: {
        name: "Bastille Vue",
        address: "78 rue de la Roquette, 75011 Paris",
      },
    }),
    prisma.building.create({
      data: {
        name: "Montmartre Heights",
        address: "25 rue des Abbesses, 75018 Paris",
      },
    }),
  ]);

  // Créer un utilisateur
  const hashedPassword = await hashPassword("password123")
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      name: "John Doe",
      buildingId: buildings[0].id,
    },
  })

  // Créer quelques plats
  const dishes = await Promise.all([
    prisma.dish.create({
      data: {
        title: "Couscous Maison",
        description: "Délicieux couscous aux légumes et poulet",
        price: 12.50,
        ingredients: ["Semoule", "Poulet", "Légumes", "Épices"],
        images: [],
        portions: 4,
        userId: user.id,
      },
    }),
    prisma.dish.create({
      data: {
        title: "Lasagnes Végétariennes",
        description: "Lasagnes aux légumes de saison",
        price: 10.00,
        ingredients: ["Pâtes", "Légumes", "Sauce tomate", "Fromage"],
        images: [],
        portions: 6,
        userId: user.id,
      },
    }),
  ])

  console.log("Base de données initialisée avec succès !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })