from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    owner_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    timings = Column(String, nullable=True)
    
    theme_color = Column(String, default="#E85A4F")
    secondary_color = Column(String, default="#D8C3A5")
    bg_color = Column(String, default="#EAE7DC")
    font_family = Column(String, default="Outfit")
    logo_url = Column(String, nullable=True)
    
    whatsapp_enabled = Column(Boolean, default=True)
    stock_alerts_enabled = Column(Boolean, default=True)
    low_stock_threshold = Column(Integer, default=5)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    procurement_list = Column(String, default="[]")

    products = relationship("Product", back_populates="store", cascade="all, delete-orphan")
    sales = relationship("Sale", backref="store", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="store", cascade="all, delete-orphan")
    
    suppliers = relationship("Supplier", backref="store", cascade="all, delete-orphan")
    employees = relationship("Employee", backref="store", cascade="all, delete-orphan")
    attendance = relationship("Attendance", backref="store", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    purchase_cost = Column(Float, default=0.0)
    stock_quantity = Column(Integer, default=0)
    unit = Column(String, default="packet")
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)

    barcode = Column(String, nullable=True)
    sku = Column(String, nullable=True)
    hsn_code = Column(String, nullable=True)
    gst_rate = Column(Float, default=18.0)
    expiry_date = Column(String, nullable=True)
    batch_number = Column(String, nullable=True)

    store = relationship("Store", back_populates="products")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    items_summary = Column(String, default="[]")
    total_amount = Column(Float, default=0.0)
    payment_method = Column(String, default="Cash")
    discount_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, index=True)
    amount = Column(Float, default=0.0)
    category = Column(String, default="Misc")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    store = relationship("Store", back_populates="expenses")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    outstanding_balance = Column(Float, default=0.0)


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    role = Column(String, default="Cashier")
    phone = Column(String, nullable=True)
    salary = Column(Float, default=0.0)
    commission = Column(Float, default=0.0)
    joining_date = Column(String, nullable=True)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(String, index=True)
    status = Column(String)
    check_in = Column(String, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=True)
    email = Column(String, index=True)
    phone = Column(String, index=True)
    password_hash = Column(String)
    role = Column(String, default="Customer")
    name = Column(String, nullable=True)
    bonus_claimed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True)
    otp_code = Column(String)
    expires_at = Column(DateTime)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    points_balance = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Streak(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)
    longest_streak = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class ModuleAccess(Base):
    __tablename__ = "module_access"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(String, index=True)
    unlocked_via = Column(String)
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)


class TransactionRecord(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String)
    amount = Column(Float, default=0.0)
    module_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    image_url = Column(String, nullable=True)
    subcategories = Column(String, default="[]")
    status = Column(Boolean, default=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    items_summary = Column(String, default="[]")
    total_amount = Column(Float, default=0.0)
    status = Column(String, default="Pending")
    payment_method = Column(String, default="Cash")
    delivery_address = Column(String, nullable=True)
    tracking_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    location = Column(String, nullable=True)
    capacity = Column(Float, nullable=True)


class CashFlow(Base):
    __tablename__ = "cash_flows"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    type = Column(String)
    amount = Column(Float, default=0.0)
    category = Column(String)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True)
    phone = Column(String, nullable=True, index=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    loyalty_points = Column(Integer, default=0)
    credit_balance = Column(Float, default=0.0)
    total_purchases = Column(Float, default=0.0)
    purchase_count = Column(Integer, default=0)
    last_visit = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ReturnRecord(Base):
    __tablename__ = "returns"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    sale_id = Column(Integer, ForeignKey("sales.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    items_summary = Column(String, default="[]")
    refund_amount = Column(Float, default=0.0)
    refund_method = Column(String, default="Cash")
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    supplier_name = Column(String, nullable=True)
    items_summary = Column(String, default="[]")
    total_amount = Column(Float, default=0.0)
    status = Column(String, default="Draft")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    title = Column(String)
    message = Column(String)
    type = Column(String, default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

