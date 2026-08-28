import { formatSerial } from "./serial";

export function createBookManifest(input: { start: number; end: number; setsPerBook: number; prefix: string; suffix: string; padding: number }) {
  const rows = [["Book number", "Start serial", "End serial", "Number of sets"]];
  if (input.end < input.start || input.setsPerBook < 1) return rows;
  const books = Math.ceil((input.end - input.start + 1) / input.setsPerBook);
  for (let index = 0; index < books; index += 1) {
    const start = input.start + index * input.setsPerBook;
    const end = Math.min(input.end, start + input.setsPerBook - 1);
    rows.push([String(index + 1), formatSerial(start, input.prefix, input.suffix, input.padding), formatSerial(end, input.prefix, input.suffix, input.padding), String(end - start + 1)]);
  }
  return rows;
}

export function manifestToCsv(rows: string[][]) {
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
}
