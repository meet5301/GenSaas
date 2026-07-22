import re
from typing import Dict, Any, List, Optional

# Standard database of high-quality Indian Kirana Store catalog items
DEFAULT_KIRANA_CATALOG = [
    # Dairy & Eggs
    {
        "name": "Amul Butter",
        "category": "Dairy & Eggs",
        "price": 56.0,
        "stock_quantity": 20,
        "unit": "100g pack",
        "description": "Premium salted butter made from fresh milk.",
        "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Amul Taaza Milk",
        "category": "Dairy & Eggs",
        "price": 28.0,
        "stock_quantity": 30,
        "unit": "500ml packet",
        "description": "Fresh pasteurized double toned milk.",
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Fresh Farm Eggs",
        "category": "Dairy & Eggs",
        "price": 48.0,
        "stock_quantity": 15,
        "unit": "6 pcs tray",
        "description": "High-quality, farm-fresh white eggs.",
        "image_url": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Mother Dairy Paneer",
        "category": "Dairy & Eggs",
        "price": 90.0,
        "stock_quantity": 12,
        "unit": "200g pack",
        "description": "Soft and fresh cottage cheese.",
        "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
    },
    
    # Grains, Oils & Masalas
    {
        "name": "Aashirvaad Shudh Chakki Atta",
        "category": "Grains, Oils & Masalas",
        "price": 245.0,
        "stock_quantity": 18,
        "unit": "5kg bag",
        "description": "100% pure whole wheat flour with 0% maida.",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Fortune Premium Kachi Ghani Mustard Oil",
        "category": "Grains, Oils & Masalas",
        "price": 175.0,
        "stock_quantity": 25,
        "unit": "1L bottle",
        "description": "Pure mustard oil made from high-quality seeds.",
        "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "India Gate Basmati Rice Super",
        "category": "Grains, Oils & Masalas",
        "price": 120.0,
        "stock_quantity": 22,
        "unit": "1kg pack",
        "description": "Aromatic, long-grain basmati rice.",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Tata Salt",
        "category": "Grains, Oils & Masalas",
        "price": 28.0,
        "stock_quantity": 40,
        "unit": "1kg packet",
        "description": "Iodized salt, Desh Ka Namak.",
        "image_url": "https://images.unsplash.com/photo-1604882737321-e6937fd6f519?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Everest Garam Masala",
        "category": "Grains, Oils & Masalas",
        "price": 82.0,
        "stock_quantity": 15,
        "unit": "100g pack",
        "description": "A perfect blend of rich, aromatic spices.",
        "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80"
    },
    
    # Snacks & Beverages
    {
        "name": "Maggi 2-Min Masala Noodles",
        "category": "Snacks & Beverages",
        "price": 60.0,
        "stock_quantity": 50,
        "unit": "4-pack",
        "description": "India's favorite instant masala noodles.",
        "image_url": "https://images.unsplash.com/photo-1612966608967-312ba5987236?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Haldiram's Bhujia Sev",
        "category": "Snacks & Beverages",
        "price": 45.0,
        "stock_quantity": 30,
        "unit": "150g pack",
        "description": "Crispy and spicy gram flour noodle snack.",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Parle-G Gold Biscuits",
        "category": "Snacks & Beverages",
        "price": 10.0,
        "stock_quantity": 100,
        "unit": "150g pack",
        "description": "The original Gluco biscuits, perfect with chai.",
        "image_url": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Red Label Tea",
        "category": "Snacks & Beverages",
        "price": 135.0,
        "stock_quantity": 20,
        "unit": "250g pack",
        "description": "High-quality black tea leaves from Brooke Bond.",
        "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Coca-Cola Original",
        "category": "Snacks & Beverages",
        "price": 50.0,
        "stock_quantity": 24,
        "unit": "750ml bottle",
        "description": "Refreshing sparkling soft drink.",
        "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80"
    },
    
    # Household & Personal Care
    {
        "name": "Dettol Liquid Handwash",
        "category": "Household & Personal Care",
        "price": 99.0,
        "stock_quantity": 15,
        "unit": "200ml pump",
        "description": "Effective germ protection handwash.",
        "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Vim Lemon Dishwash Gel",
        "category": "Household & Personal Care",
        "price": 60.0,
        "stock_quantity": 18,
        "unit": "250ml bottle",
        "description": "Concentrated dishwash gel with the power of lemons.",
        "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Colgate MaxFresh Toothpaste",
        "category": "Household & Personal Care",
        "price": 95.0,
        "stock_quantity": 25,
        "unit": "150g pack",
        "description": "Spicy fresh gel toothpaste with cooling crystals.",
        "image_url": "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=400&q=80"
    },
    {
        "name": "Surf Excel Easy Wash Powder",
        "category": "Household & Personal Care",
        "price": 140.0,
        "stock_quantity": 10,
        "unit": "1kg packet",
        "description": "Detergent powder that removes tough stains easily.",
        "image_url": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    }
]

def generate_store_from_prompt(prompt: str, store_name_override: Optional[str] = None, selected_items: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Parses a user input prompt (speech transcript or typed) to extract store parameters,
    adjusts colors, and returns custom generated general store products dynamically.
    """
    cleaned_prompt = prompt.strip()
    
    # 1. Parse Store Name
    store_name = "Apna Kirana Store"
    
    if store_name_override and store_name_override.strip():
        store_name = store_name_override.strip()
    
    name_patterns = [
        r"(?:name is|naam hai|named|called|call it)\s+['\"]?([A-Za-z0-9\s&]+)['\"]?",
        r"([A-Za-z0-9\s&]+)(?:general store|store|kirana|bazaar|mart|dukaan|supermarket|grocery|provision|provisions)",
    ]
    
    for pattern in name_patterns:
        match = re.search(pattern, cleaned_prompt, re.IGNORECASE)
        if match:
            extracted = match.group(1).strip()
            # Clean trailing/leading connection words
            extracted = re.sub(r"^(my store|apna|mera|our store)\s+", "", extracted, flags=re.IGNORECASE)
            # Remove trailing words starting with "and", "item", "in", etc.
            extracted = re.sub(r"\s+(and|item|items|will|is|are|we|sell|sells|selling|avail|available|location|in|at)\b.*$", "", extracted, flags=re.IGNORECASE)
            if len(extracted) > 2:
                # Determine suffix based on what was matched or in prompt
                suffix = " Store"
                for suf in ["general store", "store", "kirana", "bazaar", "mart", "dukaan", "supermarket", "grocery", "provision"]:
                    if suf in prompt.lower() and extracted.lower() in prompt.lower():
                        idx = prompt.lower().find(extracted.lower()) + len(extracted)
                        following = prompt[idx:].strip().lower()
                        if following.startswith(suf):
                            suffix = " " + suf.title()
                            break
                
                # Clean up if extracted already has it
                if any(x in extracted.lower() for x in ["store", "kirana", "bazaar", "mart", "dukaan", "provision"]):
                    suffix = ""
                store_name = extracted.title() + suffix
                break
                
    # If name is still generic but we find capitalized words in prompt
    if store_name == "Apna Kirana Store":
        capitalized = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b", cleaned_prompt)
        if capitalized:
            longest = max(capitalized, key=len)
            if len(longest) > 3 and longest.lower() not in ["india", "indian", "gujarat", "delhi", "mumbai", "ahmedabad", "pune", "bangalore"]:
                suffix = " Kirana Store"
                if "store" in prompt.lower():
                    suffix = " Store"
                elif "kirana" in prompt.lower():
                    suffix = " Kirana"
                elif "dukaan" in prompt.lower():
                    suffix = " Dukaan"
                store_name = longest + suffix

    # Create slug
    slug = re.sub(r'[^a-z0-9]+', '-', store_name.lower()).strip('-')
    if not slug:
        slug = "my-kirana-store"

    # 2. Parse Description
    description = f"Welcome to {store_name}! We provide fresh groceries, dairy products, grains, spices, snacks, and daily household needs directly to your doorstep."
    sells_match = re.search(r"(?:sell|selling|bechna|available|availables|specialist in)\s+([A-Za-z0-9\s,&\text]+)", cleaned_prompt, re.IGNORECASE)
    if sells_match:
        items_sold = sells_match.group(1).strip().strip('.')
        description = f"Your trusted local kirana. We specialize in {items_sold}. Quality goods at honest prices."

    # 3. Parse Location/Address
    address = "Main Market Road, India"
    cities = ["Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Pune", "Hyderabad", "Chennai", "Kolkata", "Surat", "Rajkot", "Vadodara", "Jaipur", "Lucknow", "Indore", "Bhopal", "Patna"]
    for city in cities:
        if city.lower() in cleaned_prompt.lower():
            address = f"Station Road, near Gandhi Chowk, {city}"
            break
            
    loc_match = re.search(r"(?:in|at|near|location|address is)\s+([A-Z][a-zA-Z\s,]+)(?:\b|$)", cleaned_prompt)
    if loc_match:
        loc = loc_match.group(1).strip()
        if len(loc) > 3 and loc.lower() not in ["july", "june", "monday", "tuesday", "morning", "evening"]:
            loc = loc.split(" sell")[0].split(" we")[0].split(" open")[0].split(" have")[0]
            address = f"Near Temple, {loc.strip()}"

    # 4. Parse Phone / Contact Number
    phone = "9876543210"
    phone_match = re.search(r"\b(\d{10})\b", cleaned_prompt)
    if phone_match:
        phone = phone_match.group(1)
    else:
        phone_match_alt = re.search(r"\b(?:\+91[\s-]?)?(\d{5}[\s-]?\d{5})\b", cleaned_prompt)
        if phone_match_alt:
            phone = phone_match_alt.group(1).replace(" ", "").replace("-", "")

    # 5. Parse Owner Name
    owner_name = "Kirana Merchant"
    owner_patterns = [
        r"(?:owner|malik|maalik|owned by|run by|chalata hai|chalate hain)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)",
        r"(?:my name is|mera naam|naam hai)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)",
    ]
    for pat in owner_patterns:
        m = re.search(pat, cleaned_prompt, re.IGNORECASE)
        if m:
            owner_name = m.group(1).strip().title()
            break

    # 6. Parse Store Timings
    timings = "8:00 AM - 9:30 PM (All Days)"
    timings_match = re.search(r"(\d+(?::\d+)?\s*(?:am|pm)\s*(?:to|-)\s*\d+(?::\d+)?\s*(?:am|pm))", cleaned_prompt, re.IGNORECASE)
    if timings_match:
        timings = f"{timings_match.group(1).upper()} (All Days)"
    elif "24 hour" in cleaned_prompt.lower() or "24/7" in cleaned_prompt.lower():
        timings = "Open 24 Hours (All Days)"

    # 6. Parse Themes
    theme_color = "#943F3F"
    secondary_color = "#E8D3C9"
    bg_color = "#FAF6F0"
    p_lower = cleaned_prompt.lower()

    if any(k in p_lower for k in ["green", "organic", "natural", "herbal", "eco"]):
        theme_color, secondary_color, bg_color = "#2E7D32", "#C8E6C9", "#F1F8E9"
    elif any(k in p_lower for k in ["blue", "modern", "premium", "corporate", "tech"]):
        theme_color, secondary_color, bg_color = "#1565C0", "#BBDEFB", "#F5F5F5"
    elif any(k in p_lower for k in ["saffron", "orange", "festive", "traditional", "desi"]):
        theme_color, secondary_color, bg_color = "#E65100", "#FFE0B2", "#FFF8E1"
    elif any(k in p_lower for k in ["purple", "luxury", "royal", "premium"]):
        theme_color, secondary_color, bg_color = "#6A1B9A", "#E1BEE7", "#F3E5F5"
    elif any(k in p_lower for k in ["yellow", "budget", "cheap", "sasta", "affordable"]):
        theme_color, secondary_color, bg_color = "#F9A825", "#FFF9C4", "#FFFDE7"

    # 7. Select & Filter Products
    matched_products = []
    
    # Mapping for item categories
    category_mapping = {
        "Dairy & Eggs": ["milk", "dairy", "butter", "cheese", "paneer", "egg", "eggs", "curd", "yoghurt", "ghee", "doodh", "makhan", "anda"],
        "Grains, Oils & Masalas": ["oil", "atta", "flour", "rice", "salt", "namak", "masala", "spices", "dal", "wheat", "chawal", "turmeric", "haldi", "chilli", "jeera", "mustard"],
        "Household & Personal Care": ["soap", "shampoo", "wash", "powder", "cleaner", "detergent", "brush", "toothpaste", "colgate", "dettol", "vim", "surf", "paste", "liquid", "sanitizer"],
    }
    
    # Mapping for product images
    image_mapping = {
        "milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
        "butter": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
        "egg": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80",
        "eggs": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80",
        "paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
        "cheese": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=400&q=80",
        "ghee": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
        "oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
        "atta": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
        "flour": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
        "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
        "salt": "https://images.unsplash.com/photo-1604882737321-e6937fd6f519?auto=format&fit=crop&w=400&q=80",
        "masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
        "spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
        "drink": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
        "soda": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
        "coke": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
        "pepsi": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
        "cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
        "chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
        "wafferss": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
        "wafer": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
        "biscuit": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
        "biscut": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
        "cookie": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
        "tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
        "chai": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
        "coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
        "soap": "https://images.unsplash.com/photo-1607006342456-ba275cd34280?auto=format&fit=crop&w=400&q=80",
        "shampoo": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80",
        "handwash": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80",
        "toothpaste": "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=400&q=80",
        "colgate": "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=400&q=80",
        "detergent": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80",
        "cleaner": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80",
        "noodle": "https://images.unsplash.com/photo-1612966608967-312ba5987236?auto=format&fit=crop&w=400&q=80",
        "noodles": "https://images.unsplash.com/photo-1612966608967-312ba5987236?auto=format&fit=crop&w=400&q=80",
        "maggi": "https://images.unsplash.com/photo-1612966608967-312ba5987236?auto=format&fit=crop&w=400&q=80",
    }
    
    category_defaults = {
        "Dairy & Eggs": "https://images.unsplash.com/photo-1528498033603-3c140dfedd0c?auto=format&fit=crop&w=400&q=80",
        "Grains, Oils & Masalas": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
        "Snacks & Beverages": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
        "Household & Personal Care": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    }

    def resolve_product(name: str) -> Dict[str, Any]:
        name_lower = name.lower()
        
        # 1. Determine Category
        category = "Snacks & Beverages"
        for cat, keywords in category_mapping.items():
            if any(k in name_lower for k in keywords):
                category = cat
                break
                
        # 2. Determine Image
        image_url = category_defaults[category]
        for kw, img in image_mapping.items():
            if kw in name_lower:
                image_url = img
                break
                
        # 3. Determine Price
        price = 45.0
        if "oil" in name_lower:
            price = 175.0
        elif "rice" in name_lower:
            price = 110.0
        elif "atta" in name_lower:
            price = 230.0
        elif "milk" in name_lower:
            price = 28.0
        elif "egg" in name_lower:
            price = 48.0
        elif "butter" in name_lower:
            price = 56.0
        elif "biscuit" in name_lower or "biscut" in name_lower:
            price = 20.0
        elif "chips" in name_lower or "wafferss" in name_lower or "wafer" in name_lower:
            price = 30.0
        elif "shampoo" in name_lower:
            price = 120.0
        elif "soap" in name_lower:
            price = 40.0
            
        # 4. Determine Unit
        unit = "1 unit"
        if "milk" in name_lower:
            unit = "500ml packet"
        elif "oil" in name_lower:
            unit = "1L bottle"
        elif "atta" in name_lower or "flour" in name_lower:
            unit = "5kg bag"
        elif "rice" in name_lower:
            unit = "1kg pack"
        elif "egg" in name_lower:
            unit = "6 pcs tray"
        elif "butter" in name_lower or "paneer" in name_lower or "cheese" in name_lower:
            unit = "200g pack"
        elif "biscuit" in name_lower or "biscut" in name_lower or "chips" in name_lower or "wafferss" in name_lower or "wafer" in name_lower:
            unit = "pack"
            
        return {
            "name": name,
            "category": category,
            "price": price,
            "stock_quantity": 20,
            "unit": unit,
            "description": f"Fresh and high quality {name}.",
            "image_url": image_url,
            "is_available": True
        }

    # Custom item parsing logic
    item_triggers = [
        r"(?:item will be|items are|we sell|sells|selling|sell|available|specialist in|we have|deal in|deals in)\s+([A-Za-z0-9\s,&\-\'\"]+)",
    ]
    
    items_text = ""
    for pattern in item_triggers:
        match = re.search(pattern, cleaned_prompt, re.IGNORECASE)
        if match:
            items_text = match.group(1).strip()
            break
            
    parsed_item_names = []
    if items_text:
        # Strip trailing location or phone info
        items_text = re.split(r"\s+(?:in|at|near|phone|contact|open|timings|address)\b", items_text, flags=re.IGNORECASE)[0]
        
        # Split tokens
        if "," in items_text or " and " in items_text.lower() or " & " in items_text:
            raw_items = re.split(r",\s*|\s+and\s+|\s+or\s+|\s+&\s+", items_text, flags=re.IGNORECASE)
        else:
            tokens = items_text.split()
            raw_items = []
            i = 0
            while i < len(tokens):
                merged = False
                if i + 1 < len(tokens):
                    combo = f"{tokens[i]} {tokens[i+1]}".lower()
                    if combo in [
                        "cold drink", "cold drinks", "soft drink", "soft drinks", 
                        "potato chips", "banana chips", "cooking oil", "mustard oil",
                        "fresh milk", "fresh eggs", "dish wash", "hand wash", 
                        "washing powder", "hair oil", "body soap", "dish soap", 
                        "green tea", "black tea", "atta flour", "wheat flour"
                    ]:
                        raw_items.append(combo)
                        i += 2
                        merged = True
                
                if not merged:
                    raw_items.append(tokens[i])
                    i += 1
                    
        for item in raw_items:
            cleaned = item.strip().strip('.').strip()
            cleaned = re.sub(r"^(a|an|the|some|any|various|few)\s+", "", cleaned, flags=re.IGNORECASE)
            if len(cleaned) > 1 and cleaned.lower() not in ["item", "items", "product", "products", "good", "goods", "groceries", "grocery", "household"]:
                parsed_item_names.append(cleaned.title())

    if selected_items is not None:
        matched_products = []
        for name in selected_items:
            if name.strip():
                matched_products.append(resolve_product(name.strip()))
    elif parsed_item_names:
        for name in parsed_item_names:
            matched_products.append(resolve_product(name))
            
        # Supplement if fewer than 6 items to make the catalog look rich
        if len(matched_products) < 6:
            for default_prod in DEFAULT_KIRANA_CATALOG:
                # Avoid duplicates
                if not any(p["name"].lower() in default_prod["name"].lower() or default_prod["name"].lower() in p["name"].lower() for p in matched_products):
                    matched_products.append(default_prod)
                    if len(matched_products) >= 6:
                        break
    else:
        # Fall back to default catalog
        matched_products = DEFAULT_KIRANA_CATALOG.copy()

    return {
        "store": {
            "name": store_name,
            "slug": slug,
            "description": description,
            "owner_name": owner_name,
            "address": address,
            "phone": phone,
            "timings": timings,
            "theme_color": theme_color,
            "secondary_color": secondary_color,
            "bg_color": bg_color,
            "font_family": "Outfit",
            "logo_url": None,
            "whatsapp_enabled": True,
            "stock_alerts_enabled": True,
            "low_stock_threshold": 5
        },
        "products": matched_products[:12]  # Hard cap at 12 items for initial catalog
    }
