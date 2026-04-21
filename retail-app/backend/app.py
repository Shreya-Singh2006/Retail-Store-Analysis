from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io
import json

from cleaning_module import clean_retail_dataset
from analysis_module import (
    overall_kpis,
    sales_trend_analysis,
    top_products,
    product_line_performance,
    regional_sales_insights,
    sales_channel_analysis,
    discount_effectiveness,
    profitability_analysis,
)

app = Flask(__name__)
CORS(app)

REQUIRED_COLUMNS = [
    "Order_ID", "Order_Date", "Product_Name", "Product_Line",
    "Units_Sold", "MRP", "Discount_Applied", "Region", "Sales_Channel"
]


def safe_json(obj):
    """Convert pandas objects to JSON-serializable types."""
    if isinstance(obj, pd.Series):
        return {str(k): round(float(v), 2) for k, v in obj.items()}
    if isinstance(obj, dict):
        return {str(k): round(float(v), 2) if isinstance(v, (int, float)) else v for k, v in obj.items()}
    return obj


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Please attach a CSV file."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename. Please select a valid CSV file."}), 400

    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Only CSV files are supported."}), 400

    try:
        contents = file.read().decode("utf-8")
        df = pd.read_csv(io.StringIO(contents))
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV: {str(e)}"}), 400

    # Validate required columns
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        return jsonify({
            "error": f"Missing required columns: {', '.join(missing)}",
            "hint": f"Your file has: {', '.join(df.columns.tolist())}"
        }), 422

    if len(df) == 0:
        return jsonify({"error": "The uploaded CSV file is empty."}), 422

    # --- Data Pipeline ---
    try:
        df = clean_retail_dataset(df)
    except Exception as e:
        return jsonify({"error": f"Data cleaning failed: {str(e)}"}), 500

    if len(df) == 0:
        return jsonify({"error": "After cleaning, no valid rows remain. Check your data."}), 422

    try:
        kpis = overall_kpis(df)
        trend = sales_trend_analysis(df)
        top_p = top_products(df, n=10)
        prod_lines = product_line_performance(df)
        regions = regional_sales_insights(df)
        channels = sales_channel_analysis(df)
        discount = discount_effectiveness(df)
        profit = profitability_analysis(df)
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

    # Convert Period index to strings for JSON
    trend_dict = {str(k): round(float(v), 2) for k, v in trend.items()}
    discount_dict = {str(k): round(float(v), 2) for k, v in discount.items()}

    response = {
        "kpis": {
            "Total Revenue": round(float(kpis["Total Revenue"]), 2),
            "Total Profit": round(float(kpis["Total Profit"]), 2),
            "Total Units Sold": int(kpis["Total Units Sold"]),
        },
        "sales_trend": trend_dict,
        "top_products": safe_json(top_p),
        "product_lines": safe_json(prod_lines),
        "regions": safe_json(regions),
        "channels": safe_json(channels),
        "discount": discount_dict,
        "profitability": safe_json(profit),
        "row_count": len(df),
    }

    return jsonify(response), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Retail Analysis API is running"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
