import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-slate-200">404</h1>
                <div className="mt-[-2rem]">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Page Not Found</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Sorry, the page you're looking for doesn't exist or has been moved to a new URL.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition"
                    >
                        <MoveLeft className="mr-2 size-5" /> Go Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
