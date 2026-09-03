"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { MachineProfile } from "./machines";
import { DEFAULT_MACHINES } from "./machines";

export interface StockItem {
    id: string;
    name: string;
    gsm: number;
    sheetCost: number;
    note?: string;
}

export const DEFAULT_STOCKS: StockItem[] = [
    { id: "bond-80", name: "80gsm bond", gsm: 80, sheetCost: 6 },
    { id: "art-130", name: "130gsm gloss art", gsm: 130, sheetCost: 11 },
    { id: "art-170", name: "170gsm gloss art", gsm: 170, sheetCost: 15 },
    { id: "board-300", name: "300gsm board", gsm: 300, sheetCost: 24 },
    { id: "ncr-white", name: "NCR white (per sheet)", gsm: 55, sheetCost: 9 },
];

const STOCK_KEY = "proprint.catalog.stocks";
const MACHINE_KEY = "proprint.catalog.machines";
const listeners = new Set<() => void>();
let stockCacheRaw: string | null = null;
let stockCache: StockItem[] = DEFAULT_STOCKS;
let machineCacheRaw: string | null = null;
let machineCache: MachineProfile[] = DEFAULT_MACHINES;

function canUse() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emit() {
    for (const l of listeners) l();
}

function read<T>(key: string, fallback: T[], cacheRaw: string | null, setCache: (raw: string | null, val: T[]) => T[]): T[] {
    if (!canUse()) return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === cacheRaw) return setCache(raw, fallback); // unchanged: return current cache via setter
    try {
        const parsed = raw ? (JSON.parse(raw) as T[]) : fallback;
        return setCache(raw, Array.isArray(parsed) && parsed.length ? parsed : fallback);
    } catch {
        return setCache(raw, fallback);
    }
}

export function getStocks(): StockItem[] {
    return read<StockItem>(STOCK_KEY, DEFAULT_STOCKS, stockCacheRaw, (raw, val) => {
        if (raw !== stockCacheRaw) {
            stockCacheRaw = raw;
            stockCache = val;
        }
        return stockCache;
    });
}

export function getMachines(): MachineProfile[] {
    return read<MachineProfile>(MACHINE_KEY, DEFAULT_MACHINES, machineCacheRaw, (raw, val) => {
        if (raw !== machineCacheRaw) {
            machineCacheRaw = raw;
            machineCache = val;
        }
        return machineCache;
    });
}

function writeStocks(items: StockItem[]) {
    if (!canUse()) return;
    window.localStorage.setItem(STOCK_KEY, JSON.stringify(items));
    stockCacheRaw = null;
    emit();
}

function writeMachines(items: MachineProfile[]) {
    if (!canUse()) return;
    window.localStorage.setItem(MACHINE_KEY, JSON.stringify(items));
    machineCacheRaw = null;
    emit();
}

export function addStock(item: Omit<StockItem, "id">): StockItem {
    const record: StockItem = { ...item, id: `stock-${Date.now()}` };
    writeStocks([...getStocks(), record]);
    return record;
}

export function removeStock(id: string) {
    writeStocks(getStocks().filter((s) => s.id !== id));
}

export function addMachine(item: Omit<MachineProfile, "id">): MachineProfile {
    const record: MachineProfile = { ...item, id: `machine-${Date.now()}` };
    writeMachines([...getMachines(), record]);
    return record;
}

export function removeMachine(id: string) {
    writeMachines(getMachines().filter((m) => m.id !== id));
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function useStocks(): StockItem[] {
    return useSyncExternalStore(subscribe, useCallback(() => getStocks(), []), () => DEFAULT_STOCKS);
}

export function useMachines(): MachineProfile[] {
    return useSyncExternalStore(subscribe, useCallback(() => getMachines(), []), () => DEFAULT_MACHINES);
}
