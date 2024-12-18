import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Fonction utilitaire pour générer des dates de disponibilité
function generateAvailabilityDates() {
  const now = new Date();
  const availableFrom = new Date(now);
  availableFrom.setHours(availableFrom.getHours() + Math.floor(Math.random() * 24)); // Disponible dans 0-24h

  const availableTo = new Date(availableFrom);
  availableTo.setHours(availableTo.getHours() + Math.floor(Math.random() * 48) + 1); // Disponible pendant 1-48h

  return {
    availableFrom,
    availableTo
  };
}

async function main() {
  // Création des bâtiments
  const buildings = await Promise.all([
    prisma.building.create({
      data: { 
        name: "Bastille Vue",
        address: "12 rue de la Bastille, 75011 Paris"
      },
    }),
    prisma.building.create({
      data: { 
        name: "République Résidence",
        address: "45 place de la République, 75003 Paris"
      },
    }),
    prisma.building.create({
      data: { 
        name: "Nation Plaza",
        address: "8 place de la Nation, 75012 Paris"
      },
    }),
  ]);

  // Création des utilisateurs avec leurs bâtiments respectifs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "chef1@example.com",
        password: await hash("password123", 12),
        name: "Chef Pierre",
        buildingId: buildings[0].id,
        apartment: "A101",
      },
    }),
    prisma.user.create({
      data: {
        email: "chef2@example.com",
        password: await hash("password123", 12),
        name: "Chef Marie",
        buildingId: buildings[1].id,
        apartment: "B202",
      },
    }),
    prisma.user.create({
      data: {
        email: "chef3@example.com",
        password: await hash("password123", 12),
        name: "Chef Jean",
        buildingId: buildings[2].id,
        apartment: "C303",
      },
    }),
  ]);

  // Création des plats pour chaque utilisateur
  const dishes = await Promise.all([
    // Plats pour Bastille Vue
    prisma.dish.create({
      data: {
        title: "Coq au Vin",
        description: "Plat traditionnel français mijoté au vin rouge",
        price: 15.50,
        available: true,
        portions: 4,
        userId: users[0].id,
        ...generateAvailabilityDates(),
      },
    }),
    prisma.dish.create({
      data: {
        title: "Gratin Dauphinois",
        description: "Pommes de terre gratinées à la crème",
        price: 12.00,
        available: true,
        portions: 6,
        userId: users[0].id,
        ...generateAvailabilityDates(),
      },
    }),

    // Plats pour République Résidence
    prisma.dish.create({
      data: {
        title: "Pad Thai",
        description: "Nouilles sautées aux légumes et crevettes",
        price: 13.50,
        available: true,
        portions: 3,
        userId: users[1].id,
        ...generateAvailabilityDates(),
      },
    }),
    prisma.dish.create({
      data: {
        title: "Curry Vert",
        description: "Curry thaï au lait de coco",
        price: 14.00,
        available: true,
        portions: 4,
        userId: users[1].id,
        ...generateAvailabilityDates(),
      },
    }),

    // Plats pour Nation Plaza
    prisma.dish.create({
      data: {
        title: "Lasagnes",
        description: "Lasagnes maison à la bolognaise",
        price: 16.00,
        available: true,
        portions: 8,
        userId: users[2].id,
        ...generateAvailabilityDates(),
      },
    }),
    prisma.dish.create({
      data: {
        title: "Risotto aux Champignons",
        description: "Risotto crémeux aux champignons",
        price: 14.50,
        available: true,
        portions: 4,
        userId: users[2].id,
        ...generateAvailabilityDates(),
      },
    }),
  ]);

  console.log("Base de données ensemencée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });