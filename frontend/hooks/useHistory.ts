import { useState, useEffect } from "react";
import { User } from "../app/context/AuthContext";

/**
 * Interface representing a single history record.
 */
export interface HistoryRecord {
    id: number;
    timestamp: string;
    username: string;
    filename: string;
    sequence: string;
    total_mass: number;
    is_protein: boolean;
}

/**
 * useHistory Hook
 * 
 * Manages the fetching, sorting, and deletion of analysis history records.
 * 
 * @param {string | null} apiUrl - The backend API URL.
 * @param {User | null} user - The current authenticated user.
 * @returns {object} An object containing:
 *   - history: HistoryRecord[] - The list of history records.
 *   - sortedHistory: HistoryRecord[] - The history records sorted by the current sort configuration.
 *   - sortConfig: { key: keyof HistoryRecord; direction: 'asc' | 'desc' } - The current sort state.
 *   - requestSort: (key: keyof HistoryRecord) => void - Function to change the sort key or direction.
 *   - deleteHistory: (id: number) => Promise<void> - Function to delete a record.
 *   - refreshHistory: () => Promise<void> - Function to re-fetch history.
 */
export function useHistory(apiUrl: string | null, user: User | null) {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof HistoryRecord; direction: 'asc' | 'desc' }>({
        key: 'timestamp',
        direction: 'desc'
    });

    /**
     * Fetches the history from the backend.
     */
    const fetchHistory = async () => {
        if (!apiUrl || !user) return;
        try {
            const response = await fetch(`${apiUrl}/history`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    // Initial fetch when deps change
    useEffect(() => {
        fetchHistory();
    }, [apiUrl, user]);

    /**
     * Derives the sorted history based on configuration.
     * Can be memoized if performance becomes an issue, but fast enough for small lists.
     */
    const sortedHistory = [...history].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    /**
     * Updates sort configuration. 
     * Toggles direction if clicking the same key, otherwise sets to 'asc'.
     */
    const requestSort = (key: keyof HistoryRecord) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    /**
     * Deletes a history record by ID.
     */
    const deleteHistory = async (id: number) => {
        if (!apiUrl) return;
        if (!confirm("Are you sure you want to delete this report?")) return;

        try {
            const response = await fetch(`${apiUrl}/history/${id}`, { method: "DELETE" });
            if (response.ok) {
                setHistory((prev) => prev.filter((item) => item.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete history item:", error);
        }
    };

    /**
     * Generates and downloads a text report for a specific history record.
     */
    const downloadReport = (record: HistoryRecord) => {
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
    };

    return {
        history,
        sortedHistory,
        sortConfig,
        requestSort,
        deleteHistory,
        downloadReport,
        refreshHistory: fetchHistory,
    };
}
