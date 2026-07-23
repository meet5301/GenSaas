from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    purchase_cost: Optional[float] = 0.0
    stock_quantity: int
    unit: str = "packet"
    image_url: Optional[str] = None
    description: Optional[str] = None
    is_available: bool = True
    barcode: Optional[str] = None
    sku: Optional[str] = None
    hsn_code: Optional[str] = None
    gst_rate: Optional[float] = 18.0
    expiry_date: Optional[str] = None
    batch_number: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    purchase_cost: Optional[float] = None
    stock_quantity: Optional[int] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None
    barcode: Optional[str] = None
    sku: Optional[str] = None
    hsn_code: Optional[str] = None
    gst_rate: Optional[float] = None
    expiry_date: Optional[str] = None
    batch_number: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


class SupplierBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    outstanding_balance: Optional[float] = 0.0

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


EMPLOYEE_ROLES = {"Manager", "Cashier", "Stockboy", "Delivery", "Helper", "Accountant"}

class EmployeeBase(BaseModel):
    name: str
    role: str = "Cashier"
    phone: Optional[str] = None
    salary: Optional[float] = 0.0
    commission: Optional[float] = 0.0
    joining_date: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    salary: Optional[float] = None
    commission: Optional[float] = None
    joining_date: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


class AttendanceBase(BaseModel):
    employee_id: int
    date: str
    status: str
    check_in: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


class StoreBase(BaseModel):
    name: str
    description: Optional[str] = None
    owner_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    timings: Optional[str] = None
    theme_color: Optional[str] = None
    secondary_color: Optional[str] = None
    bg_color: Optional[str] = None
    font_family: Optional[str] = None
    logo_url: Optional[str] = None
    whatsapp_enabled: Optional[bool] = None
    stock_alerts_enabled: Optional[bool] = None
    low_stock_threshold: Optional[int] = None
    procurement_list: Optional[str] = "[]"

class StoreCreate(StoreBase):
    slug: str

class StoreUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    timings: Optional[str] = None
    theme_color: Optional[str] = None
    secondary_color: Optional[str] = None
    bg_color: Optional[str] = None
    font_family: Optional[str] = None
    logo_url: Optional[str] = None
    whatsapp_enabled: Optional[bool] = None
    stock_alerts_enabled: Optional[bool] = None
    low_stock_threshold: Optional[int] = None
    procurement_list: Optional[str] = None

class StoreResponse(StoreBase):
    id: int
    slug: str
    created_at: datetime
    products: List[ProductResponse] = []
    suppliers: List[SupplierResponse] = []
    employees: List[EmployeeResponse] = []

    class Config:
        from_attributes = True


class GenerateRequest(BaseModel):
    prompt: str
    voice_input: bool = False
    email: Optional[str] = None
    store_name: Optional[str] = None
    selected_items: Optional[List[str]] = None


class SaleBase(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    items_summary: str = "[]"
    total_amount: float
    payment_method: Optional[str] = "Cash"
    discount_amount: Optional[float] = 0.0

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str = "Customer"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    store_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    id: Optional[int] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str


class CategoryBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    subcategories: Optional[str] = "[]"
    status: Optional[bool] = True

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    items_summary: str = "[]"
    total_amount: float
    status: str = "Pending"
    payment_method: str = "Cash"
    delivery_address: Optional[str] = None
    tracking_number: Optional[str] = None

class OrderCreate(OrderBase):
    customer_id: Optional[int] = None

class OrderResponse(OrderBase):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WarehouseBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: Optional[float] = None

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseResponse(WarehouseBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True


class CashFlowBase(BaseModel):
    type: str
    amount: float
    category: str
    description: Optional[str] = None

class CashFlowCreate(CashFlowBase):
    pass

class CashFlowResponse(CashFlowBase):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    loyalty_points: Optional[int] = None
    credit_balance: Optional[float] = None

class CustomerResponse(CustomerBase):
    id: int
    store_id: int
    loyalty_points: int
    credit_balance: float
    total_purchases: float
    purchase_count: int
    last_visit: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReturnBase(BaseModel):
    sale_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    items_summary: str = "[]"
    refund_amount: float
    refund_method: str = "Cash"
    reason: Optional[str] = None

class ReturnCreate(ReturnBase):
    pass

class ReturnResponse(ReturnBase):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseOrderBase(BaseModel):
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None
    items_summary: str = "[]"
    total_amount: float
    status: str = "Draft"
    notes: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    total_amount: Optional[float] = None

class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


EXPENSE_CATEGORIES = {"Salary", "Rent", "Utilities", "Purchase", "Maintenance", "Marketing", "Misc"}

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str = "Misc"
    description: Optional[str] = None

class ExpenseResponse(ExpenseCreate):
    id: int
    store_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    store_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp_code: str

class MobileSignupRequest(BaseModel):
    phone: str
    email: str
    password: str
    otp_code: str
    name: Optional[str] = "Store Owner"

class MobileLoginRequest(BaseModel):
    phone: str
    email: str
    password: str

class WalletResponse(BaseModel):
    points_balance: int
    bonus_claimed: bool

    class Config:
        from_attributes = True

class StreakResponse(BaseModel):
    current_streak: int
    last_active_date: Optional[str] = None
    longest_streak: int

    class Config:
        from_attributes = True

class ModuleUnlockRequest(BaseModel):
    module_id: str
    payment_method: str

class ModuleAccessResponse(BaseModel):
    module_id: str
    unlocked_via: str
    unlocked_at: datetime

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: float
    module_id: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    wallet: WalletResponse
    streak: StreakResponse
    unlocked_modules: List[ModuleAccessResponse]
    recent_transactions: List[TransactionResponse]

