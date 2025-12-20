import { XCircle, Dna, Download } from "lucide-react";

/**
 * SequenceViewer Component
 * 
 * A modal that displays long text content (like DNA sequences) in a scrollable area.
 * Includes functionality to download the content as a .txt file.
 * 
 * @param {string | null} sequence - The text content to display. If null, the modal is hidden.
 * @param {() => void} onClose - Function to close the modal.
 * @param {string} [filename="sequence.txt"] - The default filename for the download.
 */
export default function SequenceViewer({
    sequence,
    onClose,
    filename = "sequence.txt"
}: {
    sequence: string | null;
    onClose: () => void;
    filename?: string;
}) {
    if (!sequence) return null;

    const handleDownload = () => {
        const blob = new Blob([sequence], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
            <div className='bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative animate-in zoom-in-95'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
                >
                    <XCircle size={24} />
                </button>
                <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <Dna className="text-blue-500" /> Full Sequence Content
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto font-mono text-sm break-all text-gray-700">
                    {sequence}
                </div>
                <div className="mt-4 text-right flex justify-end gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium text-sm transition-colors"
                    >
                        <Download size={16} /> Download .txt
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
