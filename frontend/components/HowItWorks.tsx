import { Activity } from "lucide-react";

/**
 * HowItWorks Component
 * 
 * Displays the educational section explaining the DNA analysis algorithm criteria.
 * This is static content extracted from the main page to improve readability.
 */
export default function HowItWorks() {
    return (
        <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className='text-blue-500' /> How it Works
            </h2>
            <p className="text-gray-600 mb-4">
                Our algorithm analyzes the DNA sequence to determine if it encodes a
                valid protein based on specific structural and chemical criteria.
            </p>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5">
                        1
                    </span>
                    <span className="text-gray-700">
                        <strong>Start Codon:</strong> Must begin with the sequence{" "}
                        <code className="bg-gray-100 px-1 rounded">ATG</code>.
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5">
                        2
                    </span>
                    <span className="text-gray-700">
                        <strong>Stop Codon:</strong> Must end with one of the valid stop
                        codons: <code className="bg-gray-100 px-1 rounded">TAA</code>,{" "}
                        <code className="bg-gray-100 px-1 rounded">TAG</code>, or{" "}
                        <code className="bg-gray-100 px-1 rounded">TGA</code>.
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5">
                        3
                    </span>
                    <span className="text-gray-700">
                        <strong>Sequence Length:</strong> Must contain at least{" "}
                        <strong>5 codons</strong> (including start and stop).
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5">
                        4
                    </span>
                    <span className="text-gray-700">
                        <strong>Mass Percentage:</strong> Cytosine (C) and Guanine (G)
                        must account for at least <strong>30%</strong> of the total
                        mass.
                    </span>
                </li>
            </ul>
        </div>
    );
}
