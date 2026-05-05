import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export interface Lead {
    id: string;
    type: string;
    createdAt: string;
    status: "new" | "contacted" | "converted" | "rejected";
    data: Record<string, unknown>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureStore() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.access(LEADS_FILE);
    } catch {
        await fs.writeFile(LEADS_FILE, "[]", "utf-8");
    }
}

export async function saveLead(type: string, data: Record<string, unknown>): Promise<Lead | null> {
    try {
        await ensureStore();
        const raw = await fs.readFile(LEADS_FILE, "utf-8");
        const leads: Lead[] = JSON.parse(raw);
        const lead: Lead = {
            id: crypto.randomUUID(),
            type,
            createdAt: new Date().toISOString(),
            status: "new",
            data,
        };
        leads.unshift(lead);
        await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
        return lead;
    } catch (err) {
        console.warn("[leads] Persistence skipped (read-only FS?):", (err as Error).message);
        return null;
    }
}

export async function listLeads(): Promise<Lead[]> {
    try {
        await ensureStore();
        const raw = await fs.readFile(LEADS_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<boolean> {
    try {
        await ensureStore();
        const raw = await fs.readFile(LEADS_FILE, "utf-8");
        const leads: Lead[] = JSON.parse(raw);
        const idx = leads.findIndex((l) => l.id === id);
        if (idx === -1) return false;
        leads[idx].status = status;
        await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
        return true;
    } catch {
        return false;
    }
}
