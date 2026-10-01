import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
  process.exit(1);
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
  projectId,
});

const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";
const db = databaseId === "(default)" ? getFirestore() : getFirestore(databaseId);
db.settings({ ignoreUndefinedProperties: true });

await db.collection("_meta").doc("proprint").set(
  {
    app: "proprint",
    collections: ["printOrders", "leads", "payments"],
    checkedAt: new Date().toISOString(),
  },
  { merge: true },
);

const orders = await db.collection("printOrders").limit(1).get();
console.log(`Firestore is ready for ${projectId}. Sampled ${orders.size} print order.`);
