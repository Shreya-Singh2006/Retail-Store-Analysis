# 🛒 Retail Store Analysis & Decision Support System

A full-stack data analytics web app: Flask backend + React frontend.

---

## 📁 Project Structure

```
retail-app/
├── backend/
│   ├── app.py                  ← Flask API
│   ├── cleaning_module.py      ← Your cleaning module
│   ├── analysis_module.py      ← Your analysis module
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx             ← Full dashboard UI
```

---

## ⚙️ BACKEND SETUP

### Step 1 — Go to backend folder
```bash
cd retail-app/backend
```

### Step 2 — Create virtual environment (recommended)
```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Run Flask server
```bash
python app.py
```

✅ Backend will be running at: **http://localhost:5000**

---

## 🎨 FRONTEND SETUP

### Step 1 — Open a NEW terminal and go to frontend folder
```bash
cd retail-app/frontend
```

### Step 2 — Install Node dependencies
```bash
npm install
```

### Step 3 — Start the React dev server
```bash
npm run dev
```

✅ Frontend will open at: **http://localhost:3000**

---

## 🚀 Using the App

1. Open **http://localhost:3000** in your browser
2. Upload your retail CSV file
3. The backend cleans & analyzes the data automatically
4. View your full dashboard with:
   - KPI cards (Revenue, Profit, Units Sold)
   - Monthly revenue line chart
   - Top 10 products bar chart
   - Regional revenue bar chart
   - Sales channel pie chart
   - Product line performance chart
   - Profitability chart
   - Discount effectiveness chart

---

## 📋 Required CSV Columns

Your CSV must have these columns (exact names):

| Column | Description |
|---|---|
| Order_ID | Unique order identifier |
| Order_Date | Date of order |
| Product_Name | Name of product |
| Product_Line | Product category |
| Units_Sold | Number of units |
| MRP | Price per unit |
| Discount_Applied | Discount % (0–100) |
| Region | Sales region |
| Sales_Channel | Channel (Online/Offline etc.) |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload CSV, returns JSON analysis |
| GET | `/health` | Check if API is running |

### Sample API Response
```json
{
  "kpis": {
    "Total Revenue": 15234567.89,
    "Total Profit": 4570370.37,
    "Total Units Sold": 42310
  },
  "sales_trend": { "2023-01": 123456.0, ... },
  "top_products": { "Product A": 1200, ... },
  "regions": { "Mumbai": 500000.0, ... },
  "channels": { "Online": 800000.0, ... },
  "product_lines": { "Electronics": 900000.0, ... },
  "discount": { "(0, 10]": 200000.0, ... },
  "profitability": { "Electronics": 270000.0, ... },
  "row_count": 5000
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10+, Flask, Pandas, NumPy |
| Frontend | React 18, Vite, Chart.js, react-chartjs-2 |
| API | REST (JSON) |
| CORS | flask-cors |
