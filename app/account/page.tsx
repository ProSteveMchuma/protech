import type { Metadata } from "next";
import { AccountPageCopy, AccountPanel } from "@/components/AccountPanel";

export const metadata: Metadata = {
    title: "Shop account",
    description: "Sign in to save SerialPro jobs and QuotePro quotes across computers. Artwork stays in the browser.",
};

export default function AccountPage() {
    return (
        <div className="min-h-screen bg-press pb-24 pt-32 text-white">
            <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:items-start">
                <AccountPageCopy />
                <aside>
                    <AccountPanel />
                </aside>
            </div>
        </div>
    );
}
