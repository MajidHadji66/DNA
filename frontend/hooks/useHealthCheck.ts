import { useState, useEffect, useCallback } from "react";

/**
 * useHealthCheck Hook
 * 
 * This hook is responsible for checking the health status of the backend API.
 * It is used to display a warning banner if the database or backend is unavailable.
 * 
 * @param {string | null} apiUrl - The base URL of the backend API.
 * @returns {object} An object containing:
 *   - dbError: boolean - True if the backend is unreachable or reports unhealthy.
 *   - checkHealth: (url: string) => Promise<void> - Function to manually trigger a health check.
 */
export function useHealthCheck(apiUrl: string | null) {
    const [dbError, setDbError] = useState(false);

    /**
     * Checks the health of the given URL.
     * Sets dbError to true if the status is 503 or if the fetch fails.
     */
    const checkHealth = useCallback(async (url: string) => {
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
            // If we can't reach the backend at all, that's also an error
            setDbError(true);
        }
    }, []);

    // Automatically check health when apiUrl becomes available
    useEffect(() => {
        if (apiUrl) {
            checkHealth(apiUrl);
        }
    }, [apiUrl, checkHealth]);

    return { dbError, checkHealth };
}
