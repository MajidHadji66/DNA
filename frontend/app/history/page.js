"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Adjusted path
import { useRouter } from "next/navigation";
import {
    Clock,
    Download,
    Trash2,
    Eye,
    AlertTriangle,
    LogOut,
    User,
    ArrowLeft
} from "lucide-react";
import Footer from "../../components/Footer"; // Adjusted path

export default function HistoryPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [history, setHistory] = useState([]);
    const [apiUrl, setApiUrl] = useState(null);
    const [dbError, setDbError] = useState(false);

    const fetchHistory = async (url = apiUrl) => {
        if (!url || !user) return; // Only fetch if user is logged in
        try {
            const response = await fetch(`${url}/history`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    const checkHealth = async (url) => {
        if (!url) return;
        try {
            const response = await fetch(`${url}/health`);
            if (response.status === 503) {
                setDbError(true);
            } else {
                setDbError(false);
            }
        } catch (error) {
            console.error("Health check failed:", error);
            setDbError(true);
        }
    };

    useEffect(() => {
        // Only fetch config and data if user is authenticated
        if (user) {
            fetch("/api/config")
                .then((res) => res.json())
                .then((data) => {
                    setApiUrl(data.apiUrl);
                    fetchHistory(data.apiUrl);
                    checkHealth(data.apiUrl);
                })
                .catch((err) => console.error("Failed to load config:", err));
        } else if (!authLoading && !user) {
            // Redirect to home if not logged in
            router.push("/");
        }
    }, [user, authLoading, router]);

    const deleteHistory = async (id) => {
        if (!confirm("Are you sure you want to delete this report?")) return;
        try {
            const response = await fetch(`${apiUrl}/history/${id}`, { method: "DELETE" });
            if (response.ok) {
                setHistory(history.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete history item:", error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <main className='min-h-screen p-8 max-w-6xl mx-auto'>
            <header className='mb-10'>
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
                        >
                            <User size={18} />
                            <span>{user.username}</span>
                        </button>
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Database Connection Error Banner */}
            {dbError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start gap-3">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h3 className="text-red-800 font-bold">Database Connection Issue</h3>
                        <p className="text-red-700 text-sm mt-1">
                            Warning: The application is currently unable to connect to the database.
                            History features may be unavailable.
                        </p>
                    </div>
                </div>
            )}

            {/* History Section */}
            <div className="bg-white p-8 rounded-xl shadow-md min-h-[500px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock className="text-purple-600" /> Analysis History
                </h2>

                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Time (UTC)</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">User</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">File Name</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Sequence Preview</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Total Mass</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Protein?</th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-600 text-sm">
                                            {new Date(record.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 text-sm font-medium">
                                            {record.username || "Anonymous"}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 font-medium text-sm">
                                            {record.filename || "-"}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-xs text-gray-500 max-w-[150px] truncate" title={record.sequence}>
                                            {record.sequence}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 font-medium">
                                            {record.total_mass}
                                        </td>
                                        <td className="py-3 px-4">
                                            {record.is_protein ? (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => router.push(`/results/${record.id}`)}
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                                title="View Analysis"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reportContent = `DNA Analysis Report
-------------------
Timestamp: ${new Date(record.timestamp).toLocaleString()}
User: ${record.username || "Anonymous"}
Total Mass: ${record.total_mass}
Is Protein: ${record.is_protein ? "YES" : "NO"}
-------------------
Sequence:
${record.sequence}
`;
                                                    const blob = new Blob([reportContent], { type: 'text/plain' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `analysis_report_${record.id}.txt`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Download Report"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteHistory(record.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No history found.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
