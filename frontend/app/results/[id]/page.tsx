"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
    Activity,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Download,
    Dna,
    FileText
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import Footer from "../../../components/Footer";

interface AnalysisResult {
    id: number;
    filename: string;
    timestamp: string;
    username: string | null;
    total_mass: number;
    is_protein: boolean;
    nucleotides: string;
    codons: string[];
    counts: number[];
    mass_percentages: number[];
}

export default function ResultPage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiUrl, setApiUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/config")
            .then((res) => res.json())
            .then((data) => {
                setApiUrl(data.apiUrl);
            })
            .catch((err) => console.error("Failed to load config:", err));
    }, []);

    useEffect(() => {
        if (apiUrl && id && user) {
            fetchResult();
        } else if (!authLoading && !user) {
            router.push("/");
        }
    }, [apiUrl, id, user, authLoading]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/history/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch result");
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Could not load analysis result. It may have been deleted.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4">
                    <XCircle size={48} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Return to Dashboard
                </button>
            </div>
        )
    }

    if (!result) return null;

    return (
        <main className='min-h-screen p-8 max-w-6xl mx-auto'>
            <header className='mb-10'>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="text-blue-600" /> Analysis Result
                        </h1>
                        <p className="text-gray-500 mt-1">
                            File: <span className="font-medium text-gray-700">{result.filename}</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                            {new Date(result.timestamp).toLocaleString()}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            const reportContent = `DNA Analysis Report
-------------------
Timestamp: ${new Date(result.timestamp).toLocaleString()}
User: ${result.username || "Anonymous"}
File: ${result.filename}
Total Mass: ${result.total_mass}
Is Protein: ${result.is_protein ? "YES" : "NO"}
-------------------
Sequence:
${result.nucleotides}
`;
                            const blob = new Blob([reportContent], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `analysis_report_${result.id}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                    >
                        <Download size={18} /> Download Report
                    </button>
                </div>
            </header>

            <div className='space-y-6'>
                {/* Status Card */}
                <div
                    className={`p-6 rounded-xl shadow-md text-white flex items-center justify-between ${result.is_protein ? "bg-green-600" : "bg-red-500"
                        }`}
                >
                    <div>
                        <h2 className='text-2xl font-bold'>
                            {result.is_protein ? "Protein Detected" : "Not a Protein"}
                        </h2>
                        <p className='opacity-90'>
                            {result.is_protein
                                ? "This sequence meets all criteria for a valid protein."
                                : "This sequence does not meet the criteria."}
                        </p>
                    </div>
                    {result.is_protein ? (
                        <CheckCircle size={48} />
                    ) : (
                        <XCircle size={48} />
                    )}
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white p-5 rounded-xl shadow-sm'>
                        <h3 className='text-gray-500 text-sm font-medium uppercase'>
                            Total Mass
                        </h3>
                        <p className='text-3xl font-bold text-gray-800'>
                            {result.total_mass}
                        </p>
                    </div>
                    <div className='bg-white p-5 rounded-xl shadow-sm'>
                        <h3 className='text-gray-500 text-sm font-medium uppercase'>
                            Codon Count
                        </h3>
                        <p className='text-3xl font-bold text-gray-800'>
                            {result.codons.length}
                        </p>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-md'>
                    <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                        <Activity size={20} /> Nucleotide Mass Distribution (%)
                    </h3>
                    <div className='h-64 w-full'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'A', value: result.mass_percentages[0], color: '#ef4444' },
                                    { name: 'C', value: result.mass_percentages[1], color: '#f59e0b' },
                                    { name: 'T', value: result.mass_percentages[2], color: '#3b82f6' },
                                    { name: 'G', value: result.mass_percentages[3], color: '#22c55e' },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Mass %">
                                    {
                                        [
                                            { name: 'A', color: '#ef4444' }, // Red
                                            { name: 'C', color: '#f59e0b' }, // Yellow
                                            { name: 'T', color: '#3b82f6' }, // Blue
                                            { name: 'G', color: '#22c55e' }, // Green
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Raw Counts Footer */}
                    <div className='grid grid-cols-4 gap-2 text-center mt-4 pt-4 border-t border-gray-100'>
                        {["A", "C", "T", "G"].map((nuc, idx) => (
                            <div key={nuc}>
                                <div className='text-xs font-bold text-gray-400'>{nuc} Count</div>
                                <div className='text-gray-600 font-mono'>{result.counts[idx]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Codons List */}
                <div className='bg-white p-6 rounded-xl shadow-md'>
                    <h3 className='text-lg font-semibold mb-4'>Codon Sequence</h3>
                    <div className='flex flex-wrap gap-2 font-mono text-sm max-h-[200px] overflow-y-auto'>
                        {result.codons.map((codon, i) => (
                            <span
                                key={i}
                                className='bg-gray-100 px-2 py-1 rounded text-gray-700'
                            >
                                {codon}
                            </span>
                        ))}
                    </div>
                </div>


                {/* Glossary */}
                <div className='bg-slate-50 p-8 rounded-xl border border-slate-200'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <FileText className='text-slate-500' /> Glossary
                    </h2>
                    <div className='space-y-5'>
                        <div>
                            <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                                Codon
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                A sequence of 3 nucleotides that corresponds to a specific amino
                                acid or stop signal during protein synthesis.
                            </p>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                                Nucleotide
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                The basic building block of DNA. In this analyzer, we focus on
                                Adenine (A), Cytosine (C), Guanine (G), and Thymine (T).
                            </p>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                                Mass %
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                The percentage of the total molecular weight contributed by
                                specific nucleotides. C and G nucleotides are heavier and affect
                                the stability of the DNA molecule.
                            </p>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                                Protein
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                Large biomolecules and macromolecules that comprise one or more
                                long chains of amino acid residues. In this context, we check if
                                the DNA sequence has the potential to encode one.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main >
    );
}
