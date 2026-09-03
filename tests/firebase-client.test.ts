import assert from "node:assert/strict";
import test from "node:test";
import { getFirebaseWebConfig, isFirebaseWebConfigured } from "../lib/firebase-client.ts";

test("firebase web config is null when env vars are missing", () => {
    const keys = [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
    ] as const;
    const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
    for (const key of keys) delete process.env[key];

    assert.equal(getFirebaseWebConfig(), null);
    assert.equal(isFirebaseWebConfigured(), false);

    for (const key of keys) {
        if (previous[key] === undefined) delete process.env[key];
        else process.env[key] = previous[key];
    }
});

test("firebase web config assembles when all public env vars are set", () => {
    const keys = {
        NEXT_PUBLIC_FIREBASE_API_KEY: "test-key",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "example",
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "example.appspot.com",
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123",
        NEXT_PUBLIC_FIREBASE_APP_ID: "1:123:web:abc",
    } as const;
    const previous = Object.fromEntries(Object.keys(keys).map((key) => [key, process.env[key]]));
    Object.assign(process.env, keys);

    assert.deepEqual(getFirebaseWebConfig(), {
        apiKey: "test-key",
        authDomain: "example.firebaseapp.com",
        projectId: "example",
        storageBucket: "example.appspot.com",
        messagingSenderId: "123",
        appId: "1:123:web:abc",
    });
    assert.equal(isFirebaseWebConfigured(), true);

    for (const key of Object.keys(keys)) {
        if (previous[key] === undefined) delete process.env[key];
        else process.env[key] = previous[key];
    }
});
