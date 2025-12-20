"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Clock,
    Download,
    Trash2,
    Eye,
    LogOut,
    User,
    ArrowLeft,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import Footer from "../../components/Footer";
import DbConnectionBanner from "../../components/DbConnectionBanner";
import { useHealthCheck } from "../../hooks/useHealthCheck";
import { useHistory, HistoryRecord } from "../../hooks/useHistory";

export default function HistoryPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [apiUrl, setApiUrl] = useState<string | null>(null);

    // Custom Hooks
    const { dbError } = useHealthCheck(apiUrl);
    const {
        history,
        sortedHistory,
        sortConfig,
        requestSort,
        deleteHistory,
        downloadReport,
        refreshHistory
    } = useHistory(apiUrl, user);

    // Load config
    useEffect(() => {
        if (user) {
            fetch("/api/config")
                .then((res) => res.json())
                .then((data) => {
                    setApiUrl(data.apiUrl);
                })
                .catch((err) => console.error("Failed to load config:", err));
        } else if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);


    const GetSortIcon = ({ columnKey }: { columnKey: keyof HistoryRecord }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
        if (sortConfig.direction === 'asc') return <ArrowUp size={14} className="ml-1 text-blue-600" />;
        return <ArrowDown size={14} className="ml-1 text-blue-600" />;
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
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

            <DbConnectionBanner isVisible={dbError} />

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
                                    <th
                                        className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase cursor-pointer hover:bg-gray-50 transition-colors select-none"
                                        onClick={() => requestSort('timestamp')}
                                    >
                                        <div className="flex items-center">
                                            Time (UTC)
                                            <GetSortIcon columnKey="timestamp" />
                                        </div>
                                    </th>
                                    <th
                                        className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase cursor-pointer hover:bg-gray-50 transition-colors select-none"
                                        onClick={() => requestSort('username')}
                                    >
                                        <div className="flex items-center">
                                            User
                                            <GetSortIcon columnKey="username" />
                                        </div>
                                    </th>
                                    <th
                                        className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase cursor-pointer hover:bg-gray-50 transition-colors select-none"
                                        onClick={() => requestSort('filename')}
                                    >
                                        <div className="flex items-center">
                                            File Name
                                            <GetSortIcon columnKey="filename" />
                                        </div>
                                    </th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Sequence Preview</th>
                                    <th
                                        className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase cursor-pointer hover:bg-gray-50 transition-colors select-none"
                                        onClick={() => requestSort('total_mass')}
                                    >
                                        <div className="flex items-center">
                                            Total Mass
                                            <GetSortIcon columnKey="total_mass" />
                                        </div>
                                    </th>
                                    <th
                                        className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase cursor-pointer hover:bg-gray-50 transition-colors select-none"
                                        onClick={() => requestSort('is_protein')}
                                    >
                                        <div className="flex items-center">
                                            Protein?
                                            <GetSortIcon columnKey="is_protein" />
                                        </div>
                                    </th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHistory.map((record) => (
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
                                                onClick={() => downloadReport(record)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Download Report"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteHistory(record.id)}
                                                disabled={user.username !== 'admin'}
                                                className={`text-red-500 transition-colors ${user.username !== 'admin' ? 'opacity-30 cursor-not-allowed' : 'hover:text-red-700'}`}
                                                title={user.username !== 'admin' ? "You don't have admin privilege" : "Delete Report"}
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
