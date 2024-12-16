import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadImage(file: File): Promise<string> {
  try {
    // Générer un nom unique pour l'image
    const extension = file.name.split(".").pop();
    const fileName = `dishes/${uuidv4()}.${extension}`;

    // Créer une référence dans Firebase Storage
    const storageRef = ref(storage, fileName);

    // Convertir le File en Blob
    const response = await fetch(file);
    const blob = await response.blob();

    // Upload le fichier
    await uploadBytes(storageRef, blob);

    // Récupérer l'URL de l'image
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("Impossible d'uploader l'image");
  }
} 