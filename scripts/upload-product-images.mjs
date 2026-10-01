import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || "tenderpro-480721.firebasestorage.app";

if (!projectId || !clientEmail || !privateKey) {
  console.error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
  process.exit(1);
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
  storageBucket: bucketName,
});

const directory = path.join(process.cwd(), "public/images/products");
const files = (await readdir(directory)).filter((name) => name.endsWith(".jpg")).sort();
const bucket = getStorage().bucket();

for (const name of files) {
  const destination = `products/v2/${name}`;
  const file = bucket.file(destination);
  await file.save(await readFile(path.join(directory, name)), {
    resumable: false,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  await file.makePublic();
  console.log(`https://storage.googleapis.com/${bucketName}/${destination}`);
}
