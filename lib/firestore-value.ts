/** Drop undefined values so Firestore accepts the document. */
export function toFirestoreData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
