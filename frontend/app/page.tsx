"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import LoginDialog from "../components/LoginDialog";
import LandingPage from "../components/LandingPage";
import {
  Upload,
  FileText,
  Activity,
  Dna,
  User as UserIcon,
  LogOut,
  Clock,
} from "lucide-react";
import Footer from "../components/Footer";
import DbConnectionBanner from "../components/DbConnectionBanner";
import HowItWorks from "../components/HowItWorks";
import AboutModal from "../components/AboutModal";
import SequenceViewer from "../components/SequenceViewer";
import { useHealthCheck } from "../hooks/useHealthCheck";
import { useFileAnalysis } from "../hooks/useFileAnalysis";

/**
 * Validates availability of API URL
 */
async function fetchConfig() {
  const res = await fetch("/api/config");
  return res.json();
}

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();

  // Local state for modals (UI state only)
  const [showAbout, setShowAbout] = useState(false);
  const [viewSequence, setViewSequence] = useState<string | null>(null);

  // App Configuration State
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // Custom Hooks
  const { dbError, checkHealth } = useHealthCheck(apiUrl);
  const { file, loading, error, handleFileChange, handleUpload } = useFileAnalysis(apiUrl, user);

  // Initial Configuration Load
  useEffect(() => {
    if (user) {
      fetchConfig()
        .then((data) => {
          setApiUrl(data.apiUrl);
        })
        .catch((err) => console.error("Failed to load config:", err));
    }
  }, [user]);

  // Loading state for auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in -> Show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage onLogin={() => setIsLoginOpen(true)} />
        <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </>
    );
  }

  // Logged in -> Show Dashboard
  return (
    <main className='min-h-screen p-8 max-w-6xl mx-auto'>
      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <DbConnectionBanner isVisible={dbError} />

      <header className='mb-10'>
        <div className="flex justify-between items-start">
          <div className="flex-1"></div> {/* Spacer for centering */}
          <div className='text-center flex-1'>
            <h1 className='text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3'>
              <Dna size={60} /> DNA Sequence Analyzer
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
              >
                <UserIcon size={18} />
                <span>{user.username}</span>
              </button>
              <button
                onClick={() => router.push('/history')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
              >
                <Clock size={18} />
                <span>History</span>
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
        </div>
      </header>

      {/* About Modal */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />

      {/* Sequence View Modal */}
      <SequenceViewer
        sequence={viewSequence}
        onClose={() => setViewSequence(null)}
      />

      {/* Upload Section - Full Width */}
      <div className='bg-white p-12 rounded-xl shadow-lg mb-12 transform transition-all hover:scale-[1.01]'>
        <h2 className='text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-800 justify-center'>
          <Upload size={32} className="text-blue-500" /> Upload a DNA file to check for protein encoding potential
        </h2>

        <div
          className={`border-4 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
        >
          <input
            type='file'
            id='file-upload'
            className='hidden'
            onChange={handleFileChange}
            accept='.txt,.dna'
          />
          <label
            htmlFor='file-upload'
            className='cursor-pointer flex flex-col items-center justify-center h-full'
          >
            {file ? (
              <>
                <FileText size={64} className='text-green-500 mb-4 animate-bounce' />
                <span className='text-green-700 font-bold text-xl'>{file.name}</span>
                <span className='text-sm text-green-600 mt-2'>Ready to analyze</span>
              </>
            ) : (
              <>
                <FileText size={80} className='text-gray-300 mb-4 group-hover:text-blue-400 transition-colors' />
                <span className='text-xl text-gray-600 font-medium mb-2'>
                  Drag and drop or <span className='text-blue-600 underline'>browse</span>
                </span>
                <span className='text-sm text-gray-400'>
                  Supported formats: .txt, .dna
                </span>
              </>
            )}
          </label>
        </div>

        {file && (
          <div className='mt-8 flex justify-center'>
            <button
              onClick={handleUpload}
              disabled={loading}
              className='bg-blue-600 text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-3'
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing Sequence...
                </>
              ) : (
                <>
                  <Activity size={24} />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className='mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium animate-pulse'>
            {error}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className='mt-12'>
        <HowItWorks />

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAbout(true)}
            className="text-gray-500 hover:text-blue-600 underline text-sm"
          >
            About this project
          </button>
        </div>
      </div>

      <Footer />
    </main >
  );
}
