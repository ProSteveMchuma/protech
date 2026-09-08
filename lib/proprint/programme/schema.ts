/** A3 landscape funeral programme — content schema (settings only; photos come later). */

export const A3_WIDTH_MM = 420;
export const A3_HEIGHT_MM = 297;
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const BLEED_MM = 3;
export const SAFE_MM = 8;
export const GUTTER_MM = 6;
export const MAX_SHEETS = 4;

export type ProgrammeTemplateId = "floral-matriarch";

export type ServiceRow = {
    id: string;
    time: string;
    activity: string;
};

export type TributeSpeaker = {
    id: string;
    label: string;
};

export type TributeBlock = {
    id: string;
    title: string;
    body: string;
    signOff: string;
};

export type HymnBlock = {
    id: string;
    title: string;
    lyrics: string;
};

export type EulogySection = {
    id: string;
    heading: string;
    body: string;
    enabled: boolean;
};

export type ProgrammeContent = {
    templateId: ProgrammeTemplateId;
    sheetCount: number;
    identity: {
        displayFirstName: string;
        surnameLine: string;
        coverTitle: string;
        roleLine: string;
        sunrise: string;
        sunset: string;
        attributes: string[];
        dedication: string;
        motto: string;
        venue: string;
        serviceDate: string;
        serviceTime: string;
    };
    acknowledgement: {
        title: string;
        body: string;
        footerLine: string;
    };
    service: {
        title: string;
        rows: ServiceRow[];
        masterOfCeremonies: string;
        presidingPastor: string;
        choir: string;
        tributeSpeakers: TributeSpeaker[];
    };
    tributes: TributeBlock[];
    hymns: HymnBlock[];
    eulogy: {
        title: string;
        tagline: string;
        sections: EulogySection[];
        closingQuote: string;
    };
    memories: {
        title: string;
        subtitle: string;
        caption: string;
    };
};

function id(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultProgramme(): ProgrammeContent {
    return {
        templateId: "floral-matriarch",
        sheetCount: 2,
        identity: {
            displayFirstName: "Emma",
            surnameLine: "Koki Wambua",
            coverTitle: "Celebrating the Life",
            roleLine: "Beloved Matriarch of the Kitau Family",
            sunrise: "Jul 02, 1942",
            sunset: "Aug 28, 2026",
            attributes: ["Loving", "Kind", "Strong", "Inspiring"],
            dedication: "Rest in Peace, Mum",
            motto: "Family love always lives on",
            venue: "",
            serviceDate: "",
            serviceTime: "",
        },
        acknowledgement: {
            title: "Acknowledgement",
            body: "We the family are grateful for your presence, your love and finding time to console us. May the Almighty God bless you abundantly.",
            footerLine: "A beautiful soul lives on in our hearts",
        },
        service: {
            title: "Funeral Program",
            rows: [
                { id: id("row"), time: "0800 hrs", activity: "Departure for the venue" },
                { id: id("row"), time: "1000 hrs", activity: "Arrival and seating of guests" },
                { id: id("row"), time: "1030 hrs", activity: "Opening prayer and welcome remarks" },
                { id: id("row"), time: "1100 hrs", activity: "Tributes / Flowers" },
                { id: id("row"), time: "1200 hrs", activity: "Sermon and closing hymn" },
            ],
            masterOfCeremonies: "",
            presidingPastor: "",
            choir: "",
            tributeSpeakers: [
                { id: id("spk"), label: "Children" },
                { id: id("spk"), label: "Siblings" },
                { id: id("spk"), label: "Church" },
            ],
        },
        tributes: [
            {
                id: id("trb"),
                title: "Tribute from the Family",
                body: "We give thanks for a life of love, faith and quiet strength. Your example lives on in us.",
                signOff: "With love, the family",
            },
        ],
        hymns: [
            {
                id: id("hym"),
                title: "Amazing Grace",
                lyrics: "Amazing grace, how sweet the sound\nThat saved a wretch like me…",
            },
        ],
        eulogy: {
            title: "Eulogy",
            tagline: "A life of love, faith and family",
            sections: [
                { id: id("eul"), heading: "Birth", body: "", enabled: true },
                { id: id("eul"), heading: "Education", body: "", enabled: true },
                { id: id("eul"), heading: "Career", body: "", enabled: true },
                { id: id("eul"), heading: "Marriage and Family", body: "", enabled: true },
                { id: id("eul"), heading: "Demise", body: "", enabled: true },
            ],
            closingQuote: "Your legacy lives on in our hearts forever.",
        },
        memories: {
            title: "Memories",
            subtitle: "Cherished moments through the years",
            caption: "Different seasons, one beautiful story",
        },
    };
}

export function programmeDisplayName(content: ProgrammeContent) {
    const first = content.identity.displayFirstName.trim();
    const surname = content.identity.surnameLine.trim();
    const name = [first, surname].filter(Boolean).join(" ");
    return name ? `${name} programme` : "Untitled programme";
}

export function isProgrammeContent(value: unknown): value is ProgrammeContent {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    return (
        typeof record.templateId === "string" &&
        typeof record.sheetCount === "number" &&
        typeof record.identity === "object" &&
        record.identity !== null &&
        typeof record.acknowledgement === "object" &&
        typeof record.service === "object"
    );
}

export type ProgrammeSavedSettings = {
    content: ProgrammeContent;
};
