import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy",
    description: "How ProPrint handles website, shop-account, and browser-processed artwork data.",
};

export default function Privacy() {
    return (
        <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 text-slate-200">
            <h1 className="text-4xl font-black">Privacy</h1>
            <p className="mt-6 leading-8 text-slate-400">
                SerialPro processes uploaded PDF artwork locally in your browser. The current tool does not send or
                store that artwork on ProPrint servers.
            </p>
            <p className="mt-4 leading-8 text-slate-400">
                If you create a shop account, we store your email and named job settings (numbering ranges, sheet
                layouts, quote inputs) so you can reuse them on another computer. Artwork files are still not
                uploaded. Signed-out saves stay in this browser only.
            </p>
            <p className="mt-4 leading-8 text-slate-400">
                Contact and administrative services may process information you intentionally submit through their
                forms.
            </p>
            <p className="mt-4 leading-8 text-slate-400">For privacy questions, email proinnovationtech@gmail.com.</p>
        </article>
    );
}
