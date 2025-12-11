"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Activity,
  Dna,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

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

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze file");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen p-8 max-w-6xl mx-auto'>
      <header className='mb-10 text-center'>
        <h1 className='text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3'>
          <Dna size={40} /> DNA Sequence Analyzer
        </h1>
        <p className='text-gray-600'>
          Upload a DNA file to check for protein encoding potential
        </p>
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
                className={`p-6 rounded-xl shadow-md text-white flex items-center justify-between ${
                  result.is_protein ? "bg-green-600" : "bg-red-500"
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

              {/* Nucleotide Counts */}
              <div className='bg-white p-6 rounded-xl shadow-md'>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Activity size={20} /> Nucleotide Composition
                </h3>
                <div className='grid grid-cols-4 gap-2 text-center'>
                  {["A", "C", "T", "G"].map((nuc, idx) => (
                    <div key={nuc} className='p-3 bg-gray-50 rounded-lg'>
                      <div className='text-xl font-bold text-blue-900'>
                        {nuc}
                      </div>
                      <div className='text-gray-600'>{result.counts[idx]}</div>
                      <div className='text-xs text-gray-400 mt-1'>
                        {result.mass_percentages[idx]}% mass
                      </div>
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
    </main>
  );
}
