# DNA Sequence Analyzer

A full-stack web application that analyzes DNA sequences to determine their potential to encode proteins. Built with **Next.js** (Frontend) and **Python FastAPI** (Backend).

## 🚀 Features

-   **DNA Analysis**: Upload `.txt` or `.dna` files containing nucleotide sequences.
-   **Protein Detection**: Algorithm checks for valid start/stop codons, sequence length, and mass percentage.
-   **Visual Dashboard**: View nucleotide composition, codon sequences, and mass stats.
-   **Education**: Built-in glossary and explanation of the underlying biological criteria.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Lucide Icons.
-   **Backend**: Python 3.10+, FastAPI, Uvicorn.

## 📋 Prerequisites

-   Node.js (v18 or higher)
-   Python (v3.8 or higher)

## 🏁 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Start-Dev-PS/DNA-Sequence-Analyzer.git
cd DNA-Sequence-Analyzer
```

### 2. Automatic Setup (Windows)

We have provided a PowerShell script to install dependencies and start both servers automatically.

```powershell
.\start-dev.ps1
```

### 3. Manual Setup

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn api:app --reload
```
*Server runs at `http://127.0.0.1:8000`*

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```
*App runs at `http://localhost:3000`*

## 🧬 How it Works

The application determines if a sequence is a valid protein candidate based on 4 criteria:

1.  **Start Codon**: Must begin with `ATG`.
2.  **Stop Codon**: Must end with `TAA`, `TAG`, or `TGA`.
3.  **Length**: Must be at least 5 codons long.
4.  **Mass %**: Cytosine (C) and Guanine (G) must account for >= 30% of total mass.

## 👤 Author

**Majid Hadji**
-   Project: DNA Sequence Analyzer

## 📄 License

This project is open source and available for educational purposes.
