/**
 * Lead-magnet unlock cookie.
 *
 * Low-stakes content gating — if someone forges the cookie they get the guide,
 * which is what we are giving away anyway. So the cookie is unsigned. The
 * email-capture POST is what we actually care about for lead generation.
 */

export const GUIDE_COOKIE = "prt_guide_tender";

/** 30 days. Long enough that a returning reader does not see the gate again,
 * short enough that a new email capture happens if someone clears cookies. */
export const GUIDE_TTL_SECONDS = 60 * 60 * 24 * 30;
