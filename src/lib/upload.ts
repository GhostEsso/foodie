import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Vérifier que toutes les variables d'environnement sont définies
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET n'est pas défini");
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Storage Bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

// Initialiser Firebase seulement s'il n'est pas déjà initialisé
let app;
if (!getApps().length) {
  console.log("Initialisation de Firebase avec la config:", {
    ...firebaseConfig,
    apiKey: "HIDDEN"
  });
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialiser Storage avec des options spécifiques
const storage = getStorage(app);

export async function uploadImage(file: File): Promise<string> {
  try {
    console.log("Début de l'upload...");
    console.log("Bucket de stockage:", storage.app.options.storageBucket);

    // Générer un nom unique pour l'image
    const extension = file.name.split(".").pop();
    const fileName = `dishes/${uuidv4()}.${extension}`;
    console.log("Nom du fichier:", fileName);

    // Créer une référence dans Firebase Storage
    const storageRef = ref(storage, fileName);

    // Upload le fichier avec des métadonnées
    console.log("Début de l'upload du fichier...", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: "foody-app"
      }
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log("Fichier uploadé avec succès:", snapshot.metadata);

    // Récupérer l'URL de l'image
    console.log("Récupération de l'URL...");
    const downloadURL = await getDownloadURL(storageRef);
    console.log("URL récupérée:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Erreur détaillée lors de l'upload:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
      throw new Error(`Impossible d'uploader l'image: ${error.message}`);
    }
    throw new Error("Impossible d'uploader l'image");
  }
} 