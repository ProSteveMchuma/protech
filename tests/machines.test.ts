import assert from "node:assert/strict";
import test from "node:test";
import { cheapestMachine, estimateMachineCost, type MachineProfile } from "../lib/proprint/machines.ts";

const digital: MachineProfile = { id: "d", name: "Toner", type: "digital", minCharge: 300, clickPerSide: 4 };
const offset: MachineProfile = { id: "o", name: "Offset", type: "offset", minCharge: 2500, platePerSide: 700, makeReady: 800, impressionPerSide: 0.6 };

test("digital cost is clicks with a minimum charge floor", () => {
    const small = estimateMachineCost(digital, 10, 1); // 40 -> floored to 300
    assert.equal(small.printCost, 40);
    assert.equal(small.total, 300);
    const large = estimateMachineCost(digital, 1000, 2); // 8000
    assert.equal(large.printCost, 8000);
    assert.equal(large.total, 8000);
});

test("offset cost includes plates and make-ready", () => {
    const est = estimateMachineCost(offset, 1000, 2);
    // setup = 700*2 + 800 = 2200; print = 1000*2*0.6 = 1200; total = 3400
    assert.equal(est.setup, 2200);
    assert.equal(est.printCost, 1200);
    assert.equal(est.total, 3400);
});

test("cheapest machine flips from digital to offset as the run grows", () => {
    const shortRun = cheapestMachine([digital, offset], 100, 2);
    assert.equal(shortRun?.profile.id, "d"); // digital: max(300, 800)=800 < offset 2320
    const longRun = cheapestMachine([digital, offset], 20000, 2);
    assert.equal(longRun?.profile.id, "o"); // offset wins the long run
});
