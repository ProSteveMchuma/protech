"use client";

import type { ProgrammeContent } from "@/lib/proprint/programme/schema";
import { a3AspectRatio, panelLabel, sheetsForProgramme } from "@/lib/proprint/programme/layout";
import { getProgrammeTemplate, type PanelKind } from "@/lib/proprint/programme/templates";

type Props = {
    content: ProgrammeContent;
    sheetIndex: number;
};

export function ProgrammeFoldPreview({ content, sheetIndex }: Props) {
    const template = getProgrammeTemplate(content.templateId);
    const sheets = sheetsForProgramme(content);
    const face = sheets[sheetIndex] ?? sheets[0];
    if (!face) return null;
    const tokens = template.tokens;

    return (
        <div className="programme-stage" style={{ aspectRatio: a3AspectRatio() }}>
            <div className="programme-sheet" style={{ background: tokens.paper, color: tokens.ink }}>
                <Panel side="left" kind={face.left} content={content} tokens={tokens} />
                <div className="programme-crease" aria-hidden="true" />
                <Panel side="right" kind={face.right} content={content} tokens={tokens} />
                <div className="programme-wave" style={{ background: tokens.wave }} />
            </div>
            <div className="programme-stage-meta">
                <span>
                    Sheet {sheetIndex + 1} · A3 landscape · {panelLabel(face.left)} | {panelLabel(face.right)}
                </span>
                <span>Fold on centre · finished A4 panels</span>
            </div>
        </div>
    );
}

function Panel({
    side,
    kind,
    content,
    tokens,
}: {
    side: "left" | "right";
    kind: PanelKind;
    content: ProgrammeContent;
    tokens: { paper: string; ink: string; accent: string; wave: string; muted: string };
}) {
    return (
        <article className={`programme-panel programme-panel-${side}`} data-kind={kind}>
            {kind === "cover" && <CoverPanel content={content} tokens={tokens} />}
            {kind === "acknowledgement" && <AckPanel content={content} tokens={tokens} />}
            {kind === "service" && <SimplePanel title={content.service.title} body="Timed order of service will fill this panel in the next milestone." tokens={tokens} />}
            {kind === "tribute" && (
                <SimplePanel
                    title={content.tributes[0]?.title || "Tribute"}
                    body={content.tributes[0]?.body || "Tribute text will appear here."}
                    tokens={tokens}
                />
            )}
            {kind === "memories" && (
                <SimplePanel title={content.memories.title} body={content.memories.subtitle} tokens={tokens} />
            )}
            {kind === "hymns" && (
                <SimplePanel
                    title={content.hymns[0]?.title || "Hymns / Songs"}
                    body={content.hymns[0]?.lyrics || "Hymn lyrics will appear here."}
                    tokens={tokens}
                />
            )}
            {kind === "eulogy" && (
                <SimplePanel title={content.eulogy.title} body={content.eulogy.tagline} tokens={tokens} />
            )}
            {kind === "blank" && <SimplePanel title="Blank" body="Unused panel." tokens={tokens} />}
            <p className="programme-panel-dedication" style={{ color: "#f7f0e8" }}>
                {content.identity.dedication}
            </p>
        </article>
    );
}

function CoverPanel({
    content,
    tokens,
}: {
    content: ProgrammeContent;
    tokens: { accent: string; muted: string; ink: string };
}) {
    const { identity } = content;
    return (
        <div className="programme-cover">
            <p className="programme-script" style={{ color: tokens.ink }}>
                {identity.coverTitle}
            </p>
            <p className="programme-role">{identity.roleLine}</p>
            <div className="programme-photo-slot" aria-hidden="true">
                <span>Cover portrait</span>
                <small>Photo slot · Milestone 3</small>
            </div>
            <h2 className="programme-script programme-name">{identity.displayFirstName || "First name"}</h2>
            <p className="programme-surname">{identity.surnameLine || "Surname line"}</p>
            <p className="programme-dates">
                Sunrise: {identity.sunrise || "—"}
                <span aria-hidden="true"> · </span>
                Sunset: {identity.sunset || "—"}
            </p>
            {identity.attributes.length > 0 && (
                <p className="programme-attributes">{identity.attributes.join(" · ")}</p>
            )}
            {(identity.venue || identity.serviceDate) && (
                <p className="programme-service-meta">
                    {[identity.serviceDate, identity.serviceTime, identity.venue].filter(Boolean).join(" · ")}
                </p>
            )}
        </div>
    );
}

function AckPanel({
    content,
    tokens,
}: {
    content: ProgrammeContent;
    tokens: { ink: string; muted: string };
}) {
    return (
        <div className="programme-ack">
            <p className="programme-script" style={{ color: tokens.ink }}>
                {content.acknowledgement.title}
            </p>
            <div className="programme-photo-slot programme-photo-slot-sm" aria-hidden="true">
                <span>Photo</span>
            </div>
            <p className="programme-ack-body">{content.acknowledgement.body}</p>
            <p className="programme-motto">{content.identity.motto}</p>
            <p className="programme-ack-footer">{content.acknowledgement.footerLine}</p>
        </div>
    );
}

function SimplePanel({
    title,
    body,
    tokens,
}: {
    title: string;
    body: string;
    tokens: { ink: string };
}) {
    return (
        <div className="programme-simple">
            <p className="programme-script" style={{ color: tokens.ink }}>
                {title}
            </p>
            <p className="programme-simple-body">{body}</p>
        </div>
    );
}
