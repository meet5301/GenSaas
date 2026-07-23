import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "kirana.db")

def migrate():
    from database import engine
    import models
    models.Base.metadata.create_all(bind=engine)

    if not os.path.exists(db_path):
        print(f"Database file {db_path} does not exist. No migration needed.")
        return
        
    print(f"Checking database schema for {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    product_columns = [
        ("barcode", "TEXT"),
        ("sku", "TEXT"),
        ("hsn_code", "TEXT"),
        ("gst_rate", "REAL DEFAULT 18.0"),
        ("expiry_date", "TEXT"),
        ("batch_number", "TEXT")
    ]
    
    cursor.execute("PRAGMA table_info(products)")
    existing_products = [col[1] for col in cursor.fetchall()]
    
    for col_name, col_type in product_columns:
        if col_name not in existing_products:
            print(f"Adding column products.{col_name} ({col_type})")
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            
    store_columns = [
        ("theme_color", "TEXT DEFAULT '#E85A4F'"),
        ("secondary_color", "TEXT DEFAULT '#D8C3A5'"),
        ("bg_color", "TEXT DEFAULT '#EAE7DC'"),
        ("font_family", "TEXT DEFAULT 'Outfit'"),
        ("logo_url", "TEXT"),
        ("whatsapp_enabled", "BOOLEAN DEFAULT 1"),
        ("stock_alerts_enabled", "BOOLEAN DEFAULT 1"),
        ("low_stock_threshold", "INTEGER DEFAULT 5"),
        ("procurement_list", "TEXT DEFAULT '[]'")
    ]
    
    cursor.execute("PRAGMA table_info(stores)")
    existing_stores = [col[1] for col in cursor.fetchall()]
    
    for col_name, col_type in store_columns:
        if col_name not in existing_stores:
            print(f"Adding column stores.{col_name} ({col_type})")
            cursor.execute(f"ALTER TABLE stores ADD COLUMN {col_name} {col_type}")
            
    user_columns = [
        ("bonus_claimed", "BOOLEAN DEFAULT 0"),
        ("referral_code", "TEXT"),
        ("referred_by_code", "TEXT"),
        ("referral_count", "INTEGER DEFAULT 0")
    ]
    cursor.execute("PRAGMA table_info(users)")
    existing_users = [col[1] for col in cursor.fetchall()]
    for col_name, col_type in user_columns:
        if col_name not in existing_users:
            print(f"Adding column users.{col_name} ({col_type})")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")

    conn.commit()
    conn.close()
    print("Database migration checks complete.")

if __name__ == "__main__":
    migrate()
