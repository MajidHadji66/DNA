"use client";

import Link from "next/link";
import { ArrowLeft, Book, Code, Terminal, FileText, Cpu } from "lucide-react";
import Footer from "../../components/Footer";

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center text-gray-900 hover:text-blue-600 transition-colors font-medium">
                                <ArrowLeft className="mr-2" size={20} />
                                Back to App
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                DNA Analyzer Docs
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <Book size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">Introduction</h1>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            The DNA Sequence Analyzer is a specialized tool designed for molecular microbiology laboratories.
                            It provides rapid assessment of DNA sequences to determine their potential for encoding valid proteins
                            based on structural composition and mass distribution analysis.
                        </p>
                    </section>

                    <hr className="my-10 border-gray-100" />

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Cpu className="text-purple-500" /> Core Algorithm
                        </h2>
                        <div className="prose prose-blue max-w-none text-gray-600">
                            <p>
                                Our proprietary analysis engine evaluates sequences against four strict biological criteria:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 list-none pl-0">
                                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <strong className="block text-gray-900 mb-1">Start Codon Validation</strong>
                                    Sequences must initiate with the Methionine codon (ATG).
                                </li>
                                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <strong className="block text-gray-900 mb-1">Stop Codon Termination</strong>
                                    Must terminate with a valid Amber (TAG), Ochre (TAA), or Opal (TGA) codon.
                                </li>
                                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <strong className="block text-gray-900 mb-1">Minimum Length</strong>
                                    The gene candidate must consist of at least 5 codons (15 nucleotides).
                                </li>
                                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <strong className="block text-gray-900 mb-1">Mass Distribution</strong>
                                    Cytosine and Guanine content must satisfy a minimum mass threshold of 30%.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <hr className="my-10 border-gray-100" />

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="text-indigo-500" /> File Support
                        </h2>
                        <p className="text-gray-600 mb-4">
                            The analyzer accepts raw text files containing nucleotide sequences.
                        </p>
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm overflow-x-auto">
                            <p className="text-slate-500 mb-2">// Example valid format (.txt or .dna)</p>
                            <p>ATGCGTACGTCAGTCAGTCAGTCAGTAG</p>
                            <p>...or...</p>
                            <p>&gt;header_info (FASTA style headers are currently stripped)</p>
                            <p>ATGCGT...</p>
                        </div>
                    </section>

                    <hr className="my-10 border-gray-100" />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Terminal className="text-green-500" /> API Reference
                        </h2>
                        <p className="text-gray-600 mb-6">
                            External systems can integrate with our analysis engine via the REST API.
                        </p>

                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold font-mono">POST</span>
                                    <span className="font-mono text-sm text-gray-600">/api/analyze</span>
                                </div>
                                <div className="p-4 bg-white">
                                    <p className="text-sm text-gray-600 mb-3">Uploads and processes a DNA sequence file.</p>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 text-sm">
                                            <span className="text-gray-500">Content-Type</span>
                                            <span className="col-span-2 font-mono">multipart/form-data</span>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <span className="text-gray-500">Parameters</span>
                                            <span className="col-span-2 font-mono">file (Binary), username (String)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
