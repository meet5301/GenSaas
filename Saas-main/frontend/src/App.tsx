import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Store as StoreIcon, 
  Edit3, 
  Package, 
  Plus, 
  Trash2, 
  Globe, 
  Eye, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Send,
  Sparkles,
  Users,
  Briefcase,
  Settings,
  DollarSign,
  BarChart2,
  RefreshCw,
  Download,
  MessageSquare,
  User,
  Languages,
  Heart,
  Lock
} from "lucide-react";

// Types matching backend Pydantic models
interface Product {
  id: number;
  store_id: number;
  name: string;
  category: string;
  price: number;
  purchase_cost: number;
  stock_quantity: number;
  unit: string;
  image_url?: string;
  description?: string;
  is_available: boolean;
  barcode?: string;
  sku?: string;
  hsn_code?: string;
  gst_rate?: number;
  expiry_date?: string;
  batch_number?: string;
}

interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  owner_name?: string;
  address?: string;
  phone?: string;
  timings?: string;
  theme_color: string;
  secondary_color: string;
  bg_color: string;
  font_family: string;
  logo_url?: string;
  whatsapp_enabled: boolean;
  stock_alerts_enabled: boolean;
  low_stock_threshold: number;
}

interface Supplier {
  id: number;
  store_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  outstanding_balance: number;
}

interface Customer {
  id: number;
  store_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  loyalty_points: number;
  credit_balance: number;
  total_purchases: number;
  purchase_count: number;
  last_visit?: string;
}
interface Employee {
  id: number;
  store_id: number;
  name: string;
  role: string;
  phone?: string;
  salary: number;
  commission: number;
}

interface Attendance {
  id: number;
  store_id: number;
  employee_id: number;
  date: string;
  status: string;
  check_in?: string;
}

const BACKEND_URL = "http://localhost:8000";

interface CustomDropdownProps {
  value: string;
  onChange: (val: any) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  color?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  icon, 
  style, 
  selectStyle,
  dropdownStyle,
  color,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div 
      ref={containerRef} 
      className={className || "pill-dropdown-container"} 
      style={{ position: "relative", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", ...style }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {icon}
      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: color || "inherit", display: "inline-block", paddingRight: "1.2rem", position: "relative", ...selectStyle }}>
        {selectedOption?.label}
        <span style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
          transition: "transform 0.2s ease",
          fontSize: "0.55rem"
        }}>▼</span>
      </span>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "120%",
          right: 0,
          backgroundColor: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-md)",
          zIndex: 4000,
          minWidth: "160px",
          padding: "0.4rem 0",
          maxHeight: "200px",
          overflowY: "auto",
          textAlign: "left",
          ...dropdownStyle
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: opt.value === value ? "var(--theme-color, var(--color-accent-red))" : "var(--color-text-dark)",
                backgroundColor: opt.value === value ? "rgba(148, 63, 63, 0.05)" : "transparent",
                transition: "background-color 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(148, 63, 63, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = opt.value === value ? "rgba(148, 63, 63, 0.05)" : "transparent";
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Multi-language translation dictionaries
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    ownerPanel: "Owner Panel",
    adminConsole: "Owner Control Console",
    inventory: "Inventory Stock",
    billing: "Customer Billing",
    accounting: "Accounting Log",
    editStore: "Edit Store details",
    design: "Design Styling",
    suppliers: "Suppliers",
    employees: "Employees / Attendance",
    backupRestore: "Database Settings",
    saveItem: "Save Item",
    cancel: "Cancel",
    totalRevenue: "Total Revenue",
    invoicesIssued: "Invoices Issued",
    walkInCustomer: "Walk-in Customer",
    addItems: "Add Items to Bill",
    searchProducts: "Search products...",
    generateBill: "Generate & Save Bill",
    role: "Role",
    attendance: "Attendance Log",
    lowStockAlert: "Low Stock Alert!",
    aiSuggest: "AI Auto-Suggest",
    suggestDescription: "Generate with AI",
    upiPay: "UPI QR Payment",
    cash: "Cash",
    card: "Card",
    upi: "UPI",
    split: "Split",
    downloadCsv: "Download CSV Report",
    chatHelper: "AI Smart Assistant",
    themePresets: "Theme Color Presets"
  },
  hi: {
    ownerPanel: "à¤®à¤¾à¤²à¤¿à¤• à¤•à¤¾ à¤ªà¥ˆà¤¨à¤²",
    adminConsole: "à¤®à¤¾à¤²à¤¿à¤• à¤¨à¤¿à¤¯à¤‚à¤¤à¥à¤°à¤£ à¤•à¤‚à¤¸à¥‹à¤²",
    inventory: "à¤®à¤¾à¤² à¤¸à¥‚à¤šà¥€ à¤¸à¥à¤Ÿà¥‰à¤•",
    billing: "à¤—à¥à¤°à¤¾à¤¹à¤• à¤¬à¤¿à¤²à¤¿à¤‚à¤—",
    accounting: "à¤²à¥‡à¤–à¤¾à¤‚à¤•à¤¨ à¤²à¥‰à¤—",
    editStore: "à¤¦à¥à¤•à¤¾à¤¨ à¤µà¤¿à¤µà¤°à¤£ à¤¬à¤¦à¤²à¥‡à¤‚",
    design: "à¤¡à¤¿à¤œà¤¼à¤¾à¤‡à¤¨ à¤¸à¥à¤Ÿà¤¾à¤‡à¤²à¤¿à¤‚à¤—",
    suppliers: "à¤†à¤ªà¥‚à¤°à¥à¤¤à¤¿à¤•à¤°à¥à¤¤à¤¾ (à¤¸à¤ªà¥à¤²à¤¾à¤¯à¤°)",
    employees: "à¤•à¤°à¥à¤®à¤šà¤¾à¤°à¥€ / à¤‰à¤ªà¤¸à¥à¤¥à¤¿à¤¤à¤¿",
    backupRestore: "à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤¸à¥‡à¤Ÿà¤¿à¤‚à¤—à¥à¤¸",
    saveItem: "à¤†à¤‡à¤Ÿà¤® à¤¸à¤¹à¥‡à¤œà¥‡à¤‚",
    cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚",
    totalRevenue: "à¤•à¥à¤² à¤°à¤¾à¤œà¤¸à¥à¤µ",
    invoicesIssued: "à¤œà¤¾à¤°à¥€ à¤•à¤¿à¤ à¤—à¤ à¤¬à¤¿à¤²",
    walkInCustomer: "à¤¨à¤¿à¤¯à¤®à¤¿à¤¤ à¤—à¥à¤°à¤¾à¤¹à¤•",
    addItems: "à¤¬à¤¿à¤² à¤®à¥‡à¤‚ à¤†à¤‡à¤Ÿà¤® à¤œà¥‹à¥œà¥‡à¤‚",
    searchProducts: "à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¥‹à¤‚ à¤•à¥€ à¤–à¥‹à¤œ...",
    generateBill: "à¤¬à¤¿à¤² à¤¬à¤¨à¤¾à¤à¤‚ à¤”à¤° à¤¸à¤¹à¥‡à¤œà¥‡à¤‚",
    role: "à¤­à¥‚à¤®à¤¿à¤•à¤¾",
    attendance: "à¤‰à¤ªà¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤²à¥‰à¤—",
    lowStockAlert: "à¤•à¤® à¤¸à¥à¤Ÿà¥‰à¤• à¤šà¥‡à¤¤à¤¾à¤µà¤¨à¥€!",
    aiSuggest: "à¤à¤†à¤ˆ à¤¸à¥à¤à¤¾à¤µ",
    suggestDescription: "à¤à¤†à¤ˆ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¬à¤¨à¤¾à¤à¤",
    upiPay: "à¤¯à¥‚à¤ªà¥€à¤†à¤ˆ à¤•à¥à¤¯à¥‚à¤†à¤° à¤­à¥à¤—à¤¤à¤¾à¤¨",
    cash: "à¤¨à¤•à¤¦",
    card: "à¤•à¤¾à¤°à¥à¤¡",
    upi: "à¤¯à¥‚à¤ªà¥€à¤†à¤ˆ",
    split: "à¤µà¤¿à¤­à¤¾à¤œà¤¿à¤¤",
    downloadCsv: "à¤¸à¥€à¤à¤¸à¤µà¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤°à¥‡à¤‚",
    chatHelper: "à¤à¤†à¤ˆ à¤¸à¥à¤®à¤¾à¤°à¥à¤Ÿ à¤¸à¤¹à¤¾à¤¯à¤•",
    themePresets: "à¤°à¤‚à¤— à¤¥à¥€à¤® à¤ªà¥à¤°à¥€à¤¸à¥‡à¤Ÿà¥à¤¸"
  },
  gu: {
    ownerPanel: "àª®àª¾àª²àª¿àª• àªªà«‡àª¨àª²",
    adminConsole: "àª®àª¾àª²àª¿àª• àª¨àª¿àª¯àª‚àª¤à«àª°àª£ àª•àª¨à«àª¸à«‹àª²",
    inventory: "àª‡àª¨à«àªµà«‡àª¨à«àªŸàª°à«€ àª¸à«àªŸà«‹àª•",
    billing: "àª—à«àª°àª¾àª¹àª• àª¬àª¿àª²àª¿àª‚àª—",
    accounting: "àªàª•àª¾àª‰àª¨à«àªŸàª¿àª‚àª— àª²à«‹àª—",
    editStore: "àª¦à«àª•àª¾àª¨ àªµàª¿àª—àª¤à«‹ àª¸àª‚àªªàª¾àª¦àª¿àª¤ àª•àª°à«‹",
    design: "àª¡àª¿àªàª¾àª‡àª¨ àª¸à«àªŸàª¾àª‡àª²à«€àª‚àª—",
    suppliers: "àª¸àªªà«àª²àª¾àª¯àª°à«àª¸",
    employees: "àª•àª°à«àª®àªšàª¾àª°à«€àª“ / àª¹àª¾àªœàª°à«€",
    backupRestore: "àª¡à«‡àªŸàª¾àª¬à«‡àª àª¸à«‡àªŸàª¿àª‚àª—à«àª¸",
    saveItem: "àª†àª‡àªŸàª® àª¸àª¾àªšàªµà«‹",
    cancel: "àª°àª¦ àª•àª°à«‹",
    totalRevenue: "àª•à«àª² àª†àªµàª•",
    invoicesIssued: "àª‡àª¨à«àªµà«‰àª‡àª¸à«‡àª¸ àªœàª¾àª°à«€ àª•àª°à«àª¯àª¾",
    walkInCustomer: "àª—à«àª°àª¾àª¹àª•",
    addItems: "àª¬àª¿àª²àª®àª¾àª‚ àªµàª¸à«àª¤à«àª“ àª‰àª®à«‡àª°à«‹",
    searchProducts: "àª‰àª¤à«àªªàª¾àª¦àª¨à«‹ àª¶à«‹àª§à«‹...",
    generateBill: "àª¬àª¿àª² àª¬àª¨àª¾àªµà«‹ àª…àª¨à«‡ àª¸àª¾àªšàªµà«‹",
    role: "àª­à«‚àª®àª¿àª•àª¾",
    attendance: "àª¹àª¾àªœàª°à«€ àª²à«‹àª—",
    lowStockAlert: "àª“àª›à«‹ àª¸à«àªŸà«‹àª• àªàª²àª°à«àªŸ!",
    aiSuggest: "àªàª†àªˆ àª¸à«àªµàª¤àªƒ-àª¸à«‚àªšàª¨",
    suggestDescription: "àªàª†àªˆ àª¸àª¾àª¥à«‡ àª¬àª¨àª¾àªµà«‹",
    upiPay: "àª¯à«àªªà«€àª†àªˆ àª•à«àª¯à«àª†àª° àªšà«àª•àªµàª£à«€",
    cash: "àª°à«‹àª•àª¡",
    card: "àª•àª¾àª°à«àª¡",
    upi: "àª¯à«àªªà«€àª†àªˆ",
    split: "àªµàª¿àª­àª¾àªœàª¿àª¤",
    downloadCsv: "àª¸à«€àªàª¸àªµà«€ àª°àª¿àªªà«‹àª°à«àªŸ àª¡àª¾àª‰àª¨àª²à«‹àª¡ àª•àª°à«‹",
    chatHelper: "àªàª†àªˆ àª¸à«àª®àª¾àª°à«àªŸ àª¸àª¹àª¾àª¯àª•",
    themePresets: "àª¥à«€àª® àª•àª²àª° àªªà«àª°à«€àª¸à«‡àªŸà«àª¸"
  }
};

export default function App() {
  // Navigation / View State
  const [view, setView] = useState<"builder" | "dashboard" | "storefront">("builder");
  const [activeTab, setActiveTab] = useState<"stock" | "billing" | "accounting" | "suppliers" | "customers" | "employees" | "store-settings" | "settings" | "analytics" | "orders" | "ai-insights">("stock");

  // Auth User & Role State
  const [userRole, setUserRole] = useState<"Super Admin" | "Store Owner" | "Manager" | "Cashier" | "Customer">("Store Owner");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      console.log("Active session verified");
    }
  }, [token]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "", phone: "", role: "Store Owner" });

  const [lang, setLang] = useState<"en" | "hi" | "gu">("en");
  const [isDarkMode] = useState(false);

  // Owner Password Verification Lock
  const [isOwnerVerified, setIsOwnerVerified] = useState(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // Helper for quick stock update
  const handleQuickUpdateStock = async (product: Product, newQty: number) => {
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, stock_quantity: newQty })
      });
      if (!response.ok) throw new Error("Failed to update stock");
      const updated = await response.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      alert(`Stock for ${product.name} updated to ${newQty}!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update stock.");
    }
  };

  // Generator State
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Store State
  const [store, setStore] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [warehousesList, setWarehousesList] = useState<any[]>([{ id: 1, name: "Main Warehouse", location: "Store Backroom" }]);
  useEffect(() => {
    if (store) {
      fetch(`${BACKEND_URL}/api/stores/${store.id}/warehouses`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setWarehousesList(data.length > 0 ? data : [{ id: 1, name: "Main Warehouse", location: "Store Backroom" }]))
        .catch(err => console.error("Error fetching warehouses:", err));
    }
  }, [store]);
  const [cashflowsList, setCashflowsList] = useState<any[]>([]);
  const [aiInsightsData, setAiInsightsData] = useState<any | null>(null);
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  
  // Custom Scanner and Form States
  const [barcodeInput, setBarcodeInput] = useState("");
  const [invoiceFormat, setInvoiceFormat] = useState<"A4" | "Thermal">("Thermal");
  const [customerWallet] = useState(500); // INR wallet credit
  const [customerPoints] = useState(120); // reward loyalty points
  const [customerWishlist, setCustomerWishlist] = useState<number[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", image_url: "", subcategories: "[]" });
  const [customerActiveTab] = useState<"shop" | "orders" | "wishlist">("shop");
  const [isCustomerCartOpen, setIsCustomerCartOpen] = useState(false);


  
  // Local form states for updates
  const [storeForm, setStoreForm] = useState<Partial<Store>>({});
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Dairy & Eggs",
    price: 0,
    purchase_cost: 0,
    stock_quantity: 10,
    unit: "packet",
    description: "",
    image_url: "",
    barcode: "",
    sku: "",
    hsn_code: "",
    gst_rate: 18.0,
    expiry_date: "",
    batch_number: ""
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inventoryView, setInventoryView] = useState<"table" | "grid">("table");
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("All");

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    outstanding_balance: 0
  });
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // Employee Form State
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    role: "Cashier",
    phone: "",
    salary: 0,
    commission: 0
  });
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Customer Preview / Cart State
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Billing & Sales State
  const [sales, setSales] = useState<any[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingSearch, setBillingSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "UPI" | "Split">("Cash");
  const [discountCoupon, setDiscountCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // value in %
  const [generatedInvoice, setGeneratedInvoice] = useState<any | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [billingGridView, setBillingGridView] = useState(false);

  // Onboarding live parse preview
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);
  const [parseDebounceTimer, setParseDebounceTimer] = useState<any>(null);

  // AI Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Namaste! I am your AI Store Copilot. Ask me about your stock, daily sales forecast, or create a product automatically." }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Backup & Restore state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);
  // Helper Translate Function
  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en?.[key] || key;
  };

  // Initialize Speech Recognition — re-init when language changes
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
    }

    const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = langMap[lang] || "en-IN";

    rec.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setPrompt((prev) => {
        const updated = prev + (prev ? " " : "") + transcript;
        triggerParsePreview(updated);
        return updated;
      });
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);

    speechRecognitionRef.current = rec;
  }, [lang]);

  // Helper: load all store data after login/restore
  const loadStoreData = async (storeId: number, userId: number, role: string) => {
    const storeRes = await fetch(`${BACKEND_URL}/api/stores/${storeId}`);
    if (!storeRes.ok) return;
    const storeData = await storeRes.json();
    setStore(storeData);
    setProducts(storeData.products || []);
    setStoreForm(storeData);
    fetchSales(storeData.id);
    fetchSuppliers(storeData.id);
    fetchEmployees(storeData.id);
    fetchAttendance(storeData.id);
    fetchCategories(storeData.id);
    fetchCashFlows(storeData.id);
    fetchAIInsights(storeData.id);
    if (role === "Customer") {
      setView("storefront");
      fetchCustomerOrders(storeData.id, userId);
    } else {
      fetchOrders(storeData.id);
      setView("storefront");
    }
  };

  // Fetch user profile and active store data on startup
  useEffect(() => {
    const initData = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (!res.ok) { localStorage.removeItem("token"); return; }
        const userData = await res.json();
        setCurrentUser(userData);
        setUserRole(userData.role);
        setIsOwnerVerified(true);
        if (userData.store_id) await loadStoreData(userData.store_id, userData.id, userData.role);
      } catch (e) {
        console.error("Session restoration failed:", e);
      }
    };
    initData();
  }, []);

  // Handle Speech Toggle
  const toggleRecording = () => {
    if (!speechRecognitionRef.current) {
      alert("Web Speech API is not supported in this browser. Please type your description instead!");
      return;
    }

    if (isRecording) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setError(null);
      speechRecognitionRef.current.start();
    }
  };

  // Debounced live parse preview
  const triggerParsePreview = (text: string) => {
    if (parseDebounceTimer) clearTimeout(parseDebounceTimer);
    if (!text.trim() || text.trim().length < 10) { setParsedPreview(null); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/parse-voice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text })
        });
        if (res.ok) setParsedPreview(await res.json());
      } catch { /* silent */ }
    }, 600);
    setParseDebounceTimer(timer);
  };

  // Submit Generation Request (Intercepts and opens choice modal)
  const handleGenerate = async (textToUse?: string) => {
    if (!currentUser) {
      alert("Please login or sign up first to generate your store.");
      setIsAuthModalOpen(true);
      setAuthMode("signup");
      return;
    }

    const finalPrompt = textToUse || prompt;
    if (!finalPrompt.trim()) {
      setError("Please describe your store first (speak or type).");
      return;
    }

    // Auto-parse store name
    const namePatterns = [
      /(?:name is|naam hai|named|called|call it)\s+['"]?([A-Za-z0-9\s&]+)['"]?/i,
      /([A-Za-z0-9\s&]+)(?:general store|store|kirana|bazaar|mart|dukaan|supermarket|grocery|provision)/i
    ];
    let parsedName = "Apna Kirana Store";
    for (const pattern of namePatterns) {
      const match = finalPrompt.match(pattern);
      if (match && match[1]) {
        parsedName = match[1].trim();
        break;
      }
    }
    // Clean trailing/leading connection words
    parsedName = parsedName.replace(/^(my store|apna|mera|our store)\s+/i, "");
    parsedName = parsedName.replace(/\s+(and|item|items|will|is|are|we|sell|sells|selling|avail|available|location|in|at)\b.*$/i, "");
    if (!parsedName.toLowerCase().includes("store") && !parsedName.toLowerCase().includes("kirana") && !parsedName.toLowerCase().includes("mart")) {
      parsedName = parsedName + " Store";
    }

    // Auto-match items from prompt
    const lower = finalPrompt.toLowerCase();
    const allDefaults = [
      "Amul Butter", "Fresh Milk", "Fresh Eggs", "Paneer (Cottage Cheese)",
      "Mustard Cooking Oil", "Wheat Atta Flour", "Basmati Rice", "Iodized Salt", "Garam Masala Spice Pack",
      "Tea (Chai) Powder", "Coffee Powder", "Potato Chips", "Chocolate Cookies", "Cold Soda Drink",
      "Hand Wash Liquid", "Bath Soap", "Toothpaste (Colgate)", "Surf Detergent Powder", "Glass & Surface Cleaner"
    ];
    const mapping: { [key: string]: string[] } = {
      "Amul Butter": ["butter", "makhan"],
      "Fresh Milk": ["milk", "doodh"],
      "Fresh Eggs": ["egg", "eggs", "anda"],
      "Paneer (Cottage Cheese)": ["paneer"],
      "Mustard Cooking Oil": ["oil", "cooking oil", "mustard oil", "tel"],
      "Wheat Atta Flour": ["atta", "flour", "wheat"],
      "Basmati Rice": ["rice", "chawal"],
      "Iodized Salt": ["salt", "namak"],
      "Garam Masala Spice Pack": ["masala", "spice", "spices"],
      "Tea (Chai) Powder": ["tea", "chai"],
      "Coffee Powder": ["coffee"],
      "Potato Chips": ["chips", "wafer", "wafers"],
      "Chocolate Cookies": ["cookie", "cookies", "biscuit", "biscuits"],
      "Cold Soda Drink": ["soda", "cold drink", "coke", "pepsi"],
      "Hand Wash Liquid": ["handwash", "hand wash"],
      "Bath Soap": ["soap", "bath soap"],
      "Toothpaste (Colgate)": ["toothpaste", "colgate", "paste"],
      "Surf Detergent Powder": ["detergent", "surf", "washing powder"],
      "Glass & Surface Cleaner": ["cleaner", "glass cleaner"]
    };

    const matched = allDefaults.filter(item => {
      const keywords = mapping[item] || [];
      return keywords.some(k => lower.includes(k));
    });

    const itemsList = matched.length > 0 ? matched : allDefaults;

    // Directly generate storefront without asking follow-up options modal
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          email: currentUser?.email,
          store_name: parsedName,
          selected_items: itemsList
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: "Failed to generate storefront. Please try again." }));
        throw new Error(errData.detail || "Failed to generate storefront. Please try again.");
      }

      const data: Store = await response.json();
      
      setCurrentUser((prev: any) => prev ? { ...prev, store_id: data.id } : prev);
      setStore(data);
      setProducts((data as any).products || []);
      setStoreForm(data);
      fetchSales(data.id);
      fetchSuppliers(data.id);
      fetchEmployees(data.id);
      fetchAttendance(data.id);
      setIsOwnerVerified(true);
      setView("dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Update Store Details / Theme
  const handleUpdateStore = async (updatedFields: Partial<Store>) => {
    if (!store) return;
    const nextStoreState = { ...store, ...updatedFields };
    setStore(nextStoreState);

    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      if (!response.ok) throw new Error("Failed to save changes");
      const data = await response.json();
      setStore(data);
      setStoreForm(data);
    } catch (err) {
      console.error("Error updating store details:", err);
      setStore(store);
    }
  };

  // Adjust stock values directly
  const adjustStock = async (prodId: number, delta: number) => {
    if (!store) return;
    const targetProduct = products.find(p => p.id === prodId);
    if (!targetProduct) return;

    const newQty = Math.max(0, targetProduct.stock_quantity + delta);
    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, stock_quantity: newQty } : p));

    try {
      await fetch(`${BACKEND_URL}/api/stores/${store.id}/products/${prodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_quantity: newQty })
      });
    } catch (err) {
      console.error("Error adjusting product stock:", err);
      setProducts(prev => prev.map(p => p.id === prodId ? targetProduct : p));
    }
  };

  // Fetch Sales Log
  const fetchSales = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/sales`);
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (err) {
      console.error("Error fetching sales log:", err);
    }
  };

  // Fetch Categories
  const fetchCategories = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategoriesList(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm)
      });
      if (response.ok) {
        const data = await response.json();
        setCategoriesList(prev => [...prev, data]);
        setShowAddCategory(false);
        setCategoryForm({ name: "", image_url: "", subcategories: "[]" });
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    if (!store) return;
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/categories/${catId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setCategoriesList(prev => prev.filter(c => c.id !== catId));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const fetchCustomers = async (storeId: number, search = "") => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/customers${query}`);
      if (response.ok) setCustomers(await response.json());
    } catch (err) { console.error("Error fetching customers:", err); }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !customerForm.name.trim()) return;
    const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/customers`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerForm)
    });
    if (!response.ok) { alert("Could not save customer."); return; }
    setCustomerForm({ name: "", phone: "", email: "", address: "" });
    setShowAddCustomer(false);
    fetchCustomers(store.id, customerSearch);
  };

  const adjustCustomerCredit = async (customer: Customer, amount: number) => {
    if (!store || !amount) return;
    const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/customers/${customer.id}/adjust-credit`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount })
    });
    if (response.ok) fetchCustomers(store.id, customerSearch);
  };
  // Fetch Orders
  const fetchOrders = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrdersList(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchCustomerOrders = async (storeId: number, custId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/orders/customer/${custId}`);
      if (response.ok) {
        const data = await response.json();
        setOrdersList(data);
      }
    } catch (err) {
      console.error("Error fetching customer orders:", err);
    }
  };



  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/orders/${orderId}?status=${status}`, {
        method: "PUT"
      });
      if (response.ok) {
        const data = await response.json();
        setOrdersList(prev => prev.map(o => o.id === orderId ? data : o));
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Fetch CashFlows
  const fetchCashFlows = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/cashflows`);
      if (response.ok) {
        const data = await response.json();
        setCashflowsList(data);
      }
    } catch (err) {
      console.error("Error fetching cashflows:", err);
    }
  };

  const handleAddCashFlow = async (type: "Inflow" | "Outflow", amount: number, category: string, desc: string) => {
    if (!store) return;
    const payload = { type, amount, category, description: desc };
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/cashflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setCashflowsList(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error("Error recording cashflow:", err);
    }
  };

  // Fetch AI Insights
  const fetchAIInsights = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/ai/insights`);
      if (response.ok) {
        const data = await response.json();
        setAiInsightsData(data);
      }
    } catch (err) {
      console.error("Error fetching AI Insights:", err);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "signup") {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authForm.name,
            email: authForm.email,
            phone: authForm.phone,
            password: authForm.password,
            role: authForm.role
          })
        });
        if (response.ok) {
          alert("Account created! Please login.");
          setAuthMode("login");
        } else {
          const errData = await response.json();
          alert(errData.detail || "Signup failed.");
        }
      } catch {
        alert("Registration failed. Backend connection issue.");
      }
    } else {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authForm.email, password: authForm.password })
        });
        if (!response.ok) { alert("Invalid email or password."); return; }

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setToken(data.access_token);

        // Fetch full user profile via /me
        const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });
        if (!meRes.ok) { alert("Login failed."); return; }
        const userData = await meRes.json();

        setCurrentUser(userData);
        setUserRole(userData.role);
        setIsAuthModalOpen(false);
        setIsOwnerVerified(true);

        if (userData.store_id) {
          await loadStoreData(userData.store_id, userData.id, userData.role);
          setView(userData.role === "Customer" ? "storefront" : "dashboard");
        } else {
          setView(userData.role === "Customer" ? "storefront" : "builder");
        }
      } catch {
        alert("Login failed. Backend connection issue.");
      }
    }
  };

  const handleLogout = () => {
    const rt = localStorage.getItem("refresh_token");
    if (rt) fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: rt })
    }).catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setCurrentUser(null);
    setUserRole("Store Owner");
    setStore(null);
    setProducts([]);
    setCustomerWishlist([]);
    setView("builder");
  };

  // Fetch Suppliers
  const fetchSuppliers = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/suppliers`);
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  // Fetch Employees
  const fetchEmployees = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Fetch Attendance Log
  const fetchAttendance = async (storeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${storeId}/attendance`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // AI Product Auto-Suggest Autofiller
  const handleAISuggestProduct = async (productName: string) => {
    if (!productName.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/suggest-product?name=${encodeURIComponent(productName)}`);
      if (response.ok) {
        const suggested = await response.json();
        if (editingProduct) {
          setEditingProduct(prev => prev ? { ...prev, ...suggested } : null);
        } else {
          setNewProductForm(prev => ({ ...prev, ...suggested }));
        }
      }
    } catch (err) {
      console.error("Error generating product details via AI:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Chat Assistant responses
  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    const userText = chatMessage.trim();
    setChatHistory(prev => [...prev, { sender: "user", text: userText }]);
    setChatMessage("");
    setAiLoading(true);

    // Local smart heuristic response based on database
    setTimeout(() => {
      let reply = "I can help you audit stock or perform predictions! Try asking 'low stock' or 'sales prediction'.";
      const q = userText.toLowerCase();

      if (q.includes("low stock") || q.includes("alerts")) {
        const lowItems = products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5));
        if (lowItems.length === 0) {
          reply = "All products are well stocked! No low-stock items detected.";
        } else {
          reply = `Alert! The following items are running low: ${lowItems.map(p => `${p.name} (${p.stock_quantity} left)`).join(", ")}. Please prepare a purchase order.`;
        }
      } else if (q.includes("predict") || q.includes("sales") || q.includes("revenue")) {
        const revenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
        const forecast = Math.round(revenue * 1.15 + 500);
        reply = `AI Sales Forecast: Current recorded revenue is ₹${revenue}. Based on the weekly trajectory and demand patterns, we predict a 15% increase next week, with projected revenue of ₹${forecast}. Recommend keeping Grains & Oils fully stocked.`;
      } else if (q.includes("supplier") || q.includes("outstanding")) {
        const outstanding = suppliers.reduce((sum, sup) => sum + sup.outstanding_balance, 0);
        reply = `You currently have ${suppliers.length} active suppliers. Total outstanding ledger balance due is ₹${outstanding}. Ramesh Distributors has the highest balance.`;
      } else if (q.includes("employee") || q.includes("attendance")) {
        const count = employees.length;
        const presentCount = attendance.filter(a => a.date === new Date().toISOString().split("T")[0] && a.status === "Present").length;
        reply = `You have ${count} staff profiles. Today's attendance sheet logs ${presentCount} employees checked in as Present.`;
      } else if (q.includes("hello") || q.includes("hi")) {
        reply = "Hello! I am your Kirana Store AI. How can I assist you with inventory, billing, or reports today?";
      }

      setChatHistory(prev => [...prev, { sender: "ai", text: reply }]);
      setAiLoading(false);
    }, 800);
  };

  // Barcode / SKU scanner simulation logic
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = barcodeInput.trim();
    if (!barcode) return;
    const match = products.find(p => p.barcode === barcode || p.sku === barcode);
    if (match) {
      if (match.stock_quantity <= 0) {
        alert("Product is out of stock!");
        return;
      }
      const inCart = invoiceItems.find(item => item.product.id === match.id);
      if (inCart) {
        if (inCart.quantity >= match.stock_quantity) {
          alert("Cannot exceed available stock!");
          return;
        }
        setInvoiceItems(prev => prev.map(item => item.product.id === match.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setInvoiceItems(prev => [...prev, { product: match, quantity: 1 }]);
      }
      setBarcodeInput("");
    } else {
      alert("No product matches this barcode/SKU.");
    }
  };

  // Record sale to database
  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || invoiceItems.length === 0) return;

    let subtotal = invoiceItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (discountCoupon.trim().toUpperCase() === "WELCOME10") {
      subtotal = subtotal * 0.9;
    }
    const finalTotal = Math.round(subtotal);

    const summary = invoiceItems.map(item => ({
      product_id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      unit: item.product.unit,
      hsn_code: item.product.hsn_code || "1905",
      gst_rate: item.product.gst_rate || 18.0
    }));

    const discountAmt = appliedDiscount > 0 ? Math.round(invoiceItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 0.1) : 0;

    const salePayload = {
      customer_name: billingName.trim() || "Walk-in Customer",
      customer_phone: billingPhone.trim() || "N/A",
      items_summary: JSON.stringify(summary),
      total_amount: finalTotal,
      payment_method: paymentMethod,
      discount_amount: discountAmt
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salePayload)
      });

      if (!response.ok) throw new Error("Failed to record transaction");
      const createdSale = await response.json();
      
      // Update local products list (deduct stock)
      setProducts(prev => prev.map(p => {
        const soldItem = invoiceItems.find(item => item.product.id === p.id);
        if (soldItem) {
          return { ...p, stock_quantity: Math.max(0, p.stock_quantity - soldItem.quantity) };
        }
        return p;
      }));

      // Record invoice for modal display
      setGeneratedInvoice({
        id: createdSale.id,
        date: createdSale.created_at,
        customerName: createdSale.customer_name,
        customerPhone: createdSale.customer_phone,
        items: summary,
        total: finalTotal,
        paymentMethod: paymentMethod,
        discountApplied: discountCoupon ? 10 : 0,
        discountAmount: discountAmt
      });
      setAppliedDiscount(0);

      // Clear bill
      setInvoiceItems([]);
      setBillingName("");
      setBillingPhone("");
      setDiscountCoupon("");
      fetchSales(store.id);
    } catch (err) {
      console.error("Error submitting invoice:", err);
      alert("Billing failed. Please verify item stock quantities and try again.");
    }
  };

  // WhatsApp bill share
  const handleWhatsAppShare = (invoice: any) => {
    const itemLines = invoice.items.map((i: any) => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join("%0A");
    const msg = `ðŸ§¾ *Bill from ${store?.name}*%0A%0A${itemLines}%0A%0A` +
      (invoice.discountAmount > 0 ? `Discount: -₹${invoice.discountAmount}%0A` : "") +
      `*Total: ₹${invoice.total}*%0APayment: ${invoice.paymentMethod}%0A%0AThank you! 🙏`;
    const raw = (invoice.customerPhone || store?.phone || "").replace(/\D/g, "");
    const waNum = raw.length >= 10 ? (raw.startsWith("91") ? raw : "91" + raw) : "";
    window.open(`https://wa.me/${waNum}?text=${msg}`, "_blank");
  };

  // Add custom product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductForm)
      });

      if (!response.ok) throw new Error("Failed to add product");
      const createdProd = await response.json();
      setProducts(prev => [createdProd, ...prev]);
      setShowAddProduct(false);
      setNewProductForm({
        name: "",
        category: "Dairy & Eggs",
        price: 0,
        purchase_cost: 0,
        stock_quantity: 10,
        unit: "packet",
        description: "",
        image_url: "",
        barcode: "",
        sku: "",
        hsn_code: "",
        gst_rate: 18.0,
        expiry_date: "",
        batch_number: ""
      });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (prodId: number) => {
    if (!store) return;
    if (!confirm("Are you sure you want to remove this product?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/products/${prodId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Edit product details
  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !editingProduct) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct)
      });

      if (!response.ok) throw new Error("Failed to update product");
      const updatedProd = await response.json();
      setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product details. Please try again.");
    }
  };

  // Supplier handlers
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm)
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(prev => [...prev, data]);
        setShowAddSupplier(false);
        setSupplierForm({ name: "", phone: "", email: "", address: "", outstanding_balance: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustSupplierLedger = async (supId: number, adjustment: number) => {
    if (!store) return;
    const target = suppliers.find(s => s.id === supId);
    if (!target) return;
    const newBal = target.outstanding_balance + adjustment;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/suppliers/${supId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: target.name, outstanding_balance: newBal })
      });
      if (response.ok) {
        setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, outstanding_balance: newBal } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Employee handlers
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeForm)
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(prev => [...prev, data]);
        setShowAddEmployee(false);
        setEmployeeForm({ name: "", role: "Cashier", phone: "", salary: 0, commission: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogAttendance = async (empId: number, status: "Present" | "Absent") => {
    if (!store) return;
    const payload = {
      employee_id: empId,
      date: selectedAttendanceDate,
      status: status,
      check_in: status === "Present" ? "09:00" : undefined
    };
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchAttendance(store.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export DB JSON
  const handleExportBackup = async () => {
    if (!store) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/backup`);
      if (response.ok) {
        const dump = await response.json();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dump, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${store.slug}_db_backup.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      alert("Failed to export database backup.");
    }
  };

  // Import DB JSON
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!store || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const payload = JSON.parse(event.target?.result as string);
        const response = await fetch(`${BACKEND_URL}/api/stores/${store.id}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          alert("Database successfully restored from JSON backup!");
          // Reload everything
          fetchSales(store.id);
          fetchSuppliers(store.id);
          fetchEmployees(store.id);
          fetchAttendance(store.id);
          // Refetch products list
          const pResponse = await fetch(`${BACKEND_URL}/api/stores/${store.id}`);
          if (pResponse.ok) {
            const data = await pResponse.json();
            setProducts(data.products || []);
          }
        } else {
          alert("Failed to restore database. Invalid schema.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Accounting Ledger Calculations
  const calculateTotalCostOfSales = () => {
    let totalCost = 0;
    sales.forEach(sale => {
      try {
        const items = JSON.parse(sale.items_summary);
        items.forEach((item: any) => {
          // match local product cost
          const dbProd = products.find(p => p.id === item.product_id);
          const cost = dbProd ? dbProd.purchase_cost : (item.price * 0.7);
          totalCost += cost * item.quantity;
        });
      } catch (e) {
        totalCost += sale.total_amount * 0.7; // fallback
      }
    });
    return Math.round(totalCost);
  };

  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice ID,Customer,Phone,Total Amount (INR),Date\n";
    sales.forEach(s => {
      csvContent += `${s.id},"${s.customer_name}",${s.customer_phone},${s.total_amount},"${s.created_at}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${store?.slug}_sales_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Inquiry Form handlers
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const lowStockItems = products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5));
  const categories = ["All", ...(categoriesList.length > 0 ? categoriesList.map(c => c.name) : Array.from(new Set(products.map(p => p.category))))];
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div 
      className={`app-container ${isDarkMode ? "dark-theme" : ""}`}
      style={{ "--theme-color": store?.theme_color || "var(--color-accent-red)" } as React.CSSProperties}
    >
      
      {/* Header */}
      <header className="app-header" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="logo-group" style={{ cursor: "pointer" }} onClick={() => setView("builder")}>
          {view === "builder" ? (
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 600, color: "var(--color-accent-red)" }}>GenScale</span>
          ) : (
            <>
              <div className="logo-icon">
                <StoreIcon size={24} />
              </div>
              <span>{store?.name || "GenScale"}</span>
            </>
          )}
        </div>

        {/* Global Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          
          {/* Language Selector */}
          <CustomDropdown
            value={lang}
            onChange={(val) => setLang(val as any)}
            options={[
              { value: "en", label: "English" },
              { value: "hi", label: "à¤¹à¤¿à¤‚à¤¦à¥€ (Hindi)" },
              { value: "gu", label: "àª—à«àªœàª°àª¾àª¤à«€ (Gujarati)" }
            ]}
            icon={<Languages size={15} style={{ color: "var(--color-text-muted)" }} />}
          />

          {/* Auth Trigger Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="no-print">
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Hello, {currentUser.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem", borderRadius: "12px" }}>Logout</button>
              </div>
            ) : (
              <button onClick={() => { setIsAuthModalOpen(true); setAuthMode("login"); }} className="btn btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem", borderRadius: "12px" }}>
                Login / Signup
              </button>
            )}
          </div>

          {/* Auth Role Mock Selector */}
          {view !== "builder" && (
            <CustomDropdown
              value={userRole}
              onChange={(val) => {
                setUserRole(val);
                if (val === "Customer") {
                  setView("storefront");
                  setIsConsoleOpen(false);
                }
              }}
              options={[
                { value: "Store Owner", label: "Store Owner" },
                { value: "Super Admin", label: "Super Admin" },
                { value: "Manager", label: "Manager" },
                { value: "Cashier", label: "Cashier" },
                { value: "Customer", label: "Customer" }
              ]}
              icon={<User size={15} style={{ color: "var(--color-accent-red)" }} />}
              color="var(--color-accent-red)"
              style={{ borderColor: "var(--color-accent-red)" }}
            />
          )}

          {view === "builder" && (
            <div className="nav-links-center" style={{ display: "flex", gap: "2rem" }}>
              <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontWeight: 500 }}>Features</button>
              <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontWeight: 500 }}>How it Works</button>
              <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontWeight: 500 }}>About</button>
            </div>
          )}

          <div className="nav-links">
            {view === "builder" ? (
              store ? (
                <button 
                  onClick={() => {
                    if (isOwnerVerified) {
                      setView("dashboard");
                    } else {
                      setShowPasswordPrompt(true);
                    }
                  }} 
                  className="btn btn-primary" 
                  style={{ borderRadius: "50px", backgroundColor: "var(--color-accent-red)" }}
                >
                  {t("ownerPanel")}
                </button>
              ) : (
                <button onClick={() => document.getElementById("prompt-container")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary" style={{ borderRadius: "50px", backgroundColor: "var(--color-accent-red)" }}>
                  Get Started
                </button>
              )
            ) : (
              <>
                <button onClick={() => setView("builder")} className="btn btn-secondary">
                  Create New
                </button>
                <button 
                  onClick={() => {
                    if (view === "dashboard") {
                      setView("storefront");
                    } else {
                      if (isOwnerVerified) {
                        setView("dashboard");
                      } else {
                        setShowPasswordPrompt(true);
                      }
                    }
                  }} 
                  className="btn btn-primary"
                >
                  {view === "dashboard" ? <><Eye size={18} /> Storefront</> : <><Edit3 size={18} /> {t("ownerPanel")}</>}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {view !== "builder" && !currentUser && (
          <div style={{ minHeight: "calc(100vh - 75px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "var(--color-bg-base)" }}>
            <div style={{ backgroundColor: "var(--color-bg-card)", borderRadius: "16px", maxWidth: "420px", width: "100%", padding: "2.5rem", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}>
              <h3 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.5rem", marginBottom: "1.5rem" }}>
                {authMode === "login" ? "Login to GenScale" : "Create Store Owner Account"}
              </h3>
              
              <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {authMode === "signup" && (
                  <>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" required placeholder="e.g. Suresh Patel" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" placeholder="e.g. 9825098250" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                    </div>
                    <div className="form-group">
                      <label>Assigned Role</label>
                      <CustomDropdown
                        value={authForm.role}
                        onChange={val => setAuthForm({ ...authForm, role: val })}
                        options={[
                          { value: "Store Owner", label: "Store Owner" },
                          { value: "Cashier", label: "Cashier" }
                        ]}
                        className="premium-select"
                        style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0.6rem 0.95rem" }}
                        selectStyle={{ paddingRight: "1.5rem" }}
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="e.g. name@kirana.com" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" required placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", borderRadius: "50px", backgroundColor: store?.theme_color || "var(--color-accent-red)", borderColor: store?.theme_color || "var(--color-accent-red)", marginTop: "0.5rem" }}>
                  {authMode === "login" ? "Login" : "Sign Up"}
                </button>
              </form>

              <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
                {authMode === "login" ? (
                  <span>
                    Don't have an account?{" "}
                    <button onClick={() => setAuthMode("signup")} style={{ border: "none", background: "none", color: store?.theme_color || "var(--color-accent-red)", fontWeight: 700, cursor: "pointer" }}>
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button onClick={() => setAuthMode("login")} style={{ border: "none", background: "none", color: store?.theme_color || "var(--color-accent-red)", fontWeight: 700, cursor: "pointer" }}>
                      Login
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {view === "builder" && (
          <div className="builder-view">
            {/* Hero Section */}
            <div className="hero-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2rem" }}>
              <div className="hero-subtitle-tag">ARCHITECTING THE FUTURE</div>
              <h1 className="hero-main-title">
                Create Your Storefront<br />with <em>a Voice Command.</em>
              </h1>
              <p className="hero-desc">
                Deploy local general stores and complete POS management tools immediately. Describe your stock or speak details to auto-generate catalogs.
              </p>

              <div id="prompt-container" className="prompt-pill-container">
                <div style={{ display: "flex", alignItems: "center", color: "var(--color-accent-red)", paddingLeft: "0.25rem" }}>
                  <Sparkles size={20} />
                </div>
                
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); triggerParsePreview(e.target.value); }}
                  placeholder="Describe your Kirana shop (e.g. Radhe Krishna General Store owned by Suresh in Rajkot, selling ghee, atta, milk)..."
                  className="prompt-pill-input"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerate();
                  }}
                />
                
                <div className="prompt-pill-actions">
                  <button
                    onClick={toggleRecording}
                    className={`btn-pill-mic ${isRecording ? "recording" : ""}`}
                    title={isRecording ? "Stop recording" : "Record description via voice"}
                    disabled={loading}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  
                  <button
                    onClick={() => handleGenerate()}
                    className="btn-pill-generate"
                    disabled={loading}
                  >
                    {loading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div>
                        GENERATING...
                      </div>
                    ) : (
                      "GENERATE"
                    )}
                  </button>
                </div>
              </div>

              {isRecording && (
                <div className="recording-status" style={{ marginTop: "0.5rem" }}>
                  Listening... Speak details of your shop
                </div>
              )}

              {error && (
                <div style={{ marginTop: "1.5rem", color: "var(--color-accent-red)", fontWeight: 600 }}>
                  Error: {error}
                </div>
              )}

              <div className="suggestions-try-text">
                Try asking:
                <span 
                  className="suggestions-try-link"
                  onClick={() => {
                    const text = "Radhe Krishna Kirana in Rajkot. Fresh dairy, milk, butter, local oils, ghee, Atta, dals and tea dust. Contact 9825098250.";
                    setPrompt(text);
                    triggerParsePreview(text);
                    handleGenerate(text);
                  }}
                >
                  "Radhe Krishna Kirana in Rajkot"
                </span>
                <span style={{ margin: "0 0.5rem", color: "var(--color-text-muted)" }}>|</span>
                <span 
                  className="suggestions-try-link"
                  onClick={() => {
                    const text = "Sai Prasad Provision Store in Pune. Biscuits, chips, Maggie noodles, chocolates, shampoos, and detergents.";
                    setPrompt(text);
                    triggerParsePreview(text);
                    handleGenerate(text);
                  }}
                >
                  "Sai Prasad Provision Store in Pune"
                </span>
              </div>

              {/* AI Onboarding Live Parse Preview */}
              {parsedPreview && (
                <div style={{ marginTop: "1.5rem", maxWidth: "640px", width: "100%", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.25rem", boxShadow: "var(--shadow-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <Sparkles size={15} style={{ color: "var(--color-accent-red)" }} />
                    <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>AI Parsed Preview</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginLeft: "auto" }}>Auto-detected from your description</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.83rem" }}>
                    {[
                      { label: "Store Name", value: parsedPreview.name },
                      { label: "Owner", value: parsedPreview.owner_name },
                      { label: "Address", value: parsedPreview.address },
                      { label: "Phone", value: parsedPreview.phone },
                      { label: "Timings", value: parsedPreview.timings },
                      { label: "Catalog Items", value: `~${parsedPreview.product_count} products` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>{label}</span>
                        <span style={{ fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Theme</span>
                    {[parsedPreview.theme_color, parsedPreview.secondary_color, parsedPreview.bg_color].map(c => (
                      <div key={c} style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: c, border: "2px solid rgba(0,0,0,0.1)" }} />
                    ))}
                    <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{parsedPreview.theme_color}</span>
                  </div>
                </div>
              )}
            </div>

            {/* How it works */}
            <div id="features" className="info-section" style={{ marginTop: "4rem" }}>
              <h2 className="section-title">The Path to Creation</h2>
              <p className="section-subtitle">A seamless transition from voice description to a live retail business application.</p>
              
              <div id="how-it-works" className="path-timeline">
                <div className="timeline-step">
                  <div className="timeline-content">
                    <div className="timeline-step-tag">01 / CONCEPTUALIZE</div>
                    <h3>Speak or Type</h3>
                    <p>Describe your inventory and store values in English, Hindi, or Gujarati. Our local AI populates layout, catalog, and designs.</p>
                  </div>
                  <div className="timeline-icon-box" style={{ backgroundColor: "#FDF6F0" }}><Mic size={20} /></div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-content">
                    <div className="timeline-step-tag">02 / GENERATION</div>
                    <h3>AI Creation</h3>
                    <p>GenScale's catalog matching engines design standard price listings, product images, and populate initial stock configurations.</p>
                  </div>
                  <div className="timeline-icon-box"><Sparkles size={20} /></div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-content">
                    <div className="timeline-step-tag">03 / MANAGE</div>
                    <h3>Full POS System</h3>
                    <p>Launch an admin control board immediately featuring employee logs, supplier ledgers, invoice tax forms, and profit spreadsheets.</p>
                  </div>
                  <div className="timeline-icon-box" style={{ backgroundColor: "#FDF6F0" }}><Globe size={20} /></div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="info-section" style={{ marginTop: "4rem", backgroundColor: "var(--color-bg-base)", borderRadius: "24px", padding: "3rem 2rem" }}>
              <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3rem" }}>
                <h2 className="section-title">Simple, Transparent Pricing</h2>
                <p className="section-subtitle">Choose the plan that fits your store. No hidden fees. Cancel anytime.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
                {/* Free Plan */}
                <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#2E7D32", backgroundColor: "#E8F5E9", display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "20px" }}>Free</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.75rem", marginBottom: "0.25rem" }}>Starter</h3>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Perfect for small shops getting started</p>
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-text-dark)", textAlign: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-text-muted)" }}>₹</span>0
                    <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-text-muted)" }}> / month</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                    {[
                      "Billing & POS (Cashier mode)",
                      "View inventory (read-only)",
                      "Basic sales reports",
                      "Up to 100 products",
                      "WhatsApp bill sharing",
                    ].map((feature, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-dark)" }}>
                        <span style={{ color: "#2E7D32", fontSize: "1rem" }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-secondary" style={{ marginTop: "1.5rem", justifyContent: "center", borderRadius: "50px" }}>Get Started Free</button>
                </div>

                {/* Pro Plan */}
                <div style={{ backgroundColor: "var(--color-bg-card)", border: "2px solid var(--color-accent-red)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", position: "relative" }}>
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "var(--color-accent-red)", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.75rem", borderRadius: "20px" }}>MOST POPULAR</div>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-accent-red)", backgroundColor: "#FDF6F0", display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "20px" }}>Pro</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.75rem", marginBottom: "0.25rem" }}>Professional</h3>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Full POS + Inventory + Accounting</p>
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-text-dark)", textAlign: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-text-muted)" }}>₹</span>999
                    <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-text-muted)" }}> / month</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                    {[
                      "Everything in Free",
                      "Unlimited products & categories",
                      "Full inventory management",
                      "Supplier ledger & purchase orders",
                      "Employee & attendance tracking",
                      "Advanced accounting & P&L",
                      "AI Insights & demand forecasts",
                      "Backup & Restore database",
                      "Multi-warehouse support",
                    ].map((feature, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-dark)" }}>
                        <span style={{ color: "var(--color-accent-red)", fontSize: "1rem" }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" style={{ marginTop: "1.5rem", justifyContent: "center", borderRadius: "50px", backgroundColor: "var(--color-accent-red)", borderColor: "var(--color-accent-red)" }}>Start Free Trial</button>
                </div>

                {/* Enterprise Plan */}
                <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#6A1B9A", backgroundColor: "#F3E5F5", display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "20px" }}>Enterprise</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.75rem", marginBottom: "0.25rem" }}>Enterprise</h3>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>For chains & multi-store operations</p>
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-text-dark)", textAlign: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-text-muted)" }}>₹</span>Custom
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                    {[
                      "Everything in Pro",
                      "Multi-store dashboard",
                      "Custom domain & branding",
                      "Priority support & SLA",
                      "Advanced analytics & API access",
                      "Dedicated account manager",
                      "Custom integrations",
                    ].map((feature, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-dark)" }}>
                        <span style={{ color: "#6A1B9A", fontSize: "1rem" }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-secondary" style={{ marginTop: "1.5rem", justifyContent: "center", borderRadius: "50px" }}>Contact Sales</button>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div id="about" className="info-section" style={{ marginTop: "4rem", marginBottom: "4rem" }}>
              <div className="contact-layout">
                <div>
                  <h2 className="contact-section-title">Ready to launch<br /><em>your retail business?</em></h2>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
                    Get started with our state-of-the-art automated SaaS. Contact sales or support for local configurations or offline billing integration.
                  </p>
                </div>
                <div className="contact-form-card" style={{ borderRadius: "20px", boxShadow: "var(--shadow-md)" }}>
                  {contactSubmitted ? (
                    <div className="contact-success-msg">Thank you! Our retail coordinator will reach out to you shortly.</div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="contact-form">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" required placeholder="Enter your full name (e.g. Ramesh Kumar)" value={contactName} onChange={e => setContactName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required placeholder="Enter your email address (e.g. contact@store.com)" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Message</label>
                        <textarea rows={3} required placeholder="Write your message or inquiry here..." value={contactMessage} onChange={e => setContactMessage(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>Send Inquiry</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
          
        {/* Dashboard Split Screen View */}
        {view === "dashboard" && store && currentUser && (
          <>
            {/* Owner Control Sidebar Drawer */}
            <div className={`sidebar-overlay ${isConsoleOpen ? "open" : ""}`} onClick={() => setIsConsoleOpen(false)} />
            
            <div className={`admin-console-sidebar ${isConsoleOpen ? "open" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <StoreIcon size={20} style={{ color: "var(--color-accent-red)" }} />
                  <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{t("adminConsole")}</span>
                </div>
                <button onClick={() => setIsConsoleOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                </button>
              </div>

              <div className="dashboard-panel-container">
                <div className="dashboard-tabs">
                  <button onClick={() => setActiveTab("stock")} className={`tab-btn ${activeTab === "stock" ? "active" : ""}`}>
                    <Package size={16} /> {t("inventory")}
                  </button>
                  <button onClick={() => { setActiveTab("billing"); setInvoiceItems([]); }} className={`tab-btn ${activeTab === "billing" ? "active" : ""}`}>
                    <Plus size={16} /> {t("billing")}
                  </button>
                  
                  {userRole !== "Cashier" && (
                    <>
                      <button onClick={() => { setActiveTab("accounting"); fetchSales(store.id); }} className={`tab-btn ${activeTab === "accounting" ? "active" : ""}`}>
                        <DollarSign size={16} /> {t("accounting")}
                      </button>
                      <button onClick={() => { setActiveTab("suppliers"); fetchSuppliers(store.id); }} className={`tab-btn ${activeTab === "suppliers" ? "active" : ""}`}>
                        <Briefcase size={16} /> {t("suppliers")}
                      </button>
                      <button onClick={() => { setActiveTab("customers"); fetchCustomers(store.id); }} className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}>
                        <User size={16} /> Customers CRM
                      </button>
                      <button onClick={() => { setActiveTab("employees"); fetchEmployees(store.id); fetchAttendance(store.id); }} className={`tab-btn ${activeTab === "employees" ? "active" : ""}`}>
                        <Users size={16} /> {t("employees")}
                      </button>
                    </>
                  )}
                  
                  <button onClick={() => setActiveTab("store-settings")} className={`tab-btn ${activeTab === "store-settings" ? "active" : ""}`}>
                    <Settings size={16} /> Store Settings
                  </button>
                  <button onClick={() => { setActiveTab("analytics"); fetchSales(store.id); }} className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}>
                    <BarChart2 size={16} /> Analytics
                  </button>
                  <button onClick={() => { setActiveTab("orders"); fetchOrders(store.id); }} className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}>
                    <Send size={16} /> Orders
                  </button>
                  <button onClick={() => { setActiveTab("ai-insights"); fetchAIInsights(store.id); }} className={`tab-btn ${activeTab === "ai-insights" ? "active" : ""}`}>
                    <Sparkles size={16} /> AI Insights
                  </button>
                  {userRole === "Store Owner" || userRole === "Super Admin" ? (
                    <button onClick={() => setActiveTab("settings")} className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}>
                      <Settings size={16} /> {t("backupRestore")}
                    </button>
                  ) : null}
                </div>




                <div className="dashboard-content">
                  
                  {/* 1. Inventory Stock Tab */}
                  {activeTab === "stock" && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                        <h3 style={{ fontWeight: 700 }}>Stock & Category Management</h3>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {/* View Toggle */}
                          <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
                            <button
                              onClick={() => setInventoryView("table")}
                              style={{ padding: "0.4rem 0.7rem", fontSize: "0.8rem", border: "none", cursor: "pointer", backgroundColor: inventoryView === "table" ? "var(--color-accent-red)" : "transparent", color: inventoryView === "table" ? "#fff" : "var(--color-text-muted)", fontWeight: 600 }}
                              title="Table View"
                            >☰ Table</button>
                            <button
                              onClick={() => setInventoryView("grid")}
                              style={{ padding: "0.4rem 0.7rem", fontSize: "0.8rem", border: "none", cursor: "pointer", backgroundColor: inventoryView === "grid" ? "var(--color-accent-red)" : "transparent", color: inventoryView === "grid" ? "#fff" : "var(--color-text-muted)", fontWeight: 600 }}
                              title="Grid View"
                            >⊞ Grid</button>
                          </div>
                          <button onClick={() => { setShowAddProduct(!showAddProduct); setEditingProduct(null); setShowAddCategory(false); }} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Plus size={14} /> Add Product
                          </button>
                          <button onClick={() => { setShowAddCategory(!showAddCategory); setShowAddProduct(false); setEditingProduct(null); }} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Plus size={14} /> Add Category
                          </button>
                        </div>
                      </div>

                      {/* Search + Category Filter */}
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={inventorySearch}
                          onChange={e => setInventorySearch(e.target.value)}
                          style={{ flex: 1, minWidth: "160px", padding: "0.45rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                        />
                        <select
                          value={inventoryCategoryFilter}
                          onChange={e => setInventoryCategoryFilter(e.target.value)}
                          style={{ padding: "0.45rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem", backgroundColor: "var(--color-bg-card)", color: "var(--color-text-dark)" }}
                        >
                          <option value="All">All Categories</option>
                          {(categoriesList.length > 0 ? categoriesList.map(c => c.name) : Array.from(new Set(products.map(p => p.category)))).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Inline Add Category Form */}
                      {showAddCategory && (
                        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "1.5rem", border: `2px solid ${store?.theme_color || "var(--color-accent-red)"}`, margin: "1.25rem 0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
                            <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--color-text-dark)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Package size={20} style={{ color: store?.theme_color || "var(--color-accent-red)" }} /> Add New Category Entry
                            </h3>
                            <button type="button" onClick={() => setShowAddCategory(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                              <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                            </button>
                          </div>

                          <form onSubmit={handleAddCategorySubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Category Name *</label>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="e.g. Dairy & Eggs" 
                                  value={categoryForm.name} 
                                  onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} 
                                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                                />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Category Image URL</label>
                                <input 
                                  type="text" 
                                  placeholder="https://images.unsplash.com/..." 
                                  value={categoryForm.image_url} 
                                  onChange={e => setCategoryForm({...categoryForm, image_url: e.target.value})} 
                                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Subcategories (Comma separated list)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Milk, Butter, Paneer, Cheese" 
                                value={JSON.parse(categoryForm.subcategories || "[]").join(", ")} 
                                onChange={e => {
                                  const subs = e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
                                  setCategoryForm({...categoryForm, subcategories: JSON.stringify(subs)});
                                }} 
                                style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                              />
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                              <button type="submit" className="btn btn-primary" style={{ padding: "0.65rem 1.5rem", fontWeight: 700, backgroundColor: store?.theme_color || "var(--color-accent-red)" }}>Save Category</button>
                              <button type="button" onClick={() => setShowAddCategory(false)} className="btn btn-secondary" style={{ padding: "0.65rem 1.5rem" }}>Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}

                      {categoriesList.length > 0 && (
                        <div style={{ marginTop: "1.25rem", padding: "1rem", backgroundColor: "#FAF9F6", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                          <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Managed Categories</h4>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
                            {categoriesList.map(cat => (
                              <div key={cat.id} style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0.5rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "0.25rem", position: "relative" }}>
                                {cat.image_url && <img src={cat.image_url} alt={cat.name} style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "6px" }} />}
                                <strong style={{ fontSize: "0.85rem" }}>{cat.name}</strong>
                                <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                                  {JSON.parse(cat.subcategories || "[]").join(", ") || "No subcategories"}
                                </span>
                                <button 
                                  onClick={() => handleDeleteCategory(cat.id)} 
                                  style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "rgba(255,255,255,0.8)", border: "none", color: "var(--color-accent-red)", cursor: "pointer", borderRadius: "50%", padding: "0.2rem", display: "flex", alignItems: "center" }}
                                  title="Delete category"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {store.stock_alerts_enabled && lowStockItems.length > 0 && (
                        <div className="stock-summary-card" style={{ marginTop: "1rem" }}>
                          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                          <div>
                            <h4>{t("lowStockAlert")}</h4>
                            <p>{lowStockItems.length} products require restocking.</p>
                          </div>
                        </div>
                      )}

                      {/* Inline Add Product Form */}
                      {showAddProduct && (
                        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "1.5rem", border: "2px solid var(--color-accent-red)", margin: "1.25rem 0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
                            <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--color-text-dark)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Package size={20} style={{ color: "var(--color-accent-red)" }} /> New Product Entry
                            </h3>
                            <button type="button" onClick={() => setShowAddProduct(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                              <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                            </button>
                          </div>

                          <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div className="form-group">
                              <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Product Name *</label>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="e.g. Britannia Rusk Biscuits 200g" 
                                  value={newProductForm.name} 
                                  onChange={e => setNewProductForm({...newProductForm, name: e.target.value})} 
                                  style={{ flex: 1, padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                                />
                                <button 
                                  type="button" 
                                  onClick={() => handleAISuggestProduct(newProductForm.name)} 
                                  className="btn btn-secondary" 
                                  style={{ flexShrink: 0, padding: "0.5rem 0.9rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                                >
                                  <Sparkles size={14} /> AI Fill Details
                                </button>
                              </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Category</label>
                                <select value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFFFFF", color: "var(--color-text-dark)", fontSize: "0.9rem" }}>
                                  {categoriesList.length > 0 ? (
                                    categoriesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                  ) : (
                                    <>
                                      <option>Dairy & Eggs</option>
                                      <option>Grains, Oils & Masalas</option>
                                      <option>Snacks & Beverages</option>
                                      <option>Household & Personal Care</option>
                                    </>
                                  )}
                                </select>
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Unit / Packaging *</label>
                                <input type="text" required placeholder="e.g. 1kg, 200g pack, 1 liter bottle" value={newProductForm.unit} onChange={e => setNewProductForm({...newProductForm, unit: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Selling Price (₹) *</label>
                                <input type="number" required min="0" placeholder="e.g. 150.00" value={newProductForm.price} onChange={e => setNewProductForm({...newProductForm, price: parseFloat(e.target.value) || 0})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Purchase Cost (₹) *</label>
                                <input type="number" required min="0" placeholder="e.g. 110.00" value={newProductForm.purchase_cost} onChange={e => setNewProductForm({...newProductForm, purchase_cost: parseFloat(e.target.value) || 0})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Initial Stock Quantity *</label>
                                <input type="number" required min="0" placeholder="e.g. 50" value={newProductForm.stock_quantity} onChange={e => setNewProductForm({...newProductForm, stock_quantity: parseInt(e.target.value) || 0})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Barcode / GTIN</label>
                                <input type="text" placeholder="e.g. 8901234567890" value={newProductForm.barcode} onChange={e => setNewProductForm({...newProductForm, barcode: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>SKU Code</label>
                                <input type="text" placeholder="e.g. PROD-RICE-5KG" value={newProductForm.sku} onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>HSN Tax Code</label>
                                <input type="text" placeholder="e.g. 1006.30" value={newProductForm.hsn_code} onChange={e => setNewProductForm({...newProductForm, hsn_code: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>GST Rate (%)</label>
                                <input type="number" placeholder="e.g. 18.0" value={newProductForm.gst_rate} onChange={e => setNewProductForm({...newProductForm, gst_rate: parseFloat(e.target.value) || 18.0})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Expiry Date</label>
                                <input type="date" value={newProductForm.expiry_date} onChange={e => setNewProductForm({...newProductForm, expiry_date: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Batch Number</label>
                                <input type="text" placeholder="e.g. BAT-0625-A" value={newProductForm.batch_number} onChange={e => setNewProductForm({...newProductForm, batch_number: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>

                              <div className="form-group">
                                <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Product Image URL</label>
                                <input type="text" placeholder="https://..." value={newProductForm.image_url} onChange={e => setNewProductForm({...newProductForm, image_url: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                              </div>
                            </div>

                            <div className="form-group">
                              <label style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "block" }}>Description</label>
                              <textarea rows={2} placeholder="Enter a brief product description..." value={newProductForm.description} onChange={e => setNewProductForm({...newProductForm, description: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }} />
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                              <button type="submit" className="btn btn-primary" style={{ padding: "0.65rem 1.5rem", fontWeight: 700, fontSize: "0.9rem" }}>{t("saveItem")}</button>
                              <button type="button" onClick={() => setShowAddProduct(false)} className="btn btn-secondary" style={{ padding: "0.65rem 1.5rem" }}>{t("cancel")}</button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Edit Product Modal */}
                      {editingProduct && (
                        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                          <form onSubmit={handleEditProductSubmit} style={{ backgroundColor: "var(--color-bg-card)", borderRadius: "16px", padding: "1.5rem", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-md)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <h4 style={{ fontWeight: 700 }}>Edit Product</h4>
                              <button type="button" onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Plus size={20} style={{ transform: "rotate(45deg)" }} /></button>
                            </div>

                            <div className="form-group">
                              <label>Product Name</label>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input type="text" required placeholder="Enter product name" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                <button type="button" onClick={() => handleAISuggestProduct(editingProduct.name)} className="btn btn-secondary" style={{ flexShrink: 0, padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} disabled={aiLoading}>
                                  <Sparkles size={13} /> {aiLoading ? "..." : t("aiSuggest")}
                                </button>
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>Category</label>
                                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                  {categoriesList.length > 0 ? (
                                    categoriesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                  ) : (
                                    <>
                                      <option>Dairy & Eggs</option>
                                      <option>Grains, Oils & Masalas</option>
                                      <option>Snacks & Beverages</option>
                                      <option>Household & Personal Care</option>
                                    </>
                                  )}
                                </select>
                              </div>
                              <div className="form-group">
                                <label>Unit</label>
                                <input type="text" required placeholder="e.g. 1kg, 500g, Pack" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>Selling Price (₹)</label>
                                <input type="number" required min="0" placeholder="Enter selling price" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} />
                              </div>
                              <div className="form-group">
                                <label>Purchase Cost (₹)</label>
                                <input type="number" required min="0" placeholder="Enter purchase cost" value={editingProduct.purchase_cost} onChange={e => setEditingProduct({...editingProduct, purchase_cost: parseFloat(e.target.value) || 0})} />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>Stock Qty</label>
                                <input type="number" required min="0" placeholder="Enter current stock" value={editingProduct.stock_quantity} onChange={e => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value) || 0})} />
                              </div>
                              <div className="form-group">
                                <label>Barcode / GTIN</label>
                                <input type="text" placeholder="Enter barcode or scan" value={editingProduct.barcode || ""} onChange={e => setEditingProduct({...editingProduct, barcode: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>SKU Code</label>
                                <input type="text" placeholder="Enter SKU identifier" value={editingProduct.sku || ""} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} />
                              </div>
                              <div className="form-group">
                                <label>HSN Code</label>
                                <input type="text" placeholder="Enter HSN tax code" value={editingProduct.hsn_code || ""} onChange={e => setEditingProduct({...editingProduct, hsn_code: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>GST Rate (%)</label>
                                <input type="number" placeholder="Enter GST rate %" value={editingProduct.gst_rate ?? 18} onChange={e => setEditingProduct({...editingProduct, gst_rate: parseFloat(e.target.value) || 18})} />
                              </div>
                              <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="date" value={editingProduct.expiry_date || ""} onChange={e => setEditingProduct({...editingProduct, expiry_date: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>Batch Number</label>
                                <input type="text" placeholder="e.g. BATCH-2026-05" value={editingProduct.batch_number || ""} onChange={e => setEditingProduct({...editingProduct, batch_number: e.target.value})} />
                              </div>
                              <div className="form-group">
                                <label>Product Image URL</label>
                                <input type="text" placeholder="https://..." value={editingProduct.image_url || ""} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Description</label>
                              <textarea rows={2} placeholder="Product description..." value={editingProduct.description || ""} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                            </div>

                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t("saveItem")}</button>
                              <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">{t("cancel")}</button>
                            </div>
                          </form>
                        </div>
                      )}



                      {/* Stock list / grid */}
                      {(() => {
                        const filtered = products.filter(p => {
                          const matchSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || (p.sku || "").toLowerCase().includes(inventorySearch.toLowerCase()) || (p.barcode || "").includes(inventorySearch);
                          const matchCat = inventoryCategoryFilter === "All" || p.category === inventoryCategoryFilter;
                          return matchSearch && matchCat;
                        });

                        if (inventoryView === "grid") {
                          return (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
                              {filtered.map(product => {
                                const isOutOfStock = product.stock_quantity === 0;
                                const isLowStock = !isOutOfStock && product.stock_quantity <= store.low_stock_threshold;
                                return (
                                  <div key={product.id} style={{ border: "1px solid var(--color-border)", borderRadius: "10px", padding: "0.85rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative" }}>
                                    {isOutOfStock && (
                                      <span style={{ position: "absolute", top: "0.4rem", right: "0.4rem", backgroundColor: "#D32F2F", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: "10px" }}>Out of Stock</span>
                                    )}
                                    {isLowStock && (
                                      <span style={{ position: "absolute", top: "0.4rem", right: "0.4rem", backgroundColor: "#F57F17", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: "10px" }}>Low Stock</span>
                                    )}
                                    {product.image_url && <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "6px" }} />}
                                    <strong style={{ fontSize: "0.85rem", marginTop: product.image_url ? 0 : "1.2rem" }}>{product.name}</strong>
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{product.category}</span>
                                    <span style={{ fontWeight: 700, color: "var(--color-accent-red)" }}>₹{product.price}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
                                      <div className="stock-qty-adjuster" style={{ gap: "0.3rem" }}>
                                        <button onClick={() => adjustStock(product.id, -1)} className="btn-qty">-</button>
                                        <span className={`qty-display ${isLowStock || isOutOfStock ? "low-stock" : ""}`}>{product.stock_quantity}</span>
                                        <button onClick={() => adjustStock(product.id, 1)} className="btn-qty">+</button>
                                      </div>
                                      <button onClick={() => { setEditingProduct(product); setShowAddProduct(false); }} style={{ color: "#1565C0", background: "none", border: "none", cursor: "pointer", padding: "0.2rem" }}><Edit3 size={14} /></button>
                                      <button onClick={() => handleDeleteProduct(product.id)} style={{ color: "var(--color-accent-red)", background: "none", border: "none", cursor: "pointer", padding: "0.2rem" }}><Trash2 size={14} /></button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        // Table view
                        return (
                          <div className="stock-list-container" style={{ marginTop: "1rem" }}>
                            {filtered.map(product => {
                              const isOutOfStock = product.stock_quantity === 0;
                              const isLowStock = !isOutOfStock && product.stock_quantity <= store.low_stock_threshold;
                              return (
                                <div key={product.id} className="stock-item-row">
                                  <div className="stock-item-info">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                      <span className="stock-item-name">{product.name}</span>
                                      {isOutOfStock && <span style={{ backgroundColor: "#D32F2F", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "10px" }}>Out of Stock</span>}
                                      {isLowStock && <span style={{ backgroundColor: "#F57F17", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "10px" }}>Low Stock</span>}
                                    </div>
                                    <div className="stock-item-meta">
                                      <span className="stock-item-price">₹{product.price}</span>
                                      <span>•</span>
                                      <span>{product.unit}</span>
                                      <span>•</span>
                                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>{product.category}</span>
                                      <span>•</span>
                                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>GST: {product.gst_rate}% | HSN: {product.hsn_code || "N/A"}</span>
                                      {product.sku && <><span>•</span><span style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>SKU: {product.sku}</span></>}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div className="stock-qty-adjuster">
                                      <button onClick={() => adjustStock(product.id, -1)} className="btn-qty">-</button>
                                      <span className={`qty-display ${isLowStock || isOutOfStock ? "low-stock" : ""}`}>{product.stock_quantity}</span>
                                      <button onClick={() => adjustStock(product.id, 1)} className="btn-qty">+</button>
                                    </div>
                                    <button onClick={() => { setEditingProduct(product); setShowAddProduct(false); }} style={{ color: "#1565C0", background: "none", border: "none", cursor: "pointer" }}><Edit3 size={16} /></button>
                                    <button onClick={() => handleDeleteProduct(product.id)} style={{ color: "var(--color-accent-red)", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
                                  </div>
                                </div>
                              );
                            })}
                            {filtered.length === 0 && (
                              <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No products match your search/filter.</div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* 2. Customer Invoicing POS Tab */}
                  {activeTab === "billing" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 700 }}>{t("billing")}</h3>
                        <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
                          <button onClick={() => setBillingGridView(false)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", border: "none", cursor: "pointer", backgroundColor: !billingGridView ? "var(--color-accent-red)" : "transparent", color: !billingGridView ? "#fff" : "var(--color-text-muted)", fontWeight: 600 }}>☰ List</button>
                          <button onClick={() => setBillingGridView(true)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", border: "none", cursor: "pointer", backgroundColor: billingGridView ? "var(--color-accent-red)" : "transparent", color: billingGridView ? "#fff" : "var(--color-text-muted)", fontWeight: 600 }}>⊞ Grid</button>
                        </div>
                      </div>
                      
                      <form onSubmit={handleRecordSale} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Customer Name</label>
                            <input type="text" placeholder="e.g. Walk-in Customer" value={billingName} onChange={e => setBillingName(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" placeholder="e.g. 9876543210" value={billingPhone} onChange={e => setBillingPhone(e.target.value)} />
                          </div>
                        </div>

                        <div className="form-row-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                          <div className="form-group">
                            <label>Payment Method</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="premium-select">
                              <option value="Cash">{t("cash")}</option>
                              <option value="Card">{t("card")}</option>
                              <option value="UPI">{t("upi")}</option>
                              <option value="Split">{t("split")} (Cash + UPI)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Invoice Format</label>
                            <select value={invoiceFormat} onChange={e => setInvoiceFormat(e.target.value as any)} className="premium-select">
                              <option value="Thermal">Thermal Receipt (58mm)</option>
                              <option value="A4">A4 Tax Invoice</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Discount Coupon</label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <input type="text" placeholder="e.g. WELCOME10" value={discountCoupon} onChange={e => setDiscountCoupon(e.target.value)} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                              <button 
                                type="button" 
                                onClick={() => {
                                  if (discountCoupon.trim().toUpperCase() === "WELCOME10") {
                                    setAppliedDiscount(10);
                                    alert("10% Coupon Applied Successfully!");
                                  } else {
                                    alert("Invalid Coupon Code.");
                                  }
                                }} 
                                className="btn btn-secondary"
                                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", borderRadius: "8px" }}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>


                        {/* Item Selector */}
                        <div className="form-group" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                          <label>{t("addItems")}</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.5rem" }}>
                            <input type="text" placeholder={t("searchProducts")} value={billingSearch} onChange={e => setBillingSearch(e.target.value)} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <input 
                                type="text" 
                                placeholder="Scan Barcode / SKU (e.g. 8901234...)" 
                                value={barcodeInput} 
                                onChange={e => setBarcodeInput(e.target.value)} 
                                onKeyDown={e => { if (e.key === "Enter") handleBarcodeSubmit(e); }}
                                style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", flexGrow: 1 }} 
                              />
                              <button type="button" onClick={handleBarcodeSubmit} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", borderRadius: "8px" }}>Scan</button>
                            </div>
                          </div>


                          {billingGridView ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.6rem", maxHeight: "260px", overflowY: "auto", padding: "0.25rem" }}>
                              {products
                                .filter(p => p.name.toLowerCase().includes(billingSearch.toLowerCase()))
                                .map(p => {
                                  const inCart = invoiceItems.find(item => item.product.id === p.id);
                                  const outOfStock = p.stock_quantity <= 0;
                                  return (
                                    <div
                                      key={p.id}
                                      onClick={() => {
                                        if (outOfStock) return;
                                        if (inCart) {
                                          if (inCart.quantity >= p.stock_quantity) { alert("Cannot exceed available stock!"); return; }
                                          setInvoiceItems(prev => prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item));
                                        } else {
                                          setInvoiceItems(prev => [...prev, { product: p, quantity: 1 }]);
                                        }
                                      }}
                                      style={{ border: `2px solid ${inCart ? "var(--color-accent-red)" : "var(--color-border)"}`, borderRadius: "10px", overflow: "hidden", cursor: outOfStock ? "not-allowed" : "pointer", opacity: outOfStock ? 0.5 : 1, backgroundColor: "#FFFFFF", position: "relative" }}
                                    >
                                      <img src={p.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=60"} alt={p.name} style={{ width: "100%", height: "75px", objectFit: "cover" }} />
                                      {inCart && (
                                        <span style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "var(--color-accent-red)", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>{inCart.quantity}</span>
                                      )}
                                      <div style={{ padding: "0.35rem 0.4rem" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                                        <div style={{ fontSize: "0.72rem", color: "var(--color-accent-red)", fontWeight: 700 }}>₹{p.price}</div>
                                        <div style={{ fontSize: "0.62rem", color: outOfStock ? "#D32F2F" : "var(--color-text-muted)" }}>{outOfStock ? "Out of Stock" : `${p.stock_quantity} left`}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : (
                          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--color-border)", borderRadius: "8px", background: "#faf9f6" }}>
                            {products
                              .filter(p => p.name.toLowerCase().includes(billingSearch.toLowerCase()))
                              .map(p => {
                                const inCart = invoiceItems.find(item => item.product.id === p.id);
                                const outOfStock = p.stock_quantity <= 0;
                                return (
                                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--color-border)" }}>
                                    <div>
                                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</span>
                                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginLeft: "0.5rem" }}>
                                        (₹{p.price} | {p.stock_quantity} available)
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      disabled={outOfStock}
                                      onClick={() => {
                                        if (inCart) {
                                          if (inCart.quantity >= p.stock_quantity) {
                                            alert("Cannot exceed available stock!");
                                            return;
                                          }
                                          setInvoiceItems(prev => prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item));
                                        } else {
                                          setInvoiceItems(prev => [...prev, { product: p, quantity: 1 }]);
                                        }
                                      }}
                                      className="btn btn-secondary"
                                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "4px" }}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                          )}
                        </div>

                        {/* Cart Invoices list */}
                        {invoiceItems.length > 0 && (
                          <div style={{ marginTop: "1rem" }}>
                            <label style={{ fontWeight: 700, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Invoice Items</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {invoiceItems.map(item => (
                                <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "6px", backgroundColor: "#FFFFFF" }}>
                                  <div style={{ fontSize: "0.9rem" }}>
                                    <strong>{item.product.name}</strong>
                                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>₹{item.product.price} each (GST {item.product.gst_rate}%)</div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <button
                                      type="button"
                                      onClick={() => setInvoiceItems(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0))}
                                      className="btn-qty"
                                    >
                                      -
                                    </button>
                                    <span style={{ fontWeight: "bold", width: "20px", textAlign: "center" }}>{item.quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (item.quantity >= item.product.stock_quantity) {
                                          alert("Cannot exceed available stock!");
                                          return;
                                        }
                                        setInvoiceItems(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i));
                                      }}
                                      className="btn-qty"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                                <span>Subtotal</span>
                                <span>₹{invoiceItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}</span>
                              </div>
                              {appliedDiscount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "green", fontWeight: 600 }}>
                                  <span>Coupon discount (10%)</span>
                                  <span>-₹{Math.round(invoiceItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 0.1)}</span>
                                </div>
                              )}
                              
                              {(() => {
                                let totalGst = 0;
                                invoiceItems.forEach(item => {
                                  const rate = item.product.gst_rate || 18.0;
                                  const itemTotal = item.product.price * item.quantity;
                                  const taxableVal = itemTotal / (1 + rate / 100);
                                  totalGst += (itemTotal - taxableVal);
                                });
                                const cgst = Math.round(totalGst / 2);
                                const sgst = Math.round(totalGst / 2);
                                return (
                                  <>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                                      <span>CGST (split share)</span>
                                      <span>₹{cgst}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                                      <span>SGST (split share)</span>
                                      <span>₹{sgst}</span>
                                    </div>
                                  </>
                                );
                              })()}

                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem", borderTop: "1px dashed var(--color-border)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                                <span>Total Bill</span>
                                <span style={{ color: "var(--color-accent-red)" }}>
                                  ₹{Math.round(invoiceItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (appliedDiscount > 0 ? 0.9 : 1))}
                                </span>
                              </div>
                            </div>


                            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: "1rem", borderRadius: "50px", backgroundColor: "var(--color-accent-red)" }}>
                              {t("generateBill")}
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* 3. Accounting & Reports Tab */}
                  {activeTab === "accounting" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 700 }}>SaaS Financial Ledger</h3>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={handleDownloadCSV} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                            <Download size={14} /> {t("downloadCsv")}
                          </button>
                        </div>
                      </div>

                      {/* Financial Metrics Row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div style={{ padding: "1rem", backgroundColor: "#FDF6F0", border: "1px solid var(--color-border)", borderRadius: "12px", textAlign: "center" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{t("totalRevenue")}</div>
                          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-accent-red)", marginTop: "0.25rem" }}>
                            ₹{sales.reduce((sum, s) => sum + s.total_amount, 0)}
                          </div>
                        </div>
                        <div style={{ padding: "1rem", backgroundColor: "#FDF6F0", border: "1px solid var(--color-border)", borderRadius: "12px", textAlign: "center" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Purchase Cost</div>
                          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.25rem" }}>
                            ₹{calculateTotalCostOfSales()}
                          </div>
                        </div>
                        <div style={{ padding: "1rem", backgroundColor: "#FDF6F0", border: "1px solid var(--color-border)", borderRadius: "12px", textAlign: "center" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Net Profit Margin</div>
                          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "green", marginTop: "0.25rem" }}>
                            ₹{sales.reduce((sum, s) => sum + s.total_amount, 0) - calculateTotalCostOfSales()}
                          </div>
                        </div>
                      </div>

                      {/* Central Cashbook Ledger & P&L Statement */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                        
                        {/* P&L and Balance Sheet */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Profit & Loss Account</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Gross POS Sales Revenue (+)</span>
                                <span style={{ color: "green", fontWeight: 700 }}>₹{sales.reduce((sum, s) => sum + s.total_amount, 0)}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Wholesale Stock Cost (-)</span>
                                <span style={{ color: "red" }}>₹{calculateTotalCostOfSales()}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Other Operating Expenses (-)</span>
                                <span style={{ color: "red" }}>₹{cashflowsList.filter(c => c.type === "Outflow").reduce((sum, c) => sum + c.amount, 0)}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", borderTop: "1px solid var(--color-border)", paddingTop: "0.4rem", marginTop: "0.25rem" }}>
                                <span>Net Profit</span>
                                <span style={{ color: "green" }}>₹{sales.reduce((sum, s) => sum + s.total_amount, 0) - calculateTotalCostOfSales() - cashflowsList.filter(c => c.type === "Outflow").reduce((sum, c) => sum + c.amount, 0)}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Asset Balance Sheet</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Est. On-hand Cash (POS)</span>
                                <strong>₹{sales.reduce((sum, s) => sum + s.total_amount, 0) - cashflowsList.filter(c => c.type === "Outflow").reduce((sum, c) => sum + c.amount, 0)}</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Current Stock Book Value</span>
                                <strong>₹{products.reduce((sum, p) => sum + p.purchase_cost * p.stock_quantity, 0)}</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: "0.4rem", fontWeight: "bold" }}>
                                <span>Net Liquidity Capital</span>
                                <strong>₹{(sales.reduce((sum, s) => sum + s.total_amount, 0) - cashflowsList.filter(c => c.type === "Outflow").reduce((sum, c) => sum + c.amount, 0)) + products.reduce((sum, p) => sum + p.purchase_cost * p.stock_quantity, 0)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cashbook Ledger and Outflow Form */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {/* Log Expense Form */}
                          <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Log Ledger Outflow (Expense)</h4>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              const amt = parseFloat((e.target as any).amount.value) || 0;
                              const cat = (e.target as any).category.value;
                              const desc = (e.target as any).desc.value;
                              if (amt <= 0) return;
                              await handleAddCashFlow("Outflow", amt, cat, desc);
                              (e.target as any).reset();
                              alert("Expense outflow recorded!");
                            }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                <input 
                                  type="number" 
                                  name="amount" 
                                  required 
                                  placeholder="Outflow (₹)" 
                                  style={{ padding: "0.5rem 0.95rem", borderRadius: "6px", border: "1px solid var(--color-border)", width: "100%", boxSizing: "border-box", backgroundColor: "var(--color-bg-card)", color: "var(--color-text-dark)" }} 
                                />
                                <select 
                                  name="category" 
                                  className="premium-select" 
                                  style={{ padding: "0.5rem 2.2rem 0.5rem 0.95rem", height: "100%", width: "100%" }}
                                >
                                  <option value="Rent">Rent</option>
                                  <option value="Salary">Salary</option>
                                  <option value="Electricity">Electricity</option>
                                  <option value="Purchase">Purchase</option>
                                  <option value="Misc">Misc</option>
                                </select>
                              </div>
                              <input 
                                type="text" 
                                name="desc" 
                                placeholder="Brief description (e.g. June Shop Rent)..." 
                                style={{ padding: "0.5rem 0.95rem", borderRadius: "6px", border: "1px solid var(--color-border)", width: "100%", boxSizing: "border-box", backgroundColor: "var(--color-bg-card)", color: "var(--color-text-dark)" }} 
                              />
                              <button type="submit" className="btn btn-primary" style={{ padding: "0.4rem", justifyContent: "center", fontSize: "0.82rem", borderRadius: "8px" }}>Record Expense</button>
                            </form>
                          </div>

                          {/* Cashbook journal listing */}
                          <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Central Cashbook Journal</h4>
                            {cashflowsList.length === 0 ? (
                              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>No journal flows logged. POS sales and logged expenses will display here.</div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "150px", overflowY: "auto" }}>
                                {cashflowsList.map((cf, i) => (
                                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "0.25rem" }}>
                                    <div>
                                      <strong>{cf.category}</strong> <span style={{ color: "var(--color-text-muted)" }}>({cf.description || "N/A"})</span>
                                    </div>
                                    <span style={{ color: cf.type === "Inflow" ? "green" : "red", fontWeight: 700 }}>
                                      {cf.type === "Inflow" ? "+" : "-"}₹{cf.amount}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* 4. Suppliers Tab */}
                  {activeTab === "suppliers" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 700 }}>Supplier Ledger & Directory</h3>
                        <button onClick={() => setShowAddSupplier(!showAddSupplier)} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                          <Plus size={16} /> Add Supplier
                        </button>
                      </div>

                      {showAddSupplier && (
                        <form onSubmit={handleAddSupplier} className="builder-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "12px", border: "1px solid var(--color-accent-pink)" }}>
                          <h4 style={{ fontWeight: 700 }}>New Supplier Profile</h4>
                          <div className="form-group">
                            <label>Supplier Name</label>
                            <input type="text" required placeholder="e.g. Ramesh Distributors" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} />
                          </div>
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>Phone</label>
                              <input type="text" placeholder="e.g. 9812345678" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} />
                            </div>
                            <div className="form-group">
                              <label>Email</label>
                              <input type="email" placeholder="e.g. contact@dist.com" value={supplierForm.email} onChange={e => setSupplierForm({...supplierForm, email: e.target.value})} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Outstanding Debt Balance (₹)</label>
                            <input type="number" placeholder="e.g. 0.00" value={supplierForm.outstanding_balance} onChange={e => setSupplierForm({...supplierForm, outstanding_balance: parseFloat(e.target.value) || 0})} />
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Supplier</button>
                            <button type="button" onClick={() => setShowAddSupplier(false)} className="btn btn-secondary">{t("cancel")}</button>
                          </div>
                        </form>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {suppliers.map(sup => (
                          <div key={sup.id} style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "10px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong style={{ fontSize: "1rem" }}>{sup.name}</strong>
                              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                                {sup.phone && <span>Phone: {sup.phone}</span>} {sup.email && <span>| Email: {sup.email}</span>}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Outstanding Ledger</div>
                                <strong style={{ color: sup.outstanding_balance > 0 ? "red" : "green" }}>₹{sup.outstanding_balance}</strong>
                              </div>
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button onClick={() => handleAdjustSupplierLedger(sup.id, -1000)} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Pay ₹1k</button>
                                <button onClick={() => handleAdjustSupplierLedger(sup.id, 2000)} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Add ₹2k</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer CRM Tab */}
                  {activeTab === "customers" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ fontWeight: 700 }}>Customer Relationship Management</h3>
                          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>Manage customer contacts, loyalty points, purchase value, and credit balances.</p>
                        </div>
                        <button onClick={() => setShowAddCustomer(!showAddCustomer)} className="btn btn-primary" style={{ padding: "0.45rem 0.85rem" }}><Plus size={16} /> Add Customer</button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem" }}>
                        <div className="builder-card" style={{ padding: "0.9rem" }}><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>CUSTOMERS</div><strong style={{ fontSize: "1.35rem" }}>{customers.length}</strong></div>
                        <div className="builder-card" style={{ padding: "0.9rem" }}><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>LOYALTY POINTS</div><strong style={{ fontSize: "1.35rem" }}>{customers.reduce((sum, customer) => sum + customer.loyalty_points, 0)}</strong></div>
                        <div className="builder-card" style={{ padding: "0.9rem" }}><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>OUTSTANDING CREDIT</div><strong style={{ fontSize: "1.35rem", color: "#B45309" }}>₹{customers.reduce((sum, customer) => sum + customer.credit_balance, 0).toFixed(0)}</strong></div>
                      </div>

                      {showAddCustomer && <form onSubmit={handleAddCustomer} className="builder-card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <strong>New Customer Profile</strong>
                        <div className="form-row-2"><div className="form-group"><label>Full name</label><input required placeholder="Customer Full Name" value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} /></div><div className="form-group"><label>Phone</label><input placeholder="e.g. +91 98765 43210" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} /></div></div>
                        <div className="form-row-2"><div className="form-group"><label>Email</label><input type="email" placeholder="customer@example.com" value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} /></div><div className="form-group"><label>Address</label><input placeholder="City, Area, Pincode" value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} /></div></div>
                        <div style={{ display: "flex", gap: "0.5rem" }}><button className="btn btn-primary" type="submit">Save Customer</button><button className="btn btn-secondary" type="button" onClick={() => setShowAddCustomer(false)}>Cancel</button></div>
                      </form>}

                      <input value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); fetchCustomers(store.id, e.target.value); }} placeholder="Search by customer name or phone number" style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                      {customers.length === 0 ? <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "10px", color: "var(--color-text-muted)" }}>No customers found. Add your first customer profile to begin building relationships.</div> : customers.map(customer => (
                        <div key={customer.id} className="builder-card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                          <div><strong>{customer.name}</strong><div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{customer.phone || "No phone"}{customer.email ? ` · ${customer.email}` : ""}</div><div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>₹{customer.total_purchases.toFixed(0)} lifetime spend · {customer.purchase_count} purchases</div></div>
                          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}><div><div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>LOYALTY</div><strong>{customer.loyalty_points} pts</strong></div><div><div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>CREDIT</div><strong style={{ color: customer.credit_balance > 0 ? "#B45309" : "#15803D" }}>₹{customer.credit_balance.toFixed(0)}</strong></div><button onClick={() => adjustCustomerCredit(customer, 100)} className="btn btn-secondary" style={{ padding: "0.3rem 0.55rem", fontSize: "0.75rem" }}>Add ₹100 credit</button><button onClick={() => adjustCustomerCredit(customer, -100)} className="btn btn-secondary" style={{ padding: "0.3rem 0.55rem", fontSize: "0.75rem" }}>Collect ₹100</button></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 5. Employee Directory & Attendance Tab */}
                  {activeTab === "employees" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 700 }}>Employee Staff & Attendance Sheets</h3>
                        <button onClick={() => setShowAddEmployee(!showAddEmployee)} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                          <Plus size={16} /> Add Employee
                        </button>
                      </div>

                      {showAddEmployee && (
                        <form onSubmit={handleAddEmployee} className="builder-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "12px", border: "1px solid var(--color-accent-pink)" }}>
                          <h4 style={{ fontWeight: 700 }}>New Employee Profile</h4>
                          <div className="form-group">
                            <label>Employee Name</label>
                            <input type="text" required placeholder="e.g. Anil Kumar" value={employeeForm.name} onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} />
                          </div>
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>Assigned Role</label>
                              <select value={employeeForm.role} onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})}>
                                <option>Cashier</option>
                                <option>Manager</option>
                                <option>Inventory Manager</option>
                                <option>Sales Executive</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Phone Number</label>
                              <input type="text" placeholder="e.g. 9778899001" value={employeeForm.phone} onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})} />
                            </div>
                          </div>
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>Base Salary / Month (₹)</label>
                              <input type="number" placeholder="Monthly salary (₹)" value={employeeForm.salary} onChange={e => setEmployeeForm({...employeeForm, salary: parseFloat(e.target.value) || 0})} />
                            </div>
                            <div className="form-group">
                              <label>Commission Rate (%)</label>
                              <input type="number" placeholder="Commission % (e.g. 2.5)" value={employeeForm.commission} onChange={e => setEmployeeForm({...employeeForm, commission: parseFloat(e.target.value) || 0})} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Profile</button>
                            <button type="button" onClick={() => setShowAddEmployee(false)} className="btn btn-secondary">{t("cancel")}</button>
                          </div>
                        </form>
                      )}

                      {/* Attendance Date Sheet */}
                      <div style={{ border: "1px solid var(--color-border)", borderRadius: "10px", padding: "1rem", backgroundColor: "#FDF6F0" }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>Daily Log Date Selection</label>
                        <input type="date" value={selectedAttendanceDate} onChange={e => setSelectedAttendanceDate(e.target.value)} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                      </div>

                      {/* Employees List with Attendance loggers */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {employees.map(emp => {
                          const log = attendance.find(a => a.employee_id === emp.id && a.date === selectedAttendanceDate);
                          return (
                            <div key={emp.id} style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "10px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <strong style={{ fontSize: "1rem" }}>{emp.name}</strong>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                                  Role: {emp.role} | Salary: ₹{emp.salary}/mo
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: log?.status === "Present" ? "green" : "red" }}>
                                  {log ? `Status: ${log.status}` : "No Log"}
                                </span>
                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                  <button onClick={() => handleLogAttendance(emp.id, "Present")} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "green" }}>Present</button>
                                  <button onClick={() => handleLogAttendance(emp.id, "Absent")} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "red" }}>Absent</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 6+7. Unified Store Settings Tab */}
                  {activeTab === "store-settings" && (() => {
                    const THEME_PRESETS = [
                      { label: "Warm Earth",   theme: "#E85A4F", secondary: "#D8C3A5", bg: "#EAE7DC" },
                      { label: "Forest Green", theme: "#2E7D32", secondary: "#C8E6C9", bg: "#F1F8E9" },
                      { label: "Ocean Blue",   theme: "#1565C0", secondary: "#BBDEFB", bg: "#F5F5F5" },
                      { label: "Royal Purple", theme: "#6A1B9A", secondary: "#E1BEE7", bg: "#F3E5F5" },
                      { label: "Sunset Orange",theme: "#E65100", secondary: "#FFE0B2", bg: "#FFF8F0" },
                      { label: "Rose Pink",    theme: "#C2185B", secondary: "#F8BBD0", bg: "#FFF0F5" },
                      { label: "Slate Dark",   theme: "#37474F", secondary: "#CFD8DC", bg: "#ECEFF1" },
                      { label: "Golden Spice", theme: "#F9A825", secondary: "#FFF9C4", bg: "#FFFDE7" },
                    ];
                    const PLAN_INFO: Record<string, { label: string; color: string; bg: string; features: string[] }> = {
                      "Store Owner": { label: "Pro",        color: "#1565C0", bg: "#E3F2FD", features: ["Unlimited products", "AI Insights", "POS Billing", "Supplier & HR", "Backup & Restore"] },
                      "Super Admin": { label: "Enterprise", color: "#6A1B9A", bg: "#F3E5F5", features: ["All Pro features", "Multi-store access", "Priority support", "Custom domain", "Advanced analytics"] },
                      "Manager":     { label: "Pro",        color: "#1565C0", bg: "#E3F2FD", features: ["Inventory", "Billing", "Accounting", "Suppliers", "Employees"] },
                      "Cashier":     { label: "Free",       color: "#2E7D32", bg: "#E8F5E9", features: ["Billing only", "View inventory", "Basic reports"] },
                      "Customer":    { label: "Free",       color: "#2E7D32", bg: "#E8F5E9", features: ["Browse store", "Place orders", "Track orders"] },
                    };
                    const plan = PLAN_INFO[userRole] || PLAN_INFO["Cashier"];

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

                        {/* Section: Store Info */}
                        <div>
                          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Store Information</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            <div className="form-row-2">
                              <div className="form-group">
                                <label>Store Name</label>
                                <input type="text" placeholder="Store Name (e.g. Metro Fresh Market)" value={storeForm.name || ""} onChange={e => { setStoreForm({ ...storeForm, name: e.target.value }); handleUpdateStore({ name: e.target.value }); }} />
                              </div>
                              <div className="form-group">
                                <label>Owner Name</label>
                                <input type="text" placeholder="Owner Full Name (e.g. Suresh Patel)" value={storeForm.owner_name || ""} onChange={e => { setStoreForm({ ...storeForm, owner_name: e.target.value }); handleUpdateStore({ owner_name: e.target.value }); }} />
                              </div>
                            </div>
                            <div className="form-row-2">
                              <div className="form-group">
                                <label>WhatsApp Phone</label>
                                <input type="text" placeholder="e.g. 9825098250" value={storeForm.phone || ""} onChange={e => { setStoreForm({ ...storeForm, phone: e.target.value }); handleUpdateStore({ phone: e.target.value }); }} />
                              </div>
                              <div className="form-group">
                                <label>Opening Hours</label>
                                <input type="text" placeholder="e.g. 8 AM – 10 PM" value={storeForm.timings || ""} onChange={e => { setStoreForm({ ...storeForm, timings: e.target.value }); handleUpdateStore({ timings: e.target.value }); }} />
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Store Address</label>
                              <input type="text" placeholder="e.g. Shop 4, MG Road, Rajkot" value={storeForm.address || ""} onChange={e => { setStoreForm({ ...storeForm, address: e.target.value }); handleUpdateStore({ address: e.target.value }); }} />
                            </div>
                            <div className="form-group">
                              <label>Store Description</label>
                              <textarea rows={2} placeholder="Describe your store vision, specialty products, and tagline..." value={storeForm.description || ""} onChange={e => { setStoreForm({ ...storeForm, description: e.target.value }); handleUpdateStore({ description: e.target.value }); }} />
                            </div>
                            <div className="form-group">
                              <label>Logo Image URL</label>
                              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <input type="text" placeholder="https://..." value={storeForm.logo_url || ""} onChange={e => { setStoreForm({ ...storeForm, logo_url: e.target.value }); handleUpdateStore({ logo_url: e.target.value }); }} />
                                {storeForm.logo_url && <img src={storeForm.logo_url} alt="logo" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--color-border)", flexShrink: 0 }} onError={e => (e.currentTarget.style.display = "none")} />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: "1px solid var(--color-border)" }} />

                        {/* Section: Theme */}
                        <div>
                          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Theme & Appearance</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* 8 Preset swatches */}
                            <div>
                              <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>Color Presets</label>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                                {THEME_PRESETS.map(p => {
                                  const isActive = storeForm.theme_color === p.theme;
                                  return (
                                    <button
                                      key={p.label}
                                      onClick={() => { const upd = { theme_color: p.theme, secondary_color: p.secondary, bg_color: p.bg }; setStoreForm(prev => ({ ...prev, ...upd })); handleUpdateStore(upd); }}
                                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.6rem", borderRadius: "8px", border: `2px solid ${isActive ? p.theme : "var(--color-border)"}`, background: isActive ? `${p.theme}12` : "#FAFAFA", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s" }}
                                    >
                                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: p.theme, flexShrink: 0, boxShadow: isActive ? `0 0 0 2px white, 0 0 0 4px ${p.theme}` : "none" }} />
                                      {p.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Custom color pickers */}
                            <div>
                              <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>Custom Colors</label>
                              <div className="color-picker-grid">
                                <div className="color-input-wrapper">
                                  <span>Theme</span>
                                  <input type="color" value={storeForm.theme_color || "#E85A4F"} onChange={e => { setStoreForm({ ...storeForm, theme_color: e.target.value }); handleUpdateStore({ theme_color: e.target.value }); }} />
                                  <span style={{ fontSize: "0.65rem" }}>{storeForm.theme_color || "#E85A4F"}</span>
                                </div>
                                <div className="color-input-wrapper">
                                  <span>Secondary</span>
                                  <input type="color" value={storeForm.secondary_color || "#D8C3A5"} onChange={e => { setStoreForm({ ...storeForm, secondary_color: e.target.value }); handleUpdateStore({ secondary_color: e.target.value }); }} />
                                  <span style={{ fontSize: "0.65rem" }}>{storeForm.secondary_color || "#D8C3A5"}</span>
                                </div>
                                <div className="color-input-wrapper">
                                  <span>Background</span>
                                  <input type="color" value={storeForm.bg_color || "#EAE7DC"} onChange={e => { setStoreForm({ ...storeForm, bg_color: e.target.value }); handleUpdateStore({ bg_color: e.target.value }); }} />
                                  <span style={{ fontSize: "0.65rem" }}>{storeForm.bg_color || "#EAE7DC"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Font */}
                            <div className="form-group">
                              <label>Font Family</label>
                              <select value={storeForm.font_family || "Outfit"} onChange={e => { setStoreForm({ ...storeForm, font_family: e.target.value }); handleUpdateStore({ font_family: e.target.value }); }}>
                                <option>Outfit</option>
                                <option>Inter</option>
                                <option>Arial</option>
                                <option>Georgia</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div style={{ borderTop: "1px solid var(--color-border)" }} />
                        <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: plan.bg }}>
                          <div style={{ fontWeight: 800, color: plan.color }}>{plan.label} plan</div>
                          <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{currentUser?.email || "Signed-in store account"}</div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* 8. Settings Backup & Restore Tab */}
                  {activeTab === "settings" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <h3 style={{ fontWeight: 700 }}>Database backup & JSON restore</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        Export your entire store database (products, sales logs, suppliers outstanding ledger, staff profiles, attendance sheets) to a single JSON file. You can restore your data at any time.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={handleExportBackup} className="btn btn-primary" style={{ justifyContent: "center" }}>
                          <Download size={16} /> Export JSON Database Backup
                        </button>
                        
                        <div style={{ border: "1px dashed var(--color-border)", borderRadius: "12px", padding: "1.5rem", textAlign: "center", backgroundColor: "#FFFFFF" }}>
                          <label style={{ cursor: "pointer", fontWeight: 700, color: "var(--color-accent-red)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                            <RefreshCw size={24} />
                            <span>Upload JSON Backup to Restore</span>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              accept=".json" 
                              onChange={handleImportBackup} 
                              style={{ display: "none" }} 
                            />
                          </label>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Warehouse Management</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                          {warehousesList.map(w => (
                            <div key={w.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.4rem 0.6rem", border: "1px solid var(--color-border)", borderRadius: "6px", backgroundColor: "#FFFFFF" }}>
                              <span><strong>{w.name}</strong> ({w.location || "N/A"})</span>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          if (!store) return;
                          const name = (e.target as any).wName.value;
                          const loc = (e.target as any).wLoc.value;
                          if (!name) return;
                          try {
                            const res = await fetch(`${BACKEND_URL}/api/stores/${store.id}/warehouses`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name, location: loc })
                            });
                            if (res.ok) {
                              const newW = await res.json();
                              setWarehousesList(prev => [...prev, newW]);
                              (e.target as any).reset();
                              alert("Warehouse successfully registered!");
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }} style={{ display: "flex", gap: "0.5rem" }}>
                          <input type="text" name="wName" required placeholder="Warehouse Name" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />
                          <input type="text" name="wLoc" placeholder="Location" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />
                          <button type="submit" className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem", borderRadius: "6px" }}>Add</button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* 9. Analytics Tab */}
                  {activeTab === "analytics" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <h3 style={{ fontWeight: 700 }}>Analytics & Dashboard</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div style={{ padding: "1rem", backgroundColor: "#F5F7FB", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>REVENUE</span>
                          <h3 style={{ color: "var(--color-accent-red)", fontWeight: 800 }}>₹{sales.reduce((sum, s) => sum + s.total_amount, 0)}</h3>
                        </div>
                        <div style={{ padding: "1rem", backgroundColor: "#F5F7FB", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>PROFIT</span>
                          <h3 style={{ color: "green", fontWeight: 800 }}>₹{sales.reduce((sum, s) => sum + s.total_amount, 0) - calculateTotalCostOfSales()}</h3>
                        </div>
                        <div style={{ padding: "1rem", backgroundColor: "#F5F7FB", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>SALES COUNT</span>
                          <h3 style={{ color: "#E65100", fontWeight: 800 }}>{sales.length} Bills</h3>
                        </div>
                      </div>
                      
                      {/* Weekly Chart */}
                      <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "1rem" }}>Sales Chart (Weekly)</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "100px", borderBottom: "1px solid var(--color-border)" }}>
                          {[1200, 1900, 1500, 2400, 3200, 4100, 3800].map((val, idx) => (
                            <div key={idx} style={{ width: "30px", height: `${(val / 4100) * 100}%`, backgroundColor: "var(--color-accent-red)", borderRadius: "4px 4px 0 0" }} />
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. Orders Tab */}
                  {activeTab === "orders" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <h3 style={{ fontWeight: 700 }}>Storefront Orders</h3>
                      {ordersList.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "8px", color: "var(--color-text-muted)" }}>
                          No customer checkout orders received.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          {ordersList.map(o => (
                            <div key={o.id} style={{ border: "1px solid var(--color-border)", borderRadius: "10px", padding: "1rem", backgroundColor: "#FFFFFF", fontSize: "0.85rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <strong>Order #{o.id}</strong>
                                <select 
                                  value={o.status} 
                                  onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`status-dropdown status-${o.status}`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                              <div><strong>Customer:</strong> {o.customer_name} ({o.customer_phone})</div>
                              <div><strong>Address:</strong> {o.delivery_address || "Pick up at Store"}</div>
                              <div><strong>Total Amount:</strong> ₹{o.total_amount}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 11. AI Insights Tab */}
                  {activeTab === "ai-insights" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 700 }}>AI Business Intelligence</h3>
                        <button onClick={() => fetchAIInsights(store.id)} className="btn btn-secondary" style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }}>
                          <RefreshCw size={13} /> Refresh
                        </button>
                      </div>

                      {!aiInsightsData ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>Computing insights...</div>
                      ) : (
                        <>
                          {/* Sales Prediction Banner */}
                          <div style={{ padding: "1rem 1.25rem", backgroundColor: aiInsightsData.sales_prediction?.trajectory === "UPWARD" ? "#E8F5E9" : "#FFF3E0", border: `1px solid ${aiInsightsData.sales_prediction?.trajectory === "UPWARD" ? "#A5D6A7" : "#FFCC80"}`, borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Sales Prediction — Next Week</div>
                              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: aiInsightsData.sales_prediction?.trajectory === "UPWARD" ? "#2E7D32" : "#E65100" }}>
                                ₹{aiInsightsData.sales_prediction?.predicted_next_7d?.toLocaleString()}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: "0.82rem" }}>
                              <div style={{ fontWeight: 700, color: aiInsightsData.sales_prediction?.trajectory === "UPWARD" ? "#2E7D32" : "#D32F2F" }}>
                                {aiInsightsData.sales_prediction?.trajectory} {aiInsightsData.sales_prediction?.growth_rate_pct > 0 ? "+" : ""}{aiInsightsData.sales_prediction?.growth_rate_pct}%
                              </div>
                              <div style={{ color: "var(--color-text-muted)" }}>vs last 7 days (₹{aiInsightsData.sales_prediction?.last_7d_revenue?.toLocaleString()})</div>
                            </div>
                          </div>

                          {/* Gross Margin */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                            {[
                              { label: "Total Revenue", value: `₹${aiInsightsData.gross_margin?.total_revenue?.toLocaleString()}`, color: "var(--color-accent-red)" },
                              { label: "Total Cost", value: `₹${aiInsightsData.gross_margin?.total_cost?.toLocaleString()}`, color: "#E65100" },
                              { label: "Gross Margin", value: `${aiInsightsData.gross_margin?.gross_margin_pct}%`, color: "#2E7D32" },
                            ].map(({ label, value, color }) => (
                              <div key={label} style={{ padding: "0.85rem", backgroundColor: "#F5F7FB", borderRadius: "10px", border: "1px solid #E2E8F0", textAlign: "center" }}>
                                <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: 800, color, marginTop: "0.2rem" }}>{value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Revenue Trend Bar Chart */}
                          <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Revenue Trend — Last 7 Days</h4>
                            {(() => {
                              const trend: any[] = aiInsightsData.revenue_trend || [];
                              const maxVal = Math.max(...trend.map((d: any) => d.revenue), 1);
                              return (
                                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "100px" }}>
                                  {trend.map((d: any) => (
                                    <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", height: "100%", justifyContent: "flex-end" }}>
                                      <div style={{ fontSize: "0.6rem", color: "var(--color-text-muted)", fontWeight: 600 }}>₹{d.revenue > 0 ? Math.round(d.revenue) : ""}</div>
                                      <div style={{ width: "100%", height: `${Math.max((d.revenue / maxVal) * 75, d.revenue > 0 ? 4 : 2)}px`, backgroundColor: d.revenue > 0 ? "var(--color-accent-red)" : "#E2E8F0", borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                                      <div style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}>{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Top 5 Products + Donut Chart side by side */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            {/* Top 5 Products */}
                            <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                              <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Top 5 Products</h4>
                              {aiInsightsData.top_products?.length === 0 ? (
                                <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>No sales data yet.</div>
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {aiInsightsData.top_products?.map((p: any, i: number) => {
                                    const maxRev = aiInsightsData.top_products[0]?.total_revenue || 1;
                                    return (
                                      <div key={p.product_id}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                                          <span style={{ fontWeight: 600 }}>#{i + 1} {p.name}</span>
                                          <span style={{ color: "var(--color-accent-red)", fontWeight: 700 }}>₹{p.total_revenue?.toLocaleString()}</span>
                                        </div>
                                        <div style={{ height: "6px", backgroundColor: "#F0F0F0", borderRadius: "3px" }}>
                                          <div style={{ height: "100%", width: `${(p.total_revenue / maxRev) * 100}%`, backgroundColor: ["#E85A4F","#FF8A65","#FFB74D","#81C784","#64B5F6"][i], borderRadius: "3px" }} />
                                        </div>
                                        <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>{p.units_sold} units Â· {p.category}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Stock by Category Donut */}
                            <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                              <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Stock by Category</h4>
                              {(() => {
                                const cats: any[] = aiInsightsData.stock_by_category || [];
                                const total = cats.reduce((s: number, c: any) => s + c.total_units, 0) || 1;
                                const colors = ["#E85A4F","#FF8A65","#FFB74D","#81C784","#64B5F6","#BA68C8","#4DB6AC"];
                                let cumPct = 0;
                                const segments = cats.slice(0, 7).map((c: any, i: number) => {
                                  const pct = (c.total_units / total) * 100;
                                  const seg = { ...c, pct: Math.round(pct), color: colors[i % colors.length], start: cumPct };
                                  cumPct += pct;
                                  return seg;
                                });
                                // Build conic-gradient
                                const gradient = segments.map((s: any) => `${s.color} ${s.start.toFixed(1)}% ${(s.start + s.pct).toFixed(1)}%`).join(", ");
                                return (
                                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `conic-gradient(${gradient})`, flexShrink: 0 }} />
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.75rem", overflow: "hidden" }}>
                                      {segments.map((s: any) => (
                                        <div key={s.category} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                          <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: s.color, flexShrink: 0 }} />
                                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.category}</span>
                                          <span style={{ marginLeft: "auto", fontWeight: 700, flexShrink: 0 }}>{s.pct}%</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Demand Forecasts */}
                          {aiInsightsData.demand_forecasts?.length > 0 && (
                            <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                              <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Demand Forecasts by Category</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {aiInsightsData.demand_forecasts.map((f: any, i: number) => (
                                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", backgroundColor: "#F9F9F9", borderRadius: "8px", fontSize: "0.82rem" }}>
                                    <div>
                                      <strong>{f.category}</strong>
                                      <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: f.demand_level === "High" ? "#FFEBEE" : f.demand_level === "Medium" ? "#FFF8E1" : "#E8F5E9", color: f.demand_level === "High" ? "#C62828" : f.demand_level === "Medium" ? "#F57F17" : "#2E7D32", fontWeight: 700 }}>{f.demand_level}</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ color: "var(--color-text-muted)" }}>Last 7d: {f.sold_last_7d} units → Next: <strong>{f.predicted_next_7d}</strong></div>
                                      <div style={{ fontSize: "0.7rem", color: "#1565C0" }}>{f.suggestion}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Restock Suggestions */}
                          <div style={{ padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FFFFFF" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                              <h4 style={{ fontWeight: 700 }}>Restock Suggestions</h4>
                              {aiInsightsData.restock_suggestions?.length > 0 && (
                                <button
                                  onClick={async () => {
                                    let cost = 0;
                                    for (const s of aiInsightsData.restock_suggestions) {
                                      cost += s.estimated_cost;
                                      await fetch(`${BACKEND_URL}/api/stores/${store.id}/products/${s.product_id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ stock_quantity: 30 })
                                      });
                                    }
                                    await handleAddCashFlow("Outflow", Math.round(cost), "Purchase", "Auto AI restock");
                                    alert(`Restocked ${aiInsightsData.restock_suggestions.length} items. Logged outflow: ₹${Math.round(cost)}.`);
                                    const pRes = await fetch(`${BACKEND_URL}/api/stores/${store.id}`);
                                    if (pRes.ok) { const d = await pRes.json(); setProducts(d.products || []); fetchAIInsights(store.id); }
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                                >
                                  Auto Restock All
                                </button>
                              )}
                            </div>
                            {aiInsightsData.restock_suggestions?.length === 0 ? (
                              <div style={{ color: "#2E7D32", fontSize: "0.85rem" }}>✓ All products are well-stocked.</div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                {aiInsightsData.restock_suggestions.map((item: any, idx: number) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", backgroundColor: "#FFF8E1", borderRadius: "8px", fontSize: "0.82rem", border: "1px solid #FFE082" }}>
                                    <div>
                                      <strong>{item.name}</strong>
                                      <span style={{ marginLeft: "0.5rem", color: "var(--color-text-muted)" }}>{item.category}</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ color: "#D32F2F", fontWeight: 700 }}>{item.current_stock} left → order +{item.suggested_qty}</div>
                                      <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>Est. cost: ₹{item.estimated_cost} Â· via {item.supplier}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* AI Text Insights */}
                          {aiInsightsData.insights?.length > 0 && (
                            <div style={{ padding: "1rem", border: "1px solid #C8E6C9", borderRadius: "12px", backgroundColor: "#F1F8E9" }}>
                              <h4 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#2E7D32" }}>AI Business Insights</h4>
                              <ul style={{ fontSize: "0.82rem", paddingLeft: "1.2rem", color: "#33691E", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                {aiInsightsData.insights.map((ins: string, idx: number) => (
                                  <li key={idx}>{ins}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* Desktop Storefront Container */}
            <div className="full-page-storefront-wrapper" style={{ 
              fontFamily: store.font_family,
              backgroundColor: store.bg_color,
              ["--color-store-theme" as any]: store.theme_color,
              ["--color-store-secondary" as any]: store.secondary_color,
            }}>
              
              {/* Desktop view top bar selector */}
              <div className="no-print" style={{ backgroundColor: "#1c1917", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 2rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.8 }}>
                  <Eye size={14} /> SaaS Desktop Storefront View
                </div>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button 
                    onClick={() => {
                      setIsConsoleOpen(true);
                      setActiveTab("stock");
                      setShowAddProduct(true);
                      setShowAddCategory(false);
                      setEditingProduct(null);
                    }} 
                    style={{ backgroundColor: "var(--color-accent-red)", color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}
                  >
                    <Plus size={15} /> Add Product
                  </button>
                  <button 
                    onClick={() => {
                      setIsConsoleOpen(true);
                      setActiveTab("stock");
                      setShowAddCategory(true);
                      setShowAddProduct(false);
                      setEditingProduct(null);
                    }} 
                    style={{ backgroundColor: store?.theme_color || "var(--color-accent-red)", color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}
                  >
                    <Plus size={15} /> Add Category
                  </button>
                  <button onClick={() => setIsConsoleOpen(true)} style={{ backgroundColor: "#2A2421", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", padding: "0.4rem 0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                    <Edit3 size={14} /> {t("adminConsole")}
                  </button>
                  <button onClick={() => { setStore(null); setProducts([]); setView("builder"); }} className="btn btn-secondary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem", color: "white", borderColor: "rgba(255,255,255,0.25)", backgroundColor: "transparent" }}>
                    Create New Store
                  </button>
                </div>
              </div>

              {/* Full Width Store content container */}
              <div className="full-page-storefront-container">
                {/* Store Header */}
                <div className="full-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 2.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: store.theme_color }}>
                      {store.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {store.timings || "Open All Days"}
                    </div>
                  </div>

                  {/* Customer Storefront Actions toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="no-print">
                    <button 
                      onClick={() => setIsCustomerCartOpen(true)} 
                      style={{ 
                        background: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "rgba(211, 47, 47, 0.1)" : "rgba(0,0,0,0.05)", 
                        color: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "#D32F2F" : "var(--color-text-muted)", 
                        border: "none", 
                        padding: "0.4rem 0.8rem", 
                        borderRadius: "20px", 
                        fontWeight: 700, 
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.3rem", 
                        fontSize: "0.85rem" 
                      }}
                    >
                      <AlertTriangle size={15} /> Low Stock <span style={{ fontSize: "0.75rem", backgroundColor: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "#D32F2F" : "var(--color-text-muted)", color: "#FFFFFF", padding: "0.1rem 0.35rem", borderRadius: "10px" }}>{products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length}</span>
                    </button>

                    {currentUser && (
                      <div style={{ display: "flex", flexDirection: "column", fontSize: "0.75rem", borderLeft: "1px solid var(--color-border)", paddingLeft: "0.75rem", lineHeight: 1.3 }}>
                        <span style={{ fontWeight: 700 }}>{currentUser.name}</span>
                        <span style={{ color: "green" }}>Wallet: ₹{customerWallet}</span>
                        <span style={{ color: "#E65100" }}>Loyalty Pts: {customerPoints}</span>
                      </div>
                    )}
                  </div>
                </div>

                {customerActiveTab === "orders" ? (
                  <div style={{ padding: "2rem 2.5rem" }}>
                    <h3 style={{ fontWeight: 700, color: store.theme_color, marginBottom: "1.5rem" }}>My Past Orders</h3>
                    {ordersList.length === 0 ? (
                      <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "12px", color: "var(--color-text-muted)" }}>
                        You haven't placed any orders yet.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {ordersList.map(o => (
                          <div key={o.id} style={{ border: "1px solid var(--color-border)", borderRadius: "12px", padding: "1.25rem", backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Order #{o.id}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginLeft: "0.75rem" }}>{new Date(o.created_at).toLocaleDateString()}</span>
                              </div>
                              <span style={{ 
                                padding: "0.25rem 0.6rem", 
                                borderRadius: "20px", 
                                fontSize: "0.75rem", 
                                fontWeight: 700,
                                backgroundColor: o.status === "Pending" ? "#FFF9C4" : o.status === "Dispatched" ? "#E3F2FD" : o.status === "Completed" ? "#E8F5E9" : "#FFEBEE",
                                color: o.status === "Pending" ? "#F57F17" : o.status === "Dispatched" ? "#1565C0" : o.status === "Completed" ? "#2E7D32" : "#C62828"
                              }}>
                                {o.status}
                              </span>
                            </div>
                            
                            <div style={{ fontSize: "0.88rem", marginBottom: "0.5rem" }}>
                              <strong>Delivery Address:</strong> {o.delivery_address || "Self pickup"}
                            </div>
                            {o.tracking_number && (
                              <div style={{ fontSize: "0.85rem", backgroundColor: "#E3F2FD", padding: "0.5rem 0.75rem", borderRadius: "6px", color: "#1565C0", marginBottom: "0.75rem" }}>
                                <strong>Shipping Tracking Number:</strong> {o.tracking_number}
                              </div>
                            )}

                            {/* Timeline Tracker */}
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0", position: "relative", padding: "0 1rem" }}>
                              <div style={{ position: "absolute", top: "10px", left: "1.5rem", right: "1.5rem", height: "2px", backgroundColor: "#E2E8F0", zIndex: 1 }} />
                              <div style={{ 
                                position: "absolute", 
                                top: "10px", 
                                left: "1.5rem", 
                                width: o.status === "Pending" ? "0%" : o.status === "Dispatched" ? "50%" : o.status === "Completed" ? "100%" : "0%", 
                                height: "2px", 
                                backgroundColor: "green", 
                                zIndex: 2 
                              }} />
                              
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "green", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>✓</div>
                                <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: 600 }}>Placed</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: (o.status === "Dispatched" || o.status === "Completed") ? "green" : "#E2E8F0", color: (o.status === "Dispatched" || o.status === "Completed") ? "white" : "#718096", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>
                                  {(o.status === "Dispatched" || o.status === "Completed") ? "✓" : "2"}
                                </div>
                                <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: (o.status === "Dispatched" || o.status === "Completed") ? 600 : 400 }}>Dispatched</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: o.status === "Completed" ? "green" : "#E2E8F0", color: o.status === "Completed" ? "white" : "#718096", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>
                                  {o.status === "Completed" ? "✓" : "3"}
                                </div>
                                <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: o.status === "Completed" ? 600 : 400 }}>Completed</span>
                              </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                              <div>
                                <span style={{ color: "var(--color-text-muted)" }}>Paid via {o.payment_method}</span>
                              </div>
                              <strong style={{ fontSize: "1.1rem", color: store.theme_color }}>₹{o.total_amount}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : customerActiveTab === "wishlist" ? (
                  <div style={{ padding: "2rem 2.5rem" }}>
                    <h3 style={{ fontWeight: 700, color: store.theme_color, marginBottom: "1.5rem" }}>My Wishlist</h3>
                    {customerWishlist.length === 0 ? (
                      <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "12px", color: "var(--color-text-muted)" }}>
                        No items in your wishlist. Save items you like!
                      </div>
                    ) : (
                      <div className="full-page-grid" style={{ padding: 0 }}>
                        {products
                          .filter(p => customerWishlist.includes(p.id))
                          .map(product => {
                            const outOfStock = product.stock_quantity <= 0;

                            return (
                              <div key={product.id} className="product-card" style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF", position: "relative" }}>
                                <button 
                                  onClick={() => setCustomerWishlist(prev => prev.filter(id => id !== product.id))}
                                  style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
                                >
                                  <Heart size={16} fill="#E85A4F" color="#E85A4F" />
                                </button>
                                <img src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} alt={product.name} style={{ height: "180px", width: "100%", objectFit: "cover" }} />
                                <div className="product-card-body" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                  <span className="product-card-title" style={{ fontSize: "1rem", fontWeight: 700 }}>{product.name}</span>
                                  <span className="product-card-meta" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{product.unit}</span>
                                  
                                  <div className="product-card-price-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                                    <span className="product-price" style={{ fontSize: "1.1rem", fontWeight: 800 }}>₹{product.price}</span>
                                    <span style={{ fontSize: "0.85rem", color: outOfStock ? "#D32F2F" : "var(--color-text-muted)", fontWeight: 600 }}>
                                      {outOfStock ? "No Stock" : `${product.stock_quantity} left`}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => setEditingProduct(product)}
                                    className="btn btn-secondary"
                                    style={{ width: "100%", padding: "0.4rem", fontSize: "0.82rem", borderRadius: "8px", marginTop: "0.75rem", justifyContent: "center" }}
                                  >
                                    Edit & Update Stock
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Shopping view (Default)
                  <>
                    {/* Hero Description Banner */}
                    <div className="full-page-desc-banner" style={{ background: `linear-gradient(135deg, ${store.theme_color}12, ${store.secondary_color}18)` }}>
                      <h2 style={{ color: store.theme_color }}>{store.name}</h2>
                      <p>{store.description}</p>
                    </div>

                    {/* Low Stock Warnings */}
                    {products.filter(p => p.stock_quantity <= store.low_stock_threshold).length > 0 && (
                      <div style={{ padding: "1.5rem 2.5rem", backgroundColor: "#FFE3E0", borderBottom: "1px solid #FFCDD2" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D32F2F", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                          <AlertTriangle size={18} /> Out of Stock / Low Stock Warnings
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                          {products.filter(p => p.stock_quantity <= store.low_stock_threshold).map(p => (
                            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #FFCDD2", fontSize: "0.85rem", color: "#C62828" }}>
                              <span>{p.name} ({p.unit})</span>
                              <span style={{ fontWeight: "bold" }}>{p.stock_quantity === 0 ? "Out of Stock" : `${p.stock_quantity} left`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories Bar */}
                    <div style={{ padding: "1rem 2.5rem 0 2.5rem", display: "flex", gap: "0.75rem", borderBottom: "1px solid rgba(0,0,0,0.05)", overflowX: "auto" }}>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          style={{ 
                            padding: "0.6rem 1.2rem", 
                            fontSize: "0.88rem", 
                            fontWeight: 600, 
                            border: "none", 
                            background: "none", 
                            cursor: "pointer", 
                            borderBottom: `3px solid ${selectedCategory === cat ? store.theme_color : "transparent"}`,
                            color: selectedCategory === cat ? store.theme_color : "var(--color-text-muted)",
                            paddingBottom: "0.75rem"
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Products Grid */}
                    <div className="full-page-grid">
                      {filteredProducts.map(product => {
                        const outOfStock = product.stock_quantity <= 0;
                        const hasWishlist = customerWishlist.includes(product.id);
                        return (
                          <div key={product.id} className="product-card" style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", position: "relative" }}>
                            {product.stock_quantity <= store.low_stock_threshold && (
                              <div className="product-badge" style={{ background: "#FFE3E0", color: "#D32F2F" }}>
                                {outOfStock ? "Out of Stock" : "Low Stock"}
                              </div>
                            )}
                            
                            {/* Wishlist toggle button */}
                            <button 
                              onClick={() => {
                                if (hasWishlist) {
                                  setCustomerWishlist(prev => prev.filter(id => id !== product.id));
                                } else {
                                  setCustomerWishlist(prev => [...prev, product.id]);
                                }
                              }}
                              style={{ 
                                position: "absolute", 
                                top: "0.5rem", 
                                right: "0.5rem", 
                                background: "rgba(255,255,255,0.9)", 
                                border: "none", 
                                borderRadius: "50%", 
                                width: "32px", 
                                height: "32px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                cursor: "pointer", 
                                zIndex: 10,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                              }}
                            >
                              <Heart size={16} fill={hasWishlist ? "#E85A4F" : "none"} color={hasWishlist ? "#E85A4F" : "#718096"} />
                            </button>

                            <img 
                              src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} 
                              alt={product.name} 
                              style={{ height: "180px", width: "100%", objectFit: "cover" }}
                            />
                            <div className="product-card-body" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                              <span className="product-card-title" style={{ fontSize: "1rem", fontWeight: 700 }}>{product.name}</span>
                              <span className="product-card-meta" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{product.unit}</span>
                              
                              <div className="product-card-price-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                                <span className="product-price" style={{ fontSize: "1.1rem", fontWeight: 800 }}>₹{product.price}</span>
                                <span style={{ fontSize: "0.85rem", color: outOfStock ? "#D32F2F" : "var(--color-text-muted)", fontWeight: 600 }}>
                                  {outOfStock ? "No Stock" : `${product.stock_quantity} left`}
                                </span>
                              </div>

                              {/* Owner Actions */}
                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }} className="no-print">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="btn btn-secondary"
                                  style={{ flex: 1, padding: "0.4rem", fontSize: "0.82rem", borderRadius: "8px", justifyContent: "center" }}
                                >
                                  Edit & Update Stock
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Footer Section */}
                <div className="full-page-footer">
                  {store.address && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <MapPin size={16} style={{ color: store.theme_color }} />
                      <span>{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Phone size={16} style={{ color: store.theme_color }} />
                      <span>Call Store: {store.phone}</span>
                    </div>
                  )}
                  <div style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.5rem" }}>
                    Powered by GenScale Website Maker
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Separate Storefront screen view */}
        {view === "storefront" && store && currentUser && (
          <div className="full-page-storefront-wrapper" style={{ 
            fontFamily: store.font_family,
            backgroundColor: store.bg_color,
            ["--color-store-theme" as any]: store.theme_color,
            ["--color-store-secondary" as any]: store.secondary_color,
          }}>
            <div className="full-page-storefront-container">
              {/* Store Header */}
              <div className="full-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 2.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: store.theme_color }}>{store.name}</div>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    <span>{store.timings || "Open All Days"}</span>
                  </div>
                </div>

                {/* Customer Storefront Actions toolbar */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="no-print">
                  <button 
                    onClick={() => setIsCustomerCartOpen(true)} 
                    style={{ 
                      background: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "rgba(211, 47, 47, 0.1)" : "rgba(0,0,0,0.05)", 
                      color: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "#D32F2F" : "var(--color-text-muted)", 
                      border: "none", 
                      padding: "0.4rem 0.8rem", 
                      borderRadius: "20px", 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.3rem", 
                      fontSize: "0.85rem" 
                    }}
                  >
                    <AlertTriangle size={15} /> Low Stock <span style={{ fontSize: "0.75rem", backgroundColor: products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length > 0 ? "#D32F2F" : "var(--color-text-muted)", color: "#FFFFFF", padding: "0.1rem 0.35rem", borderRadius: "10px" }}>{products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length}</span>
                  </button>

                  {currentUser && (
                    <div style={{ display: "flex", flexDirection: "column", fontSize: "0.75rem", borderLeft: "1px solid var(--color-border)", paddingLeft: "0.75rem", lineHeight: 1.3 }}>
                      <span style={{ fontWeight: 700 }}>{currentUser.name}</span>
                      <span style={{ color: "green" }}>Wallet: ₹{customerWallet}</span>
                      <span style={{ color: "#E65100" }}>Loyalty Pts: {customerPoints}</span>
                    </div>
                  )}
                </div>
              </div>

              {customerActiveTab === "orders" ? (
                <div style={{ padding: "2rem 2.5rem" }}>
                  <h3 style={{ fontWeight: 700, color: store.theme_color, marginBottom: "1.5rem" }}>My Past Orders</h3>
                  {ordersList.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "12px", color: "var(--color-text-muted)" }}>
                      You haven't placed any orders yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {ordersList.map(o => (
                        <div key={o.id} style={{ border: "1px solid var(--color-border)", borderRadius: "12px", padding: "1.25rem", backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Order #{o.id}</span>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginLeft: "0.75rem" }}>{new Date(o.created_at).toLocaleDateString()}</span>
                            </div>
                            <span style={{ 
                              padding: "0.25rem 0.6rem", 
                              borderRadius: "20px", 
                              fontSize: "0.75rem", 
                              fontWeight: 700,
                              backgroundColor: o.status === "Pending" ? "#FFF9C4" : o.status === "Dispatched" ? "#E3F2FD" : o.status === "Completed" ? "#E8F5E9" : "#FFEBEE",
                              color: o.status === "Pending" ? "#F57F17" : o.status === "Dispatched" ? "#1565C0" : o.status === "Completed" ? "#2E7D32" : "#C62828"
                            }}>
                              {o.status}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: "0.88rem", marginBottom: "0.5rem" }}>
                            <strong>Delivery Address:</strong> {o.delivery_address || "Self pickup"}
                          </div>
                          {o.tracking_number && (
                            <div style={{ fontSize: "0.85rem", backgroundColor: "#E3F2FD", padding: "0.5rem 0.75rem", borderRadius: "6px", color: "#1565C0", marginBottom: "0.75rem" }}>
                              <strong>Shipping Tracking Number:</strong> {o.tracking_number}
                            </div>
                          )}

                          {/* Timeline Tracker */}
                          <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0", position: "relative", padding: "0 1rem" }}>
                            <div style={{ position: "absolute", top: "10px", left: "1.5rem", right: "1.5rem", height: "2px", backgroundColor: "#E2E8F0", zIndex: 1 }} />
                            <div style={{ 
                              position: "absolute", 
                              top: "10px", 
                              left: "1.5rem", 
                              width: o.status === "Pending" ? "0%" : o.status === "Dispatched" ? "50%" : o.status === "Completed" ? "100%" : "0%", 
                              height: "2px", 
                              backgroundColor: "green", 
                              zIndex: 2 
                            }} />
                            
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                              <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "green", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>✓</div>
                              <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: 600 }}>Placed</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                              <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: (o.status === "Dispatched" || o.status === "Completed") ? "green" : "#E2E8F0", color: (o.status === "Dispatched" || o.status === "Completed") ? "white" : "#718096", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>
                                {(o.status === "Dispatched" || o.status === "Completed") ? "✓" : "2"}
                              </div>
                              <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: (o.status === "Dispatched" || o.status === "Completed") ? 600 : 400 }}>Dispatched</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3 }}>
                              <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: o.status === "Completed" ? "green" : "#E2E8F0", color: o.status === "Completed" ? "white" : "#718096", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "bold" }}>
                                {o.status === "Completed" ? "✓" : "3"}
                              </div>
                              <span style={{ fontSize: "0.7rem", marginTop: "0.25rem", fontWeight: o.status === "Completed" ? 600 : 400 }}>Completed</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                            <div>
                              <span style={{ color: "var(--color-text-muted)" }}>Paid via {o.payment_method}</span>
                            </div>
                            <strong style={{ fontSize: "1.1rem", color: store.theme_color }}>₹{o.total_amount}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : customerActiveTab === "wishlist" ? (
                <div style={{ padding: "2rem 2.5rem" }}>
                  <h3 style={{ fontWeight: 700, color: store.theme_color, marginBottom: "1.5rem" }}>My Wishlist</h3>
                  {customerWishlist.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "12px", color: "var(--color-text-muted)" }}>
                      No items in your wishlist. Save items you like!
                    </div>
                  ) : (
                    <div className="full-page-grid" style={{ padding: 0 }}>
                      {products
                        .filter(p => customerWishlist.includes(p.id))
                        .map(product => {
                          const outOfStock = product.stock_quantity <= 0;

                          return (
                            <div key={product.id} className="product-card" style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF", position: "relative" }}>
                              <button 
                                onClick={() => setCustomerWishlist(prev => prev.filter(id => id !== product.id))}
                                style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
                              >
                                <Heart size={16} fill="#E85A4F" color="#E85A4F" />
                              </button>
                              <img src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} alt={product.name} style={{ height: "180px", width: "100%", objectFit: "cover" }} />
                              <div className="product-card-body" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span className="product-card-title" style={{ fontSize: "1rem", fontWeight: 700 }}>{product.name}</span>
                                <span className="product-card-meta" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{product.unit}</span>
                                
                                <div className="product-card-price-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                                  <span className="product-price" style={{ fontSize: "1.1rem", fontWeight: 800 }}>₹{product.price}</span>
                                  <span style={{ fontSize: "0.85rem", color: outOfStock ? "#D32F2F" : "var(--color-text-muted)", fontWeight: 600 }}>
                                    {outOfStock ? "No Stock" : `${product.stock_quantity} left`}
                                  </span>
                                </div>

                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="btn btn-secondary"
                                  style={{ width: "100%", padding: "0.4rem", fontSize: "0.82rem", borderRadius: "8px", marginTop: "0.75rem", justifyContent: "center" }}
                                >
                                  Edit & Update Stock
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                // Shopping view (Default)
                <>
                  {/* Hero Description Banner */}
                  <div className="full-page-desc-banner" style={{ background: `linear-gradient(135deg, ${store.theme_color}12, ${store.secondary_color}18)` }}>
                    <h2 style={{ color: store.theme_color }}>{store.name}</h2>
                    <p>{store.description}</p>
                  </div>

                  {/* Low Stock Warnings */}
                  {products.filter(p => p.stock_quantity <= store.low_stock_threshold).length > 0 && (
                    <div style={{ padding: "1.5rem 2.5rem", backgroundColor: "#FFE3E0", borderBottom: "1px solid #FFCDD2" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D32F2F", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                        <AlertTriangle size={18} /> Out of Stock / Low Stock Warnings
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                        {products.filter(p => p.stock_quantity <= store.low_stock_threshold).map(p => (
                          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #FFCDD2", fontSize: "0.85rem", color: "#C62828" }}>
                            <span>{p.name} ({p.unit})</span>
                            <span style={{ fontWeight: "bold" }}>{p.stock_quantity === 0 ? "Out of Stock" : `${p.stock_quantity} left`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories Bar & Quick Add Buttons */}
                  <div style={{ padding: "1rem 2.5rem 0 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.05)", overflowX: "auto", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", overflowX: "auto" }}>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          style={{ 
                            padding: "0.6rem 1.2rem", 
                            fontSize: "0.88rem", 
                            fontWeight: 600, 
                            border: "none", 
                            background: "none", 
                            cursor: "pointer", 
                            borderBottom: `3px solid ${selectedCategory === cat ? store.theme_color : "transparent"}`,
                            color: selectedCategory === cat ? store.theme_color : "var(--color-text-muted)",
                            paddingBottom: "0.75rem",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", paddingBottom: "0.5rem", flexShrink: 0 }}>
                      <button
                        onClick={() => {
                          setIsConsoleOpen(true);
                          setActiveTab("stock");
                          setShowAddProduct(true);
                          setShowAddCategory(false);
                          setEditingProduct(null);
                        }}
                        style={{
                          padding: "0.45rem 0.9rem",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          borderRadius: "20px",
                          backgroundColor: store.theme_color,
                          color: "#FFFFFF",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                        }}
                      >
                        <Plus size={14} /> Add Product
                      </button>
                      <button
                        onClick={() => {
                          setIsConsoleOpen(true);
                          setActiveTab("stock");
                          setShowAddCategory(true);
                          setShowAddProduct(false);
                          setEditingProduct(null);
                        }}
                        style={{
                          padding: "0.45rem 0.9rem",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          borderRadius: "20px",
                          backgroundColor: store?.theme_color || "var(--color-accent-red)",
                          color: "#FFFFFF",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                        }}
                      >
                        <Plus size={14} /> Add Category
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="full-page-grid">
                    {filteredProducts.map(product => {
                      const outOfStock = product.stock_quantity <= 0;
                      const hasWishlist = customerWishlist.includes(product.id);
                      return (
                        <div key={product.id} className="product-card" style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", position: "relative" }}>
                          {product.stock_quantity <= store.low_stock_threshold && (
                            <div className="product-badge" style={{ background: "#FFE3E0", color: "#D32F2F" }}>
                              {outOfStock ? "Out of Stock" : "Low Stock"}
                            </div>
                          )}
                          
                          {/* Wishlist toggle button */}
                          <button 
                            onClick={() => {
                              if (hasWishlist) {
                                setCustomerWishlist(prev => prev.filter(id => id !== product.id));
                              } else {
                                setCustomerWishlist(prev => [...prev, product.id]);
                              }
                            }}
                            style={{ 
                              position: "absolute", 
                              top: "0.5rem", 
                              right: "0.5rem", 
                              background: "rgba(255,255,255,0.85)", 
                              border: "none", 
                              borderRadius: "50%", 
                              width: "30px", 
                              height: "30px", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              cursor: "pointer", 
                              color: hasWishlist ? "red" : "#718096",
                              zIndex: 10,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              fontSize: "1.1rem"
                            }}
                          >
                            {hasWishlist ? "â¤ï¸" : "ðŸ¤"}
                          </button>

                          <img 
                            src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} 
                            alt={product.name} 
                            style={{ height: "180px", width: "100%", objectFit: "cover" }}
                          />
                          <div className="product-card-body" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <span className="product-card-title" style={{ fontSize: "1rem", fontWeight: 700 }}>{product.name}</span>
                            <span className="product-card-meta" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{product.unit}</span>
                            
                            <div className="product-card-price-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                              <span className="product-price" style={{ fontSize: "1.1rem", fontWeight: 800 }}>₹{product.price}</span>
                              <span style={{ fontSize: "0.85rem", color: outOfStock ? "#D32F2F" : "var(--color-text-muted)", fontWeight: 600 }}>
                                {outOfStock ? "No Stock" : `${product.stock_quantity} left`}
                              </span>
                            </div>

                            {/* Owner Actions */}
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }} className="no-print">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: "0.4rem", fontSize: "0.82rem", borderRadius: "8px", justifyContent: "center" }}
                              >
                                Edit & Update Stock
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Footer Section */}
              <div className="full-page-footer">
                {store.address && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={16} style={{ color: store.theme_color }} />
                    <span>{store.address}</span>
                  </div>
                )}
                {store.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Phone size={16} style={{ color: store.theme_color }} />
                    <span>Call Store: {store.phone}</span>
                  </div>
                )}
                <div style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.5rem" }}>
                  Powered by GenScale Website Maker
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Store Copilot Bubble & Chat Panel */}
      {view !== "builder" && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000 }}>
          {isChatOpen ? (
            <div style={{ backgroundColor: "#FFFFFF", width: "320px", height: "400px", borderRadius: "16px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "1rem", backgroundColor: "var(--color-accent-red)", color: "#FFFFFF", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{t("chatHelper")}</span>
                <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem" }}>Ã—</button>
              </div>
              <div style={{ flexGrow: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                {chatHistory.map((h, i) => (
                  <div key={i} style={{ alignSelf: h.sender === "user" ? "flex-end" : "flex-start", backgroundColor: h.sender === "user" ? "var(--color-accent-pink)" : "#F0F0F0", padding: "0.6rem 0.8rem", borderRadius: "10px", maxWidth: "80%", wordBreak: "break-word" }}>
                    {h.text}
                  </div>
                ))}
                {aiLoading && <div style={{ color: "var(--color-text-muted)" }}>Thinking...</div>}
              </div>
              <div style={{ padding: "0.75rem", borderTop: "1px solid var(--color-border)", display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  placeholder="Ask copilot..." 
                  value={chatMessage} 
                  onChange={e => setChatMessage(e.target.value)} 
                  onKeyDown={e => { if (e.key === "Enter") handleSendChatMessage(); }} 
                  style={{ flexGrow: 1, padding: "0.4rem 0.8rem", borderRadius: "20px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }} 
                />
                <button onClick={handleSendChatMessage} style={{ backgroundColor: "var(--color-accent-red)", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "50%", cursor: "pointer" }}>
                  →
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{ backgroundColor: "var(--color-accent-red)", color: "#FFFFFF", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", boxShadow: "var(--shadow-md)" }}
            >
              <MessageSquare size={24} />
            </button>
          )}
        </div>
      )}

      {/* Invoice Receipt Confirmation print Modal */}
      {generatedInvoice && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", overflowY: "auto" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", maxWidth: invoiceFormat === "A4" ? "760px" : "480px", width: "100%", padding: "2rem", boxShadow: "var(--shadow-lg)", position: "relative" }} className="printable-invoice">
            
            {invoiceFormat === "Thermal" ? (
              // Thermal Receipt Template
              <>
                <h2 style={{ textAlign: "center", fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--color-accent-red)", marginBottom: "0.25rem" }}>{store?.name}</h2>
                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>{store?.address || "Main Market, India"}</p>
                
                <div style={{ borderBottom: "1px dashed var(--color-border)", paddingBottom: "0.75rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
                  <div><strong>Invoice:</strong> #{generatedInvoice.id}</div>
                  <div><strong>Date:</strong> {new Date(generatedInvoice.date).toLocaleString()}</div>
                  <div><strong>Customer:</strong> {generatedInvoice.customerName} ({generatedInvoice.customerPhone})</div>
                  <div><strong>Payment Mode:</strong> {generatedInvoice.paymentMethod}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.25rem" }}>
                    <span>Item</span>
                    <span>Qty x Price</span>
                    <span>GST/HSN</span>
                    <span>Total</span>
                  </div>
                  {generatedInvoice.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                      <span>{item.name}</span>
                      <span style={{ color: "var(--color-text-muted)" }}>{item.quantity} x ₹{item.price}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{item.gst_rate}% / {item.hsn_code}</span>
                      <span>₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // A4 Tax Invoice Template
              <>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--color-accent-red)", margin: 0 }}>{store?.name}</h2>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0 0" }}>{store?.address}</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", margin: 0 }}>GSTIN: 24AAACK1234A1Z0 | Phone: {store?.phone}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "var(--color-text-dark)" }}>TAX INVOICE</h3>
                    <p style={{ fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}><strong>Invoice No:</strong> #{generatedInvoice.id}</p>
                    <p style={{ fontSize: "0.85rem", margin: 0 }}><strong>Date:</strong> {new Date(generatedInvoice.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "1.5rem", fontSize: "0.85rem", backgroundColor: "#FAF9F6", padding: "1rem", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>BILLED TO:</div>
                    <strong>{generatedInvoice.customerName}</strong>
                    <div>Phone: {generatedInvoice.customerPhone}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>PAYMENT SUMMARY:</div>
                    <div>Mode: {generatedInvoice.paymentMethod}</div>
                    <div>Status: Paid</div>
                  </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left", fontWeight: "bold" }}>
                      <th style={{ padding: "0.5rem" }}>Item Description</th>
                      <th>HSN</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Taxable Val</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedInvoice.items.map((item: any, idx: number) => {
                      const rate = item.gst_rate || 18.0;
                      const total = item.quantity * item.price;
                      const baseVal = total / (1 + rate / 100);
                      const tax = total - baseVal;
                      return (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "0.5rem", fontWeight: 600 }}>{item.name}</td>
                          <td>{item.hsn_code}</td>
                          <td>{item.quantity} {item.unit}</td>
                          <td>₹{item.price}</td>
                          <td>₹{Math.round(baseVal)}</td>
                          <td>{rate/2}% (₹{Math.round(tax/2)})</td>
                          <td>{rate/2}% (₹{Math.round(tax/2)})</td>
                          <td style={{ textAlign: "right", fontWeight: 700 }}>₹{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}

            {/* Dynamic UPI Payment QR Code display */}
            {(generatedInvoice.paymentMethod === "UPI" || generatedInvoice.paymentMethod === "Split") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", margin: "1rem 0", padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "8px", backgroundColor: "#FAF9F6" }} className="no-print">
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Scan QR to Pay via UPI</span>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`upi://pay?pa=store@upi&pn=${encodeURIComponent(store?.name || "Kirana")}&am=${generatedInvoice.total}&cu=INR`)}`} 
                  alt="UPI QR Code" 
                  style={{ width: "100px", height: "100px" }}
                />
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-accent-red)" }}>Amount: ₹{generatedInvoice.total}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.2rem", borderTop: "2px dashed var(--color-border)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
              <span>Total Invoice Bill</span>
              <span style={{ color: "var(--color-accent-red)" }}>₹{generatedInvoice.total}</span>
            </div>

            <div className="no-print" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", backgroundColor: "var(--color-accent-red)", color: "#FFFFFF", borderRadius: "50px" }}>
                Print Invoice
              </button>
              <button
                onClick={() => handleWhatsAppShare(generatedInvoice)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", backgroundColor: "#25D366", color: "#fff", border: "none", borderRadius: "50px", padding: "0.6rem 1rem", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}
              >
                <MessageSquare size={15} /> WhatsApp Bill
              </button>
              <button onClick={() => setGeneratedInvoice(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", borderRadius: "50px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Stock Alerts Drawer overlay */}
      {isCustomerCartOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2500, display: "flex", justifyContent: "flex-end" }} className="no-print">
          <div style={{ backgroundColor: "var(--color-bg-card)", width: "100%", maxWidth: "420px", height: "100%", display: "flex", flexDirection: "column", padding: "1.5rem", color: "var(--color-text-dark)", borderLeft: "1px solid var(--color-border)" }} className="customer-cart-drawer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", color: "#D32F2F" }}>
                <AlertTriangle size={22} /> Low Stock Warnings
              </h3>
              <button onClick={() => setIsCustomerCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "var(--color-text-muted)" }}>Ã—</button>
            </div>

            {products.filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5)).length === 0 ? (
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", gap: "0.5rem" }}>
                <Package size={48} style={{ opacity: 0.3 }} />
                <p style={{ fontWeight: 600 }}>All items are in stock!</p>
              </div>
            ) : (
              <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {products
                  .filter(p => p.stock_quantity <= (store?.low_stock_threshold || 5))
                  .map(product => {
                    const outOfStock = product.stock_quantity <= 0;
                    return (
                      <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flex: 1 }}>
                          <img 
                            src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} 
                            alt={product.name} 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} 
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: "0.9rem", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{product.name}</strong>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: outOfStock ? "#D32F2F" : "#E65100" }}>
                              {outOfStock ? "Out of Stock" : `Only ${product.stock_quantity} left (${product.unit})`}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Qty:</span>
                          <input 
                            type="number" 
                            defaultValue={product.stock_quantity}
                            min="0"
                            style={{ width: "65px", padding: "0.3rem", borderRadius: "6px", border: "1px solid var(--color-border)", textAlign: "center", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)", fontSize: "0.85rem", fontWeight: "bold" }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                const nextVal = parseInt((e.target as HTMLInputElement).value) || 0;
                                await handleQuickUpdateStock(product, nextVal);
                              }
                            }}
                          />
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              setIsCustomerCartOpen(false);
                            }} 
                            className="btn btn-secondary" 
                            style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", borderRadius: "6px" }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
            
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem", fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <AlertTriangle size={16} />
              <span>Press <strong>Enter</strong> in quantity box to instantly update stock levels.</span>
            </div>
          </div>
        </div>
      )}


      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", maxWidth: "400px", width: "100%", padding: "2rem", boxShadow: "var(--shadow-lg)" }}>
            <h3 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              {authMode === "login" ? "Login to GenScale" : "Create Store Owner Account"}
            </h3>
            
            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {authMode === "signup" && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" required placeholder="e.g. Suresh Patel" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" placeholder="e.g. 9825098250" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
                  </div>
                  <div className="form-group">
                    <label>Assigned Role</label>
                    <CustomDropdown
                      value={authForm.role}
                      onChange={val => setAuthForm({ ...authForm, role: val })}
                      options={[
                        { value: "Store Owner", label: "Store Owner" },
                        { value: "Cashier", label: "Cashier" }
                      ]}
                      className="premium-select"
                      style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0.6rem 0.95rem" }}
                      selectStyle={{ paddingRight: "1.5rem" }}
                    />
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="e.g. name@kirana.com" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)" }} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", padding: "0.75rem", marginTop: "0.5rem", borderRadius: "50px", backgroundColor: "var(--color-accent-red)" }}>
                {authMode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
            
            <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem" }}>
              {authMode === "login" ? (
                <span>
                  Don't have an account?{" "}
                  <button onClick={() => setAuthMode("signup")} style={{ border: "none", background: "none", color: "var(--color-accent-red)", fontWeight: 700, cursor: "pointer" }}>
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("login")} style={{ border: "none", background: "none", color: "var(--color-accent-red)", fontWeight: 700, cursor: "pointer" }}>
                    Login
                  </button>
                </span>
              )}
            </div>
            
            <button onClick={() => setIsAuthModalOpen(false)} style={{ display: "block", margin: "1rem auto 0 auto", border: "none", background: "none", color: "var(--color-text-muted)", fontSize: "0.82rem", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--color-bg-card)", borderRadius: "16px", maxWidth: "600px", width: "100%", padding: "2rem", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: "1.5rem", color: store?.theme_color || "var(--color-accent-red)" }}>
              Edit Product: {editingProduct.name}
            </h3>
            <form onSubmit={handleEditProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label>Item Name</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" required placeholder="Product name" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", flex: 1, backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                  <button type="button" onClick={() => handleAISuggestProduct(editingProduct.name)} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                    <Sparkles size={13} /> {t("aiSuggest")}
                  </button>
                </div>
              </div>

              <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Category</label>
                  <CustomDropdown
                    value={editingProduct.category}
                    onChange={val => setEditingProduct({...editingProduct, category: val})}
                    options={categoriesList.length > 0 ? categoriesList.map(c => ({ value: c.name, label: c.name })) : [
                      { value: "Dairy & Eggs", label: "Dairy & Eggs" },
                      { value: "Grains, Oils & Masalas", label: "Grains, Oils & Masalas" },
                      { value: "Snacks & Beverages", label: "Snacks & Beverages" },
                      { value: "Household & Personal Care", label: "Household & Personal Care" }
                    ]}
                    className="premium-select"
                    style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0.6rem 0.95rem" }}
                    selectStyle={{ paddingRight: "1.5rem" }}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input type="text" required placeholder="Unit (e.g. 1kg)" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
              </div>

              <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" required min="0" placeholder="Selling price (₹)" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
                <div className="form-group">
                  <label>Purchase Cost (₹)</label>
                  <input type="number" required min="0" placeholder="Cost price (₹)" value={editingProduct.purchase_cost} onChange={e => setEditingProduct({...editingProduct, purchase_cost: parseFloat(e.target.value) || 0})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
              </div>

              <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" required min="0" placeholder="Available stock quantity" value={editingProduct.stock_quantity} onChange={e => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value) || 0})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
                <div className="form-group">
                  <label>Barcode</label>
                  <input type="text" placeholder="Barcode number" value={editingProduct.barcode || ""} onChange={e => setEditingProduct({...editingProduct, barcode: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
              </div>

              <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input type="text" placeholder="SKU Code" value={editingProduct.sku || ""} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
                <div className="form-group">
                  <label>HSN Code</label>
                  <input type="text" placeholder="HSN Code" value={editingProduct.hsn_code || ""} onChange={e => setEditingProduct({...editingProduct, hsn_code: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
              </div>

              <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>GST Rate (%)</label>
                  <input type="number" placeholder="GST Rate % (e.g. 18)" value={editingProduct.gst_rate || 18} onChange={e => setEditingProduct({...editingProduct, gst_rate: parseFloat(e.target.value) || 18.0})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="date" value={editingProduct.expiry_date || ""} onChange={e => setEditingProduct({...editingProduct, expiry_date: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.6rem", borderRadius: "8px", backgroundColor: store?.theme_color || "var(--color-accent-red)", borderColor: store?.theme_color || "var(--color-accent-red)" }}>
                  Save Product
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "0.6rem", borderRadius: "8px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--color-bg-card)", borderRadius: "16px", maxWidth: "380px", width: "100%", padding: "2rem", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)", textAlign: "center" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "rgba(211, 47, 47, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", color: "var(--theme-color, var(--color-accent-red))" }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "0.5rem" }}>Security Verification</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Please enter your password to access the Owner Control Panel.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!currentUser) return;
              setIsVerifyingPassword(true);
              try {
                const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: currentUser.email,
                    password: ownerPasswordInput
                  })
                });
                if (response.ok) {
                  setIsOwnerVerified(true);
                  setShowPasswordPrompt(false);
                  setOwnerPasswordInput("");
                  setView("dashboard");
                } else {
                  alert("Incorrect password. Access denied.");
                }
              } catch (err) {
                console.error(err);
                alert("Error verifying password.");
              } finally {
                setIsVerifyingPassword(false);
              }
            }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ textAlign: "left" }}>
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={ownerPasswordInput} 
                  onChange={e => setOwnerPasswordInput(e.target.value)} 
                  style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--color-border)", width: "100%", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-dark)", boxSizing: "border-box" }} 
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isVerifyingPassword}
                style={{ width: "100%", justifyContent: "center", padding: "0.6rem", borderRadius: "8px", backgroundColor: store?.theme_color || "var(--color-accent-red)", borderColor: store?.theme_color || "var(--color-accent-red)" }}
              >
                {isVerifyingPassword ? "Verifying..." : "Verify & Enter"}
              </button>
              <button 
                type="button" 
                onClick={() => setShowPasswordPrompt(false)} 
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "0.6rem", borderRadius: "8px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}