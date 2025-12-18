"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useAuth, User } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import LoginDialog from "../components/LoginDialog";
import LandingPage from "../components/LandingPage";
import {
  Upload,
  FileText,
  Activity,
  Dna,
  AlertTriangle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Clock,
  XCircle,
  Download
} from "lucide-react";
import Footer from "../components/Footer";

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  // State variables
  const [viewSequence, setViewSequence] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [dbError, setDbError] = useState(false);



  const checkHealth = async (url: string) => {
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
  };

  useEffect(() => {
    // Only fetch config and data if user is authenticated
    if (user) {
      fetch("/api/config")
        .then((res) => res.json())
        .then((data) => {
          setApiUrl(data.apiUrl);
          checkHealth(data.apiUrl);
        })
        .catch((err) => console.error("Failed to load config:", err));
    }
  }, [user]);



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Database Connection Error Banner */}
      {dbError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-red-800 font-bold">Database Connection Issue</h3>
            <p className="text-red-700 text-sm mt-1">
              Warning: The application is currently unable to connect to the database.
              History features and saving new analyses may be unavailable.
            </p>
          </div>
        </div>
      )}

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
      {showAbout && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative'>
            <button
              onClick={() => setShowAbout(false)}
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
      )}

      {/* Sequence View Modal */}
      {viewSequence && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative'>
            <button
              onClick={() => setViewSequence(null)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <XCircle size={24} />
            </button>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <Dna className="text-blue-500" /> Full Sequence Content
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto font-mono text-sm break-all text-gray-700">
              {viewSequence}
            </div>
            <div className="mt-4 text-right flex justify-end gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([viewSequence], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sequence.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium text-sm transition-colors"
              >
                <Download size={16} /> Download .txt
              </button>
              <button
                onClick={() => setViewSequence(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section - Full Width */}
      <div className='bg-white p-12 rounded-xl shadow-lg mb-12 transform transition-all hover:scale-[1.01]'>
        <h2 className='text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-800 justify-center'>
          <Upload size={32} className="text-blue-500" />    Upload a DNA file to check for protein encoding potential
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
        {/* How It Works */}
        <div className='bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Activity className='text-blue-500' /> How it Works
          </h2>
          <p className='text-gray-600 mb-4'>
            Our algorithm analyzes the DNA sequence to determine if it encodes a
            valid protein based on specific structural and chemical criteria.
          </p>
          <ul className='space-y-3'>
            <li className='flex items-start gap-3'>
              <span className='bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5'>
                1
              </span>
              <span className='text-gray-700'>
                <strong>Start Codon:</strong> Must begin with the sequence{" "}
                <code className='bg-gray-100 px-1 rounded'>ATG</code>.
              </span>
            </li>
            <li className='flex items-start gap-3'>
              <span className='bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5'>
                2
              </span>
              <span className='text-gray-700'>
                <strong>Stop Codon:</strong> Must end with one of the valid stop
                codons: <code className='bg-gray-100 px-1 rounded'>TAA</code>,{" "}
                <code className='bg-gray-100 px-1 rounded'>TAG</code>, or{" "}
                <code className='bg-gray-100 px-1 rounded'>TGA</code>.
              </span>
            </li>
            <li className='flex items-start gap-3'>
              <span className='bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5'>
                3
              </span>
              <span className='text-gray-700'>
                <strong>Sequence Length:</strong> Must contain at least{" "}
                <strong>5 codons</strong> (including start and stop).
              </span>
            </li>
            <li className='flex items-start gap-3'>
              <span className='bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-sm mt-0.5'>
                4
              </span>
              <span className='text-gray-700'>
                <strong>Mass Percentage:</strong> Cytosine (C) and Guanine (G)
                must account for at least <strong>30%</strong> of the total
                mass.
              </span>
            </li>
          </ul>
        </div>


      </div>

      {/* Footer */}
      <Footer />
    </main >
  );
}
