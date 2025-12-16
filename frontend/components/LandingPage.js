"use client";

import Link from "next/link";
import Footer from "./Footer";
import { Dna, ArrowRight, Shield, Activity, Database, Lock } from "lucide-react";

export default function LandingPage({ onLogin }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Dna className="text-blue-400" />
                    <span>DNA<span className="text-blue-400">Analyzer</span></span>
                </div>
                <button
                    onClick={onLogin}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
                >
                    Researcher Login
                </button>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Now updated with Protein Detection Algorithm v2.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                            Unlock the secrets of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Genetic Code</span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                            Advanced DNA sequence analysis platform for modern microbiology labs.
                            Detect protein encoding potentials with high precision using our proprietary mass-distribution algorithms.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={onLogin}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Access Dashboard <ArrowRight size={20} />
                            </button>
                            <Link
                                href="/docs"
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700/80 rounded-xl font-semibold text-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
                            >
                                View Documentation
                            </Link>
                        </div>
                    </div>

                    <div className="relative animate-in slide-in-from-right duration-1000 delay-200 hidden lg:block">
                        <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full opacity-20"></div>
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-500">
                            {/* Mock Dashboard UI Preview */}
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">analysis_result_v2.json</div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Protein Status</div>
                                        <div className="text-lg font-bold text-green-400">Detected</div>
                                    </div>
                                    <div className="ml-auto text-2xl font-bold text-white">98.5%</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <div className="text-xs text-slate-400 mb-1">Codon Count</div>
                                        <div className="text-xl font-bold">1,245</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <div className="text-xs text-slate-400 mb-1">Total Mass</div>
                                        <div className="text-xl font-bold">45.2 kDa</div>
                                    </div>
                                </div>

                                <div className="h-32 bg-slate-800/30 rounded-lg flex items-end justify-between p-4 gap-2">
                                    {[40, 65, 35, 80, 55, 90, 45, 70].map((h, i) => (
                                        <div key={i} className="w-full bg-blue-500/40 rounded-t" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Shield className="text-blue-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Enterprise-grade encryption for all your genetic data sequences. Compliant with lab standards.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Activity className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Real-time processing of DNA files with immediate visual feedback and mass distribution reporting.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Database className="text-indigo-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">History Archives</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Automatically archive every analysis. Retrieve, export, and compare past results effortlessly.
                        </p>
                    </div>
                </div>
            </main>

            <Footer className="border-white/10 text-slate-400" />
        </div>
    );
}
