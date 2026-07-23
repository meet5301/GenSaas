import sys
import os
import datetime
from sqlalchemy.orm import Session

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
import models
from auth import hash_password

def seed_data():
    db: Session = SessionLocal()
    try:
        # Create all tables if not exist
        Base.metadata.create_all(bind=engine)
        
        email = "meetgol22@gmail.com"
        print(f"Seeding database for {email}...")

        # 1. Store Setup
        store = db.query(models.Store).filter(models.Store.name == "Meet's Super Mart").first()
        if not store:
            store = models.Store(
                name="Meet's Super Mart",
                slug="meets-super-mart",
                description="Premium Kirana & General POS Retail Store",
                owner_name="Meet Gol",
                address="123 Main Bazaar Road, Mumbai, Maharashtra",
                phone="9876543210",
                timings="8:00 AM - 10:00 PM",
                theme_color="#8B3A3A",
                secondary_color="#EAE4D8",
                bg_color="#FFFDF5",
                font_family="Hanken Grotesk",
                logo_url="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=300&q=80",
                whatsapp_enabled=True,
                stock_alerts_enabled=True,
                low_stock_threshold=10,
                procurement_list="[]"
            )
            db.add(store)
            db.commit()
            db.refresh(store)
        
        # 2. User Setup
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(
                email=email,
                name="Meet Gol",
                phone="9876543210",
                role="Store Owner",
                password_hash=hash_password("123456"),
                store_id=store.id,
                bonus_claimed=True,
                referral_code="MEETGOL22",
                referral_count=5
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.store_id = store.id
            user.role = "Store Owner"
            user.password_hash = hash_password("123456")
            user.bonus_claimed = True
            db.commit()

        # 3. Wallet & Streak & Modules
        wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user.id).first()
        if not wallet:
            wallet = models.Wallet(user_id=user.id, points_balance=180)
            db.add(wallet)
        else:
            wallet.points_balance = 180

        streak = db.query(models.Streak).filter(models.Streak.user_id == user.id).first()
        if not streak:
            streak = models.Streak(user_id=user.id, current_streak=12, longest_streak=21, last_active_date=datetime.date.today().isoformat())
            db.add(streak)
        else:
            streak.current_streak = 12

        # Modules access
        for mod_id in ["Module A", "Module B"]:
            mod = db.query(models.ModuleAccess).filter(models.ModuleAccess.user_id == user.id, models.ModuleAccess.module_id == mod_id).first()
            if not mod:
                db.add(models.ModuleAccess(user_id=user.id, module_id=mod_id, unlocked_via="points"))

        db.commit()

        # 4. Categories
        categories_data = [
            {"name": "Dairy & Milk", "image_url": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300", "subcategories": '["Milk", "Butter", "Cheese", "Ghee"]'},
            {"name": "Bakery & Snacks", "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", "subcategories": '["Biscuits", "Chips", "Noodles", "Bread"]'},
            {"name": "Staples & Oils", "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", "subcategories": '["Atta", "Rice", "Dals", "Cooking Oils"]'},
            {"name": "Personal Care", "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300", "subcategories": '["Soaps", "Shampoos", "Detergents"]'},
            {"name": "Beverages", "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300", "subcategories": '["Tea", "Coffee", "Juices", "Cold Drinks"]'}
        ]

        for cat in categories_data:
            existing_cat = db.query(models.Category).filter(models.Category.store_id == store.id, models.Category.name == cat["name"]).first()
            if not existing_cat:
                db.add(models.Category(store_id=store.id, **cat))
        db.commit()

        # 5. Products
        products_data = [
            {
                "name": "Amul Pasteurised Butter 500g",
                "category": "Dairy & Milk",
                "price": 275.0,
                "purchase_cost": 250.0,
                "stock_quantity": 45,
                "unit": "pack",
                "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300",
                "description": "Delicious creamy salted Amul butter",
                "barcode": "8901262010011",
                "sku": "AMUL-BUT-500",
                "hsn_code": "0405",
                "gst_rate": 12.0,
                "expiry_date": "2026-10-15",
                "batch_number": "BATCH-2026A"
            },
            {
                "name": "Amul Taaza Toned Milk 1L",
                "category": "Dairy & Milk",
                "price": 72.0,
                "purchase_cost": 66.0,
                "stock_quantity": 30,
                "unit": "pack",
                "image_url": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300",
                "description": "Homogenised toned long life milk",
                "barcode": "8901262010028",
                "sku": "AMUL-TAZ-1L",
                "hsn_code": "0401",
                "gst_rate": 0.0,
                "expiry_date": "2026-08-30",
                "batch_number": "BATCH-2026B"
            },
            {
                "name": "Fortune Sunlite Refined Oil 1L",
                "category": "Staples & Oils",
                "price": 145.0,
                "purchase_cost": 125.0,
                "stock_quantity": 25,
                "unit": "pouch",
                "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300",
                "description": "Refined Sunflower cooking oil",
                "barcode": "8901262010035",
                "sku": "FORT-OIL-1L",
                "hsn_code": "1512",
                "gst_rate": 5.0,
                "expiry_date": "2027-01-20",
                "batch_number": "BATCH-OIL99"
            },
            {
                "name": "Aashirvaad Shudh Chakki Atta 5kg",
                "category": "Staples & Oils",
                "price": 260.0,
                "purchase_cost": 225.0,
                "stock_quantity": 18,
                "unit": "bag",
                "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300",
                "description": "100% pure whole wheat flour",
                "barcode": "8901262010042",
                "sku": "AASH-ATTA-5K",
                "hsn_code": "1101",
                "gst_rate": 5.0,
                "expiry_date": "2026-12-10",
                "batch_number": "ATT-042"
            },
            {
                "name": "Tata Tea Gold Premium 500g",
                "category": "Beverages",
                "price": 310.0,
                "purchase_cost": 270.0,
                "stock_quantity": 6,
                "unit": "box",
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300",
                "description": "Rich taste and aroma long leaf tea blend",
                "barcode": "8901262010059",
                "sku": "TATA-TEA-500",
                "hsn_code": "0902",
                "gst_rate": 5.0,
                "expiry_date": "2027-06-30",
                "batch_number": "TATA-99"
            },
            {
                "name": "Cadbury Dairy Milk Silk 150g",
                "category": "Bakery & Snacks",
                "price": 175.0,
                "purchase_cost": 145.0,
                "stock_quantity": 60,
                "unit": "piece",
                "image_url": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300",
                "description": "Smooth and creamy milk chocolate bar",
                "barcode": "8901262010066",
                "sku": "CAD-SILK-150",
                "hsn_code": "1806",
                "gst_rate": 18.0,
                "expiry_date": "2027-03-15",
                "batch_number": "CAD-77"
            },
            {
                "name": "Surf Excel Easy Wash Detergent 1kg",
                "category": "Personal Care",
                "price": 140.0,
                "purchase_cost": 118.0,
                "stock_quantity": 35,
                "unit": "pack",
                "image_url": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300",
                "description": "Superior stain removal powder",
                "barcode": "8901262010073",
                "sku": "SURF-DET-1K",
                "hsn_code": "3402",
                "gst_rate": 18.0,
                "expiry_date": "2028-01-01",
                "batch_number": "SURF-12"
            },
            {
                "name": "Maggi 2-Min Masala Noodles 420g",
                "category": "Bakery & Snacks",
                "price": 95.0,
                "purchase_cost": 80.0,
                "stock_quantity": 80,
                "unit": "pack",
                "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300",
                "description": "Instant masala 6-pack noodles",
                "barcode": "8901262010103",
                "sku": "MAGG-6PK-420",
                "hsn_code": "1902",
                "gst_rate": 12.0,
                "expiry_date": "2026-11-20",
                "batch_number": "MAG-88"
            }
        ]

        for prod in products_data:
            existing = db.query(models.Product).filter(models.Product.store_id == store.id, models.Product.name == prod["name"]).first()
            if not existing:
                db.add(models.Product(store_id=store.id, **prod))
        db.commit()

        # 6. Suppliers
        suppliers_data = [
            {"name": "Amul FMCG Wholesale Ltd", "phone": "9825011223", "email": "supply@amul.coop", "address": "Anand, Gujarat", "outstanding_balance": 14500.0},
            {"name": "ITC National Distribution", "phone": "9819033445", "email": "fmcg@itc.in", "address": "Kolkata, West Bengal", "outstanding_balance": 8200.0},
            {"name": "Fortune Oils Agency", "phone": "9920055667", "email": "orders@adaniwilmar.com", "address": "Ahmedabad, Gujarat", "outstanding_balance": 3500.0}
        ]
        for sup in suppliers_data:
            existing = db.query(models.Supplier).filter(models.Supplier.store_id == store.id, models.Supplier.name == sup["name"]).first()
            if not existing:
                db.add(models.Supplier(store_id=store.id, **sup))
        db.commit()

        # 7. Customers
        customers_data = [
            {"name": "Rajesh Sharma", "phone": "9821098210", "email": "rajesh@gmail.com", "address": "Flat 402, Green Acres, Mumbai", "loyalty_points": 240, "credit_balance": 450.0, "total_purchases": 5400.0, "purchase_count": 8},
            {"name": "Priya Patel", "phone": "9879098790", "email": "priya.p@yahoo.com", "address": "Building B, MG Road, Mumbai", "loyalty_points": 380, "credit_balance": 0.0, "total_purchases": 8900.0, "purchase_count": 14},
            {"name": "Amit Verma", "phone": "9988776655", "email": "amit.v@outlook.com", "address": "12/A Station Road, Mumbai", "loyalty_points": 95, "credit_balance": 1250.0, "total_purchases": 2300.0, "purchase_count": 4}
        ]
        for cust in customers_data:
            existing = db.query(models.Customer).filter(models.Customer.store_id == store.id, models.Customer.name == cust["name"]).first()
            if not existing:
                db.add(models.Customer(store_id=store.id, **cust))
        db.commit()

        # 8. Employees & Attendance
        employees_data = [
            {"name": "Ramesh Kumar", "role": "Cashier", "phone": "9811122233", "salary": 16000.0, "commission": 500.0, "joining_date": "2025-01-10"},
            {"name": "Sunita Shah", "role": "Store Manager", "phone": "9822233344", "salary": 28000.0, "commission": 1200.0, "joining_date": "2024-06-01"}
        ]
        emp_objs = []
        for emp in employees_data:
            existing = db.query(models.Employee).filter(models.Employee.store_id == store.id, models.Employee.name == emp["name"]).first()
            if not existing:
                e_obj = models.Employee(store_id=store.id, **emp)
                db.add(e_obj)
                db.commit()
                db.refresh(e_obj)
                emp_objs.append(e_obj)
            else:
                emp_objs.append(existing)

        today_str = datetime.date.today().isoformat()
        for e in emp_objs:
            att = db.query(models.Attendance).filter(models.Attendance.store_id == store.id, models.Attendance.employee_id == e.id, models.Attendance.date == today_str).first()
            if not att:
                db.add(models.Attendance(store_id=store.id, employee_id=e.id, date=today_str, status="Present", check_in="08:30 AM"))
        db.commit()

        # 9. Sales & Invoices
        sales_data = [
            {
                "customer_name": "Rajesh Sharma",
                "customer_phone": "9821098210",
                "items_summary": '[{"product_id": 1, "name": "Amul Pasteurised Butter 500g", "quantity": 1, "price": 275.0}, {"product_id": 2, "name": "Amul Taaza Toned Milk 1L", "quantity": 2, "price": 72.0}]',
                "total_amount": 419.0,
                "payment_method": "UPI",
                "discount_amount": 0.0,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=3)
            },
            {
                "customer_name": "Priya Patel",
                "customer_phone": "9879098790",
                "items_summary": '[{"product_id": 3, "name": "Fortune Sunlite Refined Oil 1L", "quantity": 2, "price": 145.0}, {"product_id": 4, "name": "Aashirvaad Shudh Chakki Atta 5kg", "quantity": 1, "price": 260.0}]',
                "total_amount": 550.0,
                "payment_method": "Cash",
                "discount_amount": 0.0,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=6)
            },
            {
                "customer_name": "Walk-in Customer",
                "customer_phone": "N/A",
                "items_summary": '[{"product_id": 6, "name": "Cadbury Dairy Milk Silk 150g", "quantity": 2, "price": 175.0}]',
                "total_amount": 350.0,
                "payment_method": "Card",
                "discount_amount": 0.0,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=1)
            }
        ]
        for s in sales_data:
            db.add(models.Sale(store_id=store.id, **s))
        db.commit()

        # 10. Expenses & Cash Flows
        expenses_data = [
            {"title": "Shop Rent - July 2026", "amount": 15000.0, "category": "Rent"},
            {"title": "Electricity Bill", "amount": 3400.0, "category": "Utilities"},
            {"title": "Packaging Carry Bags", "amount": 1200.0, "category": "Supplies"}
        ]
        for exp in expenses_data:
            db.add(models.Expense(store_id=store.id, **exp))
        
        cashflows_data = [
            {"type": "Inflow", "amount": 12500.0, "category": "Sales Revenue", "description": "Daily counter cash register deposits"},
            {"type": "Outflow", "amount": 15000.0, "category": "Shop Rent", "description": "Monthly shop property rent payment"},
            {"type": "Outflow", "amount": 3400.0, "category": "Electricity Bill", "description": "MSEDCL electric utility bill"}
        ]
        for cf in cashflows_data:
            db.add(models.CashFlow(store_id=store.id, **cf))
        db.commit()

        # 11. Warehouses & Orders
        wh = db.query(models.Warehouse).filter(models.Warehouse.store_id == store.id).first()
        if not wh:
            db.add(models.Warehouse(store_id=store.id, name="Main Store Backroom", location="Ground Floor Section A", capacity=500.0))
            db.add(models.Warehouse(store_id=store.id, name="Central Storage Hub", location="Godown 4, MIDC Area", capacity=2500.0))
        
        orders_data = [
            {
                "customer_id": user.id,
                "customer_name": "Rajesh Sharma",
                "customer_phone": "9821098210",
                "items_summary": '[{"name": "Tata Tea Gold 500g", "qty": 1, "price": 310.0}]',
                "total_amount": 310.0,
                "status": "Pending",
                "payment_method": "UPI",
                "delivery_address": "Flat 402, Green Acres, Mumbai"
            },
            {
                "customer_id": user.id,
                "customer_name": "Priya Patel",
                "customer_phone": "9879098790",
                "items_summary": '[{"name": "Maggi Noodles 420g", "qty": 2, "price": 95.0}]',
                "total_amount": 190.0,
                "status": "Delivered",
                "payment_method": "Cash",
                "delivery_address": "Building B, MG Road, Mumbai"
            }
        ]
        for ord_item in orders_data:
            db.add(models.Order(store_id=store.id, **ord_item))
        db.commit()

        # 12. Notifications & Purchase Orders
        db.add(models.Notification(
            store_id=store.id,
            title="Low Stock Warning!",
            message="Tata Tea Gold Premium 500g has reached low stock threshold (6 left). Please reorder soon.",
            type="warning"
        ))
        db.add(models.Notification(
            store_id=store.id,
            title="Daily Sales Summary",
            message="Yesterday total sales reached ₹3,450 across 12 invoices.",
            type="info"
        ))

        db.add(models.PurchaseOrder(
            store_id=store.id,
            supplier_name="Amul FMCG Wholesale Ltd",
            items_summary='[{"name": "Amul Butter 500g", "qty": 50, "unit_price": 240.0}]',
            total_amount=12000.0,
            status="Submitted",
            notes="Expedited delivery needed before weekend"
        ))
        db.commit()

        # 13. Transactions & Returns & OTP Logs
        db.add(models.TransactionRecord(
            user_id=user.id,
            type="Bonus Credit",
            amount=50.0,
            module_id="Welcome Bonus",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ))
        db.add(models.TransactionRecord(
            user_id=user.id,
            type="Module Unlock",
            amount=100.0,
            module_id="Module A",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ))

        db.add(models.ReturnRecord(
            store_id=store.id,
            customer_name="Amit Verma",
            customer_phone="9988776655",
            items_summary='[{"name": "Amul Taaza Toned Milk 1L", "quantity": 1, "price": 72.0}]',
            refund_amount=72.0,
            refund_method="Cash",
            reason="Purchased wrong variant by mistake"
        ))

        db.add(models.OTPVerification(
            phone="9876543210",
            otp_code="123456",
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            is_verified=True
        ))
        db.commit()

        print("Database successfully seeded for meetgol22@gmail.com!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
