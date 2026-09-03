import { NextResponse } from "next/server";
import { verifyRequestUser } from "@/lib/firebase-admin-auth";
import { effectivePlan, getSubscription } from "@/lib/subscriptions";
import { planFeatures } from "@/lib/entitlements";

export async function GET(req: Request) {
    const user = await verifyRequestUser(req);
    if (!user) {
        return NextResponse.json({ authenticated: false, plan: "free", entitlements: [] });
    }
    const subscription = await getSubscription(user.uid);
    const plan = effectivePlan(subscription);
    return NextResponse.json({
        authenticated: true,
        uid: user.uid,
        email: user.email,
        plan,
        entitlements: planFeatures(plan),
        subscription: subscription
            ? { status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd, pkgKey: subscription.pkgKey }
            : null,
    });
}
