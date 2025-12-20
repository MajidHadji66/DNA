import { XCircle } from "lucide-react";

/**
 * AboutModal Component
 * 
 * Displays generic information about the project and author.
 * 
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {() => void} onClose - Function to call when closing the modal.
 */
export default function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
            <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-in zoom-in-95 leading-relaxed'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
                >
                    <XCircle size={24} />
                </button>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                    About This Project
                </h2>
                <div className='space-y-4 text-gray-600'>
                    <p>
                        <strong>Author:</strong> Majid Hadji
                    </p>
                    <p>
                        <strong>Purpose:</strong> This application was built to analyze
                        DNA sequences and determine their potential to encode proteins
                        based on specific biological criteria.
                    </p>
                    <div className='pt-4 border-t border-gray-100'>
                        <p className='text-sm'>Version 1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
