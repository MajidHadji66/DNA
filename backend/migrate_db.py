from sqlalchemy import text
from database import engine

def migrate():
    # engine is already created in database.py with the correct URL
    with engine.connect() as connection:
        # Simple migration: Add column if it doesn't exist
        # note: postgres specific syntax
        try:
            connection.execute(text("ALTER TABLE analysis_history ADD COLUMN IF NOT EXISTS filename VARCHAR;"))
            connection.commit() # Important for some drivers
            print("Migration successful: Added 'filename' column.")
        except Exception as e:
            print(f"Migration failed (might already exist or other error): {e}")

if __name__ == "__main__":
    migrate()
