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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  // State variables
  const [history, setHistory] = useState([]);
  const [viewSequence, setViewSequence] = useState(null);
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
          fetchHistory(data.apiUrl);
          checkHealth(data.apiUrl);
        })
        .catch((err) => console.error("Failed to load config:", err));
    }
  }, [user]);

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

  const handleFileChange = (e) => {
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
      setResult(data);
      fetchHistory(); // Refresh history after new analysis
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
              <Dna size={40} /> DNA Sequence Analyzer
            </h1>
            <p className='text-gray-600'>
              Upload a DNA file to check for protein encoding potential
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/profile')}
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

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Upload Section */}
        <div className='md:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <Upload size={20} /> Upload File
          </h2>

          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors'>
            <input
              type='file'
              id='file-upload'
              className='hidden'
              onChange={handleFileChange}
              accept='.txt,.dna'
            />
            <label
              htmlFor='file-upload'
              className='cursor-pointer flex flex-col items-center'
            >
              <FileText size={48} className='text-gray-400 mb-2' />
              <span className='text-blue-600 font-medium'>Choose a file</span>
              <span className='text-xs text-gray-500 mt-1'>
                .txt or .dna files
              </span>
            </label>
          </div>

          {file && (
            <div className='mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between'>
              <span className='text-sm font-medium truncate'>{file.name}</span>
              <button
                onClick={handleUpload}
                disabled={loading}
                className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors'
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          )}

          {error && (
            <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className='md:col-span-2'>
          {result ? (
            <div className='space-y-6'>
              {/* Status Card */}
              <div
                className={`p-6 rounded-xl shadow-md text-white flex items-center justify-between ${result.is_protein ? "bg-green-600" : "bg-red-500"
                  }`}
              >
                <div>
                  <h2 className='text-2xl font-bold'>
                    {result.is_protein ? "Protein Detected" : "Not a Protein"}
                  </h2>
                  <p className='opacity-90'>
                    {result.is_protein
                      ? "This sequence meets all criteria for a valid protein."
                      : "This sequence does not meet the criteria."}
                  </p>
                </div>
                {result.is_protein ? (
                  <CheckCircle size={48} />
                ) : (
                  <XCircle size={48} />
                )}
              </div>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                  <h3 className='text-gray-500 text-sm font-medium uppercase'>
                    Total Mass
                  </h3>
                  <p className='text-3xl font-bold text-gray-800'>
                    {result.total_mass}
                  </p>
                </div>
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                  <h3 className='text-gray-500 text-sm font-medium uppercase'>
                    Codon Count
                  </h3>
                  <p className='text-3xl font-bold text-gray-800'>
                    {result.codons.length}
                  </p>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-md'>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Activity size={20} /> Nucleotide Mass Distribution (%)
                </h3>
                <div className='h-64 w-full'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'A', value: result.mass_percentages[0], color: '#ef4444' },
                        { name: 'C', value: result.mass_percentages[1], color: '#f59e0b' },
                        { name: 'T', value: result.mass_percentages[2], color: '#3b82f6' },
                        { name: 'G', value: result.mass_percentages[3], color: '#22c55e' },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Mass %">
                        {
                          [
                            { name: 'A', color: '#ef4444' }, // Red
                            { name: 'C', color: '#f59e0b' }, // Yellow
                            { name: 'T', color: '#3b82f6' }, // Blue
                            { name: 'G', color: '#22c55e' }, // Green
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Raw Counts Footer */}
                <div className='grid grid-cols-4 gap-2 text-center mt-4 pt-4 border-t border-gray-100'>
                  {["A", "C", "T", "G"].map((nuc, idx) => (
                    <div key={nuc}>
                      <div className='text-xs font-bold text-gray-400'>{nuc} Count</div>
                      <div className='text-gray-600 font-mono'>{result.counts[idx]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Codons List */}
              <div className='bg-white p-6 rounded-xl shadow-md'>
                <h3 className='text-lg font-semibold mb-4'>Codon Sequence</h3>
                <div className='flex flex-wrap gap-2 font-mono text-sm'>
                  {result.codons.map((codon, i) => (
                    <span
                      key={i}
                      className='bg-gray-100 px-2 py-1 rounded text-gray-700'
                    >
                      {codon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white p-12 rounded-xl shadow-md text-center h-full flex flex-col items-center justify-center text-gray-400'>
              <Dna size={64} className='mb-4 opacity-20' />
              <p>Upload a file to see the analysis results here.</p>
            </div>
          )}
        </div>
      </div>



      {/* History Section */}
      {
        history.length > 0 && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="text-purple-600" /> Recent Analysis History
            </h2>
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
          </div>
        )
      }

      {/* Education Section */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
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

        {/* Glossary */}
        <div className='bg-slate-50 p-8 rounded-xl border border-slate-200'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
            <FileText className='text-slate-500' /> Glossary
          </h2>
          <div className='space-y-5'>
            <div>
              <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                Codon
              </h3>
              <p className='text-gray-600 text-sm'>
                A sequence of 3 nucleotides that corresponds to a specific amino
                acid or stop signal during protein synthesis.
              </p>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                Nucleotide
              </h3>
              <p className='text-gray-600 text-sm'>
                The basic building block of DNA. In this analyzer, we focus on
                Adenine (A), Cytosine (C), Guanine (G), and Thymine (T).
              </p>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                Mass %
              </h3>
              <p className='text-gray-600 text-sm'>
                The percentage of the total molecular weight contributed by
                specific nucleotides. C and G nucleotides are heavier and affect
                the stability of the DNA molecule.
              </p>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1'>
                Protein
              </h3>
              <p className='text-gray-600 text-sm'>
                Large biomolecules and macromolecules that comprise one or more
                long chains of amino acid residues. In this context, we check if
                the DNA sequence has the potential to encode one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='mt-20 border-t border-gray-200 pt-8 text-center text-gray-500 text-sm pb-8'>
        <p>&copy; 2025 Majid Hadji. All rights reserved.</p>
        <p className='mt-2'>
          DNA Sequence Analyzer Project For Educational Purposes
        </p>
        <div className='mt-4 flex justify-center gap-6'>
          <button
            onClick={() => setShowAbout(true)}
            className='hover:text-blue-600 transition-colors'
          >
            About
          </button>
          <a href='#' className='hover:text-blue-600 transition-colors'>
            Contact
          </a>
          <a
            href='https://github.com/MajidHadji66/DNA'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-blue-600 transition-colors'
          >
            GitHub
          </a>
        </div>
      </footer>
    </main >
  );
}
