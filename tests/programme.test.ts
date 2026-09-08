import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultProgramme, programmeDisplayName } from "../lib/proprint/programme/schema.ts";
import { clampSheetCount, sheetsForProgramme } from "../lib/proprint/programme/layout.ts";
import { getProgrammeTemplate } from "../lib/proprint/programme/templates.ts";
import {
    deleteProgrammeSave,
    listProgrammeSaves,
    saveProgrammeRecord,
} from "../lib/proprint/programme/saves.ts";

class MemoryStorage implements Storage {
    #map = new Map<string, string>();
    get length() {
        return this.#map.size;
    }
    clear() {
        this.#map.clear();
    }
    getItem(key: string) {
        return this.#map.has(key) ? this.#map.get(key)! : null;
    }
    key(index: number) {
        return [...this.#map.keys()][index] ?? null;
    }
    removeItem(key: string) {
        this.#map.delete(key);
    }
    setItem(key: string, value: string) {
        this.#map.set(key, String(value));
    }
}

test("floral matriarch exposes four A3 sheet faces", () => {
    const template = getProgrammeTemplate("floral-matriarch");
    assert.equal(template.sheets.length, 4);
    assert.equal(template.sheets[0].left, "acknowledgement");
    assert.equal(template.sheets[0].right, "cover");
});

test("sheet count clamps and slices the template map", () => {
    const content = createDefaultProgramme();
    content.sheetCount = 99;
    assert.equal(clampSheetCount(content.sheetCount), 4);
    content.sheetCount = 2;
    const sheets = sheetsForProgramme(content);
    assert.equal(sheets.length, 2);
    assert.equal(sheets[1].left, "service");
});

test("programme display name prefers first + surname", () => {
    const content = createDefaultProgramme();
    content.identity.displayFirstName = "Emma";
    content.identity.surnameLine = "Koki Wambua";
    assert.equal(programmeDisplayName(content), "Emma Koki Wambua programme");
});

test("programme saves create, list and delete locally", () => {
    const storage = new MemoryStorage();
    (globalThis as unknown as { window: { localStorage: Storage } }).window = { localStorage: storage };

    const content = createDefaultProgramme();
    const created = saveProgrammeRecord({ id: "prog-1", name: "  Emma programme  ", content });
    assert.equal(created.id, "prog-1");
    assert.equal(created.name, "Emma programme");
    assert.equal(listProgrammeSaves().length, 1);

    deleteProgrammeSave("prog-1");
    assert.equal(listProgrammeSaves().length, 0);
});
