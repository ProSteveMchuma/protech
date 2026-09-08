"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileUp, Sparkles, Wand2 } from "lucide-react";
import type { ProgrammeContent } from "@/lib/proprint/programme/schema";
import { newProgrammeId } from "@/lib/proprint/programme/schema";

type StepId = "source" | "cover" | "acknowledgement" | "service" | "tributes" | "hymns" | "eulogy" | "apply";

const STEPS: Array<{ id: StepId; label: string }> = [
    { id: "source", label: "Write-up" },
    { id: "cover", label: "Cover" },
    { id: "acknowledgement", label: "Acknowledgement" },
    { id: "service", label: "Service" },
    { id: "tributes", label: "Tributes" },
    { id: "hymns", label: "Hymns" },
    { id: "eulogy", label: "Eulogy" },
    { id: "apply", label: "Apply" },
];

type Props = {
    open: boolean;
    onClose: () => void;
    onApply: (content: ProgrammeContent, meta: { engine: string }) => void;
};

export function ProgrammeImportWizard({ open, onClose, onApply }: Props) {
    const [stepIndex, setStepIndex] = useState(0);
    const [rawText, setRawText] = useState("");
    const [fileName, setFileName] = useState("");
    const [preferAi, setPreferAi] = useState(true);
    const [aiConfigured, setAiConfigured] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [warnings, setWarnings] = useState<string[]>([]);
    const [engine, setEngine] = useState<"rules" | "ai" | "">("");
    const [content, setContent] = useState<ProgrammeContent | null>(null);

    useEffect(() => {
        if (!open) return;
        void fetch("/api/programme/import")
            .then((response) => response.json())
            .then((payload) => setAiConfigured(Boolean(payload.aiConfigured)))
            .catch(() => setAiConfigured(false));
    }, [open]);

    if (!open) return null;
    const step = STEPS[stepIndex];

    async function generateDraft() {
        setBusy(true);
        setError("");
        setWarnings([]);
        try {
            const response = await fetch("/api/programme/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: rawText, preferAi: preferAi && aiConfigured }),
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.error || "Could not prepare the draft.");
            }
            setContent(payload.content as ProgrammeContent);
            setEngine(payload.engine);
            setWarnings(Array.isArray(payload.warnings) ? payload.warnings : []);
            setStepIndex(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not prepare the draft.");
        } finally {
            setBusy(false);
        }
    }

    async function onFile(file: File | null) {
        if (!file) return;
        setFileName(file.name);
        setError("");
        const lower = file.name.toLowerCase();
        if (lower.endsWith(".txt") || lower.endsWith(".md")) {
            setRawText(await file.text());
            return;
        }
                if (lower.endsWith(".docx")) {
            setBusy(true);
            try {
                const buffer = await file.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                let binary = "";
                const chunk = 0x8000;
                for (let i = 0; i < bytes.length; i += chunk) {
                    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
                }
                const base64 = btoa(binary);
                const response = await fetch("/api/programme/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ docxBase64: base64, preferAi: preferAi && aiConfigured }),
                });
                const payload = await response.json();
                if (!response.ok || !payload.success) {
                    throw new Error(payload.error || "Could not read that Word file.");
                }
                // Keep extracted text visible for operator review/edit before steps
                const identity = payload.content?.identity;
                const reconstructed = [
                    identity?.coverTitle,
                    [identity?.displayFirstName, identity?.surnameLine].filter(Boolean).join(" "),
                    identity?.roleLine,
                    identity?.sunrise && identity?.sunset
                        ? `Sunrise: ${identity.sunrise} | Sunset: ${identity.sunset}`
                        : "",
                    "",
                    "Acknowledgement",
                    payload.content?.acknowledgement?.body || "",
                    "",
                    "Funeral Program",
                    ...(payload.content?.service?.rows || []).map(
                        (row: { time: string; activity: string }) => `${row.time} ${row.activity}`
                    ),
                ]
                    .filter((line: string) => line !== undefined)
                    .join("\n");
                setRawText(reconstructed || "Write-up imported from Word. Review each step.");
                setContent(payload.content as ProgrammeContent);
                setEngine(payload.engine);
                setWarnings(Array.isArray(payload.warnings) ? payload.warnings : []);
                setStepIndex(1);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not read that Word file.");
            } finally {
                setBusy(false);
            }
            return;
        }
        setError("Upload a .txt, .md, or .docx write-up — or paste the text.");
    }

    function patchIdentity(patch: Partial<ProgrammeContent["identity"]>) {
        setContent((current) => (current ? { ...current, identity: { ...current.identity, ...patch } } : current));
    }

    function patchAck(patch: Partial<ProgrammeContent["acknowledgement"]>) {
        setContent((current) =>
            current ? { ...current, acknowledgement: { ...current.acknowledgement, ...patch } } : current
        );
    }

    return (
        <div className="programme-wizard-backdrop" role="dialog" aria-modal="true" aria-label="Smart programme import">
            <div className="programme-wizard">
                <header className="programme-wizard-head">
                    <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-cyan-300">
                            Smart import · step {stepIndex + 1} of {STEPS.length}
                        </p>
                        <h2 className="mt-1 text-xl font-black">Write-up → editable A3 programme</h2>
                        <p className="mt-1 text-xs text-slate-400">
                            AI or rules only draft fields. You edit every panel before it becomes the printable programme.
                        </p>
                    </div>
                    <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={onClose}>
                        Close
                    </button>
                </header>

                <ol className="programme-wizard-steps">
                    {STEPS.map((item, index) => (
                        <li key={item.id} className={index === stepIndex ? "active" : index < stepIndex ? "done" : ""}>
                            {item.label}
                        </li>
                    ))}
                </ol>

                <div className="programme-wizard-body">
                    {step.id === "source" && (
                        <div className="space-y-4">
                            <label className="upload">
                                <FileUp />
                                <b>Upload write-up</b>
                                <span>.txt, .md, or .docx{fileName ? ` · ${fileName}` : ""}</span>
                                <input
                                    type="file"
                                    accept=".txt,.md,.docx,text/plain"
                                    className="hidden"
                                    onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
                                />
                            </label>
                            <label className="serial-field">
                                <span>Or paste the family write-up</span>
                                <textarea
                                    className="programme-textarea min-h-48"
                                    value={rawText}
                                    onChange={(event) => setRawText(event.target.value)}
                                    placeholder={`Celebrating the Life of Jane Wanjiku Mwangi\nSunrise: 12 Mar 1950 | Sunset: 2 Sep 2026\n\nAcknowledgement\nWe the family thank you…\n\nFuneral Program\n1000 hrs Arrival\n1030 hrs Opening prayer\n…`}
                                />
                            </label>
                            <label className="check">
                                <input
                                    type="checkbox"
                                    checked={preferAi}
                                    disabled={!aiConfigured}
                                    onChange={(event) => setPreferAi(event.target.checked)}
                                />
                                {aiConfigured
                                    ? "Prefer AI structuring when available (still fully editable)"
                                    : "AI not configured — local rules will draft the fields"}
                            </label>
                        </div>
                    )}

                    {content && step.id === "cover" && (
                        <div className="space-y-2">
                            <WizardField label="Cover title">
                                <input
                                    value={content.identity.coverTitle}
                                    onChange={(e) => patchIdentity({ coverTitle: e.target.value })}
                                />
                            </WizardField>
                            <div className="two">
                                <WizardField label="First name">
                                    <input
                                        value={content.identity.displayFirstName}
                                        onChange={(e) => patchIdentity({ displayFirstName: e.target.value })}
                                    />
                                </WizardField>
                                <WizardField label="Surname line">
                                    <input
                                        value={content.identity.surnameLine}
                                        onChange={(e) => patchIdentity({ surnameLine: e.target.value })}
                                    />
                                </WizardField>
                            </div>
                            <WizardField label="Role line">
                                <input
                                    value={content.identity.roleLine}
                                    onChange={(e) => patchIdentity({ roleLine: e.target.value })}
                                />
                            </WizardField>
                            <div className="two">
                                <WizardField label="Sunrise">
                                    <input
                                        value={content.identity.sunrise}
                                        onChange={(e) => patchIdentity({ sunrise: e.target.value })}
                                    />
                                </WizardField>
                                <WizardField label="Sunset">
                                    <input
                                        value={content.identity.sunset}
                                        onChange={(e) => patchIdentity({ sunset: e.target.value })}
                                    />
                                </WizardField>
                            </div>
                            <WizardField label="Dedication">
                                <input
                                    value={content.identity.dedication}
                                    onChange={(e) => patchIdentity({ dedication: e.target.value })}
                                />
                            </WizardField>
                        </div>
                    )}

                    {content && step.id === "acknowledgement" && (
                        <div className="space-y-2">
                            <WizardField label="Title">
                                <input
                                    value={content.acknowledgement.title}
                                    onChange={(e) => patchAck({ title: e.target.value })}
                                />
                            </WizardField>
                            <WizardField label="Body">
                                <textarea
                                    className="programme-textarea min-h-40"
                                    value={content.acknowledgement.body}
                                    onChange={(e) => patchAck({ body: e.target.value })}
                                />
                            </WizardField>
                            <WizardField label="Footer line">
                                <input
                                    value={content.acknowledgement.footerLine}
                                    onChange={(e) => patchAck({ footerLine: e.target.value })}
                                />
                            </WizardField>
                        </div>
                    )}

                    {content && step.id === "service" && (
                        <div className="space-y-3">
                            {content.service.rows.map((row, index) => (
                                <div key={row.id} className="two">
                                    <WizardField label={`Time ${index + 1}`}>
                                        <input
                                            value={row.time}
                                            onChange={(e) =>
                                                setContent({
                                                    ...content,
                                                    service: {
                                                        ...content.service,
                                                        rows: content.service.rows.map((item, i) =>
                                                            i === index ? { ...item, time: e.target.value } : item
                                                        ),
                                                    },
                                                })
                                            }
                                        />
                                    </WizardField>
                                    <WizardField label="Activity">
                                        <input
                                            value={row.activity}
                                            onChange={(e) =>
                                                setContent({
                                                    ...content,
                                                    service: {
                                                        ...content.service,
                                                        rows: content.service.rows.map((item, i) =>
                                                            i === index ? { ...item, activity: e.target.value } : item
                                                        ),
                                                    },
                                                })
                                            }
                                        />
                                    </WizardField>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setContent({
                                        ...content,
                                        service: {
                                            ...content.service,
                                            rows: [
                                                ...content.service.rows,
                                                { id: newProgrammeId("row"), time: "", activity: "" },
                                            ],
                                        },
                                    })
                                }
                            >
                                Add service row
                            </button>
                            <WizardField label="Tribute speakers (one per line)">
                                <textarea
                                    className="programme-textarea min-h-28"
                                    value={content.service.tributeSpeakers.map((item) => item.label).join("\n")}
                                    onChange={(e) =>
                                        setContent({
                                            ...content,
                                            service: {
                                                ...content.service,
                                                tributeSpeakers: e.target.value
                                                    .split("\n")
                                                    .map((label) => label.trim())
                                                    .filter(Boolean)
                                                    .map((label) => ({ id: newProgrammeId("spk"), label })),
                                            },
                                        })
                                    }
                                />
                            </WizardField>
                        </div>
                    )}

                    {content && step.id === "tributes" && (
                        <div className="space-y-3">
                            {(content.tributes[0] ? content.tributes : [{ id: "tmp", title: "Tribute", body: "", signOff: "" }]).map(
                                (tribute, index) => (
                                    <div key={tribute.id} className="space-y-2">
                                        <WizardField label="Title">
                                            <input
                                                value={tribute.title}
                                                onChange={(e) => {
                                                    const tributes = [...content.tributes];
                                                    if (!tributes[index]) {
                                                        tributes[index] = {
                                                            id: newProgrammeId("trb"),
                                                            title: "",
                                                            body: "",
                                                            signOff: "",
                                                        };
                                                    }
                                                    tributes[index] = { ...tributes[index], title: e.target.value };
                                                    setContent({ ...content, tributes });
                                                }}
                                            />
                                        </WizardField>
                                        <WizardField label="Body">
                                            <textarea
                                                className="programme-textarea min-h-36"
                                                value={tribute.body}
                                                onChange={(e) => {
                                                    const tributes = [...content.tributes];
                                                    if (!tributes[index]) {
                                                        tributes[index] = {
                                                            id: newProgrammeId("trb"),
                                                            title: "Tribute",
                                                            body: "",
                                                            signOff: "",
                                                        };
                                                    }
                                                    tributes[index] = { ...tributes[index], body: e.target.value };
                                                    setContent({ ...content, tributes });
                                                }}
                                            />
                                        </WizardField>
                                        <WizardField label="Sign-off">
                                            <input
                                                value={tribute.signOff}
                                                onChange={(e) => {
                                                    const tributes = [...content.tributes];
                                                    if (!tributes[index]) return;
                                                    tributes[index] = { ...tributes[index], signOff: e.target.value };
                                                    setContent({ ...content, tributes });
                                                }}
                                            />
                                        </WizardField>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {content && step.id === "hymns" && (
                        <div className="space-y-3">
                            {(content.hymns[0] ? content.hymns : [{ id: "tmp", title: "Hymn", lyrics: "" }]).slice(0, 3).map(
                                (hymn, index) => (
                                    <div key={hymn.id} className="space-y-2">
                                        <WizardField label={`Hymn ${index + 1} title`}>
                                            <input
                                                value={hymn.title}
                                                onChange={(e) => {
                                                    const hymns = [...content.hymns];
                                                    if (!hymns[index]) {
                                                        hymns[index] = { id: newProgrammeId("hym"), title: "", lyrics: "" };
                                                    }
                                                    hymns[index] = { ...hymns[index], title: e.target.value };
                                                    setContent({ ...content, hymns });
                                                }}
                                            />
                                        </WizardField>
                                        <WizardField label="Lyrics">
                                            <textarea
                                                className="programme-textarea min-h-32"
                                                value={hymn.lyrics}
                                                onChange={(e) => {
                                                    const hymns = [...content.hymns];
                                                    if (!hymns[index]) {
                                                        hymns[index] = { id: newProgrammeId("hym"), title: "Hymn", lyrics: "" };
                                                    }
                                                    hymns[index] = { ...hymns[index], lyrics: e.target.value };
                                                    setContent({ ...content, hymns });
                                                }}
                                            />
                                        </WizardField>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {content && step.id === "eulogy" && (
                        <div className="space-y-3">
                            <WizardField label="Tagline">
                                <input
                                    value={content.eulogy.tagline}
                                    onChange={(e) =>
                                        setContent({
                                            ...content,
                                            eulogy: { ...content.eulogy, tagline: e.target.value },
                                        })
                                    }
                                />
                            </WizardField>
                            {content.eulogy.sections.map((section, index) => (
                                <WizardField key={section.id} label={section.heading}>
                                    <textarea
                                        className="programme-textarea min-h-24"
                                        value={section.body}
                                        onChange={(e) =>
                                            setContent({
                                                ...content,
                                                eulogy: {
                                                    ...content.eulogy,
                                                    sections: content.eulogy.sections.map((item, i) =>
                                                        i === index ? { ...item, body: e.target.value } : item
                                                    ),
                                                },
                                            })
                                        }
                                    />
                                </WizardField>
                            ))}
                        </div>
                    )}

                    {content && step.id === "apply" && (
                        <div className="space-y-3 text-sm leading-6 text-slate-300">
                            <p>
                                Draft engine: <b className="text-white">{engine || "rules"}</b>. Everything you edited in the
                                previous steps will load into the ProgrammePro studio as normal editable fields — ready for
                                the A3 fold preview and later printable PDF.
                            </p>
                            <p>
                                Cover: {content.identity.displayFirstName} {content.identity.surnameLine}
                            </p>
                            <p>
                                Service rows: {content.service.rows.length} · Tributes: {content.tributes.length} · Hymns:{" "}
                                {content.hymns.length}
                            </p>
                            {warnings.length > 0 && (
                                <ul className="list-disc space-y-1 pl-5 text-xs text-amber-200">
                                    {warnings.map((warning) => (
                                        <li key={warning}>{warning}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-rose-300">
                            {error}
                        </p>
                    )}
                    {warnings.length > 0 && step.id !== "apply" && step.id !== "source" && (
                        <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-amber-200/90">
                            {warnings.map((warning) => (
                                <li key={warning}>{warning}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <footer className="programme-wizard-foot">
                    <button
                        type="button"
                        className="secondary-button !mt-0"
                        disabled={stepIndex === 0 || busy}
                        onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                    >
                        <ArrowLeft />
                        Back
                    </button>
                    {step.id === "source" ? (
                        <button
                            type="button"
                            className="primary-button !mt-0"
                            disabled={busy || rawText.trim().length < 40}
                            onClick={() => void generateDraft()}
                        >
                            {busy ? "Preparing…" : preferAi && aiConfigured ? "Generate with AI" : "Generate draft"}
                            {preferAi && aiConfigured ? <Sparkles className="size-4" /> : <Wand2 className="size-4" />}
                        </button>
                    ) : step.id === "apply" && content ? (
                        <button
                            type="button"
                            className="primary-button !mt-0"
                            onClick={() => {
                                onApply(content, { engine: engine || "rules" });
                                onClose();
                            }}
                        >
                            Apply to programme
                            <ArrowRight />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="primary-button !mt-0"
                            disabled={!content}
                            onClick={() => setStepIndex((index) => Math.min(STEPS.length - 1, index + 1))}
                        >
                            Next
                            <ArrowRight />
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}

function WizardField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="serial-field">
            <span>{label}</span>
            {children}
        </label>
    );
}
