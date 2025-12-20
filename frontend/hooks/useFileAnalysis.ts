import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { User } from "../app/context/AuthContext";

/**
 * useFileAnalysis Hook
 * 
 * Encapsulates the logic for handling file selection, upload, and analysis.
 * 
 * @param {string | null} apiUrl - The backend API URL.
 * @param {User | null} user - The current authenticated user.
 * @returns {object} An object containing:
 *   - file: File | null - The currently selected file.
 *   - loading: boolean - Whether an analysis is in progress.
 *   - error: string | null - Error message if analysis fails.
 *   - handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void - Handler for file input changes.
 *   - handleUpload: () => Promise<void> - Handler to trigger analysis.
 */
export function useFileAnalysis(apiUrl: string | null, user: User | null) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    /**
     * Updates the state when a user selects a file.
     */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    /**
     * Uploads the selected file to the backend for analysis.
     * Redirects to the result page on success.
     */
    const handleUpload = async () => {
        if (!file || !apiUrl) return;

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);
        if (user?.username) {
            formData.append("username", user.username);
        }

        try {
            const response = await fetch(`${apiUrl}/analyze`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMsg = "Failed to analyze file";
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.detail || errorMsg;
                } catch (e) {
                    // If JSON parsing fails, try reading as text (e.g. HTML error page)
                    const textBody = await response.text();
                    if (textBody) errorMsg = `Server Error: ${textBody.slice(0, 200)}`; // Truncate if too long
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            // Redirect to result page
            if (data.id) {
                router.push(`/results/${data.id}`);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return {
        file,
        loading,
        error,
        handleFileChange,
        handleUpload,
    };
}
