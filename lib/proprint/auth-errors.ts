function errorCode(error: unknown): string {
    if (!error || typeof error !== "object" || !("code" in error)) return "";
    return String((error as { code: unknown }).code);
}

export function mapAuthError(error: unknown): string {
    switch (errorCode(error)) {
        case "auth/invalid-email":
            return "Enter a valid email address.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Email or password is incorrect.";
        case "auth/email-already-in-use":
            return "An account already exists for this email. Sign in instead.";
        case "auth/weak-password":
            return "Use a password of at least 6 characters.";
        case "auth/too-many-requests":
            return "Too many attempts. Wait a moment and try again.";
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        case "auth/operation-not-allowed":
            return "Email sign-in is not enabled for this Firebase project yet.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        default:
            return "Could not complete that request. Try again.";
    }
}

export function mapFirestoreError(error: unknown): string {
    const code = errorCode(error);
    if (code === "permission-denied") {
        return "Cloud saves are blocked by Firestore rules. Jobs still save in this browser.";
    }
    if (code === "unavailable") {
        return "Cloud saves are temporarily unavailable. Jobs still save in this browser.";
    }
    return "Could not sync shop saves. Jobs still save in this browser.";
}
