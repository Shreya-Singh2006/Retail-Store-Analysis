# Retail Store Data Analysis

## Overview
This project analyzes retail store data to uncover **sales trends, product performance, regional insights, discount effectiveness, and profitability**.  
Insights are delivered through a **full-stack web application** (Flask backend + React frontend with Chart.js), designed to help store managers make **data-driven decisions**.

---

## Objectives
- Clean and preprocess raw retail datasets using Python (`cleaning_module.py`).
- Perform modular analysis:
  - Sales Trends
  - Top Products
  - Product Line Performance
  - Regional Insights
  - Sales Channel Analysis
  - Discount Effectiveness
  - Profitability Analysis
  - Overall KPIs
- Expose results via a **Flask API**.
- Visualize KPIs and charts in a **React + Chart.js dashboard**.
- Provide a framework for future extension into **Streamlit or Power BI dashboards**.

---

## Workflow
1. **Data Collection** – Raw CSV files (e.g., Kaggle retail datasets).  
2. **Data Cleaning** – `cleaning_module.py` handles duplicates, missing values, categorical standardization, and recalculates revenue/profit.  
3. **Analysis Modules** – Functions for trends, products, profitability, and KPIs.  
4. **Backend (Flask)** – API endpoints (`/upload`, `/health`) that process datasets and return JSON results.  
5. **Frontend (React + Chart.js)** – Interactive dashboard with line charts, bar charts, pie charts, and KPI cards.  

---

## Features
- **Sales Trend Line Chart** – Monthly revenue over time.  
- **Top Products Bar Chart** – Best-selling items.  
- **Product Line & Regional Insights** – Category and geography-based performance.  
- **Sales Channel Pie Chart** – Retail vs Online contribution.  
- **Discount Effectiveness** – Revenue impact by discount ranges.  
- **Profitability Summary** – Revenue vs margins.  
- **Overall KPIs** – Total revenue, profit, and units sold.  

---

## Project Structure

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
## Required CSV Columns

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

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10+, Flask, Pandas, NumPy |
| Frontend | React 18, Vite, Chart.js, react-chartjs-2 |
| API | REST (JSON) |
| CORS | flask-cors |


---
## How to Use

### Clone this repository
```bash
git clone https://github.com/Shreya-Singh2006/Retail-Store-Analysis.git

