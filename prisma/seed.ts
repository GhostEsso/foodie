import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer les bâtiments
  const building1 = await prisma.building.create({
    data: {
      name: "Résidence Les Lilas",
      address: "123 rue des Fleurs",
    },
  });

  const building2 = await prisma.building.create({
    data: {
      name: "Résidence Les Roses",
      address: "456 avenue des Jardins",
    },
  });

  // Créer les utilisateurs
  const hashedPassword = await hash("password123", 12);

  await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        password: hashedPassword,
        name: "John Doe",
        buildingId: building1.id,
        apartment: "A101",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        password: hashedPassword,
        name: "Jane Smith",
        buildingId: building1.id,
        apartment: "B202",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN",
        buildingId: building2.id,
        apartment: "C303",
        emailVerified: true,
      },
    }),
  ]);

  console.log("Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });