import "server-only";

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Firebase Admin] Variable de entorno requerida no definida: ${name}. "
      + "Verifica tu archivo .env.local o las variables del servidor.`
    );
  }
  return value;
}

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = requireEnv("FIREBASE_ADMIN_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
  // Reemplaza los \n escapados por saltos de línea reales
  const privateKey = requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
