import { AlertTriangle } from "lucide-react";

/**
 * DbConnectionBanner Component
 * 
 * Displays a warning banner when the application cannot connect to the backend database.
 * This is typically triggered by a 503 Service Unavailable response or network failure.
 * 
 * @param {boolean} isVisible - Whether the banner should be shown.
 */
export default function DbConnectionBanner({ isVisible }: { isVisible: boolean }) {
    if (!isVisible) return null;

    return (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={24} />
            <div>
                <h3 className="text-red-800 font-bold">Database Connection Issue</h3>
                <p className="text-red-700 text-sm mt-1">
                    Warning: The application is currently unable to connect to the database.
                    History features and saving new analyses may be unavailable.
                </p>
            </div>
        </div>
    );
}
