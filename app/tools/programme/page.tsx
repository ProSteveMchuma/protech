import type { Metadata } from "next";
import { ProgrammeStudio } from "@/components/proprint/ProgrammeStudio";

export const metadata: Metadata = {
    title: "ProgrammePro — A3 funeral programme builder",
    description:
        "Build print-ready A3-fold funeral programmes for Kenyan print shops. Cover, acknowledgement, and fold preview in the browser.",
};

export default function ProgrammePage() {
    return <ProgrammeStudio />;
}
