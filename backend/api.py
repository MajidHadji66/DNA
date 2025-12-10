from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import dna
import uvicorn

app = FastAPI()

# Enable CORS so the frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_dna_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        # Extract nucleotides from the text
        nucleotides = []
        for char in text.upper():
            if char in 'ATGC':
                nucleotides.append(char)
        
        if not nucleotides:
            return {"error": "No valid nucleotides found in file."}

        # Use the logic from dna.py
        results = dna.analyze_dna_sequence(nucleotides)
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
