from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json

import models
import schemas
import generator
from database import engine, Base, get_db
from auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    get_current_user, require_min_role,
)
from middleware import limiter, security_headers_middleware

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KiranaBuilder API", description="AI voice-to-website generator for Indian general stores")

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers
app.add_middleware(BaseHTTPMiddleware, dispatch=security_headers_middleware)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KiranaBuilder Backend API", "status": "running"}


# --- Auth Routes ---
@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=201)
@limiter.limit("10/minute")
def register(request: Request, user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    allowed_roles = {"Store Owner", "Manager", "Cashier", "Customer"}
    if user_in.role not in allowed_roles:
        raise HTTPException(status_code=400, detail="Please select a valid account role")
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        role=user_in.role,
        password_hash=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/auth/login", response_model=schemas.Token)
@limiter.limit("20/minute")
def login(request: Request, credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"id": user.id, "email": user.email, "role": user.role})
    raw_refresh = create_refresh_token()

    db_token = models.RefreshToken(
        user_id=user.id,
        token=raw_refresh,
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(db_token)
    db.commit()

    return {"access_token": access_token, "refresh_token": raw_refresh, "token_type": "bearer"}


@app.post("/api/auth/refresh", response_model=schemas.Token)
def refresh_token(body: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    db_token = db.query(models.RefreshToken).filter(models.RefreshToken.token == body.refresh_token).first()
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user = db.query(models.User).filter(models.User.id == db_token.user_id).first()
    access_token = create_access_token({"id": user.id, "email": user.email, "role": user.role})
    new_refresh = create_refresh_token()

    db_token.token = new_refresh
    db_token.expires_at = datetime.utcnow() + timedelta(days=7)
    db.commit()

    return {"access_token": access_token, "refresh_token": new_refresh, "token_type": "bearer"}


@app.post("/api/auth/logout")
def logout(body: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    db.query(models.RefreshToken).filter(models.RefreshToken.token == body.refresh_token).delete()
    db.commit()
    return {"message": "Logged out"}


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Voice Parse Preview Endpoint ---
@app.post("/api/parse-voice")
def parse_voice_prompt(request: schemas.GenerateRequest):
    """
    Parses a voice/text prompt and returns extracted store info preview
    without saving to DB. Used for onboarding live preview.
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    gen_data = generator.generate_store_from_prompt(
        prompt=request.prompt,
        store_name_override=request.store_name
    )
    store = gen_data["store"]
    return {
        "name": store["name"],
        "address": store["address"],
        "phone": store["phone"],
        "timings": store["timings"],
        "owner_name": store["owner_name"],
        "theme_color": store["theme_color"],
        "secondary_color": store["secondary_color"],
        "bg_color": store["bg_color"],
        "description": store["description"],
        "product_count": len(gen_data["products"])
    }


# --- Generation Endpoint ---
@app.post("/api/generate", response_model=schemas.StoreResponse)
def generate_store(request: schemas.GenerateRequest, db: Session = Depends(get_db)):
    """
    Core AI Generator endpoint. Processes the prompt (text or speech transcript)
    to draft a Store setup and populate it with tailored Indian grocery stocks.
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt description cannot be empty.")
    
    # Enforce limit of 1 store per email ID
    if request.email:
        existing_user = db.query(models.User).filter(models.User.email == request.email).first()
        if existing_user and existing_user.store_id is not None:
            raise HTTPException(
                status_code=400,
                detail="An account with this email is already linked to a store. (Limit: 1 store per email ID)"
            )
            
    # Generate store settings and products based on parsed guidelines
    gen_data = generator.generate_store_from_prompt(
        prompt=request.prompt,
        store_name_override=request.store_name,
        selected_items=request.selected_items
    )
    
    store_info = gen_data["store"]
    products_info = gen_data["products"]
    
    # Ensure slug uniqueness
    base_slug = store_info["slug"]
    slug = base_slug
    counter = 1
    while db.query(models.Store).filter(models.Store.slug == slug).first() is not None:
        slug = f"{base_slug}-{counter}"
        counter += 1
    store_info["slug"] = slug
    
    # Create Store in DB
    db_store = models.Store(**store_info)
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    
    # Create Products linked to the Store in DB
    for prod in products_info:
        db_prod = models.Product(store_id=db_store.id, **prod)
        db.add(db_prod)
    db.commit()
    db.refresh(db_store)
    
    # Link store to existing user account if email is provided
    if request.email:
        user = db.query(models.User).filter(models.User.email == request.email).first()
        if user:
            user.store_id = db_store.id
            db.commit()
            db.refresh(user)
            
    return db_store

# --- Store Routes ---
@app.post("/api/stores", response_model=schemas.StoreResponse)
def create_store(store: schemas.StoreCreate, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.slug == store.slug).first()
    if db_store:
        raise HTTPException(status_code=400, detail="Store URL slug already registered.")
    
    new_store = models.Store(**store.model_dump())
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    return new_store

@app.get("/api/stores/{store_id}", response_model=schemas.StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    return db_store

@app.get("/api/stores/slug/{slug}", response_model=schemas.StoreResponse)
def get_store_by_slug(slug: str, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.slug == slug).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store slug not found")
    return db_store

@app.put("/api/stores/{store_id}", response_model=schemas.StoreResponse)
def update_store(store_id: int, store_update: schemas.StoreUpdate, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    update_data = store_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_store, key, value)
        
    db.commit()
    db.refresh(db_store)
    return db_store

# --- Product Routes ---
@app.post("/api/stores/{store_id}/products", response_model=schemas.ProductResponse)
def add_product(store_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Verify store exists
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    db_product = models.Product(store_id=store_id, **product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/stores/{store_id}/products", response_model=List[schemas.ProductResponse])
def get_products(store_id: int, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    return db_store.products

@app.put("/api/stores/{store_id}/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(store_id: int, product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(
        models.Product.store_id == store_id, 
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found in this store")
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/stores/{store_id}/products/{product_id}")
def delete_product(store_id: int, product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(
        models.Product.store_id == store_id, 
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found in this store")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product successfully deleted"}


@app.post("/api/stores/{store_id}/sales", response_model=schemas.SaleResponse)
def record_sale(store_id: int, sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
        
    try:
        items = json.loads(sale.items_summary)
        for item in items:
            prod_id = item.get("product_id")
            qty = item.get("quantity", 0)
            if prod_id:
                db_prod = db.query(models.Product).filter(
                    models.Product.store_id == store_id,
                    models.Product.id == prod_id
                ).first()
                if db_prod:
                    db_prod.stock_quantity = max(0, db_prod.stock_quantity - qty)
    except Exception as e:
        print("Error updating stock quantities:", e)
        
    db_sale = models.Sale(store_id=store_id, **sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    # Auto cashflow inflow
    db.add(models.CashFlow(
        store_id=store_id, type="Inflow", amount=sale.total_amount,
        category="Sales", description=f"POS Sale - Invoice #{db_sale.id}"
    ))

    # Auto low-stock notifications (deduplicated â€” one per product per day)
    today_str = datetime.utcnow().date().isoformat()
    try:
        for item in json.loads(sale.items_summary):
            prod_id = item.get("product_id")
            if prod_id:
                prod = db.query(models.Product).filter(
                    models.Product.id == prod_id, models.Product.store_id == store_id
                ).first()
                if prod and prod.stock_quantity <= 10:
                    already_notified = db.query(models.Notification).filter(
                        models.Notification.store_id == store_id,
                        models.Notification.title == "Low Stock Alert",
                        models.Notification.message.like(f"%{prod.name}%"),
                        models.Notification.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
                    ).first()
                    if not already_notified:
                        db.add(models.Notification(
                            store_id=store_id,
                            title="Low Stock Alert",
                            message=f"{prod.name} is running low â€” only {prod.stock_quantity} unit(s) left. Restock soon.",
                            type="warning"
                        ))
    except Exception:
        pass

    db.commit()
    return db_sale



@app.get("/api/stores/{store_id}/sales", response_model=List[schemas.SaleResponse])
def get_sales(store_id: int, db: Session = Depends(get_db)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    sales = db.query(models.Sale).filter(models.Sale.store_id == store_id).order_by(models.Sale.created_at.desc()).all()
    return sales


# --- Supplier Routes ---
@app.get("/api/stores/{store_id}/suppliers", response_model=List[schemas.SupplierResponse])
def get_suppliers(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Supplier).filter(models.Supplier.store_id == store_id).all()

@app.post("/api/stores/{store_id}/suppliers", response_model=schemas.SupplierResponse)
def add_supplier(store_id: int, supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = models.Supplier(store_id=store_id, **supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.put("/api/stores/{store_id}/suppliers/{supplier_id}", response_model=schemas.SupplierResponse)
def update_supplier(store_id: int, supplier_id: int, supplier_update: schemas.SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = db.query(models.Supplier).filter(models.Supplier.store_id == store_id, models.Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    for key, val in supplier_update.model_dump(exclude_unset=True).items():
        setattr(db_supplier, key, val)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.delete("/api/stores/{store_id}/suppliers/{supplier_id}")
def delete_supplier(store_id: int, supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(models.Supplier).filter(models.Supplier.store_id == store_id, models.Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(db_supplier)
    db.commit()
    return {"message": "Supplier successfully deleted"}


# --- Employee & HR Routes ---
@app.get("/api/stores/{store_id}/employees", response_model=List[schemas.EmployeeResponse])
def get_employees(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Employee).filter(models.Employee.store_id == store_id).order_by(models.Employee.name).all()

@app.get("/api/stores/{store_id}/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(store_id: int, employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(
        models.Employee.store_id == store_id, models.Employee.id == employee_id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@app.post("/api/stores/{store_id}/employees", response_model=schemas.EmployeeResponse, status_code=201)
def add_employee(store_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    if employee.role not in schemas.EMPLOYEE_ROLES:
        raise HTTPException(status_code=400, detail=f"role must be one of: {schemas.EMPLOYEE_ROLES}")
    db_employee = models.Employee(store_id=store_id, **employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.put("/api/stores/{store_id}/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def update_employee(store_id: int, employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(
        models.Employee.store_id == store_id, models.Employee.id == employee_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    if employee_update.role and employee_update.role not in schemas.EMPLOYEE_ROLES:
        raise HTTPException(status_code=400, detail=f"role must be one of: {schemas.EMPLOYEE_ROLES}")
    for key, val in employee_update.model_dump(exclude_unset=True).items():
        setattr(db_employee, key, val)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.delete("/api/stores/{store_id}/employees/{employee_id}")
def delete_employee(store_id: int, employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(
        models.Employee.store_id == store_id, models.Employee.id == employee_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted"}


# --- Attendance Routes ---
@app.get("/api/stores/{store_id}/attendance", response_model=List[schemas.AttendanceResponse])
def get_attendance(store_id: int, date: str = None, employee_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Attendance).filter(models.Attendance.store_id == store_id)
    if date:
        query = query.filter(models.Attendance.date == date)
    if employee_id:
        query = query.filter(models.Attendance.employee_id == employee_id)
    return query.order_by(models.Attendance.date.desc()).all()

@app.post("/api/stores/{store_id}/attendance", response_model=schemas.AttendanceResponse)
def log_attendance(store_id: int, att: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    if att.status not in {"Present", "Absent"}:
        raise HTTPException(status_code=400, detail="status must be 'Present' or 'Absent'")
    emp = db.query(models.Employee).filter(
        models.Employee.id == att.employee_id, models.Employee.store_id == store_id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found in this store")
    existing = db.query(models.Attendance).filter(
        models.Attendance.store_id == store_id,
        models.Attendance.employee_id == att.employee_id,
        models.Attendance.date == att.date
    ).first()
    if existing:
        existing.status = att.status
        existing.check_in = att.check_in
        db.commit()
        db.refresh(existing)
        return existing
    db_att = models.Attendance(store_id=store_id, **att.model_dump())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att

@app.get("/api/stores/{store_id}/attendance/salary-summary")
def monthly_salary_summary(store_id: int, month: str, db: Session = Depends(get_db)):
    """month format: YYYY-MM. Returns per-employee present days, salary due, and store total."""
    employees = db.query(models.Employee).filter(models.Employee.store_id == store_id).all()
    records = db.query(models.Attendance).filter(
        models.Attendance.store_id == store_id,
        models.Attendance.date.like(f"{month}-%"),
        models.Attendance.status == "Present"
    ).all()

    present_counts: dict = {}
    for r in records:
        present_counts[r.employee_id] = present_counts.get(r.employee_id, 0) + 1

    summary = []
    total_salary_due = 0.0
    for emp in employees:
        present_days = present_counts.get(emp.id, 0)
        # Per-day salary = monthly salary / 26 working days
        salary_due = round((emp.salary / 26) * present_days, 2) if emp.salary else 0.0
        total_salary_due += salary_due
        summary.append({
            "employee_id": emp.id,
            "name": emp.name,
            "role": emp.role,
            "monthly_salary": emp.salary,
            "present_days": present_days,
            "salary_due": salary_due,
        })

    return {
        "month": month,
        "employees": summary,
        "total_salary_due": round(total_salary_due, 2),
    }


# --- Database Backup & Restore ---
def _row_to_dict(row, exclude=("store_id", "id")):
    return {c.name: getattr(row, c.name) for c in row.__table__.columns if c.name not in exclude}

def _parse_dt(val):
    if isinstance(val, str):
        try:
            return datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            return datetime.utcnow()
    return val

@app.get("/api/stores/{store_id}/backup")
def export_backup(store_id: int, db: Session = Depends(get_db)):
    db.query(models.Store).filter(models.Store.id == store_id).first() or (_ for _ in ()).throw(HTTPException(404, "Store not found"))
    return {
        "store_id": store_id,
        "exported_at": datetime.utcnow().isoformat(),
        "schema_version": "2",
        "products":       [_row_to_dict(r) for r in db.query(models.Product).filter_by(store_id=store_id).all()],
        "sales":          [_row_to_dict(r) for r in db.query(models.Sale).filter_by(store_id=store_id).all()],
        "expenses":       [_row_to_dict(r) for r in db.query(models.Expense).filter_by(store_id=store_id).all()],
        "suppliers":      [_row_to_dict(r) for r in db.query(models.Supplier).filter_by(store_id=store_id).all()],
        "employees":      [_row_to_dict(r) for r in db.query(models.Employee).filter_by(store_id=store_id).all()],
        "attendance":     [_row_to_dict(r) for r in db.query(models.Attendance).filter_by(store_id=store_id).all()],
        "customers":      [_row_to_dict(r) for r in db.query(models.Customer).filter_by(store_id=store_id).all()],
        "cashflows":      [_row_to_dict(r) for r in db.query(models.CashFlow).filter_by(store_id=store_id).all()],
        "categories":     [_row_to_dict(r) for r in db.query(models.Category).filter_by(store_id=store_id).all()],
        "orders":         [_row_to_dict(r) for r in db.query(models.Order).filter_by(store_id=store_id).all()],
        "warehouses":     [_row_to_dict(r) for r in db.query(models.Warehouse).filter_by(store_id=store_id).all()],
        "returns":        [_row_to_dict(r) for r in db.query(models.ReturnRecord).filter_by(store_id=store_id).all()],
        "purchase_orders":[_row_to_dict(r) for r in db.query(models.PurchaseOrder).filter_by(store_id=store_id).all()],
        "notifications":  [_row_to_dict(r) for r in db.query(models.Notification).filter_by(store_id=store_id).all()],
    }

@app.get("/api/stores/{store_id}/backup/counts")
def backup_counts(store_id: int, db: Session = Depends(get_db)):
    """Returns record counts per collection â€” used by the frontend backup UI."""
    return {
        "products":        db.query(models.Product).filter_by(store_id=store_id).count(),
        "sales":           db.query(models.Sale).filter_by(store_id=store_id).count(),
        "expenses":        db.query(models.Expense).filter_by(store_id=store_id).count(),
        "suppliers":       db.query(models.Supplier).filter_by(store_id=store_id).count(),
        "employees":       db.query(models.Employee).filter_by(store_id=store_id).count(),
        "attendance":      db.query(models.Attendance).filter_by(store_id=store_id).count(),
        "customers":       db.query(models.Customer).filter_by(store_id=store_id).count(),
        "cashflows":       db.query(models.CashFlow).filter_by(store_id=store_id).count(),
        "categories":      db.query(models.Category).filter_by(store_id=store_id).count(),
        "orders":          db.query(models.Order).filter_by(store_id=store_id).count(),
        "warehouses":      db.query(models.Warehouse).filter_by(store_id=store_id).count(),
        "returns":         db.query(models.ReturnRecord).filter_by(store_id=store_id).count(),
        "purchase_orders": db.query(models.PurchaseOrder).filter_by(store_id=store_id).count(),
        "notifications":   db.query(models.Notification).filter_by(store_id=store_id).count(),
    }

@app.post("/api/stores/{store_id}/restore")
def import_restore(store_id: int, payload: dict, db: Session = Depends(get_db)):
    """Selective restore â€” only replaces collections present in the payload."""
    COLLECTION_MAP = [
        ("products",       models.Product,       ["created_at"]),
        ("sales",          models.Sale,          ["created_at"]),
        ("expenses",       models.Expense,       ["created_at"]),
        ("suppliers",      models.Supplier,      []),
        ("employees",      models.Employee,      []),
        ("attendance",     models.Attendance,    []),
        ("customers",      models.Customer,      ["created_at", "last_visit"]),
        ("cashflows",      models.CashFlow,      ["created_at"]),
        ("categories",     models.Category,      []),
        ("orders",         models.Order,         ["created_at"]),
        ("warehouses",     models.Warehouse,     []),
        ("returns",        models.ReturnRecord,  ["created_at"]),
        ("purchase_orders",models.PurchaseOrder, ["created_at"]),
        ("notifications",  models.Notification,  ["created_at"]),
    ]
    restored = []
    for key, model, dt_fields in COLLECTION_MAP:
        if key not in payload:
            continue
        db.query(model).filter_by(store_id=store_id).delete()
        for row in payload[key]:
            for f in dt_fields:
                if f in row:
                    row[f] = _parse_dt(row[f])
            valid_cols = {c.name for c in model.__table__.columns} - {"id", "store_id"}
            clean = {k: v for k, v in row.items() if k in valid_cols}
            db.add(model(store_id=store_id, **clean))
        restored.append(key)
    db.commit()
    return {"message": "Restore complete.", "restored_collections": restored}

# --- AI Suggest Product Endpoint ---
@app.get("/api/ai/suggest-product")
def ai_suggest_product(name: str):
    from datetime import datetime as dt, timedelta
    name_lower = name.lower()
    desc = f"Premium quality {name} sourced from top distributors. Essential item for general households."
    category = "Grains, Oils & Masalas"
    hsn_code = "1006"
    gst_rate = 5.0
    price = 65.0
    sku = "GEN-ITEM-001"
    unit = "1kg pack"
    image_url = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"

    if "milk" in name_lower or "dairy" in name_lower or "butter" in name_lower or "paneer" in name_lower or "cheese" in name_lower:
        category = "Dairy & Eggs"
        hsn_code = "0402"
        gst_rate = 5.0
        price = 45.0
        sku = "DAI-MILK-02"
        unit = "500ml packet"
        image_url = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    elif "shampoo" in name_lower or "soap" in name_lower or "surf" in name_lower or "detergent" in name_lower or "brush" in name_lower or "colgate" in name_lower:
        category = "Household & Personal Care"
        hsn_code = "3401"
        gst_rate = 18.0
        price = 120.0
        sku = "HHC-SOAP-01"
        unit = "pack"
        image_url = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"
    elif "chips" in name_lower or "maggi" in name_lower or "biscuit" in name_lower or "drink" in name_lower or "coke" in name_lower or "snacks" in name_lower:
        category = "Snacks & Beverages"
        hsn_code = "1905"
        gst_rate = 18.0
        price = 20.0
        sku = "SNK-BIS-03"
        unit = "pack"
        image_url = "https://images.unsplash.com/photo-1599490659213-e2b9527ec087?auto=format&fit=crop&w=400&q=80"

    return {
        "name": name,
        "category": category,
        "price": price,
        "purchase_cost": round(price * 0.75, 2),
        "stock_quantity": 25,
        "unit": unit,
        "image_url": image_url,
        "description": desc,
        "barcode": f"8901234{abs(hash(name)) % 100000:05d}",
        "sku": sku,
        "hsn_code": hsn_code,
        "gst_rate": gst_rate,
        "expiry_date": (dt.now() + timedelta(days=180)).strftime("%Y-%m-%d"),
        "batch_number": f"BAT-{dt.now().strftime('%m%y')}-A"
    }


# --- Categories API ---
@app.get("/api/stores/{store_id}/categories", response_model=List[schemas.CategoryResponse])
def get_categories(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Category).filter(models.Category.store_id == store_id).all()

@app.post("/api/stores/{store_id}/categories", response_model=schemas.CategoryResponse)
def create_category(store_id: int, cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_cat = models.Category(store_id=store_id, **cat.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.put("/api/stores/{store_id}/categories/{cat_id}", response_model=schemas.CategoryResponse)
def update_category(store_id: int, cat_id: int, cat_update: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.store_id == store_id, models.Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    for key, val in cat_update.model_dump(exclude_unset=True).items():
        setattr(db_cat, key, val)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/api/stores/{store_id}/categories/{cat_id}")
def delete_category(store_id: int, cat_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.store_id == store_id, models.Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category successfully deleted"}


# --- Orders API ---
@app.get("/api/stores/{store_id}/orders", response_model=List[schemas.OrderResponse])
def get_orders(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.store_id == store_id).order_by(models.Order.created_at.desc()).all()

@app.post("/api/stores/{store_id}/orders", response_model=schemas.OrderResponse)
def create_order(store_id: int, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(store_id=store_id, **order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.put("/api/stores/{store_id}/orders/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(store_id: int, order_id: int, status: str, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.store_id == store_id, models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/stores/{store_id}/orders/customer/{customer_id}", response_model=List[schemas.OrderResponse])
def get_customer_orders(store_id: int, customer_id: int, db: Session = Depends(get_db)):
    return db.query(models.Order).filter(
        models.Order.store_id == store_id, 
        models.Order.customer_id == customer_id
    ).order_by(models.Order.created_at.desc()).all()


# --- Warehouse API ---
@app.get("/api/stores/{store_id}/warehouses", response_model=List[schemas.WarehouseResponse])
def get_warehouses(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Warehouse).filter(models.Warehouse.store_id == store_id).all()

@app.post("/api/stores/{store_id}/warehouses", response_model=schemas.WarehouseResponse)
def create_warehouse(store_id: int, wh: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    db_wh = models.Warehouse(store_id=store_id, **wh.model_dump())
    db.add(db_wh)
    db.commit()
    db.refresh(db_wh)
    return db_wh


# --- Finance & Cashbook API ---
VALID_CF_TYPES = {"Inflow", "Outflow"}
VALID_CF_CATEGORIES = {"Sales", "Purchase", "Salary", "Rent", "Utilities", "Refund", "Payout", "Capital", "Maintenance", "Marketing", "Misc"}

@app.get("/api/stores/{store_id}/cashflows", response_model=List[schemas.CashFlowResponse])
def get_cashflows(store_id: int, type: str = None, category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.CashFlow).filter(models.CashFlow.store_id == store_id)
    if type:
        query = query.filter(models.CashFlow.type == type)
    if category:
        query = query.filter(models.CashFlow.category == category)
    return query.order_by(models.CashFlow.created_at.desc()).all()

@app.post("/api/stores/{store_id}/cashflows", response_model=schemas.CashFlowResponse, status_code=201)
def create_cashflow(store_id: int, cf: schemas.CashFlowCreate, db: Session = Depends(get_db)):
    if cf.type not in VALID_CF_TYPES:
        raise HTTPException(status_code=400, detail=f"type must be one of: {VALID_CF_TYPES}")
    if cf.category not in VALID_CF_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"category must be one of: {VALID_CF_CATEGORIES}")
    db_cf = models.CashFlow(store_id=store_id, **cf.model_dump())
    db.add(db_cf)
    db.commit()
    db.refresh(db_cf)
    return db_cf

@app.delete("/api/stores/{store_id}/cashflows/{cf_id}")
def delete_cashflow(store_id: int, cf_id: int, db: Session = Depends(get_db)):
    db_cf = db.query(models.CashFlow).filter(
        models.CashFlow.id == cf_id, models.CashFlow.store_id == store_id
    ).first()
    if not db_cf:
        raise HTTPException(status_code=404, detail="Cashflow entry not found")
    db.delete(db_cf)
    db.commit()
    return {"message": "Cashflow entry deleted"}

@app.get("/api/stores/{store_id}/cashflows/summary")
def get_cashflow_summary(store_id: int, db: Session = Depends(get_db)):
    entries = db.query(models.CashFlow).filter(models.CashFlow.store_id == store_id).all()
    total_inflow = sum(e.amount for e in entries if e.type == "Inflow")
    total_outflow = sum(e.amount for e in entries if e.type == "Outflow")
    by_category: dict = {}
    for e in entries:
        cat = by_category.setdefault(e.category, {"inflow": 0.0, "outflow": 0.0})
        cat["inflow" if e.type == "Inflow" else "outflow"] += e.amount
    return {
        "total_inflow": round(total_inflow, 2),
        "total_outflow": round(total_outflow, 2),
        "net_balance": round(total_inflow - total_outflow, 2),
        "status": "Profit" if total_inflow >= total_outflow else "Loss",
        "by_category": {k: {"inflow": round(v["inflow"], 2), "outflow": round(v["outflow"], 2), "net": round(v["inflow"] - v["outflow"], 2)} for k, v in by_category.items()},
    }


# --- Expenses API ---
@app.get("/api/stores/{store_id}/expenses", response_model=List[schemas.ExpenseResponse])
def get_expenses(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Expense).filter(
        models.Expense.store_id == store_id
    ).order_by(models.Expense.created_at.desc()).all()

@app.post("/api/stores/{store_id}/expenses", response_model=schemas.ExpenseResponse, status_code=201)
def create_expense(store_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    if expense.category not in schemas.EXPENSE_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"category must be one of: {schemas.EXPENSE_CATEGORIES}")
    db_exp = models.Expense(
        store_id=store_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
    )
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    # Auto-log as cashflow outflow
    db.add(models.CashFlow(
        store_id=store_id,
        type="Outflow",
        amount=expense.amount,
        category=expense.category if expense.category in VALID_CF_CATEGORIES else "Misc",
        description=f"{expense.title} - Expense #{db_exp.id}"
    ))
    db.commit()
    return db_exp

@app.delete("/api/stores/{store_id}/expenses/{expense_id}")
def delete_expense(store_id: int, expense_id: int, db: Session = Depends(get_db)):
    db_exp = db.query(models.Expense).filter(
        models.Expense.id == expense_id, models.Expense.store_id == store_id
    ).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_exp)
    db.commit()
    return {"message": "Expense deleted"}


# --- CRM / Customer Routes ---
@app.post("/api/stores/{store_id}/customers", response_model=schemas.CustomerResponse, status_code=201)
def create_customer(store_id: int, customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(store_id=store_id, **customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/api/stores/{store_id}/customers", response_model=List[schemas.CustomerResponse])
def get_customers(store_id: int, search: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Customer).filter(models.Customer.store_id == store_id)
    if search:
        query = query.filter(
            models.Customer.name.ilike(f"%{search}%") |
            models.Customer.phone.ilike(f"%{search}%")
        )
    return query.order_by(models.Customer.name).all()

@app.get("/api/stores/{store_id}/customers/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(store_id: int, customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(
        models.Customer.store_id == store_id, models.Customer.id == customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/api/stores/{store_id}/customers/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(store_id: int, customer_id: int, customer_update: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(
        models.Customer.store_id == store_id, models.Customer.id == customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, val in customer_update.model_dump(exclude_unset=True).items():
        setattr(customer, key, val)
    db.commit()
    db.refresh(customer)
    return customer

@app.delete("/api/stores/{store_id}/customers/{customer_id}")
def delete_customer(store_id: int, customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(
        models.Customer.store_id == store_id, models.Customer.id == customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted"}

@app.post("/api/stores/{store_id}/customers/{customer_id}/add-purchase", response_model=schemas.CustomerResponse)
def add_customer_purchase(store_id: int, customer_id: int, amount: float, db: Session = Depends(get_db)):
    """Record a purchase: auto-awards loyalty points (â‚¹10 = 1 point), updates totals and last_visit."""
    customer = db.query(models.Customer).filter(
        models.Customer.store_id == store_id, models.Customer.id == customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.total_purchases += amount
    customer.purchase_count += 1
    customer.loyalty_points += int(amount // 10)
    customer.last_visit = datetime.utcnow()
    db.commit()
    db.refresh(customer)
    return customer

@app.post("/api/stores/{store_id}/customers/{customer_id}/adjust-credit", response_model=schemas.CustomerResponse)
def adjust_credit(store_id: int, customer_id: int, amount: float, db: Session = Depends(get_db)):
    """Adjust udhar (credit balance). Positive = add credit, negative = repayment."""
    customer = db.query(models.Customer).filter(
        models.Customer.store_id == store_id, models.Customer.id == customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.credit_balance += amount
    db.commit()
    db.refresh(customer)
    return customer


# --- Purchase Orders API ---
PO_STATUS_FLOW = {"Draft": {"Sent", "Cancelled"}, "Sent": {"Received", "Cancelled"}, "Received": set(), "Cancelled": set()}

@app.post("/api/stores/{store_id}/purchase-orders", response_model=schemas.PurchaseOrderResponse, status_code=201)
def create_purchase_order(store_id: int, po: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    if po.supplier_id:
        supplier = db.query(models.Supplier).filter(
            models.Supplier.id == po.supplier_id, models.Supplier.store_id == store_id
        ).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found in this store")

    db_po = models.PurchaseOrder(store_id=store_id, **po.model_dump())
    db.add(db_po)
    db.commit()
    db.refresh(db_po)

    # Auto-notification on PO creation
    supplier_label = po.supplier_name or (supplier.name if po.supplier_id else "Unknown Supplier")
    db.add(models.Notification(
        store_id=store_id,
        title="Purchase Order Created",
        message=f"PO #{db_po.id} created for {supplier_label} â€” â‚¹{po.total_amount:.2f} (Status: Draft)",
        type="info"
    ))
    db.commit()
    return db_po

@app.get("/api/stores/{store_id}/purchase-orders", response_model=List[schemas.PurchaseOrderResponse])
def get_purchase_orders(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.store_id == store_id
    ).order_by(models.PurchaseOrder.created_at.desc()).all()

@app.get("/api/stores/{store_id}/purchase-orders/{po_id}", response_model=schemas.PurchaseOrderResponse)
def get_purchase_order(store_id: int, po_id: int, db: Session = Depends(get_db)):
    db_po = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == po_id, models.PurchaseOrder.store_id == store_id
    ).first()
    if not db_po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return db_po

@app.put("/api/stores/{store_id}/purchase-orders/{po_id}/status", response_model=schemas.PurchaseOrderResponse)
def update_po_status(store_id: int, po_id: int, body: schemas.PurchaseOrderUpdate, db: Session = Depends(get_db)):
    db_po = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.id == po_id, models.PurchaseOrder.store_id == store_id
    ).first()
    if not db_po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    new_status = body.status
    if new_status and new_status != db_po.status:
        allowed = PO_STATUS_FLOW.get(db_po.status, set())
        if new_status not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from '{db_po.status}' to '{new_status}'. Allowed: {allowed or 'none'}"
            )

        # On Received: update supplier outstanding balance + log cashflow outflow
        if new_status == "Received":
            if db_po.supplier_id:
                supplier = db.query(models.Supplier).filter(
                    models.Supplier.id == db_po.supplier_id, models.Supplier.store_id == store_id
                ).first()
                if supplier:
                    supplier.outstanding_balance += db_po.total_amount

            db.add(models.CashFlow(
                store_id=store_id,
                type="Outflow",
                amount=db_po.total_amount,
                category="Purchase",
                description=f"PO #{db_po.id} received from {db_po.supplier_name or 'Supplier'}"
            ))

            db.add(models.Notification(
                store_id=store_id,
                title="Purchase Order Received",
                message=f"PO #{db_po.id} marked as Received. â‚¹{db_po.total_amount:.2f} logged as outflow.",
                type="success"
            ))

        db_po.status = new_status

    if body.notes is not None:
        db_po.notes = body.notes
    if body.total_amount is not None:
        db_po.total_amount = body.total_amount

    db.commit()
    db.refresh(db_po)
    return db_po


# --- Returns & Refunds API ---
VALID_REFUND_METHODS = {"Cash", "Wallet Credit", "UPI", "Card"}

@app.post("/api/stores/{store_id}/returns", response_model=schemas.ReturnResponse, status_code=201)
def create_return(store_id: int, ret: schemas.ReturnCreate, db: Session = Depends(get_db)):
    if ret.refund_method not in VALID_REFUND_METHODS:
        raise HTTPException(status_code=400, detail=f"Invalid refund method. Choose from: {VALID_REFUND_METHODS}")

    # Validate original sale belongs to this store
    if ret.sale_id:
        sale = db.query(models.Sale).filter(
            models.Sale.id == ret.sale_id, models.Sale.store_id == store_id
        ).first()
        if not sale:
            raise HTTPException(status_code=404, detail="Original sale not found in this store")

    # Auto-restore stock for each returned item
    try:
        items = json.loads(ret.items_summary)
        for item in items:
            prod_id = item.get("product_id")
            qty = item.get("quantity", 0)
            if prod_id and qty > 0:
                db_prod = db.query(models.Product).filter(
                    models.Product.id == prod_id, models.Product.store_id == store_id
                ).first()
                if db_prod:
                    db_prod.stock_quantity += qty
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid items_summary JSON: {e}")

    # Save return record
    db_return = models.ReturnRecord(store_id=store_id, **ret.model_dump())
    db.add(db_return)
    db.commit()
    db.refresh(db_return)

    # Auto-log cashflow outflow (skip for Wallet Credit â€” no cash leaves store)
    if ret.refund_method != "Wallet Credit":
        db.add(models.CashFlow(
            store_id=store_id,
            type="Outflow",
            amount=ret.refund_amount,
            category="Refund",
            description=f"Refund via {ret.refund_method} - Return #{db_return.id}"
        ))
        db.commit()

    return db_return

@app.get("/api/stores/{store_id}/returns", response_model=List[schemas.ReturnResponse])
def get_returns(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.ReturnRecord).filter(
        models.ReturnRecord.store_id == store_id
    ).order_by(models.ReturnRecord.created_at.desc()).all()

@app.get("/api/stores/{store_id}/returns/{return_id}", response_model=schemas.ReturnResponse)
def get_return(store_id: int, return_id: int, db: Session = Depends(get_db)):
    db_return = db.query(models.ReturnRecord).filter(
        models.ReturnRecord.id == return_id, models.ReturnRecord.store_id == store_id
    ).first()
    if not db_return:
        raise HTTPException(status_code=404, detail="Return record not found")
    return db_return


# --- Notifications API ---
@app.get("/api/stores/{store_id}/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(store_id: int, db: Session = Depends(get_db)):
    return db.query(models.Notification).filter(
        models.Notification.store_id == store_id
    ).order_by(models.Notification.created_at.desc()).limit(50).all()

@app.get("/api/stores/{store_id}/notifications/unread-count")
def unread_count(store_id: int, db: Session = Depends(get_db)):
    count = db.query(models.Notification).filter(
        models.Notification.store_id == store_id,
        models.Notification.is_read == False
    ).count()
    return {"unread_count": count}

@app.patch("/api/stores/{store_id}/notifications/{notification_id}/read", response_model=schemas.NotificationResponse)
def mark_notification_read(store_id: int, notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.store_id == store_id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@app.patch("/api/stores/{store_id}/notifications/read-all")
def mark_all_read(store_id: int, db: Session = Depends(get_db)):
    db.query(models.Notification).filter(
        models.Notification.store_id == store_id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


# --- Analytics & AI Insights API ---
@app.get("/api/stores/{store_id}/ai/insights")
def get_ai_insights(store_id: int, db: Session = Depends(get_db)):
    from collections import defaultdict

    products  = db.query(models.Product).filter(models.Product.store_id == store_id).all()
    sales     = db.query(models.Sale).filter(models.Sale.store_id == store_id).all()
    suppliers = db.query(models.Supplier).filter(models.Supplier.store_id == store_id).all()

    # â”€â”€ 1. Revenue trend â€” last 7 days â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    today = datetime.utcnow().date()
    daily_revenue: dict = {}
    for i in range(6, -1, -1):
        day = (today - timedelta(days=i)).isoformat()
        daily_revenue[day] = 0.0
    for s in sales:
        day = s.created_at.date().isoformat()
        if day in daily_revenue:
            daily_revenue[day] += s.total_amount
    revenue_trend = [
        {"date": d, "revenue": round(v, 2)} for d, v in daily_revenue.items()
    ]

    # â”€â”€ 2. Top 5 products by revenue (from items_summary JSON) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    product_revenue: dict = defaultdict(float)
    product_qty: dict    = defaultdict(int)
    prod_map = {p.id: p for p in products}
    for s in sales:
        try:
            for item in json.loads(s.items_summary):
                pid = item.get("product_id")
                qty = item.get("quantity", 0)
                price = item.get("price", 0)
                if pid:
                    product_revenue[pid] += qty * price
                    product_qty[pid]     += qty
        except Exception:
            pass
    top5 = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)[:5]
    top_products = [
        {
            "product_id": pid,
            "name": prod_map[pid].name if pid in prod_map else "Unknown",
            "category": prod_map[pid].category if pid in prod_map else "-",
            "total_revenue": round(rev, 2),
            "units_sold": product_qty[pid],
        }
        for pid, rev in top5
    ]

    # â”€â”€ 3. Gross margin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    total_revenue  = sum(s.total_amount for s in sales)
    total_cost     = sum(
        product_qty.get(p.id, 0) * p.purchase_cost for p in products
    )
    gross_profit   = total_revenue - total_cost
    gross_margin_pct = round((gross_profit / total_revenue * 100), 2) if total_revenue else 0.0

    # â”€â”€ 4. Stock by category (donut chart data) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    cat_stock: dict = defaultdict(int)
    for p in products:
        cat_stock[p.category] += p.stock_quantity
    stock_by_category = [
        {"category": cat, "total_units": units}
        for cat, units in sorted(cat_stock.items(), key=lambda x: x[1], reverse=True)
    ]

    # â”€â”€ 5. Restock suggestions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    low_stock_threshold = 10
    default_supplier = suppliers[0].name if suppliers else "Main Distributor"
    restock_suggestions = [
        {
            "product_id": p.id,
            "name": p.name,
            "category": p.category,
            "current_stock": p.stock_quantity,
            "suggested_qty": max(30 - p.stock_quantity, 10),
            "estimated_cost": round(max(30 - p.stock_quantity, 10) * p.purchase_cost, 2),
            "supplier": default_supplier,
        }
        for p in products if p.stock_quantity <= low_stock_threshold
    ]

    # â”€â”€ 6. Demand forecasts by category (based on 7-day sales velocity) â”€â”€â”€â”€â”€
    cat_sold_7d: dict = defaultdict(float)
    cutoff = datetime.utcnow() - timedelta(days=7)
    for s in sales:
        if s.created_at >= cutoff:
            try:
                for item in json.loads(s.items_summary):
                    pid = item.get("product_id")
                    qty = item.get("quantity", 0)
                    if pid and pid in prod_map:
                        cat_sold_7d[prod_map[pid].category] += qty
            except Exception:
                pass
    demand_forecasts = []
    for cat, sold_7d in cat_sold_7d.items():
        daily_avg   = sold_7d / 7
        next_week   = round(daily_avg * 7 * 1.1, 1)   # +10% growth assumption
        demand_forecasts.append({
            "category": cat,
            "sold_last_7d": round(sold_7d, 1),
            "predicted_next_7d": next_week,
            "demand_level": "High" if daily_avg > 5 else "Medium" if daily_avg > 1 else "Low",
            "suggestion": "Increase stock by 20%" if daily_avg > 5 else "Maintain current levels",
        })

    # â”€â”€ 7. Sales prediction â€” next week â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    last_7d_revenue = sum(daily_revenue.values())
    prev_7d_revenue = sum(
        s.total_amount for s in sales
        if (datetime.utcnow() - timedelta(days=14)) <= s.created_at < (datetime.utcnow() - timedelta(days=7))
    )
    growth_rate = ((last_7d_revenue - prev_7d_revenue) / prev_7d_revenue) if prev_7d_revenue else 0.10
    growth_rate = max(min(growth_rate, 0.5), -0.3)   # clamp between -30% and +50%
    predicted_next_week = round(last_7d_revenue * (1 + growth_rate), 2)

    # â”€â”€ 8. AI text insights â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    low_stock_count = len(restock_suggestions)
    insights = []
    if total_revenue > 0:
        insights.append(f"Total revenue to date: â‚¹{total_revenue:,.2f} with a gross margin of {gross_margin_pct}%.")
    if last_7d_revenue > prev_7d_revenue and prev_7d_revenue > 0:
        insights.append(f"Revenue is up {round(growth_rate * 100, 1)}% compared to the previous week â€” strong upward trend.")
    elif prev_7d_revenue > 0:
        insights.append(f"Revenue dipped {abs(round(growth_rate * 100, 1))}% vs last week. Consider running a promotion.")
    if low_stock_count:
        insights.append(f"{low_stock_count} product(s) are running low on stock. Restock order recommended.")
    if top_products:
        insights.append(f"Best seller this week: {top_products[0]['name']} â€” â‚¹{top_products[0]['total_revenue']:,.2f} in revenue.")
    if suppliers:
        high_debt = [s for s in suppliers if s.outstanding_balance > 0]
        if high_debt:
            top_debtor = max(high_debt, key=lambda s: s.outstanding_balance)
            insights.append(f"Outstanding payable to {top_debtor.name}: â‚¹{top_debtor.outstanding_balance:,.2f}. Review before next PO.")

    return {
        "revenue_trend": revenue_trend,
        "top_products": top_products,
        "gross_margin": {
            "total_revenue": round(total_revenue, 2),
            "total_cost": round(total_cost, 2),
            "gross_profit": round(gross_profit, 2),
            "gross_margin_pct": gross_margin_pct,
        },
        "stock_by_category": stock_by_category,
        "restock_suggestions": restock_suggestions,
        "demand_forecasts": demand_forecasts,
        "sales_prediction": {
            "last_7d_revenue": round(last_7d_revenue, 2),
            "predicted_next_7d": predicted_next_week,
            "growth_rate_pct": round(growth_rate * 100, 1),
            "trajectory": "UPWARD" if growth_rate >= 0 else "DOWNWARD",
        },
        "insights": insights,
    }


