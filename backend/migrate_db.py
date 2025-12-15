from sqlalchemy import create_engine, text
import os

# Use the connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://neondb_owner:npg_vTOsoL0eg5lZ@ep-still-dew-adcibm7w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
)

def migrate():
    engine = create_engine(DATABASE_URL)
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
