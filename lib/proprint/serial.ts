export function formatSerial(value: number, prefix: string, suffix: string, padding: number) {
  return `${prefix}${String(value).padStart(Math.max(1, padding), "0")}${suffix}`;
}

export function productionRecordSerial(recordIndex: number, copies: number) {
  return Math.floor(recordIndex / Math.max(1, copies));
}
