import assert from "node:assert/strict";
import test from "node:test";
import {
    deleteSave,
    listSaves,
    saveRecord,
    type SerialProSavedSettings,
} from "../lib/proprint/local-saves.ts";

class MemoryStorage {
    #map = new Map<string, string>();
    getItem(key: string) {
        return this.#map.has(key) ? this.#map.get(key)! : null;
    }
    setItem(key: string, value: string) {
        this.#map.set(key, String(value));
    }
    removeItem(key: string) {
        this.#map.delete(key);
    }
    clear() {
        this.#map.clear();
    }
}

const settings: SerialProSavedSettings = {
    start: 1,
    end: 100,
    prefix: "RCT-",
    suffix: "",
    padding: 6,
    copies: 1,
    setsPerBook: 50,
    fontSize: 12,
    bold: true,
    second: false,
    positions: [
        { x: 72, y: 88 },
        { x: 72, y: 12 },
    ],
    mode: "cut-stack",
    preset: "SRA3",
    landscape: false,
    customWidth: 320,
    customHeight: 450,
    margin: 8,
    gx: 4,
    gy: 4,
    cropMarks: true,
    templatePage: 1,
    sourceFileName: "receipts.pdf",
};

test("local saves create, update, list and delete records", () => {
    const storage = new MemoryStorage();
    (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = { localStorage: storage };

    const created = saveRecord("serialpro", { id: "save-1", name: "  Receipt books  ", settings });
    assert.equal(created.id, "save-1");
    assert.equal(created.name, "Receipt books");
    assert.equal(listSaves("serialpro").length, 1);

    const updated = saveRecord("serialpro", {
        id: created.id,
        name: "Receipt books v2",
        settings: { ...settings, end: 200 },
    });
    assert.equal(updated.id, created.id);
    assert.equal(updated.name, "Receipt books v2");
    assert.equal(updated.settings.end, 200);
    assert.equal(listSaves("serialpro").length, 1);

    deleteSave("serialpro", created.id);
    assert.equal(listSaves("serialpro").length, 0);
});
