import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listLeads, updateLeadStatus } from "@/lib/leads";

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const leads = await listLeads();
    return NextResponse.json({ success: true, leads });
}

export async function PATCH(req: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, status } = await req.json();
        const valid = ["new", "contacted", "converted", "rejected"] as const;
        if (typeof id !== "string" || !valid.includes(status)) {
            return NextResponse.json({ success: false, error: "Bad payload" }, { status: 400 });
        }
        const ok = await updateLeadStatus(id, status);
        return NextResponse.json({ success: ok });
    } catch {
        return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
    }
}
