import qrcode
import json
import os

products = [
    {"name": "Sut (Milk) Latto", "brand": "Latto", "exp": "2026-12-01", "cat": "Dairy", "filename": "qr_milk_safe.png"},
    {"name": "Yogurt Strawberry", "brand": "Biorich", "exp": "2024-05-10", "cat": "Dairy", "filename": "qr_yogurt_expired.png"},
    {"name": "Sharbat Family", "brand": "Family", "exp": "2027-01-15", "cat": "Beverages", "filename": "qr_juice_safe.png"},
    {"name": "Pishloq President", "brand": "President", "exp": "2025-02-20", "cat": "Dairy", "filename": "qr_cheese_expired.png"},
    {"name": "Non Baxmal", "brand": "Baxmal", "exp": "2026-03-05", "cat": "Bakery", "filename": "qr_bread_safe.png"},
    {"name": "Shokolad Alpen Gold", "brand": "Alpen Gold", "exp": "2024-12-25", "cat": "Sweets", "filename": "qr_choc_expired.png"}
]

os.makedirs("qr_codes", exist_ok=True)

for p in products:
    data = {
        "name": p["name"],
        "brand": p["brand"],
        "exp": p["exp"],
        "cat": p["cat"]
    }
    qr_content = json.dumps(data)
    img = qrcode.make(qr_content)
    img.save(os.path.join("qr_codes", p["filename"]))
    print(f"Generated {p['filename']}")
