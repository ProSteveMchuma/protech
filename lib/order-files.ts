import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestoreDatabase } from "./firebase-admin";
import { artworkExtension, MAX_ARTWORK_BYTES } from "./order-desk";

const bucketName = process.env.FIREBASE_STORAGE_BUCKET || "tenderpro-480721.firebasestorage.app";
const localRoot = path.join(process.cwd(), "data", "artwork");

export type StoredArtwork = {
  name: string;
  size: number;
  contentType: string;
  path: string;
};

function storageBucket() {
  if (!getFirestoreDatabase()) return null;
  const app = getApps()[0];
  if (!app) return null;
  return getStorage(app).bucket(bucketName);
}

export async function saveArtworkFile(orderId: string, file: { bytes: Buffer; contentType: string; originalName: string }): Promise<StoredArtwork> {
  const extension = artworkExtension(file.contentType);
  if (!extension) throw new Error("Use a PDF, PNG, JPG, or WebP file.");
  if (file.bytes.length === 0 || file.bytes.length > MAX_ARTWORK_BYTES) throw new Error("Artwork must be under 15 MB.");
  const safeName = file.originalName.replace(/[^\w.\- ]+/g, "").slice(0, 80) || `artwork.${extension}`;
  const objectPath = `orders/${orderId}/artwork.${extension}`;
  const bucket = storageBucket();
  if (bucket) {
    await bucket.file(objectPath).save(file.bytes, {
      resumable: false,
      metadata: { contentType: file.contentType, cacheControl: "private, max-age=0" },
    });
  } else {
    const directory = path.join(localRoot, orderId);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, `artwork.${extension}`), file.bytes);
    await fs.writeFile(path.join(directory, "meta.json"), JSON.stringify({ contentType: file.contentType, name: safeName }), "utf-8");
  }
  return { name: safeName, size: file.bytes.length, contentType: file.contentType, path: objectPath };
}

export async function readArtworkFile(stored: StoredArtwork): Promise<Buffer | null> {
  const bucket = storageBucket();
  if (bucket) {
    const [bytes] = await bucket.file(stored.path).download();
    return bytes;
  }
  try {
    return await fs.readFile(path.join(process.cwd(), "data", "artwork", path.basename(path.dirname(stored.path)), path.basename(stored.path)));
  } catch {
    return null;
  }
}
