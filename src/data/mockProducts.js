export const mockProducts = [
    {
        id: "1",
        barcode: "4780005111223",
        name: "Classic Milk 3.2%",
        brand: "Latto",
        category: "Dairy",
        expiryDate: "2026-03-15",
        status: "safe",
        reports: 0,
        image: "https://images.unsplash.com/photo-1563636619-e91000f21fca?w=400&auto=format&fit=crop"
    },
    {
        id: "2",
        barcode: "4780001234567",
        name: "Yogurt Strawberry",
        brand: "Biorich",
        category: "Dairy",
        expiryDate: "2025-12-01",
        status: "expired",
        reports: 12,
        image: "https://images.unsplash.com/photo-1571212215582-45470ecaf34d?w=400&auto=format&fit=crop"
    },
    {
        id: "3",
        barcode: "4780009876543",
        name: "Mineral Water 1.5L",
        brand: "Family",
        category: "Beverages",
        expiryDate: "2027-01-10",
        status: "safe",
        reports: 2,
        image: "https://images.unsplash.com/photo-1548919973-5cfe5d4fc474?w=400&auto=format&fit=crop"
    }
];

export const getProductByBarcode = (barcode) => {
    return mockProducts.find(p => p.barcode === barcode);
};
