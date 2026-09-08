import assert from "node:assert/strict";
import test from "node:test";
import { applyImportDraft, parseProgrammeWriteUp } from "../lib/proprint/programme/import-draft.ts";

const SAMPLE = `
Celebrating the Life of Jane Wanjiku Mwangi
Beloved Matriarch of the Mwangi Family
Sunrise: 12 Mar 1950 | Sunset: 2 Sep 2026
Rest in Peace, Mum

Acknowledgement
We the Mwangi Family thank you for standing with us. May God bless you.

Funeral Program
0800 hrs Departure from Nairobi
1000 hrs Arrival and seating
1030 hrs Opening prayer
1100 hrs Tributes / Flowers
1. Children
2. Siblings
3. Church
1200 hrs Sermon

Tribute
We remember a mother of quiet strength and warm laughter.
With love, the children

Hymns
Amazing Grace
Amazing grace how sweet the sound
That saved a wretch like me

Eulogy
Birth
Born in Murang'a on 12 March 1950.
Education
Attended local primary and secondary schools.
Career
Worked in hospitality until retirement.
Marriage and Family
Married to John Mwangi. Blessed with children and grandchildren.
Demise
Passed on 2 September 2026.
`;

test("rule-based import extracts cover identity and dates", () => {
    const draft = parseProgrammeWriteUp(SAMPLE);
    assert.equal(draft.identity?.displayFirstName, "Jane");
    assert.equal(draft.identity?.surnameLine, "Wanjiku Mwangi");
    assert.match(draft.identity?.sunrise || "", /1950/);
    assert.match(draft.identity?.sunset || "", /2026/);
    assert.ok((draft.acknowledgement?.body || "").includes("Mwangi Family"));
});

test("rule-based import builds service rows and speakers", () => {
    const draft = parseProgrammeWriteUp(SAMPLE);
    assert.ok((draft.service?.rows?.length || 0) >= 4);
    assert.equal(draft.service?.rows?.[0]?.time, "0800 hrs");
    assert.ok((draft.service?.tributeSpeakers || []).some((speaker) => speaker.label === "Children"));
});

test("applyImportDraft always returns editable programme content", () => {
    const draft = parseProgrammeWriteUp(SAMPLE);
    const content = applyImportDraft(draft);
    assert.equal(content.identity.displayFirstName, "Jane");
    assert.ok(content.service.rows.length >= 4);
    assert.ok(content.tributes[0]?.body.includes("quiet strength"));
    assert.ok(content.hymns[0]?.lyrics.toLowerCase().includes("amazing grace"));
    assert.ok(content.eulogy.sections.some((section) => section.heading === "Birth" && section.body.includes("Murang")));
});
