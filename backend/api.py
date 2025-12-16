from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import dna
import uvicorn
from database import engine, Base, get_db, AnalysisResult
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import Depends
from migrate_db import migrate

# Run migration to ensure table has 'filename' column
migrate()

app = FastAPI()

# Enable CORS so the frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables on startup
Base.metadata.create_all(bind=engine)


@app.post("/analyze")
async def analyze_dna_endpoint(
    file: UploadFile = File(...), 
    username: str = Form(None), # Accept username as form field
    db: Session = Depends(get_db)
):

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
        
        # Save to Database
        db_record = AnalysisResult(
            filename=file.filename,
            sequence=results["nucleotides"],
            is_protein=results["is_protein"],
            total_mass=str(results["total_mass"]),
            username=username
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return results

    except Exception as e:
        import traceback
        traceback.print_exc() # Print full stack trace to Cloud Run logs
        print(f"ERROR processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    # Fetch the last 10 analysis records
    history = db.query(AnalysisResult).order_by(AnalysisResult.timestamp.desc()).limit(10).all()
    return history


@app.delete("/history/{item_id}")
def delete_history_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(AnalysisResult).filter(AnalysisResult.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # execute a simple query to check the connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception as e:
        print(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Database connection unavailable")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
