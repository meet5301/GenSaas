import sys
import os

sys.path.append(os.path.dirname(__file__))

from database import engine
from sqlalchemy import text

def run_db_migration():
    print("Running universal database column migration...")
    with engine.connect() as conn:
        user_cols = [
            ("bonus_claimed", "BOOLEAN DEFAULT FALSE"),
            ("referral_code", "VARCHAR(50)"),
            ("referred_by_code", "VARCHAR(50)"),
            ("referral_count", "INTEGER DEFAULT 0")
        ]
        for col_name, col_type in user_cols:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type};"))
                conn.commit()
                print(f"Successfully added users.{col_name}")
            except Exception as e:
                print(f"Note: users.{col_name} ({e})")

        # Also ensure module_access and saas_transactions tables are created
        try:
            from models import Base
            Base.metadata.create_all(bind=engine)
            print("Successfully created/verified all tables in Base.metadata.")
        except Exception as e:
            print(f"Table creation note: {e}")

if __name__ == "__main__":
    run_db_migration()
