import { NextResponse } from "next/server";
import { isFirebaseWebConfigured } from "@/lib/firebase-client";

export const runtime = "nodejs";

function adminConfigured() {
    return Boolean(
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
            process.env.FIREBASE_CONFIG ||
            (process.env.FIREBASE_PROJECT_ID &&
                process.env.FIREBASE_CLIENT_EMAIL &&
                process.env.FIREBASE_PRIVATE_KEY)
    );
}

/**
 * Non-secret readiness check for Firebase wiring.
 * Does not open Firestore or return credential material.
 */
export async function GET() {
    const projectId =
        process.env.FIREBASE_PROJECT_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        null;

    return NextResponse.json({
        success: true,
        projectId,
        admin: {
            configured: adminConfigured(),
            purpose: "Server Firestore for leads and payments",
        },
        web: {
            configured: isFirebaseWebConfigured(),
            purpose: "Browser SDK for Auth and shop workspaces",
        },
    });
}
