-- Étape 1 : Ajouter la colonne apartment comme nullable
ALTER TABLE "users" ADD COLUMN "apartment" TEXT;

-- Étape 2 : Mettre à jour les enregistrements existants avec une valeur par défaut
UPDATE "users" SET "apartment" = 'A101' WHERE "apartment" IS NULL;

-- Étape 3 : Rendre la colonne non nullable
ALTER TABLE "users" ALTER COLUMN "apartment" SET NOT NULL;

-- Étape 4 : Ajouter la contrainte unique
ALTER TABLE "users" ADD CONSTRAINT "users_buildingId_apartment_key" UNIQUE ("buildingId", "apartment"); 