import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRequestUser } from "@/lib/firebase-admin-auth";
import { getFirestoreDatabase } from "@/lib/firebase-admin";

const kindSchema = z.enum(["serialpro", "quotepro"]);

const saveSchema = z.object({
    kind: kindSchema,
    id: z.string().min(1).max(64),
    name: z.string().min(1).max(120),
    settings: z.unknown(),
});

function collection(uid: string, kind: string) {
    const db = getFirestoreDatabase();
    if (!db) return null;
    return db.collection("workspaces").doc(uid).collection(kind);
}

export async function GET(req: Request) {
    const user = await verifyRequestUser(req);
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const kind = new URL(req.url).searchParams.get("kind");
    const parsedKind = kindSchema.safeParse(kind);
    if (!parsedKind.success) return NextResponse.json({ error: "bad kind" }, { status: 400 });

    const col = collection(user.uid, parsedKind.data);
    if (!col) return NextResponse.json({ records: [] });
    const snapshot = await col.orderBy("updatedAt", "desc").get();
    return NextResponse.json({ records: snapshot.docs.map((doc) => doc.data()) });
}

export async function POST(req: Request) {
    const user = await verifyRequestUser(req);
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const parsed = saveSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

    const col = collection(user.uid, parsed.data.kind);
    if (!col) return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
    const now = new Date().toISOString();
    const doc = await col.doc(parsed.data.id).get();
    const record = {
        id: parsed.data.id,
        name: parsed.data.name,
        kind: parsed.data.kind,
        settings: parsed.data.settings,
        createdAt: doc.exists ? (doc.data()?.createdAt ?? now) : now,
        updatedAt: now,
    };
    await col.doc(parsed.data.id).set(record);
    return NextResponse.json({ record });
}

export async function DELETE(req: Request) {
    const user = await verifyRequestUser(req);
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const url = new URL(req.url);
    const parsedKind = kindSchema.safeParse(url.searchParams.get("kind"));
    const id = url.searchParams.get("id");
    if (!parsedKind.success || !id) return NextResponse.json({ error: "bad request" }, { status: 400 });
    const col = collection(user.uid, parsedKind.data);
    if (col) await col.doc(id).delete();
    return NextResponse.json({ ok: true });
}
